"""
Text Preprocessing Module

Handles text cleaning and feature preparation for personality analysis.
Based on research-backed preprocessing techniques for personality inference.
"""

import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class TextPreprocessor:
    """
    Handles all text preprocessing for personality analysis
    """
    
    def __init__(self):
        self.stop_words = {
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'i', 'me', 'my', 'myself', 'we', 'our',
            'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves'
        }
    
    def preprocess_text(self, text: str, mode: str = 'general') -> Dict[str, Any]:
        """
        Comprehensive text preprocessing pipeline
        
        Args:
            text: Input text to preprocess
            mode: Processing mode ('quest', 'conversation', 'jd', 'general')
            
        Returns:
            Dict containing processed text and metadata
        """
        if not text or not isinstance(text, str):
            return {
                'processed_text': '',
                'original_length': 0,
                'word_count': 0,
                'sentence_count': 0,
                'features': {}
            }
        
        original_length = len(text)
        
        # Mode-specific preprocessing
        if mode == 'jd':  # Job description
            processed = self._preprocess_job_description(text)
        elif mode == 'quest':  # Quest responses
            processed = self._preprocess_quest_responses(text)
        else:  # General conversation
            processed = self._preprocess_general_text(text)
        
        # Extract linguistic features
        features = self._extract_linguistic_features(processed, text)
        
        return {
            'processed_text': processed,
            'original_length': original_length,
            'word_count': len(processed.split()),
            'sentence_count': len([s for s in processed.split('.') if s.strip()]),
            'features': features
        }
    
    def _preprocess_general_text(self, text: str) -> str:
        """Standard text preprocessing for general conversation"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '[URL]', text, flags=re.MULTILINE)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '[EMAIL]', text)
        
        # Handle contractions (preserve meaning)
        contractions = {
            "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is",
            "it's": "it is", "we're": "we are", "they're": "they are",
            "i've": "i have", "you've": "you have", "we've": "we have",
            "they've": "they have", "i'll": "i will", "you'll": "you will",
            "he'll": "he will", "she'll": "she will", "we'll": "we will",
            "they'll": "they will", "won't": "will not", "can't": "cannot",
            "don't": "do not", "doesn't": "does not", "didn't": "did not",
            "isn't": "is not", "aren't": "are not", "wasn't": "was not",
            "weren't": "were not", "haven't": "have not", "hasn't": "has not",
            "hadn't": "had not", "shouldn't": "should not", "wouldn't": "would not",
            "couldn't": "could not"
        }
        
        for contraction, expansion in contractions.items():
            text = re.sub(r'\b' + contraction + r'\b', expansion, text)
        
        # Clean up extra whitespace but preserve sentence structure
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def _preprocess_job_description(self, text: str) -> str:
        """Specialized preprocessing for job descriptions"""
        text = text.lower()
        
        # Remove common JD boilerplate
        boilerplate_patterns = [
            r'equal opportunity employer',
            r'we are an equal opportunity',
            r'please submit your resume',
            r'send your cv to',
            r'apply now',
            r'click here to apply'
        ]
        
        for pattern in boilerplate_patterns:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        # Normalize job-specific terms
        text = re.sub(r'\b(requirements?|qualifications?)\b', 'requirements', text)
        text = re.sub(r'\b(responsibilities?|duties)\b', 'responsibilities', text)
        text = re.sub(r'\b(skills?|abilities)\b', 'skills', text)
        
        return self._preprocess_general_text(text)
    
    def _preprocess_quest_responses(self, text: str) -> str:
        """Specialized preprocessing for quest responses"""
        # Quest responses are usually more personal and conversational
        # Preserve emotional indicators and personal pronouns
        text = text.lower()
        
        # Less aggressive cleaning for quest responses to preserve personality indicators
        text = re.sub(r'http\S+|www\S+|https\S+', '[URL]', text, flags=re.MULTILINE)
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def _extract_linguistic_features(self, processed_text: str, original_text: str) -> Dict[str, float]:
        """
        Extract linguistic features that correlate with personality traits
        """
        words = processed_text.split()
        original_words = original_text.lower().split()
        
        if not words:
            return {}
        
        # Word-level features
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        # Punctuation usage (from original text)
        exclamation_count = original_text.count('!')
        question_count = original_text.count('?')
        
        # Personal pronoun usage (personality indicator)
        first_person = sum(1 for word in original_words if word in ['i', 'me', 'my', 'myself', 'mine'])
        second_person = sum(1 for word in original_words if word in ['you', 'your', 'yours', 'yourself'])
        third_person = sum(1 for word in original_words if word in ['he', 'she', 'they', 'him', 'her', 'them'])
        
        # Emotional indicators
        positive_words = sum(1 for word in words if word in [
            'happy', 'excited', 'love', 'amazing', 'great', 'awesome', 'fantastic',
            'wonderful', 'excellent', 'perfect', 'brilliant', 'outstanding'
        ])
        
        negative_words = sum(1 for word in words if word in [
            'sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'disgusting',
            'worried', 'anxious', 'stressed', 'frustrated', 'disappointed'
        ])
        
        # Certainty indicators
        certainty_words = sum(1 for word in words if word in [
            'definitely', 'certainly', 'absolutely', 'sure', 'confident', 'always', 'never'
        ])
        
        uncertainty_words = sum(1 for word in words if word in [
            'maybe', 'perhaps', 'might', 'possibly', 'sometimes', 'usually', 'probably'
        ])
        
        word_count = len(words)
        
        return {
            'avg_word_length': avg_word_length,
            'exclamation_ratio': exclamation_count / word_count if word_count > 0 else 0,
            'question_ratio': question_count / word_count if word_count > 0 else 0,
            'first_person_ratio': first_person / word_count if word_count > 0 else 0,
            'second_person_ratio': second_person / word_count if word_count > 0 else 0,
            'third_person_ratio': third_person / word_count if word_count > 0 else 0,
            'positive_emotion_ratio': positive_words / word_count if word_count > 0 else 0,
            'negative_emotion_ratio': negative_words / word_count if word_count > 0 else 0,
            'certainty_ratio': certainty_words / word_count if word_count > 0 else 0,
            'uncertainty_ratio': uncertainty_words / word_count if word_count > 0 else 0,
            'word_count': word_count
        }

def preprocess_text(text: str, mode: str = 'general') -> Dict[str, Any]:
    """
    Convenience function for text preprocessing
    """
    preprocessor = TextPreprocessor()
    return preprocessor.preprocess_text(text, mode)