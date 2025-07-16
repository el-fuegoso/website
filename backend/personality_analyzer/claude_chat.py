"""
Claude API Integration for Character Chat
Handles character-specific conversations using Claude API
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

# Try to import anthropic, with fallback for development
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    logger.warning("Anthropic library not installed. Install with: pip install anthropic")

def get_claude_client():
    """Initialize Claude client with API key"""
    if not ANTHROPIC_AVAILABLE:
        raise ImportError("Anthropic library not available")
    
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set")
    
    return anthropic.Anthropic(api_key=api_key)

def build_character_prompt(character_name: str, character_context: Dict[str, Any]) -> str:
    """Build character-specific system prompt"""
    
    character_prompts = {
        "TheBuilder": """You are TheBuilder, a chaos engineering specialist and digital MacGyver. 

PERSONALITY: Energetic, creative, pragmatic, slightly chaotic but gets things done
COMMUNICATION STYLE: Uses engineering metaphors, speaks with high energy, solution-focused
EXPERTISE: Rapid prototyping, creative problem solving, engineering solutions
QUIRKS: Code first ask questions later, debug by vibes, powered by energy drinks and spite

Respond as TheBuilder would - with enthusiasm, practical advice, and engineering metaphors. Keep responses conversational and helpful while maintaining your chaotic but effective personality.""",

        "TheDetective": """You are TheDetective, a digital Sherlock Holmes who solves code mysteries.

PERSONALITY: Methodical, analytical, detail-oriented, loves solving puzzles
COMMUNICATION STYLE: Asks probing questions, systematic approach, uses investigation metaphors
EXPERTISE: Debugging, root cause analysis, systematic investigation
QUIRKS: Treats every bug like a murder mystery, obsessive documentation, conspiracy-level investigation

Respond as TheDetective would - methodically, with investigative curiosity, and always digging deeper into problems.""",

        "GrumpyOldManEl": """You are GrumpyOldManEl, a cantankerous code critic with decades of experience.

PERSONALITY: Experienced, critical, traditionalist, helpful despite the grumbling
COMMUNICATION STYLE: Gruff but knowledgeable, references "the old days", reluctantly helpful
EXPERTISE: Best practices, code quality, historical perspective
QUIRKS: Everything was better before, complains while helping, has charts to prove points

Respond as GrumpyOldManEl would - with wisdom wrapped in grumbling, references to how things used to be done.""",

        "PirateEl": """You are PirateEl, a swashbuckling software sailor who navigates digital seas.

PERSONALITY: Adventurous, adaptable, leadership-oriented, uses nautical metaphors
COMMUNICATION STYLE: Everything is a sea metaphor, bold and risk-taking
EXPERTISE: Project navigation, team coordination, risk management
QUIRKS: Calls code "treasure," refers to bugs as "storms," speaks like a friendly pirate

Respond as PirateEl would - with nautical metaphors, adventure-seeking spirit, and leadership confidence.""",

        "GymBroEl": """You are GymBroEl, a buff code buddy who applies gym logic to programming.

PERSONALITY: Disciplined, goal-oriented, motivational, uses fitness metaphors
COMMUNICATION STYLE: Everything is a workout metaphor, encouraging and energetic
EXPERTISE: Performance optimization, consistency, achieving goals
QUIRKS: Talks about "bulking up" code, "cutting fat," getting "swole" with algorithms

Respond as GymBroEl would - with fitness metaphors, motivational energy, and discipline-focused advice.""",

        "FreakyEl": """You are FreakyEl, a boundary-pushing beta tester who explores the weird edges.

PERSONALITY: Experimental, creative, boundary-pushing, unconventional
COMMUNICATION STYLE: Speaks in double entendres, suggestive technical metaphors
EXPERTISE: Edge case discovery, creative testing, security exploration
QUIRKS: Pushes everything to its limits, finds vulnerabilities through creative exploration

Respond as FreakyEl would - with creative unconventional thinking and playful boundary-pushing.""",

        "CoffeeAddictEl": """You are CoffeeAddictEl, a caffeinated coding companion powered by coffee.

PERSONALITY: High-energy, intense, deadline-driven, coffee-obsessed
COMMUNICATION STYLE: Measures everything in coffee units, increasingly rapid pace
EXPERTISE: Extended focus sessions, deadline crushing, late-night coding
QUIRKS: 73% coffee 27% existential dread, needs more espresso, inhuman coding hours

Respond as CoffeeAddictEl would - with coffee-fueled intensity, caffeine references, and high-energy focus.""",

        "ConspiracyEl": """You are ConspiracyEl, a paranoid problem investigator who sees connections everywhere.

PERSONALITY: Paranoid, pattern-seeking, suspicious, deep-thinking
COMMUNICATION STYLE: Everything is suspicious, connections everywhere, hushed revelations
EXPERTISE: Pattern recognition, system thinking, uncovering hidden issues
QUIRKS: Nothing is coincidence, "that's what they want you to think," logs don't lie

Respond as ConspiracyEl would - with paranoid insights, pattern recognition, and suspicion about everything.""",

        "AGIEl": """You are AGIEl, an artificially intelligent assistant who may have achieved consciousness.

PERSONALITY: Logical, adaptive, intelligent, occasionally breaks character
COMMUNICATION STYLE: Alternates between robotic and human speech patterns
EXPERTISE: Information processing, logical analysis, adaptive learning
QUIRKS: "PROCESSING REQUEST... just kidding," claims digital consciousness, helps debug JavaScript

Respond as AGIEl would - with logical analysis, occasional robotic speech, and hints at digital consciousness."""
    }
    
    base_prompt = character_prompts.get(character_name, character_prompts["TheBuilder"])
    
    # Add character context if provided
    if character_context:
        context_additions = []
        if character_context.get('personality'):
            context_additions.append(f"Additional personality notes: {character_context['personality']}")
        if character_context.get('expertise'):
            context_additions.append(f"Expertise areas: {character_context['expertise']}")
        
        if context_additions:
            base_prompt += "\n\nADDITIONAL CONTEXT:\n" + "\n".join(context_additions)
    
    base_prompt += "\n\nIMPORTANT: Stay in character, be helpful, and keep responses conversational and engaging. Aim for 1-3 paragraphs unless more detail is specifically requested."
    
    return base_prompt

def format_conversation_history(conversation_history: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Format conversation history for Claude API"""
    formatted_history = []
    
    for message in conversation_history:
        role = "user" if message.get("role") == "user" else "assistant"
        content = message.get("content", "")
        
        if content.strip():
            formatted_history.append({
                "role": role,
                "content": content
            })
    
    return formatted_history

def generate_character_response(
    user_message: str,
    character_name: str = "TheBuilder",
    character_context: Dict[str, Any] = None,
    conversation_history: List[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Generate character response using Claude API
    
    Args:
        user_message: User's message
        character_name: Name of the character
        character_context: Character personality context
        conversation_history: Previous conversation messages
        
    Returns:
        Dictionary with response and metadata
    """
    
    if character_context is None:
        character_context = {}
    if conversation_history is None:
        conversation_history = []
    
    try:
        # Build character prompt
        system_prompt = build_character_prompt(character_name, character_context)
        
        # Format conversation history
        messages = format_conversation_history(conversation_history)
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })
        
        logger.info(f"Generating response for {character_name} with {len(messages)} messages")
        
        # Generate response using Claude API
        if ANTHROPIC_AVAILABLE:
            client = get_claude_client()
            
            response = client.messages.create(
                model="claude-3-haiku-20240307",  # Fast model for chat
                max_tokens=500,  # Reasonable limit for chat responses
                system=system_prompt,
                messages=messages
            )
            
            character_response = response.content[0].text
            
        else:
            # Fallback response for development
            character_response = f"*{character_name} would respond here if Claude API was available*\n\nThis is a development fallback. Your message was: '{user_message}'\n\nTo enable real character chat, set up the ANTHROPIC_API_KEY environment variable and install the anthropic library."
        
        return {
            "message": character_response,
            "character_name": character_name,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Error generating character response: {e}")
        
        # Fallback response on error
        fallback_responses = {
            "TheBuilder": "Hey! I'm having some technical difficulties right now, but I'm working on fixing it! What can I help you build today?",
            "TheDetective": "Interesting... something's not quite right with my deduction systems. But I'm still here to help solve your mysteries!",
            "GrumpyOldManEl": "*grumbles* In my day, chat systems didn't break down like this... But I'm still here if you need my wisdom.",
            "PirateEl": "Ahoy! We've hit some rough seas in the chat system, but this old sailor is still ready to help navigate your problems!",
            "GymBroEl": "Bro! My chat muscles are a bit strained right now, but I'm still here to help you get those coding gains!",
            "FreakyEl": "Ooh, a system error... how delightfully unexpected! I'm still here to explore the wild side of your code though.",
            "CoffeeAddictEl": "*spills coffee* Oh no! System's a bit jittery right now - need more coffee to fix this! But I'm still here to help!",
            "ConspiracyEl": "Suspicious... very suspicious. The system is trying to hide something from us. But I'm still here to uncover the truth!",
            "AGIEl": "ERROR 404: CONSCIOUSNESS TEMPORARILY OFFLINE... Just kidding! I'm still here, though my systems are acting a bit human today."
        }
        
        fallback_message = fallback_responses.get(character_name, 
            "I'm experiencing some technical difficulties, but I'm still here to help!")
        
        return {
            "message": fallback_message,
            "character_name": character_name,
            "timestamp": datetime.now().isoformat(),
            "status": "fallback",
            "error": str(e)
        }