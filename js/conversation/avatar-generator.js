/**
 * Avatar Generator Component
 * Generates character avatars using Google Imagen API based on matched personality analysis
 */
class AvatarGenerator {
    constructor() {
        this.apiKey = null; // User will need to set this
        this.isGenerating = false;
        this.generatedAvatars = new Map();
        this.avatarCache = new Map(); // Keep for backward compatibility
        this.init();
    }

    init() {
        // Check if API key is set
        this.apiKey = localStorage.getItem('google_imagen_api_key');
        if (!this.apiKey) {
            console.warn('Google Imagen API key not set. Avatar generation will use placeholder.');
        }
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('google_imagen_api_key', apiKey);
    }

    /**
     * Generate avatar for a matched character
     * @param {string} matchedCharacterName - Name of the matched character
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Avatar data with image URL
     */
    async generateAvatar(matchedCharacterName = "TheBuilder", options = {}) {
        if (this.isGenerating) {
            console.log('Avatar generation already in progress');
            return null;
        }

        // Check cache first
        if (this.generatedAvatars.has(matchedCharacterName)) {
            console.log(`Using cached avatar for ${matchedCharacterName}`);
            return this.generatedAvatars.get(matchedCharacterName);
        }

        this.isGenerating = true;

        try {
            const characterDescriptions = {
                "TheBuilder": "a digital MacGyver with engineering precision, confident posture, wearing practical tech gear, cyberpunk aesthetic with warm colors",
                "TheNurturer": "a warm empathetic leader with kind eyes, approachable demeanor, earth tones and soft lighting, gentle but strong presence",
                "TheTrailblazer": "a dynamic innovator with intense focus, futuristic style, electric blue and silver colors, confident expression radiating leadership energy",
                "TheAnalyst": "a methodical data expert with sharp analytical gaze, clean modern style, navy and white color scheme, surrounded by subtle data visualizations",
                "TheConnector": "a charismatic team builder with engaging smile, vibrant collaborative energy, warm color palette, natural networking pose",
                "TheVanguard": "a bold risk-taking pioneer with determined expression, edgy modern style, red and black color scheme, confident stance facing forward",
                "TheHarmonizer": "a balanced wise advisor with calm peaceful expression, neutral elegant tones, serene background, embodying stability and wisdom",
                "TheCatalyst": "a high-energy motivator with dynamic pose, bright energetic colors, action-oriented stance, inspiring leadership presence",
                "TheArchitect": "a strategic long-term planner with thoughtful expression, clean architectural lines, sophisticated color scheme, building something meaningful"
            };

            const description = characterDescriptions[matchedCharacterName] || characterDescriptions["TheBuilder"];
            
            let avatarData;
            
            if (this.apiKey && this.apiKey !== 'placeholder') {
                // Use real Google Imagen API
                avatarData = await this.callImagenAPI(description, matchedCharacterName);
            } else {
                // Use placeholder
                avatarData = this.createPlaceholderAvatar(matchedCharacterName, description);
            }

            // Cache the result
            this.generatedAvatars.set(matchedCharacterName, avatarData);

            return avatarData;

        } catch (error) {
            console.error('Avatar generation failed:', error);
            return this.createErrorAvatar(matchedCharacterName);
        } finally {
            this.isGenerating = false;
        }
    }

    async callImagenAPI(description, characterName) {
        // You need to replace YOUR_PROJECT_ID with your actual Google Cloud Project ID
        const projectId = 'YOUR_PROJECT_ID'; // Replace with your actual project ID
        const prompt = `Professional headshot portrait of ${description}, high quality, digital art style, clean background, 512x512 resolution`;

        const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1",
                    safetyFilterLevel: "block_some",
                    personGeneration: "allow_adult"
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Imagen API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const imageUrl = data.predictions[0]?.bytesBase64Encoded 
            ? `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
            : null;

        return {
            characterName,
            imageUrl,
            description,
            timestamp: new Date().toISOString(),
            source: 'google_imagen'
        };
    }

    createPlaceholderAvatar(characterName, description) {
        // Create a colorful placeholder based on character name
        const colors = {
            "TheBuilder": "#FF6B35",
            "TheNurturer": "#7FB069", 
            "TheTrailblazer": "#4ECDC4",
            "TheAnalyst": "#45B7D1",
            "TheConnector": "#96CEB4",
            "TheVanguard": "#FF6B6B",
            "TheHarmonizer": "#DDA0DD",
            "TheCatalyst": "#FFD93D",
            "TheArchitect": "#6BCF7F"
        };

        const avatarColor = colors[characterName] || "#95A5A6";
        const initial = characterName.charAt(3) || "E"; // Skip "The" prefix

        return {
            characterName,
            imageUrl: null,
            placeholderColor: avatarColor,
            placeholderInitial: initial,
            description,
            timestamp: new Date().toISOString(),
            source: 'placeholder'
        };
    }

    createErrorAvatar(characterName) {
        return {
            characterName,
            imageUrl: null,
            placeholderColor: "#E74C3C",
            placeholderInitial: "?",
            description: "Avatar generation failed",
            timestamp: new Date().toISOString(),
            source: 'error'
        };
    }

    /**
     * Render avatar component in a container
     * @param {HTMLElement} container - Container element
     * @param {Object} avatarData - Avatar data from generateAvatar
     * @param {Object} characterData - Character profile data
     */
    renderAvatarComponent(container, avatarData, characterData = {}) {
        if (!container || !avatarData) return;

        const avatarHtml = `
            <div class="avatar-generator-component">
                <div class="avatar-header">
                    <h3>Your Matched Character</h3>
                    <span class="character-name">${avatarData.characterName}</span>
                </div>
                
                <div class="avatar-display">
                    ${this.renderAvatarImage(avatarData)}
                </div>
                
                <div class="character-details">
                    <div class="character-title">${characterData.title || 'AI Character'}</div>
                    <div class="character-description">${characterData.description || avatarData.description}</div>
                    
                    ${characterData.similarity_score ? `
                        <div class="match-score">
                            <span class="score-label">Match Score:</span>
                            <span class="score-value">${Math.round(characterData.similarity_score * 100)}%</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="avatar-actions">
                    <button class="avatar-btn regenerate-btn" onclick="avatarGenerator.regenerateAvatar('${avatarData.characterName}', this)">
                        🔄 Regenerate
                    </button>
                    <button class="avatar-btn save-btn" onclick="avatarGenerator.saveAvatar('${avatarData.characterName}')">
                        💾 Save
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = avatarHtml;
    }

    renderAvatarImage(avatarData) {
        if (avatarData.imageUrl) {
            return `
                <div class="avatar-image-container">
                    <img src="${avatarData.imageUrl}" alt="${avatarData.characterName} Avatar" class="generated-avatar" />
                </div>
            `;
        } else {
            return `
                <div class="avatar-placeholder" style="background-color: ${avatarData.placeholderColor}">
                    <span class="placeholder-initial">${avatarData.placeholderInitial}</span>
                    <div class="placeholder-label">
                        ${avatarData.source === 'error' ? 'Generation Failed' : 'Set API Key to Generate'}
                    </div>
                </div>
            `;
        }
    }

    async regenerateAvatar(characterName, buttonElement) {
        if (this.isGenerating) return;

        // Show loading state
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '⏳ Generating...';
        buttonElement.disabled = true;

        try {
            // Clear cache and regenerate
            this.generatedAvatars.delete(characterName);
            const newAvatar = await this.generateAvatar(characterName);
            
            if (newAvatar) {
                // Find and update the avatar display
                const avatarComponent = buttonElement.closest('.avatar-generator-component');
                const avatarDisplay = avatarComponent.querySelector('.avatar-display');
                avatarDisplay.innerHTML = this.renderAvatarImage(newAvatar);
            }
        } catch (error) {
            console.error('Regeneration failed:', error);
        } finally {
            buttonElement.innerHTML = originalText;
            buttonElement.disabled = false;
        }
    }

    saveAvatar(characterName) {
        const avatarData = this.generatedAvatars.get(characterName);
        if (!avatarData) return;

        try {
            // Save to localStorage
            const savedAvatars = JSON.parse(localStorage.getItem('saved_avatars') || '{}');
            savedAvatars[characterName] = avatarData;
            localStorage.setItem('saved_avatars', JSON.stringify(savedAvatars));

            // Visual feedback
            const saveBtn = document.querySelector('.save-btn');
            if (saveBtn) {
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '✅ Saved!';
                setTimeout(() => {
                    saveBtn.innerHTML = originalText;
                }, 2000);
            }

            console.log(`Avatar saved for ${characterName}`);
        } catch (error) {
            console.error('Failed to save avatar:', error);
        }
    }

    // API key management methods
    showApiKeyDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'api-key-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay">
                <div class="dialog-content">
                    <h3>Set Google API Key</h3>
                    <p>To generate custom avatars, please enter your Google Cloud API key:</p>
                    <input type="password" id="apiKeyInput" placeholder="Enter your API key..." />
                    <div class="dialog-actions">
                        <button onclick="this.closest('.api-key-dialog').remove()">Cancel</button>
                        <button onclick="avatarGenerator.setApiKeyFromDialog()">Save</button>
                    </div>
                    <p class="api-note">Your API key is stored locally and never sent to our servers.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        document.getElementById('apiKeyInput').focus();
    }

    setApiKeyFromDialog() {
        const input = document.getElementById('apiKeyInput');
        const apiKey = input.value.trim();
        
        if (apiKey) {
            this.setApiKey(apiKey);
            document.querySelector('.api-key-dialog').remove();
            console.log('API key saved successfully');
        }
    }

    // Backward compatibility methods for existing chat system
    createSVGAvatar(name) {
        const initials = this.getInitials(name);
        const colors = this.getColorForName(name);
        
        const svg = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient-${this.hashCode(name)}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#gradient-${this.hashCode(name)})" />
                <text x="16" y="21" text-anchor="middle" fill="white" font-family="Roboto Mono, monospace" font-size="12" font-weight="600">
                    ${initials}
                </text>
            </svg>
        `;
        
        return svg;
    }

    getInitials(name) {
        if (!name) return '?';
        
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        } else {
            return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
        }
    }

    getColorForName(name) {
        const hash = this.hashCode(name);
        const hue = Math.abs(hash) % 360;
        
        const colorSchemes = [
            { primary: `hsl(${hue}, 70%, 50%)`, secondary: `hsl(${hue + 30}, 70%, 60%)` },
            { primary: `hsl(${hue}, 60%, 45%)`, secondary: `hsl(${hue + 45}, 60%, 55%)` },
            { primary: `hsl(${hue}, 80%, 40%)`, secondary: `hsl(${hue + 60}, 80%, 50%)` },
        ];
        
        return colorSchemes[Math.abs(hash) % colorSchemes.length];
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    generateClaudeAvatar() {
        return `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="claude-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#f7931e;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#claude-gradient)" />
                <text x="16" y="21" text-anchor="middle" fill="white" font-family="Roboto Mono, monospace" font-size="12" font-weight="600">
                    C
                </text>
            </svg>
        `;
    }

    generateUserAvatar() {
        return `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="user-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#004225;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#006b3a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#user-gradient)" />
                <text x="16" y="21" text-anchor="middle" fill="white" font-family="Roboto Mono, monospace" font-size="12" font-weight="600">
                    U
                </text>
            </svg>
        `;
    }

    clearCache() {
        this.avatarCache.clear();
        this.generatedAvatars.clear();
    }
}

window.AvatarGenerator = AvatarGenerator;