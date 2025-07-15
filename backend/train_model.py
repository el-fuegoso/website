#!/usr/bin/env python3
"""
Personality Prediction Model Training Script
===========================================

This script trains a fine-tuned LLM-based personality prediction model using the Big Five
personality traits. It supports multiple datasets and model architectures.

Features:
- PANDORA Reddit dataset support
- Multiple pre-trained LLM backbones (BERT, RoBERTa, etc.)
- Configurable classification heads (Linear, BiLSTM, etc.)
- Comprehensive evaluation metrics
- Model checkpointing and saving
- Hyperparameter tuning support

Usage:
    python train_model.py --dataset pandora --model bert-base-uncased --epochs 10
    python train_model.py --dataset custom --model roberta-base --batch_size 16
"""

import os
import sys
import json
import argparse
import logging
import warnings
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from pathlib import Path
import pickle

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
from torch.utils.tensorboard import SummaryWriter
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# Transformers imports
from transformers import (
    AutoTokenizer, AutoModel, AutoConfig,
    TrainingArguments, Trainer, 
    EarlyStoppingCallback, IntervalStrategy
)
from transformers.optimization import get_linear_schedule_with_warmup

# Suppress warnings
warnings.filterwarnings('ignore')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TrainingConfig:
    """Configuration for training parameters"""
    # Model configuration
    model_name: str = "bert-base-uncased"
    max_length: int = 512
    hidden_size: int = 768
    num_labels: int = 5  # Big Five traits
    dropout: float = 0.1
    
    # Training configuration
    batch_size: int = 16
    learning_rate: float = 2e-5
    num_epochs: int = 10
    warmup_steps: int = 500
    weight_decay: float = 0.01
    gradient_accumulation_steps: int = 1
    
    # Dataset configuration
    dataset_name: str = "essays_big5"
    train_split: float = 0.8
    val_split: float = 0.1
    test_split: float = 0.1
    
    # Architecture configuration
    classification_head: str = "linear"  # "linear", "bilstm", "attention"
    freeze_embeddings: bool = False
    
    # Training configuration
    early_stopping_patience: int = 3
    save_top_k: int = 3
    evaluation_strategy: str = "steps"
    eval_steps: int = 500
    logging_steps: int = 100
    save_steps: int = 1000
    
    # Paths
    data_path: str = "data/"
    model_save_path: str = "models/"
    logs_path: str = "logs/"
    
    # Device configuration
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    mixed_precision: bool = True
    
    # Reproducibility
    seed: int = 42

class PersonalityDataset(Dataset):
    """Dataset class for personality prediction"""
    
    def __init__(self, texts: List[str], labels: List[List[float]], tokenizer, max_length: int = 512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
        
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        labels = torch.tensor(self.labels[idx], dtype=torch.float32)
        
        # Tokenize text
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].squeeze(),
            'attention_mask': encoding['attention_mask'].squeeze(),
            'labels': labels
        }

class PersonalityModel(nn.Module):
    """Personality prediction model with configurable classification head"""
    
    def __init__(self, config: TrainingConfig):
        super().__init__()
        self.config = config
        
        # Load pre-trained model
        self.bert = AutoModel.from_pretrained(config.model_name)
        
        # Freeze embeddings if specified
        if config.freeze_embeddings:
            for param in self.bert.embeddings.parameters():
                param.requires_grad = False
        
        # Classification head
        self.classification_head = self._build_classification_head()
        
        # Dropout
        self.dropout = nn.Dropout(config.dropout)
        
    def _build_classification_head(self) -> nn.Module:
        """Build the classification head based on configuration"""
        if self.config.classification_head == "linear":
            return nn.Linear(self.config.hidden_size, self.config.num_labels)
        
        elif self.config.classification_head == "bilstm":
            return nn.Sequential(
                nn.LSTM(self.config.hidden_size, self.config.hidden_size // 2, 
                       batch_first=True, bidirectional=True),
                nn.Dropout(self.config.dropout),
                nn.Linear(self.config.hidden_size, self.config.num_labels)
            )
        
        elif self.config.classification_head == "attention":
            return nn.Sequential(
                nn.MultiheadAttention(self.config.hidden_size, num_heads=8, batch_first=True),
                nn.Dropout(self.config.dropout),
                nn.Linear(self.config.hidden_size, self.config.num_labels)
            )
        
        else:
            raise ValueError(f"Unknown classification head: {self.config.classification_head}")
    
    def forward(self, input_ids, attention_mask, labels=None):
        # Get BERT outputs
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        
        # Use [CLS] token representation
        pooled_output = outputs.pooler_output
        pooled_output = self.dropout(pooled_output)
        
        # Apply classification head
        if self.config.classification_head == "linear":
            logits = self.classification_head(pooled_output)
        
        elif self.config.classification_head == "bilstm":
            # For BiLSTM, we need sequence output
            sequence_output = outputs.last_hidden_state
            lstm_out, _ = self.classification_head[0](sequence_output)
            # Take the last output
            lstm_out = lstm_out[:, -1, :]
            logits = self.classification_head[2](self.classification_head[1](lstm_out))
        
        elif self.config.classification_head == "attention":
            sequence_output = outputs.last_hidden_state
            attn_output, _ = self.classification_head[0](sequence_output, sequence_output, sequence_output)
            # Global average pooling
            attn_output = attn_output.mean(dim=1)
            logits = self.classification_head[2](self.classification_head[1](attn_output))
        
        # Calculate loss if labels provided
        loss = None
        if labels is not None:
            loss_fn = nn.MSELoss()
            loss = loss_fn(logits, labels)
        
        return {
            'loss': loss,
            'logits': logits,
            'hidden_states': outputs.hidden_states if hasattr(outputs, 'hidden_states') else None
        }

class DatasetLoader:
    """Dataset loading utilities"""
    
    @staticmethod
    def load_pandora_dataset(data_path: str) -> Tuple[List[str], List[List[float]]]:
        """Load PANDORA Reddit dataset"""
        logger.info("Loading PANDORA Reddit dataset...")
        
        # Check if dataset exists
        pandora_file = Path(data_path) / "pandora_dataset.csv"
        if not pandora_file.exists():
            logger.error(f"PANDORA dataset not found at {pandora_file}")
            logger.info("Please download the PANDORA dataset from: https://github.com/khandait/PANDORA")
            logger.info("Expected format: CSV with columns ['text', 'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']")
            sys.exit(1)
        
        # Load dataset
        df = pd.read_csv(pandora_file)
        
        # Extract text and personality scores
        texts = df['text'].tolist()
        personality_scores = df[['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']].values.tolist()
        
        logger.info(f"Loaded {len(texts)} samples from PANDORA dataset")
        return texts, personality_scores
    
    @staticmethod
    def load_essays_big5_dataset(data_path: str) -> Tuple[List[str], List[List[float]]]:
        """Load essays-big5 dataset from Hugging Face"""
        logger.info("Loading essays-big5 dataset...")
        
        # Check if processed dataset exists
        essays_big5_file = Path(data_path) / "essays_big5_dataset.csv"
        if not essays_big5_file.exists():
            logger.info("Processed essays-big5 dataset not found. Attempting to download and process...")
            
            try:
                # Try to download and process the dataset
                from datasets import load_dataset
                
                # Load the dataset
                logger.info("Loading jingjietan/essays-big5 dataset from Hugging Face...")
                ds = load_dataset("jingjietan/essays-big5")
                
                # Convert to pandas DataFrame
                if 'train' in ds:
                    df = ds['train'].to_pandas()
                else:
                    df = ds.to_pandas()
                
                # Process the dataframe
                df = DatasetLoader._process_essays_big5_dataframe(df)
                
                # Save processed dataset
                df.to_csv(essays_big5_file, index=False)
                logger.info(f"Downloaded and processed essays-big5 dataset saved to {essays_big5_file}")
                
            except ImportError:
                logger.error("datasets library not installed. Install with: pip install datasets")
                logger.error("Or prepare the dataset manually with: python prepare_dataset.py --dataset essays_big5")
                sys.exit(1)
            except Exception as e:
                logger.error(f"Error downloading essays-big5 dataset: {e}")
                logger.error("Please prepare the dataset manually with: python prepare_dataset.py --dataset essays_big5")
                sys.exit(1)
        
        # Load processed dataset
        df = pd.read_csv(essays_big5_file)
        
        # Extract text and personality scores
        texts = df['text'].tolist()
        personality_scores = df[['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']].values.tolist()
        
        logger.info(f"Loaded {len(texts)} samples from essays-big5 dataset")
        return texts, personality_scores
    
    @staticmethod
    def _process_essays_big5_dataframe(df: pd.DataFrame) -> pd.DataFrame:
        """Process essays-big5 dataframe into standard format"""
        import re
        
        # Column mapping for common variations
        column_mapping = {
            'essay': 'text',
            'TEXT': 'text',
            'content': 'text',
            'ext': 'extraversion',
            'neu': 'neuroticism',
            'agr': 'agreeableness', 
            'con': 'conscientiousness',
            'opn': 'openness',
            'o': 'openness',
            'c': 'conscientiousness',
            'e': 'extraversion',
            'a': 'agreeableness',
            'n': 'neuroticism'
        }
        
        # Apply column mapping
        df = df.rename(columns=column_mapping)
        
        # Clean text
        if 'text' in df.columns:
            df['text'] = df['text'].apply(lambda x: DatasetLoader._clean_text(str(x)))
        
        # Normalize personality scores
        big_five_traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
        for trait in big_five_traits:
            if trait in df.columns:
                # Normalize to 0-1 range
                min_val = df[trait].min()
                max_val = df[trait].max()
                if max_val > min_val:
                    df[trait] = (df[trait] - min_val) / (max_val - min_val)
                else:
                    df[trait] = 0.5
            else:
                df[trait] = 0.5
        
        # Filter short texts
        df = df[df['text'].str.len() > 50]
        
        # Select required columns
        final_columns = ['text'] + big_five_traits
        df = df[final_columns]
        
        return df
    
    @staticmethod
    def _clean_text(text: str) -> str:
        """Clean text data"""
        if pd.isna(text):
            return ""
        
        text = str(text)
        # Remove URLs
        text = re.sub(r'http\S+', '', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        return text
    
    @staticmethod
    def load_custom_dataset(data_path: str) -> Tuple[List[str], List[List[float]]]:
        """Load custom dataset"""
        logger.info("Loading custom dataset...")
        
        # Support multiple formats
        custom_files = [
            Path(data_path) / "custom_dataset.csv",
            Path(data_path) / "personality_data.json",
            Path(data_path) / "training_data.pkl"
        ]
        
        for file_path in custom_files:
            if file_path.exists():
                if file_path.suffix == '.csv':
                    df = pd.read_csv(file_path)
                    texts = df['text'].tolist()
                    personality_scores = df[['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']].values.tolist()
                    
                elif file_path.suffix == '.json':
                    with open(file_path, 'r') as f:
                        data = json.load(f)
                    texts = [item['text'] for item in data]
                    personality_scores = [[item['openness'], item['conscientiousness'], 
                                         item['extraversion'], item['agreeableness'], item['neuroticism']] 
                                         for item in data]
                
                elif file_path.suffix == '.pkl':
                    with open(file_path, 'rb') as f:
                        data = pickle.load(f)
                    texts = data['texts']
                    personality_scores = data['personality_scores']
                
                logger.info(f"Loaded {len(texts)} samples from custom dataset")
                return texts, personality_scores
        
        logger.error("No custom dataset found. Please provide one of: custom_dataset.csv, personality_data.json, or training_data.pkl")
        sys.exit(1)
    
    @staticmethod
    def create_synthetic_dataset(num_samples: int = 1000) -> Tuple[List[str], List[List[float]]]:
        """Create synthetic dataset for testing"""
        logger.info(f"Creating synthetic dataset with {num_samples} samples...")
        
        # Sample texts (in practice, these would be real text samples)
        sample_texts = [
            "I love meeting new people and exploring creative projects.",
            "I prefer quiet evenings at home with a good book.",
            "I'm always organized and plan everything in advance.",
            "I tend to worry about things that might go wrong.",
            "I'm open to trying new experiences and ideas.",
            "I enjoy helping others and working in teams.",
            "I like to take charge and lead projects.",
            "I find it hard to stay focused on routine tasks.",
            "I often feel stressed in social situations.",
            "I'm curious about different cultures and perspectives."
        ]
        
        texts = []
        personality_scores = []
        
        for i in range(num_samples):
            # Random text selection and modification
            base_text = np.random.choice(sample_texts)
            texts.append(f"{base_text} {np.random.randint(1, 100)}")
            
            # Random personality scores (normally distributed around 0.5)
            scores = np.random.normal(0.5, 0.15, 5)
            scores = np.clip(scores, 0, 1)  # Ensure scores are between 0 and 1
            personality_scores.append(scores.tolist())
        
        return texts, personality_scores

class PersonalityTrainer:
    """Main trainer class for personality prediction"""
    
    def __init__(self, config: TrainingConfig):
        self.config = config
        self.setup_logging()
        self.setup_directories()
        self.set_seed()
        
        # Initialize tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(config.model_name)
        
        # Add special tokens if needed
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
    
    def setup_logging(self):
        """Setup logging and tensorboard"""
        log_dir = Path(self.config.logs_path)
        log_dir.mkdir(parents=True, exist_ok=True)
        
        self.writer = SummaryWriter(log_dir=log_dir)
        
        # Setup file logging
        file_handler = logging.FileHandler(log_dir / "training.log")
        file_handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    def setup_directories(self):
        """Create necessary directories"""
        for path in [self.config.data_path, self.config.model_save_path, self.config.logs_path]:
            Path(path).mkdir(parents=True, exist_ok=True)
    
    def set_seed(self):
        """Set random seed for reproducibility"""
        torch.manual_seed(self.config.seed)
        np.random.seed(self.config.seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(self.config.seed)
    
    def load_dataset(self) -> Tuple[List[str], List[List[float]]]:
        """Load dataset based on configuration"""
        if self.config.dataset_name == "pandora":
            return DatasetLoader.load_pandora_dataset(self.config.data_path)
        elif self.config.dataset_name == "essays_big5":
            return DatasetLoader.load_essays_big5_dataset(self.config.data_path)
        elif self.config.dataset_name == "custom":
            return DatasetLoader.load_custom_dataset(self.config.data_path)
        elif self.config.dataset_name == "synthetic":
            return DatasetLoader.create_synthetic_dataset()
        else:
            raise ValueError(f"Unknown dataset: {self.config.dataset_name}")
    
    def split_dataset(self, texts: List[str], labels: List[List[float]]) -> Tuple[Dataset, Dataset, Dataset]:
        """Split dataset into train, validation, and test sets"""
        # First split: separate test set
        train_texts, test_texts, train_labels, test_labels = train_test_split(
            texts, labels, test_size=self.config.test_split, random_state=self.config.seed
        )
        
        # Second split: separate validation from training
        val_size = self.config.val_split / (1 - self.config.test_split)
        train_texts, val_texts, train_labels, val_labels = train_test_split(
            train_texts, train_labels, test_size=val_size, random_state=self.config.seed
        )
        
        # Create datasets
        train_dataset = PersonalityDataset(train_texts, train_labels, self.tokenizer, self.config.max_length)
        val_dataset = PersonalityDataset(val_texts, val_labels, self.tokenizer, self.config.max_length)
        test_dataset = PersonalityDataset(test_texts, test_labels, self.tokenizer, self.config.max_length)
        
        logger.info(f"Dataset split: Train={len(train_dataset)}, Val={len(val_dataset)}, Test={len(test_dataset)}")
        
        return train_dataset, val_dataset, test_dataset
    
    def train(self):
        """Main training loop"""
        logger.info("Starting personality prediction model training...")
        
        # Load dataset
        texts, labels = self.load_dataset()
        
        # Split dataset
        train_dataset, val_dataset, test_dataset = self.split_dataset(texts, labels)
        
        # Initialize model
        model = PersonalityModel(self.config)
        model.to(self.config.device)
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=self.config.model_save_path,
            num_train_epochs=self.config.num_epochs,
            per_device_train_batch_size=self.config.batch_size,
            per_device_eval_batch_size=self.config.batch_size,
            warmup_steps=self.config.warmup_steps,
            weight_decay=self.config.weight_decay,
            logging_dir=self.config.logs_path,
            logging_steps=self.config.logging_steps,
            evaluation_strategy=IntervalStrategy.STEPS,
            eval_steps=self.config.eval_steps,
            save_steps=self.config.save_steps,
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
            greater_is_better=False,
            save_total_limit=self.config.save_top_k,
            fp16=self.config.mixed_precision and torch.cuda.is_available(),
            gradient_accumulation_steps=self.config.gradient_accumulation_steps,
            learning_rate=self.config.learning_rate,
            report_to="tensorboard",
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            compute_metrics=self.compute_metrics,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=self.config.early_stopping_patience)]
        )
        
        # Train model
        trainer.train()
        
        # Evaluate on test set
        test_results = trainer.evaluate(test_dataset)
        logger.info(f"Test results: {test_results}")
        
        # Save final model
        self.save_model(trainer.model, trainer.tokenizer)
        
        # Generate evaluation report
        self.generate_evaluation_report(trainer.model, test_dataset)
        
        logger.info("Training completed successfully!")
        
        return trainer.model
    
    def compute_metrics(self, eval_pred):
        """Compute evaluation metrics"""
        predictions, labels = eval_pred
        
        # Calculate metrics for each personality trait
        metrics = {}
        trait_names = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
        
        for i, trait in enumerate(trait_names):
            pred_trait = predictions[:, i]
            true_trait = labels[:, i]
            
            mse = mean_squared_error(true_trait, pred_trait)
            mae = mean_absolute_error(true_trait, pred_trait)
            r2 = r2_score(true_trait, pred_trait)
            
            metrics[f'{trait}_mse'] = mse
            metrics[f'{trait}_mae'] = mae
            metrics[f'{trait}_r2'] = r2
        
        # Overall metrics
        overall_mse = mean_squared_error(labels.flatten(), predictions.flatten())
        overall_mae = mean_absolute_error(labels.flatten(), predictions.flatten())
        overall_r2 = r2_score(labels.flatten(), predictions.flatten())
        
        metrics.update({
            'overall_mse': overall_mse,
            'overall_mae': overall_mae,
            'overall_r2': overall_r2
        })
        
        return metrics
    
    def save_model(self, model, tokenizer):
        """Save trained model and tokenizer"""
        model_path = Path(self.config.model_save_path)
        
        # Save model
        torch.save(model.state_dict(), model_path / "personality_model.pt")
        
        # Save tokenizer
        tokenizer.save_pretrained(model_path / "tokenizer")
        
        # Save configuration
        with open(model_path / "training_config.json", 'w') as f:
            json.dump(self.config.__dict__, f, indent=2)
        
        logger.info(f"Model saved to {model_path}")
    
    def generate_evaluation_report(self, model, test_dataset):
        """Generate comprehensive evaluation report"""
        logger.info("Generating evaluation report...")
        
        # Set model to evaluation mode
        model.eval()
        
        # Create data loader
        test_loader = DataLoader(test_dataset, batch_size=self.config.batch_size, shuffle=False)
        
        all_predictions = []
        all_labels = []
        
        with torch.no_grad():
            for batch in test_loader:
                input_ids = batch['input_ids'].to(self.config.device)
                attention_mask = batch['attention_mask'].to(self.config.device)
                labels = batch['labels'].to(self.config.device)
                
                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                predictions = outputs['logits']
                
                all_predictions.append(predictions.cpu().numpy())
                all_labels.append(labels.cpu().numpy())
        
        # Concatenate all predictions and labels
        all_predictions = np.concatenate(all_predictions, axis=0)
        all_labels = np.concatenate(all_labels, axis=0)
        
        # Create visualization
        self.create_evaluation_plots(all_predictions, all_labels)
        
        # Save predictions
        results_path = Path(self.config.model_save_path) / "evaluation_results.json"
        results = {
            'predictions': all_predictions.tolist(),
            'labels': all_labels.tolist(),
            'metrics': self.compute_metrics((all_predictions, all_labels))
        }
        
        with open(results_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        logger.info(f"Evaluation report saved to {results_path}")
    
    def create_evaluation_plots(self, predictions, labels):
        """Create evaluation plots"""
        trait_names = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
        
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        axes = axes.flatten()
        
        for i, trait in enumerate(trait_names):
            ax = axes[i]
            
            # Scatter plot of predictions vs actual
            ax.scatter(labels[:, i], predictions[:, i], alpha=0.6)
            ax.plot([0, 1], [0, 1], 'r--')  # Perfect prediction line
            ax.set_xlabel(f'Actual {trait}')
            ax.set_ylabel(f'Predicted {trait}')
            ax.set_title(f'{trait} Predictions')
            
            # Calculate R²
            r2 = r2_score(labels[:, i], predictions[:, i])
            ax.text(0.05, 0.95, f'R² = {r2:.3f}', transform=ax.transAxes, 
                   bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))
        
        # Remove empty subplot
        axes[5].remove()
        
        plt.tight_layout()
        plt.savefig(Path(self.config.model_save_path) / "evaluation_plots.png", dpi=300, bbox_inches='tight')
        plt.close()
        
        # Create correlation heatmap
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Calculate correlation between predicted and actual for each trait
        correlations = []
        for i in range(5):
            corr = np.corrcoef(predictions[:, i], labels[:, i])[0, 1]
            correlations.append(corr)
        
        # Create heatmap
        sns.heatmap([correlations], annot=True, fmt='.3f', cmap='RdYlBu_r',
                   xticklabels=trait_names, yticklabels=['Correlation'],
                   ax=ax, cbar_kws={'label': 'Correlation Coefficient'})
        
        plt.title('Prediction Correlation by Personality Trait')
        plt.tight_layout()
        plt.savefig(Path(self.config.model_save_path) / "correlation_heatmap.png", dpi=300, bbox_inches='tight')
        plt.close()

def main():
    """Main training function"""
    parser = argparse.ArgumentParser(description="Train personality prediction model")
    
    # Model arguments
    parser.add_argument("--model_name", type=str, default="bert-base-uncased",
                       help="Pre-trained model name")
    parser.add_argument("--classification_head", type=str, default="linear",
                       choices=["linear", "bilstm", "attention"],
                       help="Type of classification head")
    
    # Dataset arguments
    parser.add_argument("--dataset", type=str, default="essays_big5",
                       choices=["pandora", "essays_big5", "custom", "synthetic"],
                       help="Dataset to use for training")
    parser.add_argument("--data_path", type=str, default="data/",
                       help="Path to dataset")
    
    # Training arguments
    parser.add_argument("--batch_size", type=int, default=16,
                       help="Batch size for training")
    parser.add_argument("--learning_rate", type=float, default=2e-5,
                       help="Learning rate")
    parser.add_argument("--epochs", type=int, default=10,
                       help="Number of training epochs")
    parser.add_argument("--max_length", type=int, default=512,
                       help="Maximum sequence length")
    
    # Output arguments
    parser.add_argument("--output_dir", type=str, default="models/",
                       help="Directory to save trained model")
    parser.add_argument("--logs_dir", type=str, default="logs/",
                       help="Directory for training logs")
    
    args = parser.parse_args()
    
    # Create training configuration
    config = TrainingConfig(
        model_name=args.model_name,
        classification_head=args.classification_head,
        dataset_name=args.dataset,
        data_path=args.data_path,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        num_epochs=args.epochs,
        max_length=args.max_length,
        model_save_path=args.output_dir,
        logs_path=args.logs_dir,
    )
    
    # Initialize trainer
    trainer = PersonalityTrainer(config)
    
    # Start training
    try:
        trained_model = trainer.train()
        logger.info("Training completed successfully!")
        
        # Print final message
        print("\n" + "="*60)
        print("🎉 PERSONALITY MODEL TRAINING COMPLETED! 🎉")
        print("="*60)
        print(f"✅ Model saved to: {config.model_save_path}")
        print(f"✅ Logs saved to: {config.logs_path}")
        print(f"✅ Model architecture: {config.model_name} + {config.classification_head}")
        print(f"✅ Dataset: {config.dataset_name}")
        print("="*60)
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()