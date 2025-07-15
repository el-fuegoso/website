#!/usr/bin/env python3
"""
Quick Training Script for Personality Prediction Model
=====================================================

This script provides a simple way to train the personality prediction model
with default settings and synthetic data.

Usage:
    python run_training.py
    python run_training.py --quick
    python run_training.py --synthetic_samples 1000
"""

import os
import sys
import argparse
import logging
from pathlib import Path

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

from prepare_dataset import DatasetPreparer
from train_model import PersonalityTrainer, TrainingConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def quick_training(num_samples: int = 1000):
    """Run quick training with synthetic dataset"""
    
    print("🚀 Starting Quick Personality Prediction Training")
    print("=" * 50)
    
    # Step 1: Prepare synthetic dataset
    print("📊 Step 1: Creating synthetic dataset...")
    preparer = DatasetPreparer("data/")
    success = preparer.create_synthetic_dataset(num_samples)
    
    if not success:
        print("❌ Failed to create synthetic dataset")
        return False
    
    # Step 2: Configure training
    print("⚙️  Step 2: Configuring training...")
    config = TrainingConfig(
        # Model settings
        model_name="distilbert-base-uncased",  # Smaller, faster model
        classification_head="linear",
        
        # Dataset settings
        dataset_name="synthetic",
        data_path="data/",
        
        # Training settings
        batch_size=16,  # Larger batch for efficiency
        learning_rate=5e-5,  # Higher learning rate for faster convergence
        num_epochs=1,  # Just 1 epoch for quick test
        max_length=128,  # Much shorter sequences for speed
        
        # Evaluation settings
        eval_steps=25,  # Evaluate more frequently
        logging_steps=10,  # Log more frequently
        save_steps=50,  # Save more frequently
        
        # Paths
        model_save_path="models/",
        logs_path="logs/",
        
        # Early stopping
        early_stopping_patience=1,  # Stop earlier
    )
    
    # Step 3: Train model
    print("🎯 Step 3: Training model...")
    trainer = PersonalityTrainer(config)
    
    try:
        trained_model = trainer.train()
        
        print("\n" + "=" * 50)
        print("🎉 TRAINING COMPLETED SUCCESSFULLY! 🎉")
        print("=" * 50)
        print(f"✅ Model saved to: {config.model_save_path}")
        print(f"✅ Logs saved to: {config.logs_path}")
        print(f"✅ Synthetic dataset: {num_samples} samples")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"❌ Training failed: {e}")
        return False

def full_training():
    """Run full training with configurable options"""
    
    print("🚀 Starting Full Personality Prediction Training")
    print("=" * 50)
    
    # Check for existing datasets
    data_dir = Path("data/")
    datasets = []
    
    if (data_dir / "pandora_dataset.csv").exists():
        datasets.append("pandora")
    if (data_dir / "essays_dataset.csv").exists():
        datasets.append("essays")
    if (data_dir / "essays_big5_dataset.csv").exists():
        datasets.append("essays_big5")
    if (data_dir / "synthetic_dataset.csv").exists():
        datasets.append("synthetic")
    if (data_dir / "custom_dataset.csv").exists():
        datasets.append("custom")
    
    if not datasets:
        print("📊 No datasets found. Creating synthetic dataset...")
        preparer = DatasetPreparer("data/")
        preparer.create_synthetic_dataset(5000)
        datasets.append("synthetic")
    
    print(f"📊 Available datasets: {', '.join(datasets)}")
    
    # Use the first available dataset
    dataset_name = datasets[0]
    print(f"📊 Using dataset: {dataset_name}")
    
    # Configure training
    config = TrainingConfig(
        dataset_name=dataset_name,
        data_path="data/",
        model_save_path="models/",
        logs_path="logs/",
        
        # Full training settings
        batch_size=16,
        learning_rate=2e-5,
        num_epochs=10,
        max_length=512,
        
        # Evaluation
        eval_steps=500,
        logging_steps=100,
        save_steps=1000,
        early_stopping_patience=3,
    )
    
    # Train model
    trainer = PersonalityTrainer(config)
    
    try:
        trained_model = trainer.train()
        
        print("\n" + "=" * 50)
        print("🎉 FULL TRAINING COMPLETED SUCCESSFULLY! 🎉")
        print("=" * 50)
        print(f"✅ Model saved to: {config.model_save_path}")
        print(f"✅ Logs saved to: {config.logs_path}")
        print(f"✅ Dataset used: {dataset_name}")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"❌ Training failed: {e}")
        return False

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Run personality prediction training")
    
    parser.add_argument("--quick", action="store_true",
                       help="Run quick training with small synthetic dataset")
    parser.add_argument("--synthetic_samples", type=int, default=1000,
                       help="Number of synthetic samples for quick training")
    parser.add_argument("--full", action="store_true",
                       help="Run full training with all available datasets")
    
    args = parser.parse_args()
    
    if args.quick:
        success = quick_training(args.synthetic_samples)
    elif args.full:
        success = full_training()
    else:
        # Default: quick training
        success = quick_training(args.synthetic_samples)
    
    if success:
        print("\n🎯 Next steps:")
        print("1. Check the trained model in models/")
        print("2. Review training logs in logs/")
        print("3. Test the model with your Flask API")
        print("4. Update model_loader.py to use the trained model")
        
        print("\n📝 To use the trained model:")
        print("1. Update backend/personality_analyzer/model_loader.py")
        print("2. Change use_mock_model = False")
        print("3. Restart your Flask API")
        
    else:
        print("\n❌ Training failed. Check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()