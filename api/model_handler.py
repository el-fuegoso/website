"""
Clean model handler for Vercel deployment using GitHub releases
Downloads the trained OCEAN personality model from GitHub releases
"""

import os
import json
import logging
import hashlib
import requests
from typing import Optional, Dict, Any, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)

class GitHubModelHandler:
    """Handles model loading from GitHub releases with caching"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.cache_dir = "/tmp/ocean_model_cache"
        self.model_loaded = False
        
        # GitHub repository configuration
        self.repo_owner = "el-fuegoso"
        self.repo_name = "website"
        self.model_release_tag = os.getenv('MODEL_RELEASE_TAG', 'v1.0.0-model')
        
        # Model files to download
        self.model_files = [
            'pytorch_model.bin',
            'config.json', 
            'tokenizer.json',
            'tokenizer_config.json',
            'special_tokens_map.json',
            'vocab.txt'
        ]
        
    def ensure_cache_dir(self):
        """Ensure cache directory exists"""
        os.makedirs(self.cache_dir, exist_ok=True)
        
    def get_release_download_url(self, filename: str) -> str:
        """Generate GitHub release asset download URL"""
        return f"https://github.com/{self.repo_owner}/{self.repo_name}/releases/download/{self.model_release_tag}/{filename}"
    
    def get_cached_model_info(self) -> Optional[Dict[str, Any]]:
        """Check if model is cached and get cache info"""
        cache_info_path = os.path.join(self.cache_dir, 'cache_info.json')
        
        if not os.path.exists(cache_info_path):
            return None
            
        try:
            with open(cache_info_path, 'r') as f:
                cache_info = json.load(f)
                
            # Verify all model files exist
            for filename in self.model_files:
                file_path = os.path.join(self.cache_dir, filename)
                if not os.path.exists(file_path):
                    logger.warning(f"Cached file missing: {filename}")
                    return None
                    
            return cache_info
            
        except Exception as e:
            logger.error(f"Error reading cache info: {e}")
            return None
    
    def save_cache_info(self, release_tag: str):
        """Save cache information"""
        cache_info = {
            'release_tag': release_tag,
            'cached_at': str(pd.Timestamp.now()),
            'model_files': self.model_files
        }
        
        cache_info_path = os.path.join(self.cache_dir, 'cache_info.json')
        with open(cache_info_path, 'w') as f:
            json.dump(cache_info, f, indent=2)
    
    def download_file(self, filename: str, max_retries: int = 3) -> bool:
        """Download a single model file from GitHub releases"""
        url = self.get_release_download_url(filename)
        file_path = os.path.join(self.cache_dir, filename)
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Downloading {filename} (attempt {attempt + 1}/{max_retries})")
                
                response = requests.get(url, stream=True, timeout=300)  # 5 minute timeout
                response.raise_for_status()
                
                # Download with progress tracking for large files
                total_size = int(response.headers.get('content-length', 0))
                downloaded = 0
                
                with open(file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            
                            # Log progress for large files
                            if total_size > 0 and downloaded % (1024 * 1024) == 0:  # Every MB
                                progress = (downloaded / total_size) * 100
                                logger.info(f"Download progress: {progress:.1f}% ({downloaded:,}/{total_size:,} bytes)")
                
                logger.info(f"✅ Successfully downloaded {filename} ({downloaded:,} bytes)")
                return True
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Download attempt {attempt + 1} failed for {filename}: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in 2 seconds...")
                    import time
                    time.sleep(2)
                else:
                    logger.error(f"Failed to download {filename} after {max_retries} attempts")
                    return False
            except Exception as e:
                logger.error(f"Unexpected error downloading {filename}: {e}")
                return False
        
        return False
    
    def download_model_from_releases(self) -> bool:
        """Download all model files from GitHub releases"""
        try:
            self.ensure_cache_dir()
            
            logger.info(f"🔄 Downloading model from GitHub releases (tag: {self.model_release_tag})")
            
            # Download all required files
            for filename in self.model_files:
                if not self.download_file(filename):
                    logger.error(f"Failed to download required file: {filename}")
                    return False
            
            # Save cache info
            self.save_cache_info(self.model_release_tag)
            logger.info("✅ All model files downloaded and cached successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error downloading model from releases: {e}")
            return False
    
    def load_model_from_cache(self) -> bool:
        """Load model from cached files"""
        try:
            from transformers import AutoTokenizer, AutoModelForSequenceClassification
            
            logger.info("📂 Loading model from cache...")
            
            # Load tokenizer and model from cache directory
            self.tokenizer = AutoTokenizer.from_pretrained(self.cache_dir)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.cache_dir)
            
            self.model_loaded = True
            logger.info("✅ Model loaded from cache successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model from cache: {e}")
            return False
    
    def load_model(self) -> bool:
        """Load model with GitHub releases strategy"""
        if self.model_loaded:
            return True
        
        # Check if model is already cached
        cache_info = self.get_cached_model_info()
        if cache_info and cache_info.get('release_tag') == self.model_release_tag:
            logger.info("🎯 Found matching cached model")
            if self.load_model_from_cache():
                return True
            else:
                logger.warning("Cached model corrupted, re-downloading...")
        
        # Download model from GitHub releases
        if not self.download_model_from_releases():
            logger.error("❌ Failed to download model from GitHub releases")
            return False
        
        # Load the downloaded model
        return self.load_model_from_cache()
    
    def predict_personality(self, text: str) -> Tuple[Dict[str, float], str]:
        """
        Predict personality scores using the trained OCEAN model
        """
        if not self.load_model():
            raise Exception("Model could not be loaded from GitHub releases")
        
        try:
            import torch
            from torch.nn.functional import softmax
            
            # Tokenize input text
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                max_length=512,
                truncation=True,
                padding=True
            )
            
            # Get model predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                
                # Convert to probabilities for Big Five traits
                probs = softmax(logits, dim=-1).squeeze().tolist()
                
                # Ensure we have 5 values for Big Five traits
                if len(probs) < 5:
                    probs.extend([0.5] * (5 - len(probs)))
                
                # Map to Big Five traits (normalized to 0-1)
                personality_scores = {
                    "openness": max(0.0, min(1.0, probs[0])),
                    "conscientiousness": max(0.0, min(1.0, probs[1])),
                    "extraversion": max(0.0, min(1.0, probs[2])),
                    "agreeableness": max(0.0, min(1.0, probs[3])),
                    "neuroticism": max(0.0, min(1.0, probs[4]))
                }
                
                explanation = f"OCEAN model analysis of {len(text)} characters using trained BERT model"
                
                logger.info(f"✅ Personality analysis complete: {personality_scores}")
                return personality_scores, explanation
                
        except Exception as e:
            logger.error(f"Model prediction failed: {e}")
            raise Exception(f"Personality analysis failed: {str(e)}")
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get current model status for health checks"""
        cache_info = self.get_cached_model_info()
        
        return {
            "model_loaded": self.model_loaded,
            "cache_exists": cache_info is not None,
            "cached_release_tag": cache_info.get('release_tag') if cache_info else None,
            "expected_release_tag": self.model_release_tag,
            "cache_directory": self.cache_dir,
            "model_files_count": len(self.model_files)
        }

# Global model handler instance
model_handler = GitHubModelHandler()

# Fix import for timestamp (simple fallback)
try:
    import pandas as pd
except ImportError:
    import datetime
    class pd:
        class Timestamp:
            @staticmethod
            def now():
                return datetime.datetime.now().isoformat()