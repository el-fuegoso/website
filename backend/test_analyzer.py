#!/usr/bin/env python3
"""
Test script for the Personality Analyzer

Run this to test the personality analyzer functionality before integrating with Flask.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from personality_analyzer.analyzer import PersonalityAnalyzer
import json

def test_basic_analysis():
    """Test basic personality analysis"""
    print("🧪 Testing basic personality analysis...")
    
    try:
        analyzer = PersonalityAnalyzer()
        
        # Test text
        test_text = """
        Hi, I'm John and I work as a software engineer. I love building creative solutions 
        and working with teams to solve complex problems. I'm always excited to learn new 
        technologies and I believe in making a positive impact through innovative software.
        """
        
        scores, explanation, avatar = analyzer.analyze_text(test_text, mode='general')
        
        print("✅ Basic analysis successful!")
        print(f"Explanation: {explanation}")
        print(f"Avatar: {avatar['title']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic analysis failed: {e}")
        return False

def test_quest_analysis():
    """Test quest mode analysis"""
    print("\n🧪 Testing quest mode analysis...")
    
    try:
        analyzer = PersonalityAnalyzer()
        
        # Test quest responses
        quest_responses = [
            "I'm Sarah, and I work as a product manager at a tech startup",
            "I'm really excited about a new AI project we're building to help small businesses",
            "I'd love to have dinner with Marie Curie to talk about perseverance in science",
            "I want to make technology more accessible and help bridge the digital divide"
        ]
        
        result = analyzer.analyze_quest_responses(quest_responses, "Sarah")
        
        print("✅ Quest analysis successful!")
        print(f"Avatar: {result['avatar_data']['title']}")
        print(f"Completion: {result['completion_status']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Quest analysis failed: {e}")
        return False

def test_model_info():
    """Test model information retrieval"""
    print("\n🧪 Testing model information...")
    
    try:
        analyzer = PersonalityAnalyzer()
        info = analyzer.get_model_info()
        
        print("✅ Model info retrieved!")
        print(f"Model: {info['model_name']}")
        print(f"Traits: {info['supported_traits']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Model info failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Elliot Personality Analyzer Backend\n")
    
    tests = [
        test_basic_analysis,
        test_quest_analysis,
        test_model_info
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is ready for integration.")
        return True
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)