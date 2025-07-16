"""
Utility Functions for Personality Analysis

Helper functions for interpreting personality scores, generating avatar data,
and providing explainable AI insights.
"""

from typing import Dict, List, Any, Tuple
import logging
import numpy as np
from scipy.spatial.distance import cosine

logger = logging.getLogger(__name__)

def get_big_five_traits() -> List[str]:
    """Returns the names of the Big Five personality traits."""
    return ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]

def get_trait_descriptions() -> Dict[str, Dict[str, str]]:
    """
    Returns detailed descriptions for each Big Five trait
    """
    return {
        "Openness": {
            "name": "Openness to Experience", 
            "high": "Curious, imaginative, open to new experiences, creative, intellectually adventurous",
            "low": "Conventional, practical, prefers routine, traditional, less imaginative",
            "keywords": ["creative", "curious", "imaginative", "artistic", "innovative"]
        },
        "Conscientiousness": {
            "name": "Conscientiousness",
            "high": "Organized, disciplined, goal-oriented, reliable, self-controlled",
            "low": "Spontaneous, flexible, less structured, more impulsive",
            "keywords": ["organized", "disciplined", "reliable", "responsible", "thorough"]
        },
        "Extraversion": {
            "name": "Extraversion",
            "high": "Outgoing, energetic, sociable, assertive, talkative",
            "low": "Reserved, quiet, prefers solitude, thoughtful, independent",
            "keywords": ["outgoing", "energetic", "social", "talkative", "assertive"]
        },
        "Agreeableness": {
            "name": "Agreeableness", 
            "high": "Compassionate, cooperative, trusting, helpful, empathetic",
            "low": "Competitive, skeptical, direct, independent, challenging",
            "keywords": ["cooperative", "trusting", "helpful", "empathetic", "kind"]
        },
        "Neuroticism": {
            "name": "Emotional Stability",
            "high": "Sensitive to stress, prone to anxiety, emotionally reactive",
            "low": "Calm, emotionally stable, resilient, even-tempered",
            "keywords": ["anxious", "stressed", "worried", "emotional", "sensitive"]
        }
    }

def interpret_scores(raw_scores: Dict[str, float], features: Dict[str, float] = None) -> Dict[str, Dict[str, Any]]:
    """
    Interprets raw numerical personality scores into descriptive labels with confidence levels
    
    Args:
        raw_scores: Dictionary of trait names to scores (0.0 - 1.0)
        features: Optional linguistic features for additional context
        
    Returns:
        Dictionary with interpreted personality data
    """
    trait_descriptions = get_trait_descriptions()
    interpretations = {}
    
    for trait, score in raw_scores.items():
        if trait not in trait_descriptions:
            logger.warning(f"Unknown trait: {trait}")
            continue
            
        trait_info = trait_descriptions[trait]
        
        # Determine if score is high or low (threshold at 0.5)
        is_high = score > 0.5
        confidence = abs(score - 0.5) * 2  # 0.0 to 1.0 confidence
        
        # Get appropriate description
        description = trait_info["high"] if is_high else trait_info["low"]
        level = "High" if is_high else "Low"
        
        # Add confidence qualifier
        if confidence > 0.7:
            confidence_text = "Very confident"
        elif confidence > 0.4:
            confidence_text = "Moderately confident"
        else:
            confidence_text = "Low confidence"
            
        interpretations[trait] = {
            "score": round(score, 3),
            "level": level,
            "description": description,
            "confidence": round(confidence, 3),
            "confidence_text": confidence_text,
            "percentile": round(score * 100, 1),
            "trait_name": trait_info["name"]
        }
    
    return interpretations

def generate_avatar_traits(personality_scores: Dict[str, float], context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Generate avatar characteristics based on personality scores
    
    Args:
        personality_scores: Big Five personality scores
        context: Additional context (name, role, etc.)
        
    Returns:
        Avatar data with traits, working style, and collaboration approach
    """
    if not personality_scores:
        return create_default_avatar()
    
    # Extract scores
    openness = personality_scores.get("Openness", 0.5)
    conscientiousness = personality_scores.get("Conscientiousness", 0.5)
    extraversion = personality_scores.get("Extraversion", 0.5)
    agreeableness = personality_scores.get("Agreeableness", 0.5)
    neuroticism = personality_scores.get("Neuroticism", 0.5)
    
    # Determine dominant traits
    dominant_traits = []
    if openness > 0.6:
        dominant_traits.append("Creative")
    if conscientiousness > 0.6:
        dominant_traits.append("Organized")
    if extraversion > 0.6:
        dominant_traits.append("Social")
    if agreeableness > 0.6:
        dominant_traits.append("Collaborative")
    if neuroticism < 0.4:  # Low neuroticism = high stability
        dominant_traits.append("Stable")
    
    # Generate avatar archetype
    archetype = determine_archetype(personality_scores)
    
    # Generate working style
    working_style = determine_working_style(personality_scores)
    
    # Generate collaboration approach
    collaboration_style = determine_collaboration_style(personality_scores)
    
    # Generate avatar description
    name = context.get('user_name', 'El') if context else 'El'
    
    avatar_data = {
        "title": f"Your Personal El: {archetype['name']}",
        "archetype": archetype,
        "dominant_traits": dominant_traits,
        "working_style": working_style,
        "collaboration_style": collaboration_style,
        "summary": generate_avatar_summary(archetype, dominant_traits, name),
        "strengths": generate_strengths(personality_scores),
        "ideal_role": generate_ideal_role(personality_scores),
        "communication_style": determine_communication_style(personality_scores),
        "personality_scores": personality_scores
    }
    
    return avatar_data

def determine_archetype(scores: Dict[str, float]) -> Dict[str, Any]:
    """Determine personality archetype based on Big Five scores"""
    openness = scores.get("Openness", 0.5)
    conscientiousness = scores.get("Conscientiousness", 0.5)
    extraversion = scores.get("Extraversion", 0.5)
    agreeableness = scores.get("Agreeableness", 0.5)
    neuroticism = scores.get("Neuroticism", 0.5)
    
    # Define archetypes based on trait combinations
    if openness > 0.6 and conscientiousness > 0.6:
        return {
            "name": "The Innovator",
            "description": "Creative and organized, brings novel ideas to life",
            "emoji": "💡",
            "confidence": (openness + conscientiousness) / 2
        }
    elif extraversion > 0.6 and agreeableness > 0.6:
        return {
            "name": "The Collaborator", 
            "description": "People-focused and energetic, excels in team environments",
            "emoji": "🤝",
            "confidence": (extraversion + agreeableness) / 2
        }
    elif conscientiousness > 0.6 and neuroticism < 0.4:
        return {
            "name": "The Executor",
            "description": "Reliable and calm, gets things done efficiently",
            "emoji": "⚡",
            "confidence": (conscientiousness + (1 - neuroticism)) / 2
        }
    elif openness > 0.6 and extraversion > 0.6:
        return {
            "name": "The Catalyst",
            "description": "Energetic and creative, drives change and innovation",
            "emoji": "🚀",
            "confidence": (openness + extraversion) / 2
        }
    elif conscientiousness > 0.6 and agreeableness > 0.6:
        return {
            "name": "The Supporter",
            "description": "Dependable and caring, provides stability and support",
            "emoji": "🛡️",
            "confidence": (conscientiousness + agreeableness) / 2
        }
    else:
        return {
            "name": "The Adaptable",
            "description": "Balanced and flexible, adapts well to different situations",
            "emoji": "🌟",
            "confidence": 0.5
        }

def determine_working_style(scores: Dict[str, float]) -> Dict[str, str]:
    """Determine working style based on personality scores"""
    conscientiousness = scores.get("Conscientiousness", 0.5)
    openness = scores.get("Openness", 0.5)
    extraversion = scores.get("Extraversion", 0.5)
    
    if conscientiousness > 0.6:
        structure = "Prefers structured approaches and clear processes"
    else:
        structure = "Thrives with flexibility and spontaneous problem-solving"
        
    if openness > 0.6:
        innovation = "Enjoys exploring new methods and creative solutions"
    else:
        innovation = "Values proven methods and practical approaches"
        
    if extraversion > 0.6:
        energy = "Works best with regular interaction and collaboration"
    else:
        energy = "Excels in focused, independent work environments"
    
    return {
        "structure": structure,
        "innovation": innovation,
        "energy": energy
    }

def determine_collaboration_style(scores: Dict[str, float]) -> Dict[str, str]:
    """Determine collaboration approach based on personality scores"""
    agreeableness = scores.get("Agreeableness", 0.5)
    extraversion = scores.get("Extraversion", 0.5)
    conscientiousness = scores.get("Conscientiousness", 0.5)
    
    if agreeableness > 0.6:
        approach = "Prioritizes harmony and consensus-building"
    else:
        approach = "Values direct communication and healthy debate"
        
    if extraversion > 0.6:
        communication = "Communicates openly and frequently with team members"
    else:
        communication = "Prefers thoughtful, prepared interactions"
        
    if conscientiousness > 0.6:
        reliability = "Delivers on commitments and maintains accountability"
    else:
        reliability = "Brings spontaneity and adaptability to team dynamics"
    
    return {
        "approach": approach,
        "communication": communication,
        "reliability": reliability
    }

def determine_communication_style(scores: Dict[str, float]) -> str:
    """Determine communication style"""
    extraversion = scores.get("Extraversion", 0.5)
    agreeableness = scores.get("Agreeableness", 0.5)
    openness = scores.get("Openness", 0.5)
    
    if extraversion > 0.6 and agreeableness > 0.6:
        return "Warm and engaging, builds rapport easily"
    elif extraversion > 0.6 and openness > 0.6:
        return "Enthusiastic and idea-focused, inspires others"
    elif agreeableness > 0.6:
        return "Supportive and empathetic, listens actively"
    elif openness > 0.6:
        return "Thoughtful and conceptual, explores possibilities"
    else:
        return "Direct and practical, focuses on clear outcomes"

def generate_avatar_summary(archetype: Dict[str, Any], traits: List[str], name: str) -> str:
    """Generate a summary description of the avatar"""
    trait_text = ", ".join(traits).lower() if traits else "adaptable"
    
    return f"Meet {name} - {archetype['description']} This {trait_text} personality brings a unique combination of skills and perspectives to any team."

def generate_strengths(scores: Dict[str, float]) -> List[str]:
    """Generate list of strengths based on personality scores"""
    strengths = []
    
    if scores.get("Openness", 0) > 0.6:
        strengths.append("Creative problem-solving")
        strengths.append("Adaptability to change")
        
    if scores.get("Conscientiousness", 0) > 0.6:
        strengths.append("Project management")
        strengths.append("Attention to detail")
        
    if scores.get("Extraversion", 0) > 0.6:
        strengths.append("Team leadership")
        strengths.append("Communication skills")
        
    if scores.get("Agreeableness", 0) > 0.6:
        strengths.append("Conflict resolution")
        strengths.append("Team building")
        
    if scores.get("Neuroticism", 0) < 0.4:
        strengths.append("Stress management")
        strengths.append("Decision-making under pressure")
    
    return strengths if strengths else ["Balanced skill set", "Adaptability"]

def generate_ideal_role(scores: Dict[str, float]) -> str:
    """Generate ideal role description based on personality"""
    openness = scores.get("Openness", 0.5)
    conscientiousness = scores.get("Conscientiousness", 0.5)
    extraversion = scores.get("Extraversion", 0.5)
    
    if openness > 0.6 and extraversion > 0.6:
        return "Innovation lead or creative strategist role with team interaction"
    elif conscientiousness > 0.6 and extraversion > 0.6:
        return "Project manager or team lead role with clear deliverables"
    elif openness > 0.6 and conscientiousness > 0.6:
        return "Product development or research role combining creativity with execution"
    elif extraversion > 0.6:
        return "Client-facing or team coordination role with regular collaboration"
    elif conscientiousness > 0.6:
        return "Operations or implementation role with structured processes"
    else:
        return "Flexible contributor role adapting to team needs"

def create_default_avatar() -> Dict[str, Any]:
    """Create a default avatar when personality analysis fails"""
    return {
        "title": "Your Personal El: The Adaptable",
        "archetype": {
            "name": "The Adaptable",
            "description": "Balanced and flexible, ready to take on diverse challenges",
            "emoji": "🌟",
            "confidence": 0.5
        },
        "dominant_traits": ["Balanced", "Adaptable"],
        "working_style": {
            "structure": "Comfortable with both structured and flexible approaches",
            "innovation": "Open to both creative and practical solutions",
            "energy": "Adapts well to different work environments"
        },
        "collaboration_style": {
            "approach": "Balances cooperation with independent contribution",
            "communication": "Adjusts communication style to team needs",
            "reliability": "Maintains steady performance across different contexts"
        },
        "summary": "A well-rounded individual ready to contribute effectively in various roles and team dynamics.",
        "strengths": ["Adaptability", "Balance", "Versatility"],
        "ideal_role": "Multi-faceted contributor role with diverse responsibilities",
        "communication_style": "Flexible and context-appropriate",
        "personality_scores": {
            "Openness": 0.5,
            "Conscientiousness": 0.5, 
            "Extraversion": 0.5,
            "Agreeableness": 0.5,
            "Neuroticism": 0.5
        }
    }

def generate_xai_insights(text: str, scores: Dict[str, float], features: Dict[str, float]) -> str:
    """
    Generate explainable AI insights (placeholder for future implementation)
    """
    insights = []
    
    # Analyze linguistic features that contributed to scores
    if features.get('first_person_ratio', 0) > 0.1:
        insights.append("High use of first-person pronouns suggests self-focus")
        
    if features.get('positive_emotion_ratio', 0) > 0.05:
        insights.append("Positive language indicates optimistic outlook")
        
    if features.get('certainty_ratio', 0) > 0.03:
        insights.append("Definitive language suggests confidence")
        
    if features.get('question_ratio', 0) > 0.02:
        insights.append("Questioning language indicates curiosity")
    
    return " • ".join(insights) if insights else "Analysis based on overall language patterns and word choice."

def map_ui_traits_to_big_five(selected_traits: Dict[str, bool]) -> Dict[str, float]:
    """
    Converts selected UI traits into a Big Five personality profile (0-1 scale).
    
    Args:
        selected_traits: Dictionary of trait names to boolean selection status
        
    Returns:
        Dictionary with Big Five scores (0-1 scale)
    """
    # Initialize Big Five scores to neutral baseline (0.5)
    big_five_scores = {
        "Openness": 0.5,
        "Conscientiousness": 0.5, 
        "Extraversion": 0.5,
        "Agreeableness": 0.5,
        "Neuroticism": 0.5
    }
    
    # Trait mappings with weights (can be adjusted based on psychological research)
    trait_mappings = {
        "innovation": {"Openness": 0.3, "Conscientiousness": 0.1},
        "energy": {"Extraversion": 0.3, "Neuroticism": -0.1},
        "intensity": {"Conscientiousness": 0.3, "Neuroticism": -0.05},
        "cooperative": {"Agreeableness": 0.3, "Extraversion": 0.1},
        "calm": {"Neuroticism": -0.3, "Conscientiousness": 0.1},
        "technical": {"Conscientiousness": 0.25, "Openness": 0.1},
        "creativity": {"Openness": 0.25},
        "leadership": {"Extraversion": 0.25, "Conscientiousness": 0.1},
        "collaborative": {"Agreeableness": 0.25, "Extraversion": 0.1},
        "adventure": {"Openness": 0.2, "Extraversion": 0.15},
        "empathetic": {"Agreeableness": 0.3},
        "discipline": {"Conscientiousness": 0.25, "Neuroticism": -0.1},
        "harmonious": {"Agreeableness": 0.25, "Neuroticism": -0.1},
        "hustle": {"Extraversion": 0.2, "Conscientiousness": 0.2},
        "speed": {"Extraversion": 0.15, "Neuroticism": 0.1},
        "experimental": {"Openness": 0.3},
        "paranoia": {"Neuroticism": 0.25, "Conscientiousness": 0.1},
        "anxious": {"Neuroticism": 0.3},
        "supportive": {"Agreeableness": 0.25, "Extraversion": 0.1}
    }
    
    # Apply trait effects
    for trait_name, is_selected in selected_traits.items():
        if is_selected and trait_name in trait_mappings:
            for big_five_trait, weight in trait_mappings[trait_name].items():
                big_five_scores[big_five_trait] += weight
    
    # Clamp scores to valid range [0, 1]
    for trait in big_five_scores:
        big_five_scores[trait] = max(0.0, min(1.0, big_five_scores[trait]))
    
    return big_five_scores

def calculate_similarity(user_profile: Dict[str, float], character_profile: Dict[str, float]) -> float:
    """
    Calculates the cosine similarity between a user's Big Five profile
    and an AI character's Big Five profile.
    
    Args:
        user_profile: User's Big Five scores (0-1 scale)
        character_profile: Character's Big Five scores (1-5 scale, converted internally)
        
    Returns:
        Similarity score (0-1, higher = more similar)
    """
    # Convert character profile from 1-5 scale to 0-1 scale
    char_scores_converted = {
        "Openness": (character_profile.get("O", 3) - 1) / 4,
        "Conscientiousness": (character_profile.get("C", 3) - 1) / 4,
        "Extraversion": (character_profile.get("E", 3) - 1) / 4,
        "Agreeableness": (character_profile.get("A", 3) - 1) / 4,
        "Neuroticism": (character_profile.get("N", 3) - 1) / 4
    }
    
    # Create vectors for similarity calculation
    user_vec = np.array([
        user_profile.get("Openness", 0.5),
        user_profile.get("Conscientiousness", 0.5),
        user_profile.get("Extraversion", 0.5),
        user_profile.get("Agreeableness", 0.5),
        user_profile.get("Neuroticism", 0.5)
    ])
    
    char_vec = np.array([
        char_scores_converted["Openness"],
        char_scores_converted["Conscientiousness"],
        char_scores_converted["Extraversion"],
        char_scores_converted["Agreeableness"],
        char_scores_converted["Neuroticism"]
    ])
    
    # Ensure vectors are not zero vectors
    if np.linalg.norm(user_vec) == 0 or np.linalg.norm(char_vec) == 0:
        return 0.0
    
    # Calculate cosine similarity (1 - cosine distance)
    similarity = 1 - cosine(user_vec, char_vec)
    
    # Ensure result is in valid range [0, 1]
    return max(0.0, min(1.0, similarity))

def find_best_character_match(user_profile: Dict[str, float], all_characters: Dict[str, Dict]) -> Tuple[str, Dict, float]:
    """
    Finds the AI character with the highest personality similarity to the user.
    
    Args:
        user_profile: User's Big Five personality scores (0-1 scale)
        all_characters: Dictionary of character data from character_data.py
        
    Returns:
        Tuple of (character_name, character_data, similarity_score)
    """
    best_match_name = None
    best_match_data = None
    highest_similarity = -1.0
    
    for char_name, char_data in all_characters.items():
        similarity = calculate_similarity(user_profile, char_data)
        
        if similarity > highest_similarity:
            highest_similarity = similarity
            best_match_name = char_name
            best_match_data = char_data
    
    return best_match_name, best_match_data, highest_similarity

def get_personality_insights(user_profile: Dict[str, float], selected_traits: Dict[str, bool]) -> Dict[str, Any]:
    """
    Generate personality insights based on Big Five scores and selected traits.
    
    Args:
        user_profile: User's Big Five scores
        selected_traits: UI traits selected by user
        
    Returns:
        Dictionary with personality insights and recommendations
    """
    insights = {
        "personality_summary": "",
        "working_style_tips": [],
        "collaboration_tips": [],
        "growth_areas": [],
        "trait_explanations": {}
    }
    
    # Generate personality summary
    dominant_traits = []
    for trait, score in user_profile.items():
        if score > 0.6:
            dominant_traits.append(f"High {trait}")
        elif score < 0.4:
            if trait == "Neuroticism":
                dominant_traits.append("High Emotional Stability")
            else:
                dominant_traits.append(f"Low {trait}")
    
    insights["personality_summary"] = f"Your personality profile shows: {', '.join(dominant_traits) if dominant_traits else 'Balanced traits across all dimensions'}"
    
    # Generate working style tips
    if user_profile.get("Conscientiousness", 0.5) > 0.6:
        insights["working_style_tips"].append("Leverage your natural organization skills with structured project management tools")
    
    if user_profile.get("Openness", 0.5) > 0.6:
        insights["working_style_tips"].append("Seek out creative challenges and opportunities to innovate")
    
    if user_profile.get("Extraversion", 0.5) > 0.6:
        insights["working_style_tips"].append("Maximize your energy through regular team interactions and collaborative work")
    
    # Generate collaboration tips
    if user_profile.get("Agreeableness", 0.5) > 0.6:
        insights["collaboration_tips"].append("Your natural empathy makes you excellent at building team consensus")
    
    if user_profile.get("Neuroticism", 0.5) < 0.4:
        insights["collaboration_tips"].append("Your emotional stability helps you be a calming presence during stressful projects")
    
    # Generate growth areas
    if user_profile.get("Openness", 0.5) < 0.4:
        insights["growth_areas"].append("Consider exploring new approaches and being more open to creative solutions")
    
    if user_profile.get("Conscientiousness", 0.5) < 0.4:
        insights["growth_areas"].append("Focus on developing better organizational habits and follow-through")
    
    # Explain trait connections
    for trait_name, is_selected in selected_traits.items():
        if is_selected:
            insights["trait_explanations"][trait_name] = get_trait_explanation(trait_name, user_profile)
    
    return insights

def get_trait_explanation(trait_name: str, user_profile: Dict[str, float]) -> str:
    """
    Explain how a selected trait connects to Big Five personality dimensions.
    
    Args:
        trait_name: Name of the selected trait
        user_profile: User's Big Five scores
        
    Returns:
        Explanation string
    """
    explanations = {
        "Innovation": f"Your Innovation score reflects high Openness ({user_profile.get('Openness', 0.5):.2f}), indicating creativity and intellectual curiosity.",
        "Analytical": f"Your Analytical nature shows in both Openness ({user_profile.get('Openness', 0.5):.2f}) and Conscientiousness ({user_profile.get('Conscientiousness', 0.5):.2f}), combining curiosity with systematic thinking.",
        "High Energy": f"Your High Energy reflects strong Extraversion ({user_profile.get('Extraversion', 0.5):.2f}) and emotional stability.",
        "Intense Focus": f"Your Intense Focus indicates high Conscientiousness ({user_profile.get('Conscientiousness', 0.5):.2f}) and emotional stability under pressure.",
        "Cooperative": f"Your Cooperative nature shows high Agreeableness ({user_profile.get('Agreeableness', 0.5):.2f}), indicating you value harmony and teamwork.",
        "Calm Under Pressure": f"Your ability to stay Calm Under Pressure reflects low Neuroticism ({user_profile.get('Neuroticism', 0.5):.2f}), showing excellent emotional regulation."
    }
    
    return explanations.get(trait_name, f"Your {trait_name} trait contributes to your overall personality profile.")