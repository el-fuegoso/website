#!/usr/bin/env python3
"""
Dataset Preparation Script for Personality Prediction
====================================================

This script downloads and prepares datasets for personality prediction training.
Supports multiple datasets including PANDORA, Essays, and custom formats.

Usage:
    python prepare_dataset.py --dataset pandora --output_dir data/
    python prepare_dataset.py --dataset essays --output_dir data/
    python prepare_dataset.py --create_synthetic --num_samples 5000
"""

import os
import sys
import json
import argparse
import logging
import requests
import zipfile
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from urllib.parse import urlparse
import re
from sklearn.model_selection import train_test_split

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatasetPreparer:
    """Dataset preparation utilities"""
    
    def __init__(self, output_dir: str = "data/"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Big Five trait names
        self.big_five_traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    
    def download_file(self, url: str, filename: str) -> bool:
        """Download file from URL"""
        try:
            logger.info(f"Downloading {filename} from {url}")
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            file_path = self.output_dir / filename
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            logger.info(f"Downloaded {filename} successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error downloading {filename}: {e}")
            return False
    
    def prepare_pandora_dataset(self) -> bool:
        """Prepare PANDORA Reddit dataset"""
        logger.info("Preparing PANDORA Reddit dataset...")
        
        # PANDORA dataset is typically available on GitHub
        # Note: This is a placeholder - actual dataset may require different access
        pandora_url = "https://raw.githubusercontent.com/khandait/PANDORA/main/dataset/pandora_data.csv"
        
        try:
            # Try to download from GitHub (this may not work directly)
            if not self.download_file(pandora_url, "pandora_raw.csv"):
                logger.warning("Direct download failed. Creating instructions for manual download.")
                self.create_pandora_instructions()
                return False
            
            # Process the dataset
            self.process_pandora_dataset()
            return True
            
        except Exception as e:
            logger.error(f"Error preparing PANDORA dataset: {e}")
            self.create_pandora_instructions()
            return False
    
    def create_pandora_instructions(self):
        """Create instructions for manually downloading PANDORA dataset"""
        instructions = """
# PANDORA Dataset Download Instructions

The PANDORA dataset needs to be downloaded manually. Please follow these steps:

1. Visit: https://github.com/khandait/PANDORA
2. Download the dataset files
3. Extract and place the CSV file in the data/ directory
4. Rename the file to 'pandora_raw.csv'
5. Run this script again

Expected format:
- CSV file with columns: user_id, text, openness, conscientiousness, extraversion, agreeableness, neuroticism
- Text should be cleaned and ready for training
- Personality scores should be normalized between 0 and 1

Alternative datasets:
- Essays dataset: Run with --dataset essays
- Synthetic dataset: Run with --create_synthetic
"""
        
        with open(self.output_dir / "PANDORA_INSTRUCTIONS.txt", 'w') as f:
            f.write(instructions)
        
        logger.info("Created PANDORA download instructions in data/PANDORA_INSTRUCTIONS.txt")
    
    def process_pandora_dataset(self):
        """Process PANDORA dataset into standard format"""
        logger.info("Processing PANDORA dataset...")
        
        # Read raw data
        df = pd.read_csv(self.output_dir / "pandora_raw.csv")
        
        # Clean text
        df['text'] = df['text'].apply(self.clean_text)
        
        # Normalize personality scores (if not already normalized)
        for trait in self.big_five_traits:
            if trait in df.columns:
                df[trait] = self.normalize_scores(df[trait])
        
        # Filter out very short texts
        df = df[df['text'].str.len() > 50]
        
        # Remove outliers
        df = self.remove_outliers(df)
        
        # Save processed dataset
        output_file = self.output_dir / "pandora_dataset.csv"
        df.to_csv(output_file, index=False)
        
        logger.info(f"Processed PANDORA dataset saved to {output_file}")
        logger.info(f"Dataset size: {len(df)} samples")
        
        # Create dataset statistics
        self.create_dataset_stats(df, "pandora")
    
    def prepare_essays_dataset(self) -> bool:
        """Prepare Essays dataset (Big Five personality traits)"""
        logger.info("Preparing Essays dataset...")
        
        # This is a well-known dataset for personality prediction
        essays_url = "https://raw.githubusercontent.com/SenticNet/personality-detection/master/data/essays.csv"
        
        try:
            if not self.download_file(essays_url, "essays_raw.csv"):
                logger.warning("Direct download failed. Creating instructions for manual download.")
                self.create_essays_instructions()
                return False
            
            self.process_essays_dataset()
            return True
            
        except Exception as e:
            logger.error(f"Error preparing Essays dataset: {e}")
            self.create_essays_instructions()
            return False
    
    def create_essays_instructions(self):
        """Create instructions for manually downloading Essays dataset"""
        instructions = """
# Essays Dataset Download Instructions

The Essays dataset can be downloaded from various sources:

1. Kaggle: https://www.kaggle.com/datasets/datasnaek/mbti-type
2. GitHub: https://github.com/SenticNet/personality-detection
3. Original paper: Pennebaker, J. W., & King, L. A. (1999)

Expected format:
- CSV file with columns: text, and personality trait scores
- May include MBTI types that need to be converted to Big Five
- Text should be essay-style writing samples

Steps:
1. Download the dataset from one of the sources above
2. Place the CSV file in the data/ directory
3. Rename to 'essays_raw.csv'
4. Run this script again
"""
        
        with open(self.output_dir / "ESSAYS_INSTRUCTIONS.txt", 'w') as f:
            f.write(instructions)
        
        logger.info("Created Essays download instructions in data/ESSAYS_INSTRUCTIONS.txt")
    
    def process_essays_dataset(self):
        """Process Essays dataset into standard format"""
        logger.info("Processing Essays dataset...")
        
        # Read raw data
        df = pd.read_csv(self.output_dir / "essays_raw.csv")
        
        # Clean text
        df['text'] = df['text'].apply(self.clean_text)
        
        # If dataset has MBTI types, convert to Big Five
        if 'type' in df.columns:
            df = self.convert_mbti_to_big_five(df)
        
        # Normalize personality scores
        for trait in self.big_five_traits:
            if trait in df.columns:
                df[trait] = self.normalize_scores(df[trait])
        
        # Filter and clean
        df = df[df['text'].str.len() > 100]
        df = self.remove_outliers(df)
        
        # Save processed dataset
        output_file = self.output_dir / "essays_dataset.csv"
        df.to_csv(output_file, index=False)
        
        logger.info(f"Processed Essays dataset saved to {output_file}")
        logger.info(f"Dataset size: {len(df)} samples")
        
        # Create dataset statistics
        self.create_dataset_stats(df, "essays")
    
    def convert_mbti_to_big_five(self, df: pd.DataFrame) -> pd.DataFrame:
        """Convert MBTI types to Big Five personality traits"""
        logger.info("Converting MBTI types to Big Five traits...")
        
        # MBTI to Big Five mapping (approximate)
        mbti_to_big_five = {
            # Extraversion
            'E': {'extraversion': 0.7},
            'I': {'extraversion': 0.3},
            
            # Openness (Intuition vs Sensing)
            'N': {'openness': 0.7},
            'S': {'openness': 0.3},
            
            # Conscientiousness (Judging vs Perceiving)
            'J': {'conscientiousness': 0.7},
            'P': {'conscientiousness': 0.3},
            
            # Agreeableness (Feeling vs Thinking)
            'F': {'agreeableness': 0.7},
            'T': {'agreeableness': 0.3},
        }
        
        # Initialize Big Five columns
        for trait in self.big_five_traits:
            df[trait] = 0.5  # Default neutral value
        
        # Convert MBTI to Big Five
        for idx, row in df.iterrows():
            mbti_type = row['type']
            
            # Extract individual preferences
            e_i = mbti_type[0]  # E or I
            n_s = mbti_type[1]  # N or S
            f_t = mbti_type[2]  # F or T
            j_p = mbti_type[3]  # J or P
            
            # Map to Big Five
            if e_i in mbti_to_big_five:
                df.loc[idx, 'extraversion'] = mbti_to_big_five[e_i]['extraversion']
            
            if n_s in mbti_to_big_five:
                df.loc[idx, 'openness'] = mbti_to_big_five[n_s]['openness']
            
            if f_t in mbti_to_big_five:
                df.loc[idx, 'agreeableness'] = mbti_to_big_five[f_t]['agreeableness']
            
            if j_p in mbti_to_big_five:
                df.loc[idx, 'conscientiousness'] = mbti_to_big_five[j_p]['conscientiousness']
            
            # Neuroticism is not directly mapped from MBTI, use random with some variation
            df.loc[idx, 'neuroticism'] = np.random.normal(0.5, 0.1)
        
        # Clip values to valid range
        for trait in self.big_five_traits:
            df[trait] = np.clip(df[trait], 0, 1)
        
        return df
    
    def create_synthetic_dataset(self, num_samples: int = 5000) -> bool:
        """Create synthetic dataset for training and testing"""
        logger.info(f"Creating synthetic dataset with {num_samples} samples...")
        
        # Text templates with personality indicators
        text_templates = {
            'high_openness': [
                "I love exploring new ideas and creative possibilities. Art and innovation fascinate me.",
                "I'm always curious about different perspectives and unconventional approaches.",
                "I enjoy abstract thinking and philosophical discussions about life and meaning.",
                "I find myself drawn to creative pursuits and artistic expression.",
                "I love traveling to new places and experiencing different cultures."
            ],
            'low_openness': [
                "I prefer practical, concrete solutions to everyday problems.",
                "I value tradition and established ways of doing things.",
                "I focus on realistic goals and tangible outcomes.",
                "I prefer familiar routines and predictable environments.",
                "I believe in proven methods and established practices."
            ],
            'high_conscientiousness': [
                "I always plan ahead and organize my tasks carefully.",
                "I set clear goals and work systematically to achieve them.",
                "I believe in discipline and maintaining high standards.",
                "I take responsibility seriously and always follow through.",
                "I prefer structured environments and clear expectations."
            ],
            'low_conscientiousness': [
                "I work best when I can be flexible and spontaneous.",
                "I adapt quickly to changing situations and new opportunities.",
                "I prefer to keep my options open rather than committing to rigid plans.",
                "I find inspiration in the moment and go with the flow.",
                "I value freedom and creativity over strict schedules."
            ],
            'high_extraversion': [
                "I love meeting new people and social gatherings energize me.",
                "I enjoy being the center of attention and leading conversations.",
                "I thrive in team environments and collaborative projects.",
                "I'm comfortable speaking up in groups and sharing my ideas.",
                "I get excited about networking and building relationships."
            ],
            'low_extraversion': [
                "I prefer quiet, intimate conversations with close friends.",
                "I need time alone to recharge and reflect on my thoughts.",
                "I work best in peaceful, focused environments.",
                "I prefer listening to others rather than dominating conversations.",
                "I value deep, meaningful connections over large social networks."
            ],
            'high_agreeableness': [
                "I always try to help others and put their needs first.",
                "I believe in cooperation and finding win-win solutions.",
                "I avoid conflict and try to maintain harmony in relationships.",
                "I trust people and give them the benefit of the doubt.",
                "I'm compassionate and empathetic toward others' feelings."
            ],
            'low_agreeableness': [
                "I believe in being direct and honest, even if it's uncomfortable.",
                "I value competence and results over being liked.",
                "I'm skeptical of others' motives and prefer to verify claims.",
                "I compete to win and don't back down from challenges.",
                "I prioritize my own goals and needs first."
            ],
            'high_neuroticism': [
                "I often worry about things that might go wrong.",
                "I feel stressed easily and have trouble managing anxiety.",
                "I tend to be moody and my emotions change frequently.",
                "I often feel overwhelmed by life's challenges.",
                "I worry about what others think of me."
            ],
            'low_neuroticism': [
                "I stay calm and composed even under pressure.",
                "I have a stable mood and rarely get upset.",
                "I handle criticism well and don't take things personally.",
                "I'm resilient and bounce back quickly from setbacks.",
                "I maintain an optimistic outlook on life."
            ]
        }
        
        texts = []
        personality_scores = []
        
        for i in range(num_samples):
            # Generate random personality profile
            profile = {
                'openness': np.random.beta(2, 2),
                'conscientiousness': np.random.beta(2, 2),
                'extraversion': np.random.beta(2, 2),
                'agreeableness': np.random.beta(2, 2),
                'neuroticism': np.random.beta(2, 2)
            }
            
            # Select text template based on personality profile
            selected_templates = []
            
            # For each trait, select template based on score
            for trait, score in profile.items():
                if score > 0.6:
                    template_key = f'high_{trait}'
                elif score < 0.4:
                    template_key = f'low_{trait}'
                else:
                    # Random selection for neutral scores
                    template_key = f'{"high" if np.random.random() > 0.5 else "low"}_{trait}'
                
                if template_key in text_templates:
                    selected_templates.extend(text_templates[template_key])
            
            # Create text by combining templates
            num_sentences = np.random.randint(3, 8)
            selected_sentences = np.random.choice(selected_templates, num_sentences, replace=False)
            text = ' '.join(selected_sentences)
            
            # Add some variation
            text = self.add_text_variation(text, profile)
            
            texts.append(text)
            personality_scores.append([profile[trait] for trait in self.big_five_traits])
        
        # Create dataframe
        df = pd.DataFrame({
            'text': texts,
            'openness': [scores[0] for scores in personality_scores],
            'conscientiousness': [scores[1] for scores in personality_scores],
            'extraversion': [scores[2] for scores in personality_scores],
            'agreeableness': [scores[3] for scores in personality_scores],
            'neuroticism': [scores[4] for scores in personality_scores]
        })
        
        # Save synthetic dataset
        output_file = self.output_dir / "synthetic_dataset.csv"
        df.to_csv(output_file, index=False)
        
        logger.info(f"Synthetic dataset saved to {output_file}")
        logger.info(f"Dataset size: {len(df)} samples")
        
        # Create dataset statistics
        self.create_dataset_stats(df, "synthetic")
        
        return True
    
    def add_text_variation(self, text: str, profile: Dict[str, float]) -> str:
        """Add variation to text based on personality profile"""
        # Add personality-specific words or phrases
        variations = {
            'high_openness': ['innovative', 'creative', 'unique', 'artistic', 'imaginative'],
            'high_conscientiousness': ['organized', 'systematic', 'careful', 'thorough', 'disciplined'],
            'high_extraversion': ['exciting', 'energetic', 'social', 'outgoing', 'enthusiastic'],
            'high_agreeableness': ['kind', 'helpful', 'cooperative', 'supportive', 'caring'],
            'high_neuroticism': ['worried', 'anxious', 'stressful', 'uncertain', 'concerned']
        }
        
        # Add random variations based on high traits
        for trait, score in profile.items():
            if score > 0.7:
                key = f'high_{trait}'
                if key in variations:
                    word = np.random.choice(variations[key])
                    # Sometimes add the word to the text
                    if np.random.random() < 0.3:
                        text += f" I feel {word} about this."
        
        return text
    
    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        if pd.isna(text):
            return ""
        
        # Convert to string and basic cleaning
        text = str(text)
        text = re.sub(r'http\S+', '', text)  # Remove URLs
        text = re.sub(r'@\w+', '', text)     # Remove mentions
        text = re.sub(r'#\w+', '', text)     # Remove hashtags
        text = re.sub(r'\s+', ' ', text)     # Multiple spaces to single
        text = text.strip()
        
        return text
    
    def normalize_scores(self, scores: pd.Series) -> pd.Series:
        """Normalize personality scores to 0-1 range"""
        min_score = scores.min()
        max_score = scores.max()
        
        if max_score == min_score:
            return pd.Series([0.5] * len(scores))
        
        normalized = (scores - min_score) / (max_score - min_score)
        return normalized
    
    def remove_outliers(self, df: pd.DataFrame) -> pd.DataFrame:
        """Remove outliers from dataset"""
        # Remove texts that are too short or too long
        df = df[(df['text'].str.len() > 50) & (df['text'].str.len() < 5000)]
        
        # Remove personality score outliers (beyond 3 standard deviations)
        for trait in self.big_five_traits:
            if trait in df.columns:
                mean_score = df[trait].mean()
                std_score = df[trait].std()
                df = df[abs(df[trait] - mean_score) <= (3 * std_score)]
        
        return df
    
    def create_dataset_stats(self, df: pd.DataFrame, dataset_name: str):
        """Create dataset statistics"""
        stats = {
            'dataset_name': dataset_name,
            'total_samples': len(df),
            'text_length_stats': {
                'mean': df['text'].str.len().mean(),
                'median': df['text'].str.len().median(),
                'std': df['text'].str.len().std(),
                'min': df['text'].str.len().min(),
                'max': df['text'].str.len().max()
            },
            'personality_stats': {}
        }
        
        # Personality trait statistics
        for trait in self.big_five_traits:
            if trait in df.columns:
                stats['personality_stats'][trait] = {
                    'mean': df[trait].mean(),
                    'median': df[trait].median(),
                    'std': df[trait].std(),
                    'min': df[trait].min(),
                    'max': df[trait].max()
                }
        
        # Correlations between traits
        if all(trait in df.columns for trait in self.big_five_traits):
            corr_matrix = df[self.big_five_traits].corr()
            stats['trait_correlations'] = corr_matrix.to_dict()
        
        # Save statistics
        stats_file = self.output_dir / f"{dataset_name}_stats.json"
        with open(stats_file, 'w') as f:
            json.dump(stats, f, indent=2)
        
        logger.info(f"Dataset statistics saved to {stats_file}")
        
        # Print summary
        print(f"\n📊 {dataset_name.upper()} Dataset Statistics:")
        print(f"Total samples: {stats['total_samples']}")
        print(f"Avg text length: {stats['text_length_stats']['mean']:.1f} characters")
        print("\nPersonality trait means:")
        for trait in self.big_five_traits:
            if trait in stats['personality_stats']:
                mean_val = stats['personality_stats'][trait]['mean']
                print(f"  {trait.capitalize()}: {mean_val:.3f}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Prepare datasets for personality prediction")
    
    parser.add_argument("--dataset", type=str, choices=["pandora", "essays", "all"],
                       help="Dataset to prepare")
    parser.add_argument("--create_synthetic", action="store_true",
                       help="Create synthetic dataset")
    parser.add_argument("--num_samples", type=int, default=5000,
                       help="Number of samples for synthetic dataset")
    parser.add_argument("--output_dir", type=str, default="data/",
                       help="Output directory for datasets")
    
    args = parser.parse_args()
    
    # Initialize dataset preparer
    preparer = DatasetPreparer(args.output_dir)
    
    success = True
    
    if args.create_synthetic:
        success = preparer.create_synthetic_dataset(args.num_samples)
    
    if args.dataset == "pandora":
        success = preparer.prepare_pandora_dataset()
    elif args.dataset == "essays":
        success = preparer.prepare_essays_dataset()
    elif args.dataset == "all":
        success = preparer.prepare_pandora_dataset() and preparer.prepare_essays_dataset()
    
    if success:
        print("\n✅ Dataset preparation completed successfully!")
        print(f"📁 Files saved to: {args.output_dir}")
        print("\nNext steps:")
        print("1. Review the prepared datasets")
        print("2. Run: python train_model.py --dataset <dataset_name>")
        print("3. Monitor training progress in logs/")
    else:
        print("\n❌ Dataset preparation failed. Check the logs for details.")
        print("You may need to manually download some datasets.")

if __name__ == "__main__":
    main()