"""
Core Personality Analyzer

Main class that orchestrates text preprocessing, personality analysis,
and avatar generation for the Elliot terminal experience.
"""

import logging
from typing import Dict, List, Any, Tuple, Optional
from .preprocessing import preprocess_text
from .model_loader import load_personality_model, load_tokenizer
from .utils import (
    interpret_scores, generate_avatar_traits, create_default_avatar,
    generate_xai_insights, get_big_five_traits
)

logger = logging.getLogger(__name__)

class PersonalityAnalyzer:
    """
    Main personality analyzer class for the Elliot terminal experience
    
    Handles:
    - Text preprocessing and feature extraction
    - Personality prediction using Big Five model
    - Avatar generation based on personality scores
    - Integration with terminal conversation flows
    """
    
    def __init__(self, model_path: str = "models/personality_model.pt", 
                 tokenizer_path: str = "models/tokenizer"):
        """
        Initialize the personality analyzer
        
        Args:
            model_path: Path to personality prediction model
            tokenizer_path: Path to tokenizer files
        """
        self.model_path = model_path
        self.tokenizer_path = tokenizer_path
        
        # Load model and tokenizer
        try:
            self.model = load_personality_model(model_path)
            self.tokenizer = load_tokenizer(tokenizer_path)
            logger.info("✅ PersonalityAnalyzer initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize PersonalityAnalyzer: {e}")
            raise
        
        # Cache for conversation context
        self.conversation_cache = {}
        
    def analyze_text(self, text: str, mode: str = 'general', 
                    context: List[Dict[str, str]] = None) -> Tuple[Dict[str, Any], str, Dict[str, Any]]:
        """
        Analyze personality from text input
        
        Args:
            text: Input text to analyze
            mode: Analysis mode ('quest', 'conversation', 'jd', 'general')
            context: Conversation history for additional context
            
        Returns:
            Tuple of (personality_scores, explanation, avatar_data)
        """
        try:
            logger.info(f"Analyzing text in {mode} mode: {text[:100]}...")
            
            # Preprocess text
            preprocessed = preprocess_text(text, mode)
            
            if not preprocessed['processed_text']:
                logger.warning("Empty text after preprocessing")
                return self._create_minimal_analysis("Insufficient text for analysis")
            
            # Add context if available
            full_text = text
            if context and len(context) > 0:
                # Combine recent conversation for better analysis
                recent_messages = [msg.get('content', '') for msg in context[-5:]]
                full_text = f"{' '.join(recent_messages)} {text}"
                preprocessed = preprocess_text(full_text, mode)
            
            # Get personality scores from model
            personality_scores = self.model.predict(
                features=preprocessed['features'],
                text=preprocessed['processed_text']
            )
            
            # Interpret scores
            interpreted_scores = interpret_scores(personality_scores, preprocessed['features'])
            
            # Generate explanation
            explanation = self._generate_explanation(
                interpreted_scores, 
                preprocessed['features'],
                mode
            )
            
            # Generate avatar data
            avatar_data = generate_avatar_traits(
                personality_scores,
                context={'mode': mode, 'text_length': len(text)}
            )
            
            logger.info("✅ Personality analysis completed successfully")
            
            return interpreted_scores, explanation, avatar_data
            
        except Exception as e:
            logger.error(f"❌ Error in analyze_text: {e}")
            return self._create_error_analysis(str(e))
    
    def analyze_quest_responses(self, responses: List[str], user_name: str = "User") -> Dict[str, Any]:
        """
        Analyze personality from quest mode responses
        
        Args:
            responses: List of 4 quest responses
            user_name: User's name for personalization
            
        Returns:
            Comprehensive personality analysis
        """
        try:
            logger.info(f"Analyzing quest responses for {user_name}")
            
            if len(responses) < 4:
                raise ValueError("Quest analysis requires all 4 responses")
            
            # Combine all responses for comprehensive analysis
            combined_text = " ".join(responses)
            
            # Analyze with quest mode
            personality_scores, explanation, avatar_data = self.analyze_text(
                combined_text, 
                mode='quest'
            )
            
            # Add quest-specific context to avatar
            avatar_data['user_name'] = user_name
            avatar_data['quest_responses'] = responses
            avatar_data['analysis_type'] = 'comprehensive_quest'
            
            # Generate quest-specific insights
            quest_insights = self._generate_quest_insights(responses, personality_scores)
            
            return {
                "personality_analysis": personality_scores,
                "avatar_data": avatar_data,
                "explanation": explanation,
                "quest_insights": quest_insights,
                "user_name": user_name,
                "completion_status": "complete"
            }
            
        except Exception as e:
            logger.error(f"❌ Error in analyze_quest_responses: {e}")
            return {
                "error": str(e),
                "completion_status": "failed",
                "user_name": user_name
            }
    
    def generate_avatar_from_scores(self, personality_scores: Dict[str, float], 
                                   user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Generate avatar directly from personality scores
        
        Args:
            personality_scores: Big Five personality scores
            user_context: Additional context for avatar generation
            
        Returns:
            Avatar data
        """
        try:
            logger.info("Generating avatar from personality scores")
            
            avatar_data = generate_avatar_traits(personality_scores, user_context)
            
            # Add generation metadata
            avatar_data['generation_method'] = 'direct_scores'
            avatar_data['timestamp'] = self._get_timestamp()
            
            return avatar_data
            
        except Exception as e:
            logger.error(f"❌ Error in generate_avatar_from_scores: {e}")
            return create_default_avatar()
    
    def _generate_explanation(self, interpreted_scores: Dict[str, Any], 
                             features: Dict[str, float], mode: str) -> str:
        """
        Generate explanation for personality analysis
        """
        try:
            # Get dominant traits
            dominant_traits = []
            for trait, data in interpreted_scores.items():
                if data['confidence'] > 0.6:
                    dominant_traits.append(f"{trait}: {data['level']}")
            
            if not dominant_traits:
                dominant_traits = ["Balanced personality across all traits"]
            
            # Mode-specific explanations
            mode_context = {
                'quest': "Based on your comprehensive quest responses",
                'conversation': "Based on your conversational style",
                'jd': "Based on your professional description",
                'general': "Based on your text input"
            }
            
            base_explanation = mode_context.get(mode, "Based on your input")
            
            # Add linguistic insights
            insights = generate_xai_insights("", interpreted_scores, features)
            
            explanation = f"{base_explanation}, I can see: {', '.join(dominant_traits[:3])}. {insights}"
            
            return explanation
            
        except Exception as e:
            logger.error(f"Error generating explanation: {e}")
            return "Analysis completed successfully with your personality profile."
    
    def _generate_quest_insights(self, responses: List[str], 
                                personality_scores: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate specific insights from quest responses
        """
        insights = {
            "work_style": self._analyze_work_response(responses[0]),
            "passion_analysis": self._analyze_passion_response(responses[1]),
            "social_preferences": self._analyze_dinner_response(responses[2]),
            "impact_motivation": self._analyze_impact_response(responses[3])
        }
        
        return insights
    
    def _analyze_work_response(self, response: str) -> str:
        """Analyze work-related response"""
        response_lower = response.lower()
        
        if any(word in response_lower for word in ['manage', 'lead', 'team', 'director']):
            return "Shows leadership orientation and people management skills"
        elif any(word in response_lower for word in ['create', 'design', 'build', 'develop']):
            return "Demonstrates creative and building-focused approach"
        elif any(word in response_lower for word in ['analyze', 'data', 'research', 'study']):
            return "Indicates analytical and research-oriented mindset"
        else:
            return "Shows diverse professional interests and adaptability"
    
    def _analyze_passion_response(self, response: str) -> str:
        """Analyze passion project response"""
        response_lower = response.lower()
        
        if any(word in response_lower for word in ['learn', 'new', 'skill', 'course']):
            return "High drive for continuous learning and growth"
        elif any(word in response_lower for word in ['help', 'community', 'volunteer', 'impact']):
            return "Strong orientation toward helping others and social impact"
        elif any(word in response_lower for word in ['create', 'art', 'music', 'write']):
            return "Creative expression and artistic interests drive engagement"
        else:
            return "Diverse interests with intrinsic motivation"
    
    def _analyze_dinner_response(self, response: str) -> str:
        """Analyze dinner conversation response"""
        response_lower = response.lower()
        
        if any(word in response_lower for word in ['historical', 'past', 'history', 'dead']):
            return "Values learning from history and past wisdom"
        elif any(word in response_lower for word in ['family', 'friend', 'personal']):
            return "Prioritizes close relationships and personal connections"
        elif any(word in response_lower for word in ['famous', 'celebrity', 'leader', 'influential']):
            return "Interested in leadership, influence, and achievement"
        else:
            return "Open to diverse perspectives and meaningful conversations"
    
    def _analyze_impact_response(self, response: str) -> str:
        """Analyze impact motivation response"""
        response_lower = response.lower()
        
        if any(word in response_lower for word in ['world', 'global', 'humanity', 'society']):
            return "Driven by large-scale positive change and global impact"
        elif any(word in response_lower for word in ['team', 'company', 'organization', 'work']):
            return "Focused on professional and organizational improvement"
        elif any(word in response_lower for word in ['family', 'friends', 'community', 'local']):
            return "Motivated by personal and community-level positive change"
        else:
            return "Balanced approach to making meaningful contributions"
    
    def _create_minimal_analysis(self, message: str) -> Tuple[Dict[str, Any], str, Dict[str, Any]]:
        """Create minimal analysis when input is insufficient"""
        default_scores = {
            trait: {
                "score": 0.5,
                "level": "Balanced",
                "description": "Insufficient data for detailed analysis",
                "confidence": 0.1,
                "confidence_text": "Low confidence",
                "percentile": 50.0,
                "trait_name": trait
            }
            for trait in get_big_five_traits()
        }
        
        return (
            default_scores,
            message,
            create_default_avatar()
        )
    
    def _create_error_analysis(self, error_msg: str) -> Tuple[Dict[str, Any], str, Dict[str, Any]]:
        """Create error response for failed analysis"""
        return self._create_minimal_analysis(f"Analysis error: {error_msg}")
    
    def _get_timestamp(self) -> str:
        """Get current timestamp for metadata"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model"""
        return {
            "model_name": getattr(self.model, 'model_name', 'Unknown'),
            "model_path": self.model_path,
            "tokenizer_name": getattr(self.tokenizer, 'tokenizer_name', 'Unknown'),
            "supported_traits": get_big_five_traits(),
            "analysis_modes": ['general', 'quest', 'conversation', 'jd']
        }