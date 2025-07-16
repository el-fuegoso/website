from flask import Flask, request, jsonify
from flask_cors import CORS
from personality_analyzer.analyzer import PersonalityAnalyzer
import logging
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the personality analyzer
try:
    analyzer = PersonalityAnalyzer()
    logger.info("✅ PersonalityAnalyzer initialized successfully")
except Exception as e:
    logger.error(f"❌ Error initializing PersonalityAnalyzer: {e}")
    analyzer = None

@app.route('/')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Elliot Personality Analyzer API",
        "analyzer_status": "ready" if analyzer else "failed"
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Main endpoint for personality analysis from terminal input
    Accepts: text, mode, context from the Elliot terminal
    Returns: personality analysis and avatar recommendations
    """
    if analyzer is None:
        return jsonify({
            "error": "Personality analyzer not initialized. Check server logs.",
            "status": "error"
        }), 500

    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'text' not in data:
            return jsonify({
                "error": "Missing 'text' field in request",
                "status": "error"
            }), 400
            
        user_text = data.get('text', '')
        mode = data.get('mode', 'general')  # quest, conversation, jd
        context = data.get('context', [])  # conversation history
        
        if not user_text.strip():
            return jsonify({
                "error": "Text input cannot be empty",
                "status": "error"
            }), 400

        logger.info(f"Analyzing text in {mode} mode: {user_text[:100]}...")

        # Perform personality analysis
        personality_scores, explanation, avatar_data = analyzer.analyze_text(
            text=user_text,
            mode=mode,
            context=context
        )
        
        return jsonify({
            "status": "success",
            "personality_scores": personality_scores,
            "explanation": explanation,
            "avatar_data": avatar_data,
            "analysis_mode": mode,
            "text_length": len(user_text)
        })

    except Exception as e:
        logger.error(f"Error in analyze_text: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Analysis failed: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/quest', methods=['POST'])
def analyze_quest():
    """
    Specific endpoint for quest mode analysis
    Processes all 4 quest responses together for comprehensive analysis
    """
    if analyzer is None:
        return jsonify({
            "error": "Personality analyzer not initialized",
            "status": "error"
        }), 500

    try:
        data = request.get_json()
        
        if not data or 'responses' not in data:
            return jsonify({
                "error": "Missing 'responses' field in request",
                "status": "error"
            }), 400
            
        responses = data.get('responses', [])
        user_name = data.get('user_name', 'User')
        
        if len(responses) < 4:
            return jsonify({
                "error": "Quest mode requires all 4 responses",
                "status": "error"
            }), 400

        logger.info(f"Analyzing quest responses for {user_name}")

        # Process quest responses
        combined_analysis = analyzer.analyze_quest_responses(responses, user_name)
        
        return jsonify({
            "status": "success",
            "analysis": combined_analysis,
            "user_name": user_name,
            "response_count": len(responses)
        })

    except Exception as e:
        logger.error(f"Error in analyze_quest: {e}")
        return jsonify({
            "error": f"Quest analysis failed: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/generate_avatar', methods=['POST'])
def generate_avatar():
    """
    Generate avatar based on personality analysis
    """
    if analyzer is None:
        return jsonify({
            "error": "Personality analyzer not initialized",
            "status": "error"
        }), 500

    try:
        data = request.get_json()
        
        personality_scores = data.get('personality_scores', {})
        user_context = data.get('user_context', {})
        
        logger.info("Generating avatar from personality scores")

        # Generate avatar
        avatar_data = analyzer.generate_avatar_from_scores(personality_scores, user_context)
        
        return jsonify({
            "status": "success",
            "avatar": avatar_data
        })

    except Exception as e:
        logger.error(f"Error in generate_avatar: {e}")
        return jsonify({
            "error": f"Avatar generation failed: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/analyze_traits', methods=['POST'])
def analyze_ui_traits():
    """
    Analyze personality from UI trait selections and find matching character
    """
    try:
        data = request.get_json()
        
        if not data or 'traits' not in data:
            return jsonify({
                "error": "Missing 'traits' field in request",
                "status": "error"
            }), 400
            
        selected_traits = data.get('traits', {})
        user_name = data.get('user_name', 'User')
        
        logger.info(f"Analyzing UI traits for {user_name}: {list(selected_traits.keys())}")

        # Use mock analysis if analyzer isn't available, otherwise use real analysis
        if analyzer is None:
            # Simple mock analysis based on traits
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
            analysis = analyzer.analyze_ui_traits(selected_traits, user_name)
            analysis["status"] = "success"
        
        return jsonify(analysis)

    except Exception as e:
        logger.error(f"Error in analyze_ui_traits: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Trait analysis failed: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/characters', methods=['GET'])
def get_characters():
    """
    Get all available AI character profiles
    """
    try:
        if analyzer:
            character_data = analyzer.get_all_character_profiles()
        else:
            # Fallback to direct import
            from personality_analyzer.character_data import get_all_characters
            characters = get_all_characters()
            character_data = {
                "characters": characters,
                "character_count": len(characters),
                "character_names": list(characters.keys())
            }
        
        return jsonify({
            "status": "success",
            **character_data
        })

    except Exception as e:
        logger.error(f"Error in get_characters: {e}")
        return jsonify({
            "error": f"Failed to retrieve characters: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/match_character', methods=['POST'])
def match_character():
    """
    Find best matching character for given text or traits
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No data provided",
                "status": "error"
            }), 400
        
        # Check if we have text or traits
        user_text = data.get('text')
        selected_traits = data.get('traits')
        mode = data.get('mode', 'general')
        
        if not user_text and not selected_traits:
            return jsonify({
                "error": "Either 'text' or 'traits' must be provided",
                "status": "error"
            }), 400
        
        if analyzer is None:
            # Use mock analysis for traits only
            if selected_traits:
                return analyze_ui_traits()
            else:
                return jsonify({
                    "error": "Text analysis requires model (not available). Please use trait selection instead.",
                    "status": "error"
                }), 503
        
        # Use real analyzer
        if user_text:
            analysis = analyzer.get_character_match_for_text(user_text, mode)
        else:
            analysis = analyzer.analyze_ui_traits(selected_traits, data.get('user_name', 'User'))
        
        analysis["status"] = "success"
        return jsonify(analysis)

    except Exception as e:
        logger.error(f"Error in match_character: {e}")
        return jsonify({
            "error": f"Character matching failed: {str(e)}",
            "status": "error"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "status": "error"
    }), 404

@app.route('/api/chat', methods=['POST'])
def chat_with_character():
    """
    Chat endpoint for character conversations
    Accepts: message, character_name, character_context, conversation_history
    Returns: character response
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                "error": "Missing 'message' field in request",
                "status": "error"
            }), 400
            
        user_message = data.get('message', '')
        character_name = data.get('character_name', 'TheBuilder')
        character_context = data.get('character_context', {})
        conversation_history = data.get('conversation_history', [])
        
        if not user_message.strip():
            return jsonify({
                "error": "Message cannot be empty",
                "status": "error"
            }), 400

        logger.info(f"Chat request for {character_name}: {user_message[:100]}...")

        # Import Claude API for character chat
        from personality_analyzer.claude_chat import generate_character_response
        
        response = generate_character_response(
            user_message=user_message,
            character_name=character_name,
            character_context=character_context,
            conversation_history=conversation_history
        )
        
        return jsonify({
            "status": "success",
            "response": response,
            "character_name": character_name,
            "timestamp": response.get("timestamp")
        })

    except Exception as e:
        logger.error(f"Error in chat_with_character: {e}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Chat failed: {str(e)}",
            "status": "error"
        }), 500

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "status": "error"
    }), 500

if __name__ == '__main__':
    print("🚀 Starting Elliot Personality Analyzer API...")
    print("📊 Available endpoints:")
    print("   GET  /                    - Health check")
    print("   POST /api/analyze         - General text analysis")
    print("   POST /api/quest           - Quest response analysis")
    print("   POST /api/analyze_traits  - UI trait analysis & character matching")
    print("   POST /api/match_character - Find matching character (text or traits)")
    print("   GET  /api/characters      - Get all available characters")
    print("   POST /api/generate_avatar - Avatar generation")
    print("   POST /api/chat            - Character chat conversations")
    print("")
    print("🎭 Loaded AI Characters:")
    try:
        if analyzer:
            characters = analyzer.get_all_character_profiles()
            for name in characters.get("character_names", []):
                print(f"   • {name}")
        else:
            print("   • Character loading pending model initialization...")
    except Exception as e:
        print(f"   • Error loading characters: {e}")
    
    app.run(debug=True, host='0.0.0.0', port=5001)