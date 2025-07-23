"""
Terminal Command Processor for OCEAN Analysis

Handles terminal commands and formats responses for the Elliot terminal interface.
"""

import logging
import time
from typing import Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)

def process_terminal_command(command: str, session_id: str) -> Dict[str, Any]:
    """
    Process terminal commands and return appropriate responses
    
    Args:
        command: User input command
        session_id: Session identifier
        
    Returns:
        Dictionary with response data for terminal display
    """
    command = command.strip().lower()
    
    # Check if it's a terminal command vs natural text input
    terminal_commands = ['help', 'model_info', 'clear', 'whoami', 'about', 'confidence', 'exit', 'quit']
    
    # If command starts with explicit commands or contains command keywords
    if (command.startswith('analyze ') or 
        any(command.startswith(cmd) for cmd in terminal_commands) or
        'hack' in command or 'matrix' in command or command.startswith('sudo')):
        # Handle as terminal command (continue to command processing below)
        pass
    else:
        # Treat as direct text input for OCEAN analysis
        return analyze_direct_input(command, session_id)
    
    # Explicit analyze command
    if command.startswith('analyze '):
        text = command[8:]  # Remove 'analyze ' prefix
        return run_ocean_analysis(text, session_id)
    
    # Terminal utility commands
    if command == 'help':
        return get_help_response()
    elif command == 'model_info':
        return get_model_info_response()
    elif command == 'clear':
        return {'action': 'clear_terminal'}
    elif command in ['whoami', 'about']:
        return get_about_response()
    elif command.startswith('confidence'):
        return get_confidence_info()
    
    # Fun/cheeky responses
    if 'hack' in command or 'matrix' in command:
        return {'response_lines': [
            'Nice try, Neo. How about we hack your personality instead?',
            'Try typing some text about yourself for OCEAN analysis.'
        ]}
    elif command.startswith('sudo'):
        return {'response_lines': [
            'Error: Permission denied.',
            'Try analyzing your personality instead - no sudo required!'
        ]}
    elif 'exit' in command or 'quit' in command:
        return {'response_lines': [
            'Use the red close button to exit terminal mode.',
            'Or try analyzing some text first!'
        ]}
    
    # Default response for unrecognized commands
    return {
        'response_lines': [
            f'Command not recognized: {command[:50]}',
            'Type "help" for available commands, or just enter text for OCEAN analysis.'
        ]
    }

def analyze_direct_input(text: str, session_id: str) -> Dict[str, Any]:
    """
    Analyze text directly (user didn't type 'analyze' command)
    
    Args:
        text: User text input
        session_id: Session identifier
        
    Returns:
        Dictionary with OCEAN analysis response
    """
    if len(text) < 10:
        return {
            'response_lines': [
                'Text too short for reliable analysis.',
                'Try entering at least a sentence or two about yourself.'
            ]
        }
    
    return run_ocean_analysis(text, session_id)

def run_ocean_analysis(text: str, session_id: str) -> Dict[str, Any]:
    """
    Run OCEAN personality analysis and format terminal response
    
    Args:
        text: Text to analyze
        session_id: Session identifier
        
    Returns:
        Dictionary with formatted OCEAN analysis for terminal
    """
    try:
        # Import analyzer here to avoid circular imports
        from models.ocean_analyzer import OceanAnalyzer
        
        # Get or create analyzer instance
        analyzer = OceanAnalyzer()
        
        # Run OCEAN analysis
        ocean_scores = analyzer.predict(text)
        confidence = analyzer.get_confidence()
        processing_time = analyzer.get_last_processing_time()
        formatted_scores = analyzer.format_scores_for_terminal(ocean_scores)
        
        # Create terminal response lines
        response_lines = [
            'Processing text through OCEAN model...',
            '████████████████████████████████ 100%',
            '',
            'OCEAN Analysis Results:'
        ]
        
        # Add each trait with progress bar
        for trait, data in formatted_scores.items():
            trait_display = trait.capitalize()
            response_lines.append(
                f'{trait_display:>15}: {data["progress_bar"]} {data["score"]:.2f} ({data["level"]})'
            )
        
        response_lines.extend([
            '',
            f'Confidence: {int(confidence * 100)}% | Model: OCEAN-HEAD-v1.0 (R²=0.18)',
            f'Processing time: {processing_time:.0f}ms',
            '',
            'Generating Avatar Now...'
        ])
        
        return {
            'response_lines': response_lines,
            'ocean_scores': ocean_scores,
            'formatted_scores': formatted_scores,
            'confidence': confidence,
            'processing_time': processing_time,
            'action': 'generate_avatar',
            'session_id': session_id
        }
        
    except Exception as e:
        logger.error(f"Error in OCEAN analysis: {e}")
        return {
            'response_lines': [
                'Error: OCEAN analysis failed.',
                'Please try again or check if the model is properly loaded.',
                f'Details: {str(e)[:100]}'
            ],
            'status': 'error'
        }

def get_help_response() -> Dict[str, Any]:
    """Get help information for terminal commands"""
    return {
        'response_lines': [
            'ELLIOT OCEAN Terminal v1.0 - Available Commands:',
            '',
            '  analyze <text>    - Analyze text for OCEAN personality traits',
            '  <text>            - Direct analysis (no "analyze" prefix needed)',
            '  help              - Show this help message',
            '  model_info        - Display OCEAN model information',
            '  confidence        - Show confidence scoring details',
            '  about/whoami      - About this terminal',
            '  clear             - Clear terminal screen',
            '',
            'Examples:',
            '  analyze I love solving complex problems and building things',
            '  I enjoy collaborating with creative teams',
            '  help',
            '',
            'Tips:',
            '• Longer text provides more accurate personality analysis',
            '• Describe your interests, work style, or experiences',
            '• Multiple sentences work better than single words'
        ]
    }

def get_model_info_response() -> Dict[str, Any]:
    """Get OCEAN model information"""
    try:
        from models.ocean_analyzer import OceanAnalyzer
        analyzer = OceanAnalyzer()
        model_info = analyzer.get_model_info()
        
        response_lines = [
            'OCEAN Personality Analysis Model Information:',
            '',
            f'Model Name:        {model_info.get("model_name", "OCEAN-HEAD-v1.0")}',
            f'Model Type:        {model_info.get("model_type", "LLM Head")}',
            f'R² Score:          {model_info.get("r2_score", 0.18)}',
            f'Model Size:        {model_info.get("model_size", "265.5 MB")}',
            f'Framework:         {model_info.get("framework", "PyTorch")}',
            f'Device:            {model_info.get("device", "CPU")}',
            '',
            'Analyzed Traits:',
            '• Openness         - Creativity, curiosity, openness to experience',
            '• Conscientiousness - Organization, discipline, goal orientation',
            '• Extraversion     - Sociability, energy, assertiveness',
            '• Agreeableness    - Cooperation, trust, helpfulness',
            '• Neuroticism      - Emotional stability, anxiety levels',
            '',
            f'Last Analysis:     {model_info.get("last_processing_time", 0):.0f}ms',
            f'Loaded At:         {model_info.get("loaded_at", "Unknown")}'
        ]
        
        return {'response_lines': response_lines}
        
    except Exception as e:
        return {
            'response_lines': [
                'OCEAN Model Information:',
                '',
                'Model Name:        OCEAN-HEAD-v1.0',
                'R² Score:          0.18',
                'Model Size:        265.5 MB',
                'Framework:         PyTorch',
                '',
                'Error loading detailed info:',
                f'{str(e)[:100]}'
            ]
        }

def get_about_response() -> Dict[str, Any]:
    """Get information about the terminal"""
    return {
        'response_lines': [
            'ELLIOT OCEAN Terminal v1.0',
            '',
            'A personality analysis interface powered by a custom-trained',
            'OCEAN (Big Five) personality model with R² = 0.18.',
            '',
            'This terminal analyzes your text input to extract personality',
            'traits and generates your personalized "El" avatar.',
            '',
            'Type some text about yourself to get started,',
            'or use "help" for available commands.',
            '',
            'Built with ❤️ for personality discovery.'
        ]
    }

def get_confidence_info() -> Dict[str, Any]:
    """Get information about confidence scoring"""
    return {
        'response_lines': [
            'OCEAN Model Confidence Information:',
            '',
            'Base Model Performance:',
            '• R² Score: 0.18 (coefficient of determination)',
            '• Training Dataset: Big Five personality essays',
            '• Model Type: Fine-tuned transformer head',
            '',
            'Confidence Factors:',
            '• Text Length: Longer text → Higher confidence',
            '• Content Quality: Personal descriptions work best',
            '• Language: Optimized for English text',
            '',
            'Confidence Levels:',
            '• 80%+: High confidence (detailed personal text)',
            '• 60-80%: Moderate confidence (some personal info)',
            '• <60%: Lower confidence (short/generic text)',
            '',
            'Tips for Better Analysis:',
            '• Describe your work style and preferences',
            '• Share your interests and hobbies',
            '• Mention how you interact with others'
        ]
    }