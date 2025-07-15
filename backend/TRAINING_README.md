# Personality Prediction Model Training System

This directory contains a comprehensive training system for personality prediction models based on the Big Five personality traits using deep learning techniques.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install core dependencies
pip install -r requirements.txt

# Install training dependencies (includes PyTorch, transformers, etc.)
pip install -r requirements_training.txt
```

### 2. Quick Training with Synthetic Data

```bash
# Run quick training (recommended for testing)
python run_training.py --quick --synthetic_samples 1000

# Run full training with more samples
python run_training.py --full
```

### 3. Use Trained Model

After training, update the model loader:

```python
# In personality_analyzer/model_loader.py
use_mock_model = False  # Change to use trained model
```

Then restart your Flask API.

## 📁 File Structure

```
backend/
├── train_model.py              # Main training script
├── run_training.py             # Quick training runner
├── prepare_dataset.py          # Dataset preparation utilities
├── training_config.yaml        # Training configuration
├── requirements_training.txt   # Training dependencies
├── data/                       # Dataset storage
│   ├── pandora_dataset.csv     # PANDORA Reddit dataset
│   ├── essays_dataset.csv      # Essays dataset
│   └── synthetic_dataset.csv   # Synthetic dataset
├── models/                     # Trained models
│   ├── personality_model.pt    # Model weights
│   ├── tokenizer/             # Tokenizer files
│   ├── training_config.json   # Training configuration
│   └── evaluation_results.json # Training results
└── logs/                       # Training logs
    ├── training.log           # Training log file
    └── tensorboard/           # TensorBoard logs
```

## 🎯 Training Options

### Dataset Options

1. **Synthetic Dataset** (Default)
   - Automatically generated
   - Good for testing and development
   - 1000-5000 samples recommended

2. **PANDORA Reddit Dataset**
   - Real Reddit personality data
   - Requires manual download
   - High quality, large dataset

3. **Essays Dataset**
   - Academic personality essays
   - MBTI to Big Five conversion
   - Moderate size, good quality

### Model Architectures

1. **BERT + Linear** (Default)
   - Fast training and inference
   - Good baseline performance
   - Recommended for most use cases

2. **BERT + BiLSTM**
   - More complex architecture
   - Better for sequential patterns
   - Slower training

3. **BERT + Attention**
   - Attention-based classification
   - Good for long texts
   - Experimental

### Training Commands

```bash
# Basic training with synthetic data
python train_model.py --dataset synthetic --epochs 5

# Training with PANDORA dataset
python train_model.py --dataset pandora --epochs 10 --batch_size 16

# Training with custom architecture
python train_model.py --model_name roberta-base --classification_head bilstm

# Advanced training with custom parameters
python train_model.py \
    --dataset pandora \
    --model_name bert-base-uncased \
    --classification_head linear \
    --batch_size 32 \
    --learning_rate 3e-5 \
    --epochs 15 \
    --max_length 512
```

## 📊 Dataset Preparation

### Synthetic Dataset

```bash
# Create synthetic dataset
python prepare_dataset.py --create_synthetic --num_samples 5000
```

### PANDORA Reddit Dataset

```bash
# Prepare PANDORA dataset (requires manual download)
python prepare_dataset.py --dataset pandora --output_dir data/
```

### Essays Dataset

```bash
# Prepare Essays dataset
python prepare_dataset.py --dataset essays --output_dir data/
```

### Custom Dataset

Create a CSV file with these columns:
- `text`: Text content for analysis
- `openness`: Openness score (0.0 - 1.0)
- `conscientiousness`: Conscientiousness score (0.0 - 1.0)
- `extraversion`: Extraversion score (0.0 - 1.0)
- `agreeableness`: Agreeableness score (0.0 - 1.0)
- `neuroticism`: Neuroticism score (0.0 - 1.0)

Save as `data/custom_dataset.csv` and run:

```bash
python train_model.py --dataset custom
```

## 🔧 Configuration

### Training Configuration (training_config.yaml)

```yaml
model:
  name: "bert-base-uncased"
  max_length: 512
  dropout: 0.1

training:
  batch_size: 16
  learning_rate: 2e-5
  num_epochs: 10
  early_stopping_patience: 3

dataset:
  name: "synthetic"
  train_split: 0.8
  val_split: 0.1
  test_split: 0.1
```

### Model Loader Configuration

```python
# In personality_analyzer/model_loader.py
use_mock_model = True   # Use rule-based model
use_mock_model = False  # Use trained neural model
```

## 📈 Monitoring Training

### TensorBoard

```bash
# Start TensorBoard
tensorboard --logdir logs/tensorboard

# Open in browser
http://localhost:6006
```

### Training Logs

```bash
# View training logs
tail -f logs/training.log

# View model performance
cat models/evaluation_results.json
```

## 🎯 Performance Metrics

### Expected Performance

- **MSE**: < 0.05 (Mean Squared Error)
- **MAE**: < 0.15 (Mean Absolute Error)
- **R²**: > 0.6 (Coefficient of Determination)
- **Pearson Correlation**: > 0.7

### Evaluation Metrics

The training system evaluates models using:
- Mean Squared Error (MSE)
- Mean Absolute Error (MAE)
- R² Score
- Pearson Correlation
- Per-trait analysis

## 🚀 Production Deployment

### 1. Train Production Model

```bash
# Train with larger dataset and more epochs
python train_model.py \
    --dataset pandora \
    --epochs 20 \
    --batch_size 32 \
    --learning_rate 2e-5
```

### 2. Enable Trained Model

```python
# In personality_analyzer/model_loader.py
use_mock_model = False
```

### 3. Test Model

```bash
# Test API with trained model
curl -X POST -H "Content-Type: application/json" \
    -d '{"text": "I love exploring new ideas and creative projects"}' \
    http://localhost:5001/api/analyze
```

## 🔍 Troubleshooting

### Common Issues

1. **CUDA Out of Memory**
   ```bash
   # Reduce batch size
   python train_model.py --batch_size 8
   ```

2. **Training Too Slow**
   ```bash
   # Use smaller model
   python train_model.py --model_name distilbert-base-uncased
   ```

3. **Poor Performance**
   ```bash
   # Increase training epochs
   python train_model.py --epochs 20
   
   # Use larger dataset
   python prepare_dataset.py --create_synthetic --num_samples 10000
   ```

4. **Model Loading Errors**
   ```python
   # Check model path
   ls -la models/
   
   # Verify configuration
   cat models/training_config.json
   ```

### Debug Mode

```bash
# Enable debug logging
python train_model.py --dataset synthetic --epochs 1 --batch_size 2
```

## 📚 Additional Resources

### Datasets

- [PANDORA Reddit Dataset](https://github.com/khandait/PANDORA)
- [Essays Dataset](https://www.kaggle.com/datasets/datasnaek/mbti-type)
- [Big Five Personality Test](https://www.123test.com/big-five-personality-test/)

### Models

- [BERT Base](https://huggingface.co/bert-base-uncased)
- [RoBERTa Base](https://huggingface.co/roberta-base)
- [DistilBERT](https://huggingface.co/distilbert-base-uncased)

### Research Papers

- [Personality Prediction Based on User Behavior](https://arxiv.org/abs/1204.4809)
- [Deep Learning for Personality Prediction](https://arxiv.org/abs/1708.01357)
- [BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This training system is part of the Elliot Lee Personality Analyzer project.

---

**Happy Training! 🎉**

For questions or issues, please check the troubleshooting section or open an issue in the repository.