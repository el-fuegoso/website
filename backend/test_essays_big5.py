#!/usr/bin/env python3
"""
Test script for essays-big5 dataset loading
"""

import os
import sys
import logging

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from prepare_dataset import DatasetPreparer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_essays_big5_dataset():
    """Test loading and processing essays-big5 dataset"""
    print("🧪 Testing essays-big5 dataset loading...")
    
    try:
        # Test dataset preparation
        preparer = DatasetPreparer("data/")
        success = preparer.prepare_essays_big5_dataset()
        
        if success:
            print("✅ essays-big5 dataset loaded and processed successfully!")
            
            # Check the generated file
            dataset_file = "data/essays_big5_dataset.csv"
            if os.path.exists(dataset_file):
                import pandas as pd
                df = pd.read_csv(dataset_file)
                
                print(f"\n📊 Dataset Statistics:")
                print(f"   Total samples: {len(df)}")
                print(f"   Columns: {df.columns.tolist()}")
                
                # Check text lengths
                text_lengths = df['text'].str.len()
                print(f"   Text length - Min: {text_lengths.min()}, Max: {text_lengths.max()}, Mean: {text_lengths.mean():.1f}")
                
                # Check personality scores
                personality_cols = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
                print(f"\n📈 Personality Score Statistics:")
                for col in personality_cols:
                    if col in df.columns:
                        mean_val = df[col].mean()
                        std_val = df[col].std()
                        min_val = df[col].min()
                        max_val = df[col].max()
                        print(f"   {col.capitalize()}: Mean={mean_val:.3f}, Std={std_val:.3f}, Range=[{min_val:.3f}, {max_val:.3f}]")
                
                # Show sample texts
                print(f"\n📝 Sample Texts:")
                for i, text in enumerate(df['text'].head(3)):
                    print(f"   {i+1}. {text[:100]}...")
                
                return True
            else:
                print("❌ Dataset file not created")
                return False
        else:
            print("❌ Failed to load essays-big5 dataset")
            return False
            
    except Exception as e:
        print(f"❌ Error testing dataset: {e}")
        return False

def test_training_integration():
    """Test training script integration"""
    print("\n🎯 Testing training integration...")
    
    try:
        from train_model import DatasetLoader
        
        # Test dataset loading
        texts, scores = DatasetLoader.load_essays_big5_dataset("data/")
        
        print(f"✅ Training integration successful!")
        print(f"   Loaded {len(texts)} texts")
        print(f"   Loaded {len(scores)} personality score sets")
        
        # Check first few samples
        if texts and scores:
            print(f"\n📝 First sample:")
            print(f"   Text: {texts[0][:100]}...")
            print(f"   Scores: {scores[0]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Training integration failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 ESSAYS-BIG5 DATASET TEST")
    print("=" * 60)
    
    # Test dataset preparation
    dataset_success = test_essays_big5_dataset()
    
    # Test training integration
    training_success = test_training_integration()
    
    print("\n" + "=" * 60)
    if dataset_success and training_success:
        print("🎉 ALL TESTS PASSED!")
        print("✅ essays-big5 dataset is ready for training")
        print("\nNext steps:")
        print("1. Run: python run_training.py --quick")
        print("2. Or: python train_model.py --dataset essays_big5")
    else:
        print("❌ SOME TESTS FAILED")
        print("Please check the error messages above")
    print("=" * 60)