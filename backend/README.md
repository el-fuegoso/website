# Elliot Personality Analyzer Backend

A Flask-based personality analysis API that integrates with the Elliot terminal experience to provide Big Five personality insights and generate personalized avatars.

## Features

- **Personality Analysis**: Big Five personality trait analysis from text input
- **Multiple Input Modes**: 
  - Quest mode (4 guided questions)
  - Natural conversation analysis
  - Job description analysis
  - General text analysis
- **Avatar Generation**: Personalized avatar creation based on personality scores
- **RESTful API**: Clean JSON API for frontend integration
- **Explainable AI**: Insights into analysis reasoning

## Architecture

```
backend/
├── app.py                      # Flask application
├── personality_analyzer/       # Core analysis package
│   ├── __init__.py
│   ├── analyzer.py            # Main analyzer class
│   ├── preprocessing.py       # Text preprocessing
│   ├── model_loader.py        # Model loading (currently rule-based)
│   └── utils.py              # Utilities and avatar generation
├── models/                    # Model storage (placeholder)
├── requirements.txt           # Python dependencies
└── test_analyzer.py          # Test script
```

## Installation

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Test the Analyzer**:
   ```bash
   python test_analyzer.py
   ```

3. **Run the Flask Server**:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /
```
Returns server status and analyzer readiness.

### General Text Analysis
```
POST /api/analyze
Content-Type: application/json

{
  "text": "Your text to analyze...",
  "mode": "general|quest|conversation|jd",
  "context": [optional conversation history]
}
```

### Quest Mode Analysis
```
POST /api/quest
Content-Type: application/json

{
  "responses": ["response1", "response2", "response3", "response4"],
  "user_name": "UserName"
}
```

### Avatar Generation
```
POST /api/generate_avatar
Content-Type: application/json

{
  "personality_scores": {
    "Openness": 0.7,
    "Conscientiousness": 0.6,
    "Extraversion": 0.8,
    "Agreeableness": 0.5,
    "Neuroticism": 0.3
  },
  "user_context": {}
}
```

## Response Format

All endpoints return JSON responses with this structure:

```json
{
  "status": "success|error",
  "personality_scores": {
    "Openness": {
      "score": 0.7,
      "level": "High",
      "description": "Curious, imaginative, open to new experiences",
      "confidence": 0.8,
      "percentile": 70.0
    }
    // ... other traits
  },
  "avatar_data": {
    "title": "Your Personal El: The Innovator",
    "archetype": {
      "name": "The Innovator",
      "description": "Creative and organized, brings novel ideas to life",
      "emoji": "💡"
    },
    "dominant_traits": ["Creative", "Organized"],
    "working_style": {
      "structure": "Prefers structured approaches",
      "innovation": "Enjoys exploring new methods",
      "energy": "Works best with collaboration"
    }
    // ... more avatar data
  },
  "explanation": "Based on your input, I can see: High Openness, Moderate Conscientiousness..."
}
```

## Current Implementation

### Model Status
- **Current**: Rule-based personality analysis using linguistic features
- **Planned**: Integration with pre-trained transformer models (BERT/RoBERTa)
- **Features**: Extracts linguistic patterns, emotional indicators, and personality markers

### Analysis Features
- **Text Preprocessing**: Handles contractions, URLs, emotional indicators
- **Feature Extraction**: Word usage patterns, emotional language, certainty markers
- **Personality Mapping**: Maps linguistic features to Big Five traits
- **Avatar Generation**: Creates detailed personality-based avatars

## Integration with Frontend

The backend is designed to integrate with the Elliot terminal frontend:

1. **Terminal Input**: User types in terminal → sent to `/api/analyze`
2. **Quest Flow**: All 4 quest responses → sent to `/api/quest`  
3. **Avatar Display**: Personality scores → avatar generation → terminal display

### Frontend Integration Example

```javascript
// Send terminal input to backend
async function analyzeTerminalInput(text, mode = 'general') {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode })
    });
    return await response.json();
}
```

## Development Notes

### Adding Real ML Models

To integrate actual trained models:

1. **Save Model**: Place trained PyTorch/TensorFlow model in `models/`
2. **Update Model Loader**: Modify `model_loader.py` to load real models
3. **Configure Tokenizer**: Add proper tokenizer files to `models/tokenizer/`

### Extending Analysis

To add new personality frameworks:

1. **Update Utils**: Add new trait definitions in `utils.py`
2. **Modify Analyzer**: Update scoring logic in `analyzer.py`
3. **Enhance API**: Add new endpoints if needed

## Testing

Run the test suite:
```bash
python test_analyzer.py
```

Tests cover:
- Basic text analysis
- Quest mode processing
- Model information retrieval
- Error handling

## Deployment

For production deployment:

1. **Use Production WSGI Server**: Gunicorn, uWSGI, etc.
2. **Environment Variables**: Move configuration to env vars
3. **Logging**: Configure proper logging levels
4. **Model Loading**: Optimize model loading for production
5. **CORS**: Configure CORS for your domain

## Next Steps

1. **Frontend Integration**: Connect to Elliot terminal interface
2. **Model Training**: Train actual ML models on personality datasets
3. **Enhanced Features**: Add more sophisticated linguistic analysis
4. **Performance**: Optimize for real-time analysis
5. **Validation**: Add psychometric validation of results