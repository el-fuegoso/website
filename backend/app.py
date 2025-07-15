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

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "status": "error"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "status": "error"
    }), 500

if __name__ == '__main__':
    print("🚀 Starting Elliot Personality Analyzer API...")
    print("📊 Available endpoints:")
    print("   GET  /              - Health check")
    print("   POST /api/analyze   - General text analysis")
    print("   POST /api/quest     - Quest response analysis")
    print("   POST /api/generate_avatar - Avatar generation")
    
    app.run(debug=True, host='0.0.0.0', port=5000)