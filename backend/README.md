---
title: Personality API
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.12.0
app_file: app.py
pinned: false
license: mit
---

# Personality API

An AI-powered personality analysis service that analyzes text input and generates personality profiles based on the Big Five personality traits model.

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

## Production Deployment

### Option 1: Gunicorn (Recommended)

The project includes production-ready configuration:

```bash
# Install production dependencies
pip install gunicorn

# Start with custom configuration
gunicorn --config gunicorn.conf.py app:app

# Or use the provided startup script
chmod +x start_server.sh
./start_server.sh
```

### Option 2: Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
```

### Environment Configuration

For production, set these environment variables:

```bash
# Core Configuration
FLASK_ENV=production
FLASK_DEBUG=False
MODEL_PATH=/app/models/ocean_model/

# Database (if using persistent storage)
DATABASE_URL=postgresql://user:pass@host:port/db

# Security
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com,api.your-domain.com

# Performance
WORKERS=4
TIMEOUT=120
MAX_REQUESTS=1000

# Monitoring
LOG_LEVEL=INFO
METRICS_ENDPOINT=/metrics
```

### Production Optimizations

1. **Model Loading**: Pre-load models at startup
   ```python
   # In app.py
   @app.before_first_request
   def load_models():
       # Preload ML models to avoid cold starts
       analyzer.initialize_models()
   ```

2. **Caching**: Implement Redis caching
   ```bash
   pip install redis flask-caching
   ```

3. **Database**: Add PostgreSQL for persistent storage
   ```bash
   pip install psycopg2-binary flask-sqlalchemy
   ```

4. **Monitoring**: Add health checks and metrics
   ```python
   @app.route('/health')
   def health_check():
       return {'status': 'healthy', 'timestamp': datetime.utcnow()}
   ```

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle long analysis requests
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

### Cloud Deployment Options

#### AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init
eb create production
eb deploy
```

#### Google Cloud Platform
```bash
# Install gcloud CLI and deploy
gcloud app deploy

# app.yaml
runtime: python39
env: standard
instance_class: F2
automatic_scaling:
  min_instances: 1
  max_instances: 10
```

#### Heroku
```bash
# Add Procfile
echo "web: gunicorn --config gunicorn.conf.py app:app" > Procfile

# Deploy
git add .
git commit -m "Add production config"
git push heroku main
```

## Performance Monitoring

### Metrics Collection

Add application performance monitoring:

```python
# Install monitoring dependencies
pip install prometheus_client psutil

# Add to app.py
from prometheus_client import Counter, Histogram, generate_latest

# Metrics
REQUEST_COUNT = Counter('app_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('app_request_duration_seconds', 'Request duration')

@app.route('/metrics')
def metrics():
    return generate_latest()
```

### Load Testing

Test API performance with realistic loads:

```bash
# Install load testing tools
pip install locust

# Create locustfile.py
from locust import HttpUser, task, between

class PersonalityAPIUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def analyze_text(self):
        self.client.post("/api/analyze", json={
            "text": "Sample text for analysis",
            "mode": "general"
        })
```

### Database Optimization

For high-volume deployments:

```python
# Add database connection pooling
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True
)
```

## Security Considerations

### Input Validation
- Sanitize all text inputs
- Rate limiting per IP/user
- Input length restrictions
- Content filtering for sensitive data

### API Security
```python
# Add rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/analyze')
@limiter.limit("10 per minute")
def analyze():
    # Your analysis logic here
    pass
```

### Data Privacy
- No persistent storage of user input (by default)
- GDPR compliance considerations
- Anonymized analytics only
- Clear data retention policies

## Troubleshooting

### Common Issues

1. **Model Loading Errors**
   ```bash
   # Check model files exist
   ls -la models/ocean_model/
   
   # Verify permissions
   chmod -R 755 models/
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   htop
   
   # Adjust model loading strategy
   export MODEL_CACHE_SIZE=1  # Reduce memory usage
   ```

3. **API Timeout Issues**
   ```python
   # Increase timeout in gunicorn.conf.py
   timeout = 300  # 5 minutes for complex analysis
   ```

### Performance Optimization

1. **Model Inference**: Use batch processing for multiple requests
2. **Caching**: Implement intelligent result caching
3. **Async Processing**: Use Celery for long-running tasks
4. **CDN**: Cache static responses at edge locations

## Next Steps

1. **Frontend Integration**: Complete integration with Elliot terminal interface
2. **Model Training**: Train production ML models on larger personality datasets  
3. **Enhanced Features**: Add multilingual support and advanced linguistic analysis
4. **Performance**: Implement caching and async processing for scale
5. **Validation**: Add comprehensive psychometric validation and A/B testing
6. **Documentation**: Create interactive API documentation with Swagger/OpenAPI