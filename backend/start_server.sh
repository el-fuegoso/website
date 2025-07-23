#!/bin/bash
# Start script for Elliot OCEAN Terminal API

echo "🚀 Starting Elliot OCEAN Terminal API..."
echo "🧠 OCEAN Personality Analysis Model Integration"
echo "📊 Model: pytorch_model.bin (265.5MB, R² = 0.18)"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  No virtual environment found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check for OCEAN model files
if [ ! -f "models/ocean_model/pytorch_model.bin" ]; then
    echo "⚠️  OCEAN model files not found!"
    echo "📁 Please place your trained model files in:"
    echo "   models/ocean_model/pytorch_model.bin"
    echo "   models/ocean_model/config.json"
    echo "   models/ocean_model/tokenizer.json"
    echo "   models/ocean_model/tokenizer_config.json"
    echo "   models/ocean_model/special_tokens_map.json"
    echo "   models/ocean_model/vocab.txt"
    echo "   models/ocean_model/comparison_summary.json"
    echo ""
    echo "🔄 Starting server anyway (model will load when files are available)..."
fi

# Set Flask environment
export FLASK_APP=app.py
export FLASK_ENV=development

# Start server with Gunicorn
echo "🌐 Starting server on http://0.0.0.0:5001"
echo "📡 API endpoints available:"
echo "   GET  /                - Health check"
echo "   POST /api/analyze     - OCEAN text analysis"  
echo "   POST /api/terminal    - Terminal command processing"
echo "   GET  /api/model_info  - Model information"
echo ""

gunicorn --config gunicorn.conf.py app:app