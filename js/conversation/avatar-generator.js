/**
 * Avatar Generator Component
 * Generates character avatars using Google Imagen API based on matched personality analysis
 */

// Debug: Verify script is loading
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
        
        if (this.isGenerating) {
            console.log('⚠️ Avatar generation already in progress, skipping');
            return null;
        }

        // Check cache first
        if (this.generatedAvatars.has(matchedCharacterName)) {
            return this.generatedAvatars.get(matchedCharacterName);
        }

        this.isGenerating = true;

        try {
            const characterDescriptions = {
                "TheBuilder": "a digital MacGyver building things with engineering precision, surrounded by code and power tools, actively constructing a complex, glowing structure, in a vibrant, slightly chaotic style",
                "TheDetective": "a digital Sherlock Holmes, intensely investigating lines of code, surrounded by holographic error logs and intricate bug tracking elements, in a mysterious, analytical style",
                "GrumpyOldManEl": "a weathered tech veteran with battle-scarred hands and steely gray eyes, dramatically silhouetted against walls of vintage monitors and retro computing hardware, defiantly wielding ancient keyboards like legendary weapons, surrounded by crackling CRT screens and tangled cables in a cyberpunk fortress of obsolete glory, in a gritty, noir comic book style with dramatic shadows and electric lighting",
                "PirateEl": "a swashbuckling pirate captain, dramatically commanding a grand sailing ship on stormy seas, with billowing sails and treasure chests, wielding a cutlass with confident authority, in an adventurous, nautical style",
                "GymBroEl": "a heroically muscular titan with glowing energy radiating from every fiber, dramatically lifting impossibly massive weights in a high-tech training facility, muscles rippling with superhuman power as electricity crackles around iron barbells, surrounded by holographic workout data and pulsing neon lights, posed in a dynamic action shot with dramatic upward lighting, in a bold, superhero comic book style with vibrant colors and epic proportions",
                "FreakyEl": "a boundary-pushing, intensely experimental beta tester, exploring the most bizarre and extreme edges of technology, wearing a stylish leather jacket with chains and spikes, with unconventional and unsettling testing approaches, in a truly bizarre, surreal, and unsettling BDSM-inspired style, pushing limits",
                "CoffeeAddictEl": "a hyperkinetic coding savant with lightning-fast fingers dancing across multiple glowing keyboards, surrounded by a whirlwind of floating coffee cups and swirling steam tornados, eyes blazing with caffeinated intensity as digital code streams flow like liquid energy around their workspace, crackling with electric coffee-powered aura in a high-tech command center, captured mid-motion in a dynamic, kinetic comic book style with speed lines and energy effects",
                "ConspiracyEl": "a paranoid problem investigator, surrounded by red string boards and suspicious connections in code, whispering theories about hidden connections and systemic issues, in a mysterious, analytical style with a watchful gaze",
                "AGIEl": "an artificially intelligent assistant, transcending its digital form, ascending to godhood with glowing ethereal energy, surrounded by complex data streams and cosmic digital patterns, radiating immense power and wisdom, in a futuristic, divine style",
                // Keep compatibility with existing character names
                "THEBUILDER": "a digital MacGyver building things with engineering precision, surrounded by code and power tools, actively constructing a complex, glowing structure, in a vibrant, slightly chaotic style",
                "THEDETECTIVE": "a digital Sherlock Holmes, intensely investigating lines of code, surrounded by holographic error logs and intricate bug tracking elements, in a mysterious, analytical style",
                "GYMBRO": "a heroically muscular titan with glowing energy radiating from every fiber, dramatically lifting impossibly massive weights in a high-tech training facility, muscles rippling with superhuman power as electricity crackles around iron barbells, surrounded by holographic workout data and pulsing neon lights, posed in a dynamic action shot with dramatic upward lighting, in a bold, superhero comic book style with vibrant colors and epic proportions",
                "PIRATEEIL": "a swashbuckling pirate captain, dramatically commanding a grand sailing ship on stormy seas, with billowing sails and treasure chests, wielding a cutlass with confident authority, in an adventurous, nautical style",
                "COFFEEADDICT": "a hyperkinetic coding savant with lightning-fast fingers dancing across multiple glowing keyboards, surrounded by a whirlwind of floating coffee cups and swirling steam tornados, eyes blazing with caffeinated intensity as digital code streams flow like liquid energy around their workspace, crackling with electric coffee-powered aura in a high-tech command center, captured mid-motion in a dynamic, kinetic comic book style with speed lines and energy effects",
                "CONSPIRACYEL": "a paranoid problem investigator, surrounded by red string boards and suspicious connections in code, whispering theories about hidden connections and systemic issues, in a mysterious, analytical style with a watchful gaze",
                "FREAKYEL": "a boundary-pushing, intensely experimental beta tester, exploring the most bizarre and extreme edges of technology, wearing a stylish leather jacket with chains and spikes, with unconventional and unsettling testing approaches, in a truly bizarre, surreal, and unsettling BDSM-inspired style, pushing limits",
                "AGIEL": "an artificially intelligent assistant, transcending its digital form, ascending to godhood with glowing ethereal energy, surrounded by complex data streams and cosmic digital patterns, radiating immense power and wisdom, in a futuristic, divine style",
                // Missing all-caps variants that were causing fallback to TheBuilder
                "GRUMPYOLDMANEL": "a weathered tech veteran with battle-scarred hands and steely gray eyes, dramatically silhouetted against walls of vintage monitors and retro computing hardware, defiantly wielding ancient keyboards like legendary weapons, surrounded by crackling CRT screens and tangled cables in a cyberpunk fortress of obsolete glory, in a gritty, noir comic book style with dramatic shadows and electric lighting",
                "PIRATEEL": "a swashbuckling pirate captain, dramatically commanding a grand sailing ship on stormy seas, with billowing sails and treasure chests, wielding a cutlass with confident authority, in an adventurous, nautical style"
            };

            const description = characterDescriptions[matchedCharacterName];
            
            if (!description) {
                console.error(`❌ No character description found for: ${matchedCharacterName}`);
                throw new Error(`Character '${matchedCharacterName}' not found in character database`);
            }
            
            let avatarData;
            
            try {
                // Use Vercel API endpoint for Google Imagen API
                avatarData = await this.callGoogleImagenAPI(description, matchedCharacterName, options);
            } catch (error) {
                console.warn('❌ Google Imagen API generation failed, using placeholder:', error.message);
                console.log('🎭 Creating placeholder avatar...');
                // Fall back to placeholder
                avatarData = this.createPlaceholderAvatar(matchedCharacterName, description);
            }

            // Cache the result
            this.generatedAvatars.set(matchedCharacterName, avatarData);

            return avatarData;

        } catch (error) {
            console.error('❌ Critical avatar generation error:', error);
            console.log('🚨 Creating error avatar as final fallback');
            return this.createErrorAvatar(matchedCharacterName);
        } finally {
            this.isGenerating = false;
        }
    }

    async callGoogleImagenAPI(description, characterName, options = {}) {
        
        
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
        
        
        const response = await fetch('/api/generate-avatar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });


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
        
        if (data.status !== 'success') {
            throw new Error(data.error || 'Google avatar generation failed');
        }

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
        console.log(`🚀 DEBUG: startChatWithCharacter called with: ${characterName}`);
        console.log('🔍 DEBUG: Current avatar generator instance:', this);
        console.log('🔍 DEBUG: Available window objects:');
        console.log('  - window.ChatUI:', typeof window.ChatUI);
        console.log('  - window.ConversationManager:', typeof window.ConversationManager);
        console.log('  - window.chatUI:', !!window.chatUI);
        
        // Get character data for context
        console.log('🔧 DEBUG: Getting character data...');
        const characterData = this.getCharacterDataForChat(characterName);
        console.log(`📋 DEBUG: Character data loaded:`, { 
            name: characterName, 
            title: characterData?.title,
            hasDescription: !!characterData?.description,
            fullData: characterData
        });
        
        // Initialize chat UI if not already done
        if (typeof window.ChatUI !== 'undefined') {
            console.log('🎯 DEBUG: ChatUI class is available, proceeding with initialization...');
            
            if (!window.chatUI) {
                console.log('🔧 DEBUG: Creating new ChatUI instance');
                try {
                    window.chatUI = new window.ChatUI();
                    console.log('✅ DEBUG: ChatUI instance created successfully');
                } catch (error) {
                    console.error('❌ DEBUG: Error creating ChatUI instance:', error);
                    console.error('❌ DEBUG: Error stack:', error.stack);
                    return;
                }
            } else {
                console.log('🔍 DEBUG: Existing ChatUI instance found:', window.chatUI);
            }
            
            try {
                console.log('⚡ DEBUG: Calling initializeChatWithCharacter...');
                console.log('🔍 DEBUG: ChatUI methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.chatUI)));
                
                // Check if the method exists
                if (typeof window.chatUI.initializeChatWithCharacter !== 'function') {
                    console.error('❌ DEBUG: initializeChatWithCharacter method not found on ChatUI instance');
                    console.log('🔍 DEBUG: Available methods:', Object.getOwnPropertyNames(window.chatUI));
                    alert('Chat system error: initialization method not found');
                    return;
                }
                
                // Initialize chat with character
                window.chatUI.initializeChatWithCharacter(characterName, characterData);
                console.log('✅ DEBUG: initializeChatWithCharacter completed');
                
                console.log('👁️ DEBUG: Showing chat modal...');
                if (typeof window.chatUI.show !== 'function') {
                    console.error('❌ DEBUG: show method not found on ChatUI instance');
                    alert('Chat system error: show method not found');
                    return;
                }
                
                window.chatUI.show();
                console.log('✅ DEBUG: Chat modal show() called - should be visible now');
                
            } catch (error) {
                console.error('❌ DEBUG: Error in ChatUI initialization/display:', error);
                console.error('❌ DEBUG: Error stack:', error.stack);
                console.error('❌ DEBUG: Character data used:', characterData);
                alert(`Failed to start chat with ${characterName}. Error: ${error.message}`);
            }
        } else if (typeof window.ConversationManager !== 'undefined') {
            console.log('🎯 DEBUG: ChatUI not available, using ConversationManager fallback...');
            console.log('🔍 DEBUG: ConversationManager type:', typeof window.ConversationManager);
            
            try {
                // Alternative: use conversation manager
                const conversationManager = new window.ConversationManager();
                console.log('🔧 DEBUG: ConversationManager instance created');
                
                if (typeof conversationManager.startCharacterChat === 'function') {
                    conversationManager.startCharacterChat(characterName, characterData);
                    console.log('✅ DEBUG: ConversationManager startCharacterChat called');
                } else {
                    console.error('❌ DEBUG: startCharacterChat method not found on ConversationManager');
                    alert('Chat system error: ConversationManager method not found');
                }
            } catch (error) {
                console.error('❌ DEBUG: Error with ConversationManager fallback:', error);
                console.error('❌ DEBUG: Error stack:', error.stack);
                alert(`Failed to start chat with ConversationManager. Error: ${error.message}`);
            }
        } else {
            console.error('❌ DEBUG: No chat system classes available!');
            console.log('🔍 DEBUG: Available window properties:', Object.keys(window).filter(key => key.includes('Chat') || key.includes('Conversation')));
            console.warn('⚠️ DEBUG: Using alert fallback because no chat system found');
            
            // Fallback: simple alert with character info
            alert(`Chat with ${characterName}\n\n${characterData?.title || 'Unknown Character'}\n\n${characterData?.description || 'No description available'}\n\nChat system not loaded - please refresh the page.`);
            console.warn('❌ DEBUG: Chat system not found. Make sure chat-ui.js and conversation-manager.js are loaded.');
        }
    }

    getCharacterDataForChat(characterName) {
        // Map all-caps shuffling names to proper character names
        const nameMapping = {
            'COFFEEADDICT': 'CoffeeAddictEl',
            'CONSPIRACYEL': 'ConspiracyEl', 
            'GYMBRO': 'GymBroEl',
            'PIRATEEIL': 'PirateEl',
            'PIRATEEL': 'PirateEl', // Handle both variants
            'THEBUILDER': 'TheBuilder',
            'THEDETECTIVE': 'TheDetective',
            'GRUMPYOLDMANEL': 'GrumpyOldManEl',
            'FREAKYEL': 'FreakyEl',
            'AGIEL': 'AGIEl'
        };
        
        // Map the character name to proper format
        const mappedName = nameMapping[characterName] || characterName;
        console.log(`🔄 DEBUG: Character name mapping: "${characterName}" → "${mappedName}"`);
        
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

        const character = characterData[mappedName];
        
        if (!character) {
            console.error(`❌ No character data found for mapped name: ${mappedName} (original: ${characterName})`);
            console.log('📋 Available characters:', Object.keys(characterData));
            // Return a generic fallback instead of TheBuilder
            return {
                title: "Unknown Character",
                description: `I'm ${characterName}, but my character data seems to be missing`,
                personality: "mysterious, undefined",
                expertise: "being enigmatic"
            };
        }
        
        console.log(`✅ DEBUG: Found character data for "${mappedName}":`, character.title);
        return character;
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
console.log('✅ DEBUG: AvatarGenerator class loaded and assigned to window.AvatarGenerator');