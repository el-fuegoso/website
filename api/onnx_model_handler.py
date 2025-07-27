"""
ONNX model handler for Vercel deployment - optimized for size and speed
Downloads ONNX model from GitHub releases for personality analysis
"""

import os
import json
import logging
import requests
import numpy as np
from typing import Optional, Dict, Any, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)

class ONNXModelHandler:
    """Handles ONNX model loading from GitHub releases with caching"""
    
    def __init__(self):
        self.session = None
        self.tokenizer_data = None
        self.cache_dir = "/tmp/onnx_model_cache"
        self.model_loaded = False
        
        # GitHub repository configuration
        self.repo_owner = "el-fuegoso"
        self.repo_name = "website"
        self.model_release_tag = os.getenv('ONNX_MODEL_RELEASE_TAG', 'v1.0.0-onnx-model')
        
        # ONNX model files to download
        self.model_files = [
            'model.onnx',
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
        """Check if ONNX model is cached and get cache info"""
        cache_info_path = os.path.join(self.cache_dir, 'onnx_cache_info.json')
        
        if not os.path.exists(cache_info_path):
            return None
            
        try:
            with open(cache_info_path, 'r') as f:
                cache_info = json.load(f)
                
            # Verify all model files exist
            for filename in self.model_files:
                file_path = os.path.join(self.cache_dir, filename)
                if not os.path.exists(file_path):
                    logger.warning(f"Cached ONNX file missing: {filename}")
                    return None
                    
            return cache_info
            
        except Exception as e:
            logger.error(f"Error reading ONNX cache info: {e}")
            return None
    
    def save_cache_info(self, release_tag: str):
        """Save ONNX cache information"""
        import datetime
        cache_info = {
            'release_tag': release_tag,
            'cached_at': datetime.datetime.now().isoformat(),
            'model_files': self.model_files,
            'format': 'onnx'
        }
        
        cache_info_path = os.path.join(self.cache_dir, 'onnx_cache_info.json')
        with open(cache_info_path, 'w') as f:
            json.dump(cache_info, f, indent=2)
    
    def download_file(self, filename: str, max_retries: int = 3) -> bool:
        """Download a single ONNX model file from GitHub releases"""
        url = self.get_release_download_url(filename)
        file_path = os.path.join(self.cache_dir, filename)
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Downloading ONNX {filename} (attempt {attempt + 1}/{max_retries})")
                
                response = requests.get(url, stream=True, timeout=300)
                response.raise_for_status()
                
                # Download with progress tracking
                total_size = int(response.headers.get('content-length', 0))
                downloaded = 0
                
                with open(file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            
                            # Log progress for large files
                            if total_size > 0 and downloaded % (1024 * 1024) == 0:
                                progress = (downloaded / total_size) * 100
                                logger.info(f"ONNX download progress: {progress:.1f}% ({downloaded:,}/{total_size:,} bytes)")
                
                logger.info(f"✅ Successfully downloaded ONNX {filename} ({downloaded:,} bytes)")
                return True
                
            except requests.exceptions.RequestException as e:
                logger.error(f"ONNX download attempt {attempt + 1} failed for {filename}: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in 2 seconds...")
                    import time
                    time.sleep(2)
                else:
                    logger.error(f"Failed to download ONNX {filename} after {max_retries} attempts")
                    return False
            except Exception as e:
                logger.error(f"Unexpected error downloading ONNX {filename}: {e}")
                return False
        
        return False
    
    def download_onnx_model_from_releases(self) -> bool:
        """Download all ONNX model files from GitHub releases"""
        try:
            self.ensure_cache_dir()
            
            logger.info(f"🔄 Downloading ONNX model from GitHub releases (tag: {self.model_release_tag})")
            
            # Download all required files
            for filename in self.model_files:
                if not self.download_file(filename):
                    logger.error(f"Failed to download required ONNX file: {filename}")
                    return False
            
            # Save cache info
            self.save_cache_info(self.model_release_tag)
            logger.info("✅ All ONNX model files downloaded and cached successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error downloading ONNX model from releases: {e}")
            return False
    
    def load_tokenizer_from_cache(self) -> bool:
        """Load tokenizer data from cached files"""
        try:
            # Load tokenizer configuration
            tokenizer_path = os.path.join(self.cache_dir, 'tokenizer.json')
            config_path = os.path.join(self.cache_dir, 'tokenizer_config.json')
            vocab_path = os.path.join(self.cache_dir, 'vocab.txt')
            
            with open(tokenizer_path, 'r') as f:
                tokenizer_data = json.load(f)
            
            with open(config_path, 'r') as f:
                tokenizer_config = json.load(f)
            
            # Load vocabulary
            with open(vocab_path, 'r', encoding='utf-8') as f:
                vocab = [line.strip() for line in f.readlines()]
            
            # Create vocabulary mapping
            vocab_to_id = {token: idx for idx, token in enumerate(vocab)}
            
            self.tokenizer_data = {
                'vocab': vocab,
                'vocab_to_id': vocab_to_id,
                'config': tokenizer_config,
                'data': tokenizer_data
            }
            
            logger.info("✅ Tokenizer loaded from cache successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load tokenizer from cache: {e}")
            return False
    
    def load_onnx_model_from_cache(self) -> bool:
        """Load ONNX model from cached files"""
        try:
            import onnxruntime as ort
            
            logger.info("📂 Loading ONNX model from cache...")
            
            # Load ONNX model
            model_path = os.path.join(self.cache_dir, 'model.onnx')
            self.session = ort.InferenceSession(model_path)
            
            self.model_loaded = True
            logger.info("✅ ONNX model loaded from cache successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load ONNX model from cache: {e}")
            return False
    
    def load_model(self) -> bool:
        """Load ONNX model with GitHub releases strategy"""
        if self.model_loaded:
            return True
        
        # Check if model is already cached
        cache_info = self.get_cached_model_info()
        if cache_info and cache_info.get('release_tag') == self.model_release_tag:
            logger.info("🎯 Found matching cached ONNX model")
            if self.load_onnx_model_from_cache() and self.load_tokenizer_from_cache():
                return True
            else:
                logger.warning("Cached ONNX model corrupted, re-downloading...")
        
        # Download model from GitHub releases
        if not self.download_onnx_model_from_releases():
            logger.error("❌ Failed to download ONNX model from GitHub releases")
            return False
        
        # Load the downloaded model and tokenizer
        return self.load_onnx_model_from_cache() and self.load_tokenizer_from_cache()
    
    def tokenize_text(self, text: str, max_length: int = 512) -> Dict[str, np.ndarray]:
        """Simple tokenization for ONNX model inference"""
        if not self.tokenizer_data:
            raise Exception("Tokenizer not loaded")
        
        # Simple tokenization (basic implementation)
        vocab_to_id = self.tokenizer_data['vocab_to_id']
        
        # Basic word tokenization (you may need to adapt this based on your model's tokenizer)
        tokens = text.lower().split()
        
        # Convert to token IDs
        input_ids = [vocab_to_id.get('[CLS]', 101)]  # Start with [CLS] token
        
        for token in tokens:
            if len(input_ids) >= max_length - 1:  # Reserve space for [SEP]
                break
            token_id = vocab_to_id.get(token, vocab_to_id.get('[UNK]', 100))
            input_ids.append(token_id)
        
        input_ids.append(vocab_to_id.get('[SEP]', 102))  # End with [SEP] token
        
        # Pad to max_length
        while len(input_ids) < max_length:
            input_ids.append(vocab_to_id.get('[PAD]', 0))
        
        # Create attention mask
        attention_mask = [1 if token_id != vocab_to_id.get('[PAD]', 0) else 0 for token_id in input_ids]
        
        return {
            'input_ids': np.array([input_ids], dtype=np.int64),
            'attention_mask': np.array([attention_mask], dtype=np.int64)
        }
    
    def predict_personality(self, text: str) -> Tuple[Dict[str, float], str]:
        """
        Predict personality scores using the ONNX model
        """
        if not self.load_model():
            raise Exception("ONNX model could not be loaded from GitHub releases")
        
        try:
            # Tokenize input text
            inputs = self.tokenize_text(text)
            
            # Run ONNX inference
            outputs = self.session.run(None, inputs)
            logits = outputs[0]  # First output should be logits
            
            # Apply softmax to get probabilities
            import numpy as np
            exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
            probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
            probs = probs.squeeze().tolist()
            
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
            
            explanation = f"ONNX OCEAN model analysis of {len(text)} characters using optimized BERT model"
            
            logger.info(f"✅ ONNX personality analysis complete: {personality_scores}")
            return personality_scores, explanation
            
        except Exception as e:
            logger.error(f"ONNX model prediction failed: {e}")
            raise Exception(f"ONNX personality analysis failed: {str(e)}")
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get current ONNX model status for health checks"""
        cache_info = self.get_cached_model_info()
        
        return {
            "model_loaded": self.model_loaded,
            "model_format": "onnx",
            "cache_exists": cache_info is not None,
            "cached_release_tag": cache_info.get('release_tag') if cache_info else None,
            "expected_release_tag": self.model_release_tag,
            "cache_directory": self.cache_dir,
            "model_files_count": len(self.model_files),
            "runtime": "onnxruntime"
        }

# Global ONNX model handler instance
onnx_model_handler = ONNXModelHandler()