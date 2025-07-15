"""
Personality Analyzer Package

This package provides personality analysis capabilities for the Elliot terminal experience.
It implements evidence-based personality inference using NLP techniques and the Big Five model.
"""

from .analyzer import PersonalityAnalyzer
from .utils import get_big_five_traits, interpret_scores

__version__ = "1.0.0"
__author__ = "Elliot Lee"

__all__ = [
    'PersonalityAnalyzer',
    'get_big_five_traits', 
    'interpret_scores'
]