# Manual GitHub Release Creation

## Step 1: Go to GitHub Releases

1. Visit: https://github.com/el-fuegoso/website/releases
2. Click **"Create a new release"**

## Step 2: Release Configuration

**Tag version**: `v1.0.0-model`

**Release title**: `OCEAN Personality Model v1.0.0`

**Description**:
```
Trained BERT model for Big Five personality analysis. Includes all model files needed for inference.

Model Details:
- Architecture: BERT-base-uncased fine-tuned for personality classification
- Output: Big Five personality traits (OCEAN)
- Model size: ~253MB
- Files included: pytorch_model.bin, config.json, tokenizer files

Usage:
This release is used by the Vercel deployment to download the model at runtime.
Set MODEL_RELEASE_TAG=v1.0.0-model in your Vercel environment variables.
```

## Step 3: Upload Model Files

Upload these 6 files from `backend/models/ocean_model/`:

1. **pytorch_model.bin** (253MB) - Main model weights
2. **config.json** - Model configuration
3. **tokenizer.json** - Tokenizer data
4. **tokenizer_config.json** - Tokenizer configuration  
5. **special_tokens_map.json** - Special tokens mapping
6. **vocab.txt** - Vocabulary file

## Step 4: Publish Release

- ✅ Check "Set as the latest release"
- Click **"Publish release"**

## Step 5: Verify Release

After publishing, verify the release URL works:
https://github.com/el-fuegoso/website/releases/tag/v1.0.0-model

Each file should be downloadable with URLs like:
https://github.com/el-fuegoso/website/releases/download/v1.0.0-model/pytorch_model.bin

## Next Steps

1. Add `MODEL_RELEASE_TAG=v1.0.0-model` to Vercel environment variables
2. Deploy to Vercel
3. Test the health endpoint to verify model loading