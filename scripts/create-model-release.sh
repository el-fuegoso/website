#!/bin/bash

# Script to create GitHub release with model assets
# Run this from the project root directory

set -e

# Configuration
RELEASE_TAG="v1.0.0-model"
RELEASE_NAME="OCEAN Personality Model v1.0.0"
RELEASE_DESCRIPTION="Trained BERT model for Big Five personality analysis. Includes all model files needed for inference."
MODEL_DIR="backend/models/ocean_model"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Creating GitHub release for OCEAN personality model${NC}"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Check if model directory exists
if [ ! -d "$MODEL_DIR" ]; then
    echo -e "${RED}❌ Model directory not found: $MODEL_DIR${NC}"
    exit 1
fi

# List required model files
REQUIRED_FILES=(
    "pytorch_model.bin"
    "config.json"
    "tokenizer.json"
    "tokenizer_config.json"
    "special_tokens_map.json"
    "vocab.txt"
)

echo -e "${YELLOW}📋 Checking required model files...${NC}"

# Check if all required files exist
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$MODEL_DIR/$file" ]; then
        echo -e "${RED}❌ Required file not found: $MODEL_DIR/$file${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Found: $file${NC}"
    fi
done

# Get file sizes
echo -e "${YELLOW}📊 Model file sizes:${NC}"
for file in "${REQUIRED_FILES[@]}"; do
    size=$(ls -lh "$MODEL_DIR/$file" | awk '{print $5}')
    echo "   $file: $size"
done

# Calculate total size
total_size=$(du -sh "$MODEL_DIR" | awk '{print $1}')
echo -e "${YELLOW}📦 Total model size: $total_size${NC}"

# Confirm before creating release
echo ""
echo -e "${YELLOW}🔍 Release details:${NC}"
echo "   Tag: $RELEASE_TAG"
echo "   Name: $RELEASE_NAME"
echo "   Model files: ${#REQUIRED_FILES[@]}"
echo "   Total size: $total_size"
echo ""

read -p "Create release with these assets? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Release creation cancelled."
    exit 0
fi

# Create the release
echo -e "${GREEN}🏗️  Creating GitHub release...${NC}"

# Create release with description
gh release create "$RELEASE_TAG" \
    --title "$RELEASE_NAME" \
    --notes "$RELEASE_DESCRIPTION" \
    --latest=false

echo -e "${GREEN}✅ Release created successfully${NC}"

# Upload model files
echo -e "${GREEN}📤 Uploading model files...${NC}"

for file in "${REQUIRED_FILES[@]}"; do
    echo "   Uploading $file..."
    gh release upload "$RELEASE_TAG" "$MODEL_DIR/$file"
done

echo -e "${GREEN}🎉 Model release created successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Update MODEL_RELEASE_TAG environment variable to: $RELEASE_TAG"
echo "2. Deploy to Vercel with: vercel --prod"
echo "3. Test the health endpoint to verify model loading"
echo ""
echo -e "${GREEN}Release URL: $(gh release view $RELEASE_TAG --web)${NC}"