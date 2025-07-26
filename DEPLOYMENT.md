# Vercel Deployment Guide

## Overview

This project has been configured for deployment on Vercel using Python runtime for the Flask backend and static hosting for the frontend.

## Architecture

- **Frontend**: Static HTML/CSS/JS served by Vercel
- **Backend**: Flask app running as Vercel Python serverless functions
- **Model**: Trained BERT model hosted on GitHub releases with intelligent caching

## Deployment Steps

### 1. Create GitHub Release with Model

First, create a GitHub release containing your trained model:

```bash
# Run the provided script
./scripts/create-model-release.sh
```

This will:
- Create a GitHub release tagged `v1.0.0-model`
- Upload all required model files (pytorch_model.bin, config.json, etc.)
- Provide instructions for the next steps

### 2. Environment Variables

Set the following environment variables in your Vercel dashboard:

```bash
# Required for character chat functionality
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# GitHub model release tag
MODEL_RELEASE_TAG=v1.0.0-model
```

Or via Vercel CLI:
```bash
vercel env add ANTHROPIC_API_KEY production
vercel env add MODEL_RELEASE_TAG production
vercel env add ANTHROPIC_API_KEY preview
vercel env add MODEL_RELEASE_TAG preview
vercel env add ANTHROPIC_API_KEY development
vercel env add MODEL_RELEASE_TAG development
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts to configure your project
```

#### Option B: GitHub Integration
1. Connect your repository to Vercel
2. Configure environment variables in the dashboard
3. Deploy automatically on git push

### 4. Verify Deployment

After deployment, test these endpoints:

- `GET /` - Health check
- `POST /api/analyze` - Text personality analysis
- `POST /api/analyze_traits` - UI trait analysis
- `GET /api/characters` - Available AI characters
- `POST /api/chat` - Character conversations

## Model Handling

### GitHub Releases Strategy
- **253MB trained BERT model** hosted as GitHub release assets
- **Intelligent caching** in `/tmp/ocean_model_cache` 
- **Version control** through release tags
- **Reliable downloads** from GitHub's global CDN

### Download Process
1. **Cold Start**: Function checks cache for existing model
2. **Cache Miss**: Downloads model from GitHub releases (~30-60 seconds)
3. **Cache Hit**: Loads model from `/tmp/` cache (~5-10 seconds)
4. **Persistence**: Cache survives across requests in same instance

### Performance Characteristics
- **First request**: 30-60 seconds (model download + loading)
- **Subsequent requests**: 2-5 seconds (cached model)
- **Function reuse**: Cache persists between requests
- **Reliability**: No fallbacks - always uses your trained model

## API Endpoints

All Flask backend endpoints are available under `/api/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/analyze` | POST | Text personality analysis |
| `/api/quest` | POST | Quest response analysis |
| `/api/analyze_traits` | POST | UI trait analysis |
| `/api/characters` | GET | Get all AI characters |
| `/api/match_character` | POST | Character matching |
| `/api/generate_avatar` | POST | Avatar generation |
| `/api/chat` | POST | Character conversations |

## Configuration Files

### vercel.json
- Configures Python runtime for `/api/index.py`
- Routes all Flask endpoints through the Python function
- Sets CORS headers and function timeouts

### requirements.txt
- Optimized for production deployment
- Core ML dependencies only
- Lightweight compared to training requirements

### api/index.py
- Main Vercel serverless function
- Handles all Flask backend endpoints
- Clean integration with GitHub model handler

### api/model_handler.py
- GitHub releases model downloader
- Intelligent caching system
- Progress tracking for large downloads
- Version-aware model management

## Troubleshooting

### Common Issues

1. **Model Download Failures**
   - Check GitHub release exists: `https://github.com/el-fuegoso/website/releases/tag/v1.0.0-model`
   - Verify `MODEL_RELEASE_TAG` environment variable is set
   - Check function logs for download error details
   - Ensure all 6 model files are in the release

2. **Environment Variables**
   - Ensure `ANTHROPIC_API_KEY` is set for chat functionality
   - Verify `MODEL_RELEASE_TAG` matches your release tag
   - Check Vercel dashboard environment configuration

3. **Function Timeouts**
   - Default timeout is 60 seconds for analysis functions
   - First request may timeout during model download
   - Subsequent requests should be much faster
   - Monitor function duration in Vercel dashboard

4. **Cache Issues**
   - Function logs show "🎯 Found matching cached model" when cache works
   - Cache automatically refreshes if release tag changes
   - `/tmp/ocean_model_cache` directory cleared on function restart

5. **CORS Issues**
   - Headers are configured in `vercel.json`
   - All API endpoints support CORS
   - Preflight OPTIONS requests handled automatically

### Monitoring

- Use Vercel's function logs for debugging
- Monitor function duration and memory usage
- Set up alerts for failed requests

## Development vs Production

### Local Development
```bash
# Run frontend
python3 -m http.server 8080

# Test API function
python3 api/index.py
```

### Production Deployment
- All endpoints available at your Vercel domain
- Environment variables managed through Vercel
- Automatic HTTPS and CDN distribution

## Next Steps

1. **Performance Optimization**
   - Implement function warming
   - Optimize model loading strategies
   - Consider edge caching for static responses

2. **Monitoring & Analytics**
   - Add error tracking
   - Monitor personality analysis usage
   - Track chat conversation metrics

3. **Feature Enhancements**
   - Add database for user data persistence
   - Implement user authentication
   - Add more AI character profiles