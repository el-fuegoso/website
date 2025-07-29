import os
import sys
import json
import logging
import traceback
from typing import Dict, Any, Union

# Add the backend directory to Python path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global analyzer instance for reuse across requests
analyzer = None

def init_analyzer():
    """Initialize PyTorch model handler for personality analysis"""
    global analyzer
    if analyzer is None:
        try:
            # Use PyTorch model handler for personality analysis
            from personality_analyzer.analyzer import PersonalityAnalyzer
            analyzer = PersonalityAnalyzer()
            logger.info("✅ PyTorch model handler initialized successfully")
        except Exception as e:
            logger.error(f"❌ Error initializing PyTorch model handler: {e}")
            raise Exception(f"PyTorch model handler initialization failed: {str(e)}")
    return analyzer

def create_response(data: Dict[str, Any], status_code: int = 200) -> Dict[str, Any]:
    """Create a Vercel-compatible response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
        },
        'body': json.dumps(data)
    }

def handle_cors_preflight() -> Dict[str, Any]:
    """Handle CORS preflight requests"""
    return create_response({}, 200)

def analyze_text_handler(body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle personality analysis from terminal input"""
    try:
        current_analyzer = init_analyzer()

        # Validate input
        if not body or 'text' not in body:
            return create_response({
                "error": "Missing 'text' field in request",
                "status": "error"
            }, 400)
            
        user_text = body.get('text', '')
        mode = body.get('mode', 'general')
        context = body.get('context', [])
        
        if not user_text.strip():
            return create_response({
                "error": "Text input cannot be empty",
                "status": "error"
            }, 400)

        logger.info(f"Analyzing text in {mode} mode: {user_text[:100]}...")

        # Perform personality analysis using GitHub model
        personality_scores, explanation = current_analyzer.predict_personality(user_text)
        
        # Generate avatar data based on personality scores
        avatar_data = {
            "avatar_style": "personality_based",
            "personality_scores": personality_scores,
            "generated_from": "pytorch_ocean_model",
            "dominant_traits": sorted(personality_scores.items(), key=lambda x: x[1], reverse=True)[:2]
        }
        
        return create_response({
            "status": "success",
            "personality_scores": personality_scores,
            "explanation": explanation,
            "avatar_data": avatar_data,
            "analysis_mode": mode,
            "text_length": len(user_text),
            "model_source": "pytorch_github_releases"
        })

    except Exception as e:
        logger.error(f"Error in analyze_text: {e}")
        logger.error(traceback.format_exc())
        return create_response({
            "error": f"Analysis failed: {str(e)}",
            "status": "error"
        }, 500)

def analyze_quest_handler(body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle quest mode analysis"""
    try:
        current_analyzer = init_analyzer()

        if not body or 'responses' not in body:
            return create_response({
                "error": "Missing 'responses' field in request",
                "status": "error"
            }, 400)
            
        responses = body.get('responses', [])
        user_name = body.get('user_name', 'User')
        
        if len(responses) < 4:
            return create_response({
                "error": "Quest mode requires all 4 responses",
                "status": "error"
            }, 400)

        logger.info(f"Analyzing quest responses for {user_name}")

        # Combine all quest responses into single text for analysis
        combined_text = " ".join(responses)
        personality_scores, explanation = current_analyzer.predict_personality(combined_text)
        
        # Create quest-specific analysis
        quest_analysis = {
            "personality_scores": personality_scores,
            "explanation": f"Quest analysis for {user_name} based on {len(responses)} responses",
            "user_name": user_name,
            "response_count": len(responses),
            "combined_text_length": len(combined_text),
            "dominant_traits": sorted(personality_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        }
        
        return create_response({
            "status": "success",
            "analysis": quest_analysis,
            "user_name": user_name,
            "response_count": len(responses),
            "model_source": "pytorch_github_releases"
        })

    except Exception as e:
        logger.error(f"Error in analyze_quest: {e}")
        return create_response({
            "error": f"Quest analysis failed: {str(e)}",
            "status": "error"
        }, 500)

def analyze_traits_handler(body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle UI trait analysis and character matching"""
    try:
        if not body or 'traits' not in body:
            return create_response({
                "error": "Missing 'traits' field in request",
                "status": "error"
            }, 400)
            
        selected_traits = body.get('traits', {})
        user_name = body.get('user_name', 'User')
        
        logger.info(f"Analyzing UI traits for {user_name}: {list(selected_traits.keys())}")

        current_analyzer = init_analyzer()
        
        # Use mock analysis if analyzer isn't available
        if current_analyzer is None:
            from personality_analyzer.utils import map_ui_traits_to_big_five, find_best_character_match
            from personality_analyzer.character_data import get_all_characters
            
            user_big_five = map_ui_traits_to_big_five(selected_traits)
            characters = get_all_characters()
            char_name, char_data, similarity = find_best_character_match(user_big_five, characters)
            
            analysis = {
                "status": "success",
                "analysis_type": "ui_traits_mock",
                "user_name": user_name,
                "selected_traits": selected_traits,
                "big_five_scores": user_big_five,
                "matched_character": {
                    "name": char_name,
                    "data": char_data,
                    "similarity_score": similarity,
                    "match_confidence": "High" if similarity > 0.8 else "Medium" if similarity > 0.6 else "Low"
                },
                "completion_status": "complete",
                "note": "Using trait-based analysis (model not available)"
            }
        else:
            # Use full analyzer
            analysis = current_analyzer.analyze_ui_traits(selected_traits, user_name)
            analysis["status"] = "success"
        
        return create_response(analysis)

    except Exception as e:
        logger.error(f"Error in analyze_ui_traits: {e}")
        logger.error(traceback.format_exc())
        return create_response({
            "error": f"Trait analysis failed: {str(e)}",
            "status": "error"
        }, 500)

def get_characters_handler() -> Dict[str, Any]:
    """Get all available AI character profiles"""
    try:
        current_analyzer = init_analyzer()
        
        if current_analyzer:
            character_data = current_analyzer.get_all_character_profiles()
        else:
            # Fallback to direct import
            from personality_analyzer.character_data import get_all_characters
            characters = get_all_characters()
            character_data = {
                "characters": characters,
                "character_count": len(characters),
                "character_names": list(characters.keys())
            }
        
        return create_response({
            "status": "success",
            **character_data
        })

    except Exception as e:
        logger.error(f"Error in get_characters: {e}")
        return create_response({
            "error": f"Failed to retrieve characters: {str(e)}",
            "status": "error"
        }, 500)

def match_character_handler(body: Dict[str, Any]) -> Dict[str, Any]:
    """Find best matching character for given text or traits"""
    try:
        if not body:
            return create_response({
                "error": "No data provided",
                "status": "error"
            }, 400)
        
        # Check if we have text or traits
        user_text = body.get('text')
        selected_traits = body.get('traits')
        mode = body.get('mode', 'general')
        
        if not user_text and not selected_traits:
            return create_response({
                "error": "Either 'text' or 'traits' must be provided",
                "status": "error"
            }, 400)
        
        current_analyzer = init_analyzer()
        
        if current_analyzer is None:
            # Use mock analysis for traits only
            if selected_traits:
                return analyze_traits_handler(body)
            else:
                return create_response({
                    "error": "Text analysis requires model (not available). Please use trait selection instead.",
                    "status": "error"
                }, 503)
        
        # Use real analyzer
        if user_text:
            analysis = current_analyzer.get_character_match_for_text(user_text, mode)
        else:
            analysis = current_analyzer.analyze_ui_traits(selected_traits, body.get('user_name', 'User'))
        
        analysis["status"] = "success"
        return create_response(analysis)

    except Exception as e:
        logger.error(f"Error in match_character: {e}")
        return create_response({
            "error": f"Character matching failed: {str(e)}",
            "status": "error"
        }, 500)

def generate_avatar_handler(body: Dict[str, Any]) -> Dict[str, Any]:
    """Generate avatar based on personality analysis"""
    try:
        personality_scores = body.get('personality_scores', {})
        user_context = body.get('user_context', {})
        
        logger.info("Generating avatar from personality scores")

        # Generate simple avatar data based on personality scores
        dominant_trait = max(personality_scores.items(), key=lambda x: x[1])[0] if personality_scores else "balanced"
        
        avatar_data = {
            "avatar_style": "personality_based",
            "dominant_trait": dominant_trait,
            "personality_scores": personality_scores,
            "user_context": user_context,
            "generated_from": "ocean_model",
            "style_recommendations": {
                "openness": "creative" if personality_scores.get("openness", 0) > 0.6 else "traditional",
                "extraversion": "bright" if personality_scores.get("extraversion", 0) > 0.6 else "subtle",
                "conscientiousness": "structured" if personality_scores.get("conscientiousness", 0) > 0.6 else "flexible"
            }
        }
        
        return create_response({
            "status": "success",
            "avatar": avatar_data,
            "model_source": "pytorch_github_releases"
        })

    except Exception as e:
        logger.error(f"Error in generate_avatar: {e}")
        return create_response({
            "error": f"Avatar generation failed: {str(e)}",
            "status": "error"
        }, 500)

def chat_handler(body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle character chat conversations"""
    try:
        if not body or 'message' not in body:
            return create_response({
                "error": "Missing 'message' field in request",
                "status": "error"
            }, 400)
            
        user_message = body.get('message', '')
        character_name = body.get('character_name', 'TheBuilder')
        character_context = body.get('character_context', {})
        conversation_history = body.get('conversation_history', [])
        terminal_context = body.get('terminal_context', None)
        
        if not user_message.strip():
            return create_response({
                "error": "Message cannot be empty",
                "status": "error"
            }, 400)

        logger.info(f"Chat request for {character_name}: {user_message[:100]}...")
        
        # Enhanced context for TerminalAssistant
        if character_name == 'TerminalAssistant' and terminal_context:
            character_context.update({
                'terminal_mode': True,
                'text_classification': terminal_context.get('classification', {}),
                'analysis_context': terminal_context.get('context', {}),
                'terminal_conversation_history': terminal_context.get('conversation_history', [])
            })
            
            if terminal_context.get('classification'):
                classification = terminal_context['classification']
                context_message = f"Text classification: {classification.get('type', 'unknown')} (confidence: {classification.get('confidence', 0):.2f})"
                
                enhanced_history = conversation_history.copy()
                if enhanced_history:
                    enhanced_history.insert(-1, {
                        'role': 'system',
                        'content': context_message
                    })
                else:
                    enhanced_history = [{'role': 'system', 'content': context_message}]
                
                conversation_history = enhanced_history

        # Import Claude API for character chat
        from personality_analyzer.claude_chat import generate_character_response
        
        response = generate_character_response(
            user_message=user_message,
            character_name=character_name,
            character_context=character_context,
            conversation_history=conversation_history
        )
        
        return create_response({
            "status": "success",
            "response": response,
            "character_name": character_name,
            "timestamp": response.get("timestamp")
        })

    except Exception as e:
        logger.error(f"Error in chat_with_character: {e}")
        logger.error(traceback.format_exc())
        return create_response({
            "error": f"Chat failed: {str(e)}",
            "status": "error"
        }, 500)

def health_check_handler() -> Dict[str, Any]:
    """Health check endpoint"""
    try:
        current_analyzer = init_analyzer()
        model_status = current_analyzer.get_model_status()
        
        return create_response({
            "status": "healthy",
            "service": "Elliot Personality Analyzer API",
            "model_handler": "pytorch_github_releases",
            "model_status": model_status,
            "analyzer_status": "ready"
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return create_response({
            "status": "unhealthy",
            "service": "Elliot Personality Analyzer API",
            "error": str(e),
            "analyzer_status": "failed"
        }, 503)

def handler(event, context=None):
    """Main Vercel serverless function handler"""
    try:
        # Get HTTP method and path
        http_method = event.get('httpMethod', event.get('method', 'GET')).upper()
        path = event.get('path', event.get('rawPath', '/'))
        
        # Handle CORS preflight
        if http_method == 'OPTIONS':
            return handle_cors_preflight()
        
        # Parse request body
        body = {}
        if event.get('body'):
            try:
                if isinstance(event['body'], str):
                    body = json.loads(event['body'])
                else:
                    body = event['body']
            except json.JSONDecodeError:
                return create_response({
                    "error": "Invalid JSON in request body",
                    "status": "error"
                }, 400)
        
        # Route requests
        if path == '/' or path.endswith('/index.py'):
            if http_method == 'GET':
                return health_check_handler()
            
        # API endpoint routing
        if '/api/analyze' in path and 'traits' not in path:
            if http_method == 'POST':
                return analyze_text_handler(body)
                
        elif '/api/quest' in path:
            if http_method == 'POST':
                return analyze_quest_handler(body)
                
        elif '/api/analyze_traits' in path:
            if http_method == 'POST':
                return analyze_traits_handler(body)
                
        elif '/api/characters' in path:
            if http_method == 'GET':
                return get_characters_handler()
                
        elif '/api/match_character' in path:
            if http_method == 'POST':
                return match_character_handler(body)
                
        elif '/api/generate_avatar' in path:
            if http_method == 'POST':
                return generate_avatar_handler(body)
                
        elif '/api/chat' in path:
            if http_method == 'POST':
                return chat_handler(body)
        
        # Default handler for unmatched routes
        return create_response({
            "error": "Endpoint not found",
            "status": "error",
            "available_endpoints": [
                "GET / - Health check",
                "POST /api/analyze - Text analysis",
                "POST /api/quest - Quest analysis", 
                "POST /api/analyze_traits - Trait analysis",
                "GET /api/characters - Get characters",
                "POST /api/match_character - Character matching",
                "POST /api/generate_avatar - Avatar generation",
                "POST /api/chat - Character chat"
            ]
        }, 404)
        
    except Exception as e:
        logger.error(f"Handler error: {e}")
        logger.error(traceback.format_exc())
        return create_response({
            "error": f"Internal server error: {str(e)}",
            "status": "error"
        }, 500)

# For Vercel Python runtime
def main(request):
    """Vercel Python runtime entry point"""
    import json
    
    # Convert Vercel request to event format
    event = {
        'httpMethod': request.method,
        'path': request.path,
        'body': None
    }
    
    # Handle request body
    if request.method in ['POST', 'PUT', 'PATCH']:
        try:
            if hasattr(request, 'get_json'):
                event['body'] = request.get_json()
            elif hasattr(request, 'json'):
                event['body'] = request.json
            else:
                # Try to parse raw data
                data = request.data if hasattr(request, 'data') else b''
                if data:
                    event['body'] = json.loads(data.decode('utf-8'))
        except:
            pass
    
    # Call handler
    response = handler(event)
    
    # Convert response for Vercel
    from flask import Response
    return Response(
        response['body'],
        status=response['statusCode'],
        headers=response['headers']
    )

# Fallback for testing
if __name__ == '__main__':
    # Test event
    test_event = {
        'httpMethod': 'GET',
        'path': '/',
        'body': None
    }
    
    result = handler(test_event)
    print(json.dumps(result, indent=2))