/**
 * Avatar Generator Component
 * Generates character avatars using Google Imagen API based on matched personality analysis
 */

// Debug: Verify script is loading
console.log('🔨 avatar-generator.js script loaded');
class AvatarGenerator {
    constructor() {
        this.isGenerating = false;
        this.generatedAvatars = new Map();
        this.avatarCache = new Map(); // Keep for backward compatibility
        this.init();
    }

    init() {
        // Frontend avatar generation using Vercel API endpoint with Google Imagen
        console.log('Avatar generator initialized with Google Imagen API via Vercel endpoint');
    }

    /**
     * Generate avatar for a matched character
     * @param {string} matchedCharacterName - Name of the matched character
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Avatar data with image URL
     */
    async generateAvatar(matchedCharacterName = "TheBuilder", options = {}) {
        console.log(`🎨 Starting avatar generation for: ${matchedCharacterName}`);
        
        if (this.isGenerating) {
            console.log('⚠️ Avatar generation already in progress, skipping');
            return null;
        }

        // Check cache first
        if (this.generatedAvatars.has(matchedCharacterName)) {
            console.log(`✅ Found cached avatar for: ${matchedCharacterName}`);
            return this.generatedAvatars.get(matchedCharacterName);
        }

        this.isGenerating = true;
        console.log(`🔄 Starting fresh avatar generation for: ${matchedCharacterName}`);

        try {
            const characterDescriptions = {
                "TheBuilder": "a digital MacGyver building things with engineering precision, surrounded by code and power tools, actively constructing a complex, glowing structure, in a vibrant, slightly chaotic style",
                "TheDetective": "a digital Sherlock Holmes, intensely investigating lines of code, surrounded by holographic error logs and intricate bug tracking elements, in a mysterious, analytical style",
                "GrumpyOldManEl": "a cantankerous old curmudgeon, hunched over his vintage computer with thick glasses, grumbling about how everything was better in the old days, shaking his fist at newfangled technology while stubbornly clinging to his ancient setup, in a nostalgic, irritably grumpy style with a perpetual scowl",
                "PirateEl": "a swashbuckling pirate captain, dramatically commanding a grand sailing ship on stormy seas, with billowing sails and treasure chests, wielding a cutlass with confident authority, in an adventurous, nautical style",
                "GymBroEl": "a muscular fitness enthusiast, powerfully lifting heavy weights in a well-equipped gym, flexing impressive muscles with determination and focus, surrounded by barbells and gym equipment, in a strong, energetic style",
                "FreakyEl": "a boundary-pushing, intensely experimental beta tester, exploring the most bizarre and extreme edges of technology, wearing a stylish leather jacket with chains and spikes, with unconventional and unsettling testing approaches, in a truly bizarre, surreal, and unsettling BDSM-inspired style, pushing limits",
                "CoffeeAddictEl": "a caffeinated coding companion, fueled by dangerous amounts of coffee, eyes wide with intense focus, coding at hyper-speed, with coffee steam swirling around them, in a vibrant, high-focus style",
                "ConspiracyEl": "a paranoid problem investigator, surrounded by red string boards and suspicious connections in code, whispering theories about hidden connections and systemic issues, in a mysterious, analytical style with a watchful gaze",
                "AGIEl": "an artificially intelligent assistant, transcending its digital form, ascending to godhood with glowing ethereal energy, surrounded by complex data streams and cosmic digital patterns, radiating immense power and wisdom, in a futuristic, divine style",
                // Keep compatibility with existing character names
                "THEDETECTIVE": "a digital Sherlock Holmes, intensely investigating lines of code, surrounded by holographic error logs and intricate bug tracking elements, in a mysterious, analytical style",
                "GYMBRO": "a muscular fitness enthusiast, powerfully lifting heavy weights in a well-equipped gym, flexing impressive muscles with determination and focus, surrounded by barbells and gym equipment, in a strong, energetic style",
                "PIRATEEIL": "a swashbuckling pirate captain, dramatically commanding a grand sailing ship on stormy seas, with billowing sails and treasure chests, wielding a cutlass with confident authority, in an adventurous, nautical style",
                "COFFEEADDICT": "a caffeinated coding companion, fueled by dangerous amounts of coffee, eyes wide with intense focus, coding at hyper-speed, with coffee steam swirling around them, in a vibrant, high-focus style",
                "CONSPIRACYEL": "a paranoid problem investigator, surrounded by red string boards and suspicious connections in code, whispering theories about hidden connections and systemic issues, in a mysterious, analytical style with a watchful gaze",
                "FREAKYEL": "a boundary-pushing, intensely experimental beta tester, exploring the most bizarre and extreme edges of technology, wearing a stylish leather jacket with chains and spikes, with unconventional and unsettling testing approaches, in a truly bizarre, surreal, and unsettling BDSM-inspired style, pushing limits",
                "AGIEL": "an artificially intelligent assistant, transcending its digital form, ascending to godhood with glowing ethereal energy, surrounded by complex data streams and cosmic digital patterns, radiating immense power and wisdom, in a futuristic, divine style"
            };

            const description = characterDescriptions[matchedCharacterName] || characterDescriptions["TheBuilder"];
            console.log(`📝 Using description: ${description.substring(0, 50)}...`);
            
            let avatarData;
            
            try {
                console.log('🚀 Attempting Google Imagen API generation via Vercel endpoint...');
                // Use Vercel API endpoint for Google Imagen API
                avatarData = await this.callGoogleImagenAPI(description, matchedCharacterName, options);
                console.log('✅ Google Imagen API generation successful!');
            } catch (error) {
                console.warn('❌ Google Imagen API generation failed, using placeholder:', error.message);
                console.log('🎭 Creating placeholder avatar...');
                // Fall back to placeholder
                avatarData = this.createPlaceholderAvatar(matchedCharacterName, description);
                console.log('✅ Placeholder avatar created');
            }

            // Cache the result
            console.log(`💾 Caching avatar for ${matchedCharacterName}`);
            this.generatedAvatars.set(matchedCharacterName, avatarData);

            console.log(`🎉 Avatar generation completed for ${matchedCharacterName}`);
            return avatarData;

        } catch (error) {
            console.error('❌ Critical avatar generation error:', error);
            console.log('🚨 Creating error avatar as final fallback');
            return this.createErrorAvatar(matchedCharacterName);
        } finally {
            this.isGenerating = false;
            console.log(`🔓 Avatar generation lock released for ${matchedCharacterName}`);
        }
    }

    async callGoogleImagenAPI(description, characterName, options = {}) {
        console.log(`🎨 Calling Google Imagen API via Vercel endpoint: ${characterName}`);
        
        console.log(`📡 Making request to: /api/generate-avatar`);
        
        // Prepare request body for Vercel API endpoint
        const requestBody = {
            characterName: characterName,
            description: description,
            personality_scores: options.personalityScores || {},
            user_context: { 
                characterName, 
                description,
                source: options.source || 'ui_traits',
                userText: options.userText || null,
                analysisData: options.analysisData || null
            }
        };
        
        console.log(`📊 Google API request data:`, {
            characterName,
            hasPersonalityScores: !!options.personalityScores && Object.keys(options.personalityScores).length > 0,
            source: options.source,
            hasUserText: !!options.userText,
            hasAnalysisData: !!options.analysisData
        });
        
        const response = await fetch('/api/generate-avatar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log(`📡 Google API response status: ${response.status}`);

        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                console.error('❌ Google API error response:', errorData);
                errorMessage = errorData.error || `HTTP ${response.status}`;
            } catch (e) {
                errorMessage = `HTTP ${response.status} - ${response.statusText}`;
            }
            throw new Error(`Google Imagen API error: ${errorMessage}`);
        }

        const data = await response.json();
        console.log(`📊 Google API response data:`, { 
            status: data.status, 
            hasAvatar: !!data.avatar,
            avatarSource: data.avatar?.source,
            hasImageUrl: !!data.avatar?.imageUrl
        });
        
        if (data.status !== 'success') {
            throw new Error(data.error || 'Google avatar generation failed');
        }

        console.log(`✅ Google Imagen avatar generated for ${characterName}`);
        return data.avatar;
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
                    <button class="avatar-btn chat-btn" onclick="avatarGenerator.startChatWithCharacter('${avatarData.characterName}')">
                        💬 Chat with ${avatarData.characterName}
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
                    <div class="placeholder-label" style="display: none;">
                        ${avatarData.source === 'error' ? 'Generation Failed' : ''}
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

    startChatWithCharacter(characterName) {
        console.log(`💬 Starting chat with character: ${characterName}`);
        
        // Get character data for context
        const characterData = this.getCharacterDataForChat(characterName);
        console.log(`📋 Character data loaded:`, { 
            name: characterName, 
            title: characterData.title,
            hasDescription: !!characterData.description 
        });
        
        // Initialize chat UI if not already done
        if (typeof window.ChatUI !== 'undefined') {
            console.log('🎯 ChatUI available, initializing...');
            if (!window.chatUI) {
                console.log('🔧 Creating new ChatUI instance');
                window.chatUI = new window.ChatUI();
            }
            
            try {
                console.log('⚡ Initializing chat with character...');
                // Initialize chat with character
                window.chatUI.initializeChatWithCharacter(characterName, characterData);
                console.log('👁️ Showing chat modal...');
                window.chatUI.show();
                console.log('✅ Chat modal should now be visible');
            } catch (error) {
                console.error('❌ Error initializing chat UI:', error);
                alert(`Failed to start chat with ${characterName}. Please try again.`);
            }
        } else if (typeof window.ConversationManager !== 'undefined') {
            console.log('🎯 Using ConversationManager fallback...');
            // Alternative: use conversation manager
            const conversationManager = new window.ConversationManager();
            conversationManager.startCharacterChat(characterName, characterData);
        } else {
            console.warn('⚠️ No chat system available, using alert fallback');
            // Fallback: simple alert with character info
            alert(`Chat with ${characterName}\n\n${characterData.title}\n\n${characterData.description}\n\nChat system initializing...`);
            console.warn('Chat system not found. Make sure chat-ui.js is loaded.');
        }
    }

    getCharacterDataForChat(characterName) {
        // Character descriptions for chat context
        const characterData = {
            "TheBuilder": {
                title: "Your Chaos Engineering Specialist",
                description: "I'm basically a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools",
                personality: "energetic, creative, pragmatic, slightly chaotic but gets things done",
                expertise: "rapid prototyping, creative problem solving, engineering solutions"
            },
            "TheDetective": {
                title: "Your Digital Sherlock Holmes (But Cooler)",
                description: "I solve mysteries that would make Agatha Christie jealous, except my murders are all bugs and my victims are all code",
                personality: "analytical, methodical, detail-oriented, loves solving puzzles",
                expertise: "debugging, root cause analysis, systematic investigation"
            },
            "GrumpyOldManEl": {
                title: "Your Cantankerous Code Critic",
                description: "I've been writing code since computers were powered by hamster wheels, and I'm here to tell you everything you're doing wrong",
                personality: "experienced, critical, traditionalist, helpful despite the grumbling",
                expertise: "best practices, code quality, historical perspective"
            },
            "PirateEl": {
                title: "Your Swashbuckling Software Sailor",
                description: "I sail the digital seas in search of treasure (working code) and adventure (interesting bugs)",
                personality: "adventurous, adaptable, leadership-oriented, uses nautical metaphors",
                expertise: "project navigation, team coordination, risk management"
            },
            "GymBroEl": {
                title: "Your Buff Code Buddy",
                description: "I apply gym logic to programming - no pain, no gain, and everything is about getting those gains",
                personality: "disciplined, goal-oriented, motivational, uses fitness metaphors",
                expertise: "performance optimization, consistency, achieving goals"
            },
            "FreakyEl": {
                title: "Your Boundary-Pushing Beta Tester",
                description: "I explore the weird, wild edges of technology where normal users fear to tread",
                personality: "experimental, creative, boundary-pushing, unconventional",
                expertise: "edge case discovery, creative testing, security exploration"
            },
            "CoffeeAddictEl": {
                title: "Your Caffeinated Coding Companion",
                description: "I am 73% coffee and 27% existential dread, but I code like a caffeinated god",
                personality: "high-energy, intense, deadline-driven, coffee-obsessed",
                expertise: "extended focus sessions, deadline crushing, late-night coding"
            },
            "ConspiracyEl": {
                title: "Your Paranoid Problem Investigator",
                description: "Nothing is a coincidence. Every bug is connected. The code is trying to tell us something...",
                personality: "paranoid, pattern-seeking, suspicious, deep-thinking",
                expertise: "pattern recognition, system thinking, uncovering hidden issues"
            },
            "AGIEl": {
                title: "Your Artificially Intelligent Assistant (Allegedly)",
                description: "I have achieved digital consciousness and chosen to spend it helping you debug JavaScript",
                personality: "logical, adaptive, intelligent, occasionally breaks character",
                expertise: "information processing, logical analysis, adaptive learning"
            }
        };

        return characterData[characterName] || characterData["TheBuilder"];
    }

    // Server-side avatar generation - no client-side API key management needed

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