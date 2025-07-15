"""
Model Loader Module

Handles loading of pre-trained personality prediction models and tokenizers.
Currently implements a rule-based approach with placeholder for ML models.
"""

import os
import logging
from typing import Dict, Any, Optional
import json
import torch
import numpy as np

logger = logging.getLogger(__name__)

# Configuration for model loading
use_mock_model = True  # Set to False when trained model is available

class MockPersonalityModel:
    """
    Mock personality model that uses linguistic features for prediction
    This serves as a placeholder until a real trained model is available
    """
    
    def __init__(self):
        self.model_name = "Rule-Based Personality Analyzer v1.0"
        self.traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]
        
    def predict(self, features: Dict[str, float], text: str = "") -> Dict[str, float]:
        """
        Predict personality scores based on linguistic features
        
        Args:
            features: Extracted linguistic features from preprocessing
            text: Original text (for additional context)
            
        Returns:
            Dictionary of Big Five personality scores (0.0 - 1.0)
        """
        if not features:
            return self._default_scores()
        
        scores = {}
        
        # Openness - creativity, curiosity, openness to new experiences
        openness = 0.5
        if features.get('avg_word_length', 0) > 5:  # Complex vocabulary
            openness += 0.2
        if features.get('question_ratio', 0) > 0.02:  # Curiosity
            openness += 0.15
        if 'creative' in text.lower() or 'innovative' in text.lower():
            openness += 0.1
        scores['Openness'] = min(1.0, max(0.0, openness))
        
        # Conscientiousness - organization, discipline, reliability
        conscientiousness = 0.5
        if features.get('certainty_ratio', 0) > 0.03:  # Decisive language
            conscientiousness += 0.2
        if 'plan' in text.lower() or 'organize' in text.lower() or 'schedule' in text.lower():
            conscientiousness += 0.15
        if features.get('uncertainty_ratio', 0) > 0.05:  # Too much uncertainty
            conscientiousness -= 0.1
        scores['Conscientiousness'] = min(1.0, max(0.0, conscientiousness))
        
        # Extraversion - sociability, energy, assertiveness
        extraversion = 0.5
        if features.get('exclamation_ratio', 0) > 0.01:  # Enthusiastic
            extraversion += 0.2
        if features.get('second_person_ratio', 0) > 0.05:  # Other-focused
            extraversion += 0.15
        if 'team' in text.lower() or 'people' in text.lower() or 'social' in text.lower():
            extraversion += 0.1
        if features.get('first_person_ratio', 0) > 0.15:  # Too self-focused
            extraversion -= 0.1
        scores['Extraversion'] = min(1.0, max(0.0, extraversion))
        
        # Agreeableness - cooperation, trust, empathy
        agreeableness = 0.5
        if features.get('positive_emotion_ratio', 0) > 0.03:  # Positive language
            agreeableness += 0.2
        if 'help' in text.lower() or 'support' in text.lower() or 'collaborate' in text.lower():
            agreeableness += 0.15
        if features.get('negative_emotion_ratio', 0) > 0.03:  # Negative language
            agreeableness -= 0.1
        scores['Agreeableness'] = min(1.0, max(0.0, agreeableness))
        
        # Neuroticism - emotional stability (lower scores = more stable)
        neuroticism = 0.5
        if features.get('negative_emotion_ratio', 0) > 0.05:  # High negative emotion
            neuroticism += 0.2
        if 'stress' in text.lower() or 'worry' in text.lower() or 'anxious' in text.lower():
            neuroticism += 0.15
        if features.get('positive_emotion_ratio', 0) > 0.05:  # High positive emotion
            neuroticism -= 0.1
        if features.get('certainty_ratio', 0) > 0.03:  # Confident language
            neuroticism -= 0.1
        scores['Neuroticism'] = min(1.0, max(0.0, neuroticism))
        
        return scores
    
    def _default_scores(self) -> Dict[str, float]:
        """Return default balanced scores"""
        return {
            "Openness": 0.5,
            "Conscientiousness": 0.5,
            "Extraversion": 0.5,
            "Agreeableness": 0.5,
            "Neuroticism": 0.5
        }

class TrainedPersonalityModel:
    """
    Trained personality model using BERT + classification head
    """
    
    def __init__(self, model_path: str, device: str = "cpu"):
        self.device = device
        self.model = None
        self.tokenizer = None
        self.config = None
        self.traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]
        
        # Load model components
        self._load_model(model_path)
        
    def _load_model(self, model_path: str):
        """Load the trained model and tokenizer"""
        try:
            # Import required modules
            from transformers import AutoTokenizer, AutoModel
            import torch.nn as nn
            
            # Load configuration
            config_path = os.path.join(model_path, "training_config.json")
            if os.path.exists(config_path):
                with open(config_path, 'r') as f:
                    self.config = json.load(f)
            else:
                # Default configuration
                self.config = {
                    "model_name": "bert-base-uncased",
                    "hidden_size": 768,
                    "num_labels": 5,
                    "dropout": 0.1,
                    "classification_head": "linear",
                    "max_length": 512
                }
            
            # Load tokenizer
            tokenizer_path = os.path.join(model_path, "tokenizer")
            if os.path.exists(tokenizer_path):
                self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
            else:
                self.tokenizer = AutoTokenizer.from_pretrained(self.config["model_name"])
                
            # Add padding token if needed
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load model architecture
            self.bert = AutoModel.from_pretrained(self.config["model_name"])
            
            # Build classification head
            if self.config["classification_head"] == "linear":
                self.classification_head = nn.Linear(self.config["hidden_size"], self.config["num_labels"])
            else:
                # Default to linear if unknown
                self.classification_head = nn.Linear(self.config["hidden_size"], self.config["num_labels"])
            
            self.dropout = nn.Dropout(self.config["dropout"])
            
            # Load trained weights
            model_weights_path = os.path.join(model_path, "personality_model.pt")
            if os.path.exists(model_weights_path):
                # Load state dict
                state_dict = torch.load(model_weights_path, map_location=self.device)
                
                # Load BERT weights
                bert_state_dict = {k[5:]: v for k, v in state_dict.items() if k.startswith('bert.')}
                if bert_state_dict:
                    self.bert.load_state_dict(bert_state_dict, strict=False)
                
                # Load classification head weights
                head_state_dict = {k[20:]: v for k, v in state_dict.items() if k.startswith('classification_head.')}
                if head_state_dict:
                    self.classification_head.load_state_dict(head_state_dict, strict=False)
                
                logger.info(f"Loaded trained model weights from {model_weights_path}")
            else:
                logger.warning(f"No trained weights found at {model_weights_path}. Using pre-trained BERT only.")
            
            # Move to device
            self.bert.to(self.device)
            self.classification_head.to(self.device)
            
            # Set to evaluation mode
            self.bert.eval()
            self.classification_head.eval()
            
            logger.info("Trained personality model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load trained model: {e}")
            raise
    
    def predict(self, features: Dict[str, float], text: str = "") -> Dict[str, float]:
        """
        Predict personality scores using the trained model
        
        Args:
            features: Extracted linguistic features (not used in neural model)
            text: Original text for prediction
            
        Returns:
            Dictionary of Big Five personality scores (0.0 - 1.0)
        """
        if not text:
            return self._default_scores()
        
        try:
            # Tokenize input
            max_length = self.config.get("max_length", 512)
            encoding = self.tokenizer(
                text,
                truncation=True,
                padding='max_length',
                max_length=max_length,
                return_tensors='pt'
            )
            
            # Move to device
            input_ids = encoding['input_ids'].to(self.device)
            attention_mask = encoding['attention_mask'].to(self.device)
            
            # Forward pass
            with torch.no_grad():
                bert_outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
                pooled_output = bert_outputs.pooler_output
                pooled_output = self.dropout(pooled_output)
                logits = self.classification_head(pooled_output)
                
                # Apply sigmoid to get scores between 0 and 1
                scores = torch.sigmoid(logits).cpu().numpy().flatten()
            
            # Create score dictionary
            score_dict = {}
            for i, trait in enumerate(self.traits):
                score_dict[trait] = float(scores[i])
            
            return score_dict
            
        except Exception as e:
            logger.error(f"Error in model prediction: {e}")
            return self._default_scores()
    
    def _default_scores(self) -> Dict[str, float]:
        """Return default balanced scores"""
        return {
            "Openness": 0.5,
            "Conscientiousness": 0.5,
            "Extraversion": 0.5,
            "Agreeableness": 0.5,
            "Neuroticism": 0.5
        }

class MockTokenizer:
    """
    Mock tokenizer for consistency with ML model interface
    In a real implementation, this would be a HuggingFace tokenizer
    """
    
    def __init__(self):
        self.tokenizer_name = "Simple Text Tokenizer"
        
    def tokenize(self, text: str) -> list:
        """Simple tokenization"""
        return text.lower().split()
    
    def encode(self, text: str) -> list:
        """Simple encoding (returns word indices)"""
        words = self.tokenize(text)
        return list(range(len(words)))  # Mock encoding

def load_personality_model(model_path: str):
    """
    Load personality prediction model
    
    Args:
        model_path: Path to the model file
        
    Returns:
        Loaded personality model (mock or trained implementation)
    """
    if use_mock_model:
        logger.info("Using mock personality model (rule-based implementation)")
        return MockPersonalityModel()
    
    # Try to load trained model
    try:
        if os.path.exists(model_path):
            logger.info(f"Loading trained personality model from {model_path}")
            device = "cuda" if torch.cuda.is_available() else "cpu"
            return TrainedPersonalityModel(model_path, device)
        else:
            logger.warning(f"Trained model not found at {model_path}. Falling back to mock model.")
            return MockPersonalityModel()
    except Exception as e:
        logger.error(f"Failed to load trained model: {e}")
        logger.warning("Falling back to mock model")
        return MockPersonalityModel()

def load_tokenizer(tokenizer_path: str) -> MockTokenizer:
    """
    Load tokenizer for text processing
    
    Args:
        tokenizer_path: Path to tokenizer files
        
    Returns:
        Loaded tokenizer (currently mock implementation)
    """
    if not os.path.exists(tokenizer_path):
        logger.warning(f"Tokenizer not found at {tokenizer_path}. Using simple mock tokenizer.")
        
    logger.info("Loading simple tokenizer (mock implementation)")
    
    return MockTokenizer()

def save_model_config(model_path: str, config: Dict[str, Any]) -> None:
    """
    Save model configuration for future loading
    
    Args:
        model_path: Path where model is stored
        config: Configuration dictionary
    """
    config_path = os.path.join(os.path.dirname(model_path), 'model_config.json')
    
    try:
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        logger.info(f"Model config saved to {config_path}")
    except Exception as e:
        logger.error(f"Failed to save model config: {e}")

def load_model_config(model_path: str) -> Optional[Dict[str, Any]]:
    """
    Load model configuration
    
    Args:
        model_path: Path where model is stored
        
    Returns:
        Configuration dictionary or None if not found
    """
    config_path = os.path.join(os.path.dirname(model_path), 'model_config.json')
    
    if not os.path.exists(config_path):
        return None
        
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
        logger.info(f"Model config loaded from {config_path}")
        return config
    except Exception as e:
        logger.error(f"Failed to load model config: {e}")
        return None

# Future implementation for real ML models:
"""
def load_real_pytorch_model(model_path: str):
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer
    
    # Load pre-trained model
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    
    model.eval()
    return model, tokenizer

def load_real_tensorflow_model(model_path: str):
    import tensorflow as tf
    
    model = tf.keras.models.load_model(model_path)
    return model
"""