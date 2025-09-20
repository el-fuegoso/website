# Elliot Lee Interactive Portfolio

## 🌟 Live Experience
**[🚀 Meet Your Ideal El](https://elliot.earth)**

## ✨ What is this?

### 🎨 **Interactive Generative Art**
- Clean hero seciton based on https://www.thewayofcode.com/ from Rick Ruben and Anthropic

### 🤖 **Character Discovery**
The only person that knows what is going to work for them is themselves. I built a system where users can either customise the traits they want directly, or speak to a terminal window that uses a custom LLM head to analyise thier personality. With a few API calls the system generates the perfect El for you! 


### 🧠 **Personality Analysis**
Choose your preferred interaction style:
- **Simple Mode**: Adjust Big Five personality sliders to your desired traits
- **Terminal Mode**: Natural conversation that analyzes your personality with a custom LLM head. 

### 💬 **Character Chat**
Engage in live conversations with your matched "El" character powered by Claude AI - each with their own unique personality, speaking style, and expertise.

## 🏗️ Technical Architecture

### Frontend Stack
```
Three.js (r128)      → Dynamic 3D art experiences
GSAP (3.12.2)        → Smooth animations & transitions  
Vanilla JavaScript   → Modular component architecture
CSS3                 → Custom properties & responsive design
```

### AI Integration
```
Claude API           → Real-time character conversations
Hugging Face API     → Personality analysis via thoucentric/Big-Five-Personality-Traits-Detection
Streaming Responses  → Live conversation updates
Big Five Model       → Psychological personality framework
```

### Serverless Architecture
```
Vercel Functions     → API endpoints for Claude chat
Static Hosting       → GitHub Pages deployment
External APIs        → No backend server required
```


## 🛠️ Project Structure

```
website/
├── index.html                    # Main application
├── vercel.json                   # Serverless configuration
├── api/                          # Serverless functions
│   ├── claude.js                 # Main Claude API endpoint
│   ├── claude-stream.js          # Streaming responses
│   └── chat.js                   # Chat functionality
├── css/                          # Stylesheets
│   ├── main.css                  # Core styling
│   ├── avatar-cards.css          # Character interface
│   ├── conversation.css          # Chat system
│   └── trait-selector.css        # Personality selector
├── js/                           # Frontend modules
│   ├── main.js                   # Core application logic
│   ├── trait-selector.js         # Personality interface
│   ├── ocean-personality.js      # Big Five framework
│   └── conversation/             # Chat components
│       ├── chat-ui.js            # Modern chat interface
│       ├── claude-client.js      # API client
│       ├── conversation-manager.js # Message handling
│       └── avatar-generator.js   # Character utilities
└── images/                       # Project portfolio assets
    ├── 121-festival/             # Festival project
    ├── blackbird/                # VC platform
    ├── talent-army/              # Award-winning app
    └── ...                       # Additional projects
```

## 🎪 Character Personality System

### Big Five Traits Analysis
Each character has distinct personality patterns:
- **Openness**: Creativity, curiosity, innovation
- **Conscientiousness**: Organization, discipline, reliability  
- **Extraversion**: Energy, sociability, enthusiasm
- **Agreeableness**: Cooperation, empathy, teamwork
- **Neuroticism**: Emotional stability, stress response

## 🌐 API Integration

### Personality Analysis
```javascript
// Automatic analysis via HuggingFace API
const response = await fetch('https://api-inference.huggingface.co/models/thoucentric/Big-Five-Personality-Traits-Detection', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${HF_API_TOKEN}` },
    body: JSON.stringify({ inputs: userText })
});
```

### Character Chat
```javascript
// Streaming Claude conversations
const response = await fetch('/api/claude-stream', {
    method: 'POST',
    body: JSON.stringify({ 
        message: userMessage,
        character: selectedCharacter,
        personality: personalityScores
    })
});
```

## 🔮 What Makes This Special

- **No Complex Setup**: Static site with smart API integrations
- **Real AI Personalities**: Each character has distinct conversation patterns
- **Interactive Art**: Not just a portfolio - an experience
- **Professional + Playful**: Serious work showcased through engaging interactions
- **Personality-Driven**: Technology that adapts to who you are


MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Contact

**Elliot Lee**  
- 💼 LinkedIn: [elliot-james-lee](https://www.linkedin.com/in/elliot-james-lee)
- 📧 Email: elliotjameslee8@gmail.com
- 🌐 Portfolio: [el-fuegoso.github.io/website](https://el-fuegoso.github.io/website)

---

*Built with ❤️ and the belief that portfolios should be as unique as the people behind them.*
