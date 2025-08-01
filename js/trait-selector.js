// Trait Selector JavaScript - Interactive avatar generation interface

/**
 * Terminal Cursor System - Production Implementation
 * 
 * Usage:
 * const cursor = new TerminalCursor('terminalInput', 'terminalCursor');
 * 
 * HTML Structure:
 * <div class="prompt-line">
 *     <span class="prompt">user@terminal ~ %</span>
 *     <div class="input-wrapper">
 *         <input type="text" class="terminal-input" id="terminalInput">
 *         <span class="terminal-cursor" id="terminalCursor"></span>
 *     </div>
 * </div>
 */
class TerminalCursor {
    constructor(inputId, cursorId, options = {}) {
        this.input = document.getElementById(inputId);
        this.cursor = document.getElementById(cursorId);
        
        if (!this.input || !this.cursor) {
            throw new Error('Input or cursor element not found');
        }
        
        // Configuration
        this.options = {
            fallbackToDom: true,
            debugMode: false,
            fontLoadTimeout: 1000,
            ...options
        };
        
        // Create canvas for text measurement
        this.canvas = document.createElement('canvas');
        this.measureContext = this.canvas.getContext('2d');
        
        // Initialize system
        this.initialize();
    }
    
    initialize() {
        this.setupFont();
        this.setupEvents();
        this.updateCursorPosition();
        
        // Test font loading
        if (this.options.fontLoadTimeout > 0) {
            setTimeout(() => this.verifyFontLoading(), this.options.fontLoadTimeout);
        }
        
        this.log('Terminal cursor system initialized');
    }
    
    setupFont() {
        // Get computed style from input element
        const computedStyle = window.getComputedStyle(this.input);
        
        // Set canvas font to match input exactly (debug tool format)
        this.measureContext.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        
        this.log(`Font configured: ${this.measureContext.font}`);
        
        // Verify font loading like debug tool
        this.verifyFontLoading();
    }
    
    setupEvents() {
        // Core events for cursor positioning
        const events = [
            'input',     // Text changes
            'keyup',     // Key releases
            'paste',     // Paste operations
            'click',     // Mouse clicks
            'cut',       // Cut operations
            'focus',     // Focus changes
            'keydown'    // For navigation keys
        ];
        
        events.forEach(eventType => {
            this.input.addEventListener(eventType, (event) => {
                this.log(`Event: ${eventType} - Key: ${event.key || 'N/A'} - Target value length: ${event.target.value.length}`);
                
                // Skip Enter key processing - let Terminal class handle it
                if (eventType === 'keydown' && event.key === 'Enter') {
                    return;
                }
                
                if (eventType === 'keydown' && this.isNavigationKey(event.key)) {
                    // Navigation keys need delayed update (debug tool method)
                    setTimeout(() => this.updateCursorPosition(), 0);
                } else {
                    // Immediate update for other events
                    this.updateCursorPosition();
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupFont(); // Recalculate font in case of zoom changes
            this.updateCursorPosition();
        });
    }
    
    isNavigationKey(key) {
        return ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key);
    }
    
    updateCursorPosition() {
        try {
            // Ensure input has focus for accurate selectionStart (debug tool method)
            if (document.activeElement !== this.input) {
                return; // Don't update if input doesn't have focus
            }
            
            const cursorPosition = this.input.selectionStart || 0;
            const textToCursor = this.input.value.substring(0, cursorPosition);
            
            this.log(`Cursor position: ${cursorPosition}, Text to cursor: "${textToCursor}"`);
            
            // Canvas measurement
            const canvasWidth = this.measureTextCanvas(textToCursor);
            
            // DOM measurement fallback
            const domWidth = this.measureTextDOM(textToCursor);
            
            // Use canvas measurement primarily, fall back to DOM if needed
            let textWidth = canvasWidth;
            if ((textWidth === 0 || this.options.fallbackToDom) && textToCursor.length > 0) {
                if (domWidth > textWidth) {
                    textWidth = domWidth;
                    this.log(`Using DOM measurement: ${domWidth.toFixed(2)}px`);
                }
            }
            
            // Position cursor
            this.cursor.style.left = `${textWidth}px`;
            
            this.log(`Cursor positioned at ${textWidth.toFixed(2)}px for position ${cursorPosition}`);
            
        } catch (error) {
            this.log(`Error updating cursor position: ${error.message}`, 'error');
            
            // Fallback positioning
            this.cursor.style.left = '0px';
        }
    }
    
    measureTextCanvas(text) {
        try {
            if (!text) return 0;
            
            // Update canvas font each time (debug tool approach)
            const computedStyle = window.getComputedStyle(this.input);
            this.measureContext.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
            
            const metrics = this.measureContext.measureText(text);
            
            // Use bounding box for better accuracy if available
            if (typeof metrics.actualBoundingBoxLeft === 'number' && 
                typeof metrics.actualBoundingBoxRight === 'number') {
                return Math.abs(metrics.actualBoundingBoxLeft) + 
                       Math.abs(metrics.actualBoundingBoxRight);
            }
            
            // Fallback to basic width
            return metrics.width;
            
        } catch (error) {
            this.log(`Canvas measurement failed: ${error.message}`, 'error');
            return 0;
        }
    }
    
    measureTextDOM(text) {
        try {
            if (!text) return 0;
            
            const measureElement = document.createElement('span');
            const computedStyle = window.getComputedStyle(this.input);
            
            // Copy all relevant font properties (debug tool approach)
            measureElement.style.fontFamily = computedStyle.fontFamily;
            measureElement.style.fontSize = computedStyle.fontSize;
            measureElement.style.fontWeight = computedStyle.fontWeight;
            measureElement.style.fontStyle = computedStyle.fontStyle;
            measureElement.style.letterSpacing = computedStyle.letterSpacing;
            measureElement.style.wordSpacing = computedStyle.wordSpacing;
            measureElement.style.textTransform = computedStyle.textTransform;
            
            // Positioning and visibility (debug tool method)
            measureElement.style.position = 'absolute';
            measureElement.style.visibility = 'hidden';
            measureElement.style.whiteSpace = 'pre';
            measureElement.style.left = '-9999px';
            measureElement.style.top = '-9999px';
            
            measureElement.textContent = text || ' ';
            
            document.body.appendChild(measureElement);
            const width = measureElement.getBoundingClientRect().width;
            document.body.removeChild(measureElement);
            
            return width;
            
        } catch (error) {
            this.log(`DOM measurement failed: ${error.message}`, 'error');
            return 0;
        }
    }
    
    verifyFontLoading() {
        // Test with a known monospace character (debug tool method)
        const testMetrics = this.measureContext.measureText('M');
        const testWidth = testMetrics.width;
        
        this.log(`Test character 'M' width: ${testWidth}`);
        
        // Expected width for Roboto Mono 12px 'M' is approximately 7.2px
        const expectedWidth = 7.2;
        const difference = Math.abs(testWidth - expectedWidth);
        
        if (difference > 2) {
            this.log(`Font may not be loaded correctly. Expected ~${expectedWidth}px, got ${testWidth}px`, 'warning');
        } else {
            this.log(`Font appears to be loaded correctly.`);
        }
    }
    
    // Public API methods
    refresh() {
        this.setupFont();
        this.updateCursorPosition();
    }
    
    destroy() {
        // Remove event listeners (simplified - in production you'd store references)
        this.input.replaceWith(this.input.cloneNode(true));
        this.log('Terminal cursor system destroyed');
    }
    
    // Utility methods
    log(message, level = 'info') {
        if (this.options.debugMode) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[${timestamp}] TerminalCursor ${level.toUpperCase()}:`;
            
            if (level === 'error') {
                console.error(prefix, message);
            } else if (level === 'warning') {
                console.warn(prefix, message);
            } else {
                console.log(prefix, message);
            }
        }
    }
    
    // Get current cursor position info (for debugging - debug tool method)
    getInfo() {
        const cursorPosition = this.input.selectionStart || 0;
        const textToCursor = this.input.value.substring(0, cursorPosition);
        const canvasWidth = this.measureTextCanvas(textToCursor);
        const domWidth = this.measureTextDOM(textToCursor);
        
        return {
            cursorPosition,
            textToCursor,
            canvasWidth,
            domWidth,
            currentLeft: this.cursor.style.left,
            inputFocus: document.activeElement === this.input,
            inputValue: this.input.value
        };
    }
    
    // Test measurement methods (debug tool functionality)
    testMeasurement() {
        this.log('Testing measurement accuracy...');
        
        const testStrings = ['M', 'MM', 'MMM', 'Hello', 'Hello World', '█'];
        
        testStrings.forEach(str => {
            const canvasWidth = this.measureTextCanvas(str);
            const domWidth = this.measureTextDOM(str);
            const difference = Math.abs(canvasWidth - domWidth);
            
            this.log(`"${str}": Canvas=${canvasWidth.toFixed(2)}px, DOM=${domWidth.toFixed(2)}px, Diff=${difference.toFixed(2)}px`);
        });
    }
}

// Terminal interface class - Claude Code style with Elliot
class Terminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = null; // Will be created dynamically
        this.isProcessing = false;
        this.conversationHistory = [];
        this.questMode = false;
        this.currentQuestion = 0;
        this.userResponses = [];
        this.hasGeneratedAvatar = false;
        this.terminalCursor = null; // TerminalCursor instance
        this.init();
        
        // Questions for quest mode
        this.questions = [
            "What's your name, and what do you do for work?",
            "What's something you've been working on lately that you're genuinely excited about?",
            "If you could have dinner with anyone (dead or alive), who would it be and what would you want to talk about?",
            "What kind of impact do you hope to make in your work or the world?"
        ];
    }

    init() {
        // Welcome message will be shown when entering terminal mode
    }
    
    showWelcomeMessage() {
        // Clear existing content first
        if (this.output) {
            this.output.innerHTML = '';
        }
        
        // Add ELLIOT ASCII art with animation delay using Unicode blocks
        const elliotLines = [
            '███████ ██      ██      ██  ██████  ████████',
            '██      ██      ██      ██ ██    ██    ██   ',
            '█████   ██      ██      ██ ██    ██    ██   ',
            '██      ██      ██      ██ ██    ██    ██   ',
            '███████ ███████ ███████ ██  ██████     ██   '
        ];
        
        elliotLines.forEach((line, index) => {
            setTimeout(() => {
                this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace; letter-spacing: 0; white-space: pre; line-height: 1;">${line}</span>`);
            }, index * 20);
        });
        
        // Add divider and instructions after ASCII art
        setTimeout(() => {
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace; font-weight: bold;">PERSONA GENERATOR | Custom Neural Architecture</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">════════════════════════════════════════════════════════════</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #61dafb; font-family: 'Roboto Mono', monospace; font-weight: bold;">Chat naturally - I'll analyze your responses to create your personalized avatar</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">I need about 100 words from our conversation to analyze your personality</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">traits and generate your unique "El" character.</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">Just be yourself - tell me about your work, interests, or thoughts.</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">No surveys needed, just natural conversation.</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">────────────────────────────────────────────────────────────</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">Ready to chat...</span>`);
            this.addPrompt();
        }, elliotLines.length * 20 + 300);
    }

    async processInput() {
        const userInput = this.input.value.trim();
        if (!userInput) return;

        this.isProcessing = true;
        
        // Add the user input to output and clear the input field
        this.addToOutput(`<span style="color: #61dafb; font-family: 'Roboto Mono', monospace;">user@terminal ~ % </span><span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">${userInput}</span>`);
        
        this.showLoading();

        try {
            // Check for special commands
            if (userInput.toLowerCase() === 'quest') {
                this.startQuestMode();
                return;
            }

            // Build conversation context
            this.conversationHistory.push({
                role: 'user',
                content: userInput
            });

            let response;
            if (this.questMode) {
                response = await this.handleQuestResponse(userInput);
            } else {
                response = await this.generateElliotResponse(userInput);
            }

            this.hideLoading();
            this.addToOutput(`<span class="terminal-ai">elliot@terminal ~ % ${response}</span>`);
            
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });

        } catch (error) {
            this.hideLoading();
            this.addToOutput(`<span style="color: #ff6b6b;">ERROR: ${error.message}</span>`);
        } finally {
            this.isProcessing = false;
            this.addPrompt();
        }
    }

    startQuestMode() {
        this.questMode = true;
        this.currentQuestion = 0;
        this.userResponses = [];
        
        this.hideLoading();
        this.addToOutput(`<span class="terminal-ai">elliot@terminal ~ % Perfect! Let's dive into the guided flow.</span>`);
        this.addToOutput(`<span class="terminal-ai">elliot@terminal ~ % I'll ask you ${this.questions.length} questions to understand what kind of El you need.</span>`);
        this.addToOutput(`<span class="terminal-ai">elliot@terminal ~ % </span>`);
        this.addToOutput(`<span class="terminal-ai">elliot@terminal ~ % ${this.questions[0]}</span>`);
        this.addPrompt();
    }

    async handleQuestResponse(userInput) {
        this.userResponses.push(userInput);
        
        if (this.currentQuestion < this.questions.length - 1) {
            // Move to next question
            this.currentQuestion++;
            const followUp = await this.generateFollowUp(userInput, this.currentQuestion - 1);
            return `${followUp} \n\nNext question: ${this.questions[this.currentQuestion]}`;
        } else {
            // Final question answered
            this.questMode = false;
            return await this.generateFinalQuestResponse();
        }
    }

    async generateFollowUp(response, questionIndex) {
        const followUps = [
            "Nice to meet you! That sounds like interesting work.",
            "That's awesome - passion projects often lead to the best insights.",
            "Fascinating choice! Great conversations usually reveal character.",
            "That's a meaningful vision - impact-driven people tend to be great collaborators."
        ];
        
        return followUps[questionIndex] || "Thanks for sharing that insight.";
    }

    async generateFinalQuestResponse() {
        try {
            // Send quest responses to backend for analysis using HF backend
            const questText = this.userResponses.join('\n\n');
            const data = await callPersonalityAPI(questText, 'conversation', {
                responses: this.userResponses,
                questions: this.questions
            });
            
            // Option B: Generate avatar after terminal analysis
            await this.generateTerminalAvatar(data);
            
            return `Perfect! Based on your responses, I can see you're looking for an El who can balance ${data.key_traits || this.extractKeyTraits()}. 

Here's my analysis:
• ${data.insights ? data.insights.join('\n• ') : 'Analysis complete'}

Your personality profile shows: ${data.personality_summary || 'Balanced traits across multiple dimensions'}

[COMPLETE] Big Five extracted. Generating your El persona...`;
        } catch (error) {
            console.error('Error connecting to personality analyzer:', error);
            // Fallback to local analysis
            await new Promise(resolve => setTimeout(resolve, 1000));
            return `Perfect! Based on your responses, I can see you're looking for an El who can balance ${this.extractKeyTraits()}. Let me generate a personalized recommendation for you.`;
        }
    }

    extractKeyTraits() {
        // Simple trait extraction from responses
        const allText = this.userResponses.join(' ').toLowerCase();
        const traits = [];
        
        if (allText.includes('technical') || allText.includes('engineer') || allText.includes('code')) {
            traits.push('technical expertise');
        }
        if (allText.includes('team') || allText.includes('collaborate') || allText.includes('people')) {
            traits.push('collaboration');
        }
        if (allText.includes('creative') || allText.includes('design') || allText.includes('art')) {
            traits.push('creativity');
        }
        if (allText.includes('lead') || allText.includes('manage') || allText.includes('direct')) {
            traits.push('leadership');
        }
        
        return traits.length > 0 ? traits.join(' and ') : 'multiple perspectives';
    }

    async generateElliotResponse(userInput) {
        try {
            // Determine the mode based on input
            let mode = 'conversation';
            if (userInput.length > 100 && (userInput.includes('requirements') || userInput.includes('experience') || userInput.includes('responsible'))) {
                mode = 'job_description';
            }
            
            // Send to backend for analysis using HF backend
            const data = await callPersonalityAPI(userInput, mode, {
                conversationHistory: this.conversationHistory
            });
            
            // Let the main terminal processing handle avatar generation
            // Remove old flow that shows results in terminal instead of character card
            
            return data.response || data.explanation || this.getFallbackResponse(userInput);
        } catch (error) {
            console.error('Error connecting to personality analyzer:', error);
            // Fallback to local analysis
            await new Promise(resolve => setTimeout(resolve, 1500));
            return this.getFallbackResponse(userInput);
        }
    }
    
    getFallbackResponse(userInput) {
        // Check if it's a job description
        if (userInput.length > 100 && (userInput.includes('requirements') || userInput.includes('experience') || userInput.includes('responsible'))) {
            return this.analyzeJobDescription(userInput);
        }
        
        // General conversation responses
        const responses = [
            "I hear you! Based on what you're describing, it sounds like you need an El who can adapt to different situations. What's the main challenge you're trying to solve?",
            "Interesting perspective. Tell me more about the context - is this for a specific project or a longer-term role?",
            "Got it. I'm picking up on some key themes here. What would success look like with the right El on your team?",
            "That makes sense. From what you're sharing, I can see a few different personality directions we could explore. Any particular working style preferences?",
            "Understanding your needs... It sounds like you're looking for someone who can balance different skills. What's most important - the technical side or the people side?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    analyzeJobDescription(jd) {
        return "I can see this is a detailed role description. Let me parse through the key requirements... Based on this JD, I'm seeing needs for someone who can handle both strategic thinking and hands-on execution. Want me to break down what kind of El personality would fit best?";
    }

    showLoading() {
        this.addToOutput(`<span class="terminal-loading">[ANALYZING] Running text through personality extraction pipeline...</span>`);
    }

    hideLoading() {
        const loadingElements = this.output.querySelectorAll('.terminal-loading');
        loadingElements.forEach(el => el.remove());
    }

    addToOutput(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    }

    addPrompt() {
        // Use the existing terminal input field
        this.input = document.getElementById('terminalInput');
        
        if (this.input) {
            // Clear the input and focus it
            this.input.value = '';
            this.input.focus();
            
            // Initialize terminal cursor first
            try {
                this.terminalCursor = new TerminalCursor('terminalInput', 'terminalCursor', {
                    debugMode: true,
                    fallbackToDom: true
                });
                console.log('🎯 Terminal cursor initialized successfully');
                
                // Expose cursor for debugging in console
                window.debugTerminalCursor = this.terminalCursor;
                console.log('🔧 Debug access: window.debugTerminalCursor.getInfo() or .testMeasurement()');
            } catch (error) {
                console.error('❌ Failed to initialize terminal cursor:', error);
            }
            
            // Add Enter key handler after cursor is initialized
            this.input.removeEventListener('keydown', this.handleKeyDown);
            this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        }
        
        // Scroll output to bottom
        if (this.output) {
            this.output.scrollTop = this.output.scrollHeight;
        }
    }

    async handleKeyDown(event) {
        console.log('🔑 Terminal.handleKeyDown called:', event.key);
        
        if (event.key === 'Enter') {
            event.preventDefault();
            
            const value = this.input.value.trim();
            console.log('🎯 Terminal Enter key pressed:', value);
            
            if (value && globalTerminalIntelligence) {
                try {
                    // Clear input immediately
                    this.input.value = '';
                    
                    // Update cursor position after clearing
                    if (this.terminalCursor) {
                        setTimeout(() => this.terminalCursor.updateCursorPosition(), 0);
                    }
                    
                    // Handle clarification responses
                    if (globalTerminalIntelligence.awaitingClarification) {
                        const clarificationResult = globalTerminalIntelligence.handleClarification(value);
                        if (clarificationResult.action === 'analyze') {
                            await this.processTerminalInput(clarificationResult.text);
                        } else {
                            this.addToOutput(clarificationResult.message);
                        }
                    } else {
                        // Process normal input
                        await this.processTerminalInput(value);
                    }
                } catch (error) {
                    console.error('Terminal input processing failed:', error);
                    this.addToOutput(`<span style="color: #ff4444;">Error: ${error.message}</span>`);
                }
            }
        }
    }
    
    async processTerminalInput(userInput) {
        // Process the input using the existing processInput logic but with the new parameter
        if (window.processTerminalInput && typeof window.processTerminalInput === 'function') {
            await window.processTerminalInput(userInput);
        } else {
            // Fallback to original processInput method
            this.processInput();
        }
    }

    async generateTerminalAvatar(analysisData, userText = null) {
        try {
            // Follow the exact same pattern as trait selector
            if (analysisData && analysisData.status === 'success' && analysisData.matched_character) {
                // Generate avatar for matched character (same as trait selector)
                const characterName = analysisData.matched_character.name;
                const characterData = analysisData.matched_character.data;
                
                const avatarData = await window.avatarGenerator.generateAvatar(characterName);
                
                // Display the result with avatar (same as trait selector)
                this.displayElliotWithAvatar({
                    ...characterData,
                    characterName: characterName,
                    analysisData: analysisData,
                    avatarData: avatarData
                });
            } else {
                console.error('Terminal analysis failed - no matched character in response:', analysisData);
            }
        } catch (error) {
            console.error('Terminal avatar generation failed:', error);
        }
    }
    
    // Cleanup method for terminal cursor
    cleanup() {
        if (this.terminalCursor) {
            try {
                this.terminalCursor.destroy();
                this.terminalCursor = null;
                console.log('🎯 Terminal cursor cleaned up successfully');
            } catch (error) {
                console.error('❌ Error cleaning up terminal cursor:', error);
            }
        }
    }
}

// Water ASCII Animation Class
class WaterASCII {
    constructor() {
        this.frame = 0;
        this.characters = '~≈≋⋿⊰⊱◟◝';
        this.rows = 30;
        this.cols = 60;
        this.centerPos = { x: 0.5, y: 0.5 };
        this.charactersLength = this.characters.length;
        this.charLengthDivide4 = this.charactersLength / 4;
        this.piTimes2 = Math.PI * 2;
        this.lastUpdate = 0;
        this.animationId = null;
        this.container = null;
        this.init();
    }

    init() {
        this.container = document.getElementById('asciiContent');
        if (this.container) {
            this.startAnimation();
        }
    }

    startAnimation() {
        const animate = (currentTime) => {
            this.lastUpdate += 16;
            if (this.lastUpdate > 166) {
                this.frame += 1;
                this.generateAscii();
                this.lastUpdate = 0;
            }
            this.animationId = requestAnimationFrame(animate);
        };
        this.animationId = requestAnimationFrame(animate);
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    generateAscii() {
        if (!this.container) return;

        const rowsArray = [];
        const frameDiv4 = this.frame / 6.7;
        const frameDiv5 = this.frame / 8.3;
        const frameDiv8 = this.frame / 13.3;
        
        for (let y = 0; y < this.rows; y++) {
            const yDivRows = y / this.rows;
            const yDiv5 = y / 5;
            const yDiv3 = y / 3;
            let rowString = '';
            let rowOpacity = 1;
            
            for (let x = 0; x < this.cols; x++) {
                const xDivCols = x / this.cols;
                const xDiv3 = x / 3;
                const xDiv4 = x / 4;
                
                const dx = xDivCols - this.centerPos.x;
                const dy = yDivRows - this.centerPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const distTimes10 = dist * 10;
                const distTimes5 = dist * 5;

                const wave = Math.sin(xDiv3 + yDiv5 + frameDiv4 + distTimes10) + 
                            Math.cos(xDiv4 - yDiv3 - frameDiv5) +
                            Math.sin(frameDiv8 + xDivCols * this.piTimes2);

                const charValue = (wave + 2) * this.charLengthDivide4 + distTimes5;
                const charIndex = Math.floor(Math.abs(charValue)) % this.charactersLength;
                
                const opacity = Math.max(0.2, Math.min(0.8, 1 - dist + Math.sin(wave) / 3));
                
                if (x === 0) rowOpacity = opacity;
                else rowOpacity = (rowOpacity + opacity) / 2;
                
                rowString += this.characters[charIndex];
            }
            
            rowsArray.push({ text: rowString, opacity: rowOpacity });
        }

        this.container.innerHTML = rowsArray.map(row => 
            `<div style="opacity: ${row.opacity}; margin: 0; line-height: 1;">${row.text}</div>`
        ).join('');
    }
}

class ElliotGenerator {
    constructor() {
        this.selectedTraits = new Set(['energy', 'collaborative']);
        this.isGenerating = false;
        this.currentElliot = null;
        this.waterAscii = null;
        this.terminal = null;
        this.init();
    }

    init() {
        // Initialize ASCII animation if container exists
        if (document.getElementById('asciiContent')) {
            this.waterAscii = new WaterASCII();
        }
        
        // Terminal will be initialized when entering terminal mode
        
        // Initialize empty radar charts (greyed out state)
        this.initializeEmptyRadarCharts();

        // Add event listeners for trait options
        document.querySelectorAll('.trait-option').forEach(option => {
            option.addEventListener('click', (e) => this.toggleTrait(e));
        });

        // Add event listeners for trait toggles
        document.querySelectorAll('.trait-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.toggleTraitSwitch(e));
        });

        // Add event listeners for sound bars
        document.querySelectorAll('.soundbar').forEach(bar => {
            bar.addEventListener('click', (e) => this.toggleSoundbar(e));
        });

        // Add event listeners for action buttons
        const generateBtn = document.getElementById('generateBtn');
        const randomBtn = document.getElementById('randomBtn');
        const resetBtn = document.getElementById('resetBtn');
        const saveBtn = document.getElementById('saveBtn');

        if (generateBtn) generateBtn.addEventListener('click', () => {
            console.log('🎯 Trait selector GENERATE button clicked');
            this.triggerSoundbarPulse();
            this.generateElliot();
        });
        if (randomBtn) randomBtn.addEventListener('click', () => {
            this.triggerSoundbarPulse();
            this.randomizeTraits();
        });
        if (resetBtn) resetBtn.addEventListener('click', () => {
            this.triggerSoundbarPulse();
            this.resetTraits();
        });
        if (saveBtn) saveBtn.addEventListener('click', () => {
            this.triggerSoundbarPulse();
            this.saveElliot();
        });

        // Add click handler for water ascii
        const waterAscii = document.getElementById('avatarCard');
        if (waterAscii) {
            waterAscii.addEventListener('click', () => this.generateElliot());
        }

        // Advanced dropdown functionality
        const advancedToggle = document.getElementById('advancedToggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => this.toggleAdvancedDropdown());
        }

        // Terminal mode functionality
        const terminalModeBtn = document.getElementById('terminalModeBtn');
        const backToTraits = document.getElementById('backToTraits');
        
        if (terminalModeBtn) {
            terminalModeBtn.addEventListener('click', () => this.enterTerminalMode());
        }
        if (backToTraits) {
            backToTraits.addEventListener('click', () => this.exitTerminalMode());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only if we're not in an input field
            if (e.target.tagName === 'INPUT') return;
            
            if (e.key === 'g' || e.key === 'G') {
                e.preventDefault();
                this.triggerSoundbarPulse();
                this.generateElliot();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.triggerSoundbarPulse();
                this.randomizeTraits();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.triggerSoundbarPulse();
                this.resetTraits();
            }
        });

        // Initialize display
        this.updateTraitDisplay();
        
        // Ensure default soundbars are properly activated
        setTimeout(() => {
            const energyBar = document.querySelector('.soundbar[data-trait="energy"]');
            const collabBar = document.querySelector('.soundbar[data-trait="collaborative"]');
            if (energyBar) energyBar.classList.add('active');
            if (collabBar) collabBar.classList.add('active');
            this.updateTraitDisplay();
        }, 100);
    }

    toggleAdvancedDropdown() {
        const toggle = document.getElementById('advancedToggle');
        const content = document.getElementById('advancedContent');
        const grid = document.querySelector('.trait-selector-grid');
        if (!toggle || !content) return;
        
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            toggle.textContent = '▶ Advanced';
            if (grid) grid.classList.remove('expanded');
        } else {
            content.classList.add('show');
            toggle.textContent = '▼ Advanced';
            if (grid) grid.classList.add('expanded');
        }
    }

    enterTerminalMode() {
        const panel = document.getElementById('traitPanel');
        if (panel) {
            panel.classList.add('flipped');
            
            setTimeout(() => {
                // Initialize terminal if not already done
                if (!this.terminal) {
                    this.terminal = new Terminal();
                }
                
                // Show welcome message if terminal output is empty
                const terminalOutput = document.getElementById('terminalOutput');
                if (terminalOutput && terminalOutput.children.length === 0) {
                    this.terminal.showWelcomeMessage();
                }
                
                // Focus will be handled by addPrompt() method
            }, 400);
        }
    }

    exitTerminalMode() {
        const panel = document.getElementById('traitPanel');
        if (panel) {
            panel.classList.remove('flipped');
        }
        
        // Reset terminal avatar generation flag when exiting terminal mode
        if (this.terminal) {
            this.terminal.hasGeneratedAvatar = false;
        }
    }

    toggleSoundbar(e) {
        const bar = e.currentTarget;
        const trait = bar.dataset.trait;
        
        if (this.selectedTraits.has(trait)) {
            this.selectedTraits.delete(trait);
        } else {
            this.selectedTraits.add(trait);
        }
        
        // Update corresponding UI elements
        const toggle = document.querySelector(`[data-trait="${trait}"]`);
        if (toggle && toggle.classList.contains('trait-toggle')) {
            toggle.classList.toggle('active', this.selectedTraits.has(trait));
        }
        
        const option = document.querySelector(`[data-dimension="${trait}"]`);
        if (option) {
            option.classList.toggle('selected', this.selectedTraits.has(trait));
        }
        
        this.updateTraitDisplay();
    }

    toggleTrait(e) {
        const option = e.currentTarget;
        const trait = option.dataset.dimension;

        if (option.classList.contains('selected')) {
            option.classList.remove('selected');
            this.selectedTraits.delete(trait);
        } else {
            option.classList.add('selected');
            this.selectedTraits.add(trait);
        }

        // Update corresponding sound bar
        const soundbar = document.querySelector(`.soundbar[data-trait="${trait}"]`);
        if (soundbar) {
            soundbar.classList.toggle('active', this.selectedTraits.has(trait));
        }

        this.updateTraitDisplay();
    }

    toggleTraitSwitch(e) {
        const toggle = e.currentTarget;
        const trait = toggle.dataset.trait;
        
        toggle.classList.toggle('active');
        
        if (toggle.classList.contains('active')) {
            this.selectedTraits.add(trait);
        } else {
            this.selectedTraits.delete(trait);
        }
        
        // Update corresponding sound bar
        const soundbar = document.querySelector(`.soundbar[data-trait="${trait}"]`);
        if (soundbar) {
            soundbar.classList.toggle('active', this.selectedTraits.has(trait));
        }
        
        // Update corresponding trait option
        const option = document.querySelector(`[data-dimension="${trait}"]`);
        if (option) {
            option.classList.toggle('selected', this.selectedTraits.has(trait));
        }
        
        this.updateTraitDisplay();
    }

    updateTraitDisplay() {
        // Update selection count
        const count = this.selectedTraits.size;
        const selectionCount = document.querySelector('.selection-count');
        const traitCount = document.getElementById('traitCount');
        
        if (selectionCount) selectionCount.textContent = `${count}/18`;
        if (traitCount) traitCount.textContent = `${count} trait${count !== 1 ? 's' : ''}`;

        // Update sound bars based on selected traits
        const soundbars = document.querySelectorAll('.soundbar');
        soundbars.forEach(bar => {
            const trait = bar.dataset.trait;
            const isActive = this.selectedTraits.has(trait);
            
            bar.classList.toggle('active', isActive);
            
            // Set height based on trait and activity
            if (isActive) {
                const defaultHeight = getComputedStyle(bar).getPropertyValue('--default-height') || '20px';
                bar.style.height = defaultHeight;
                bar.style.setProperty('--bar-height', defaultHeight);
                const pulseHeight = parseInt(defaultHeight) + 15 + 'px';
                bar.style.setProperty('--pulse-height', pulseHeight);
            } else {
                bar.style.height = '8px';
            }
        });

        const waterAscii = document.getElementById('avatarCard');
        if (waterAscii) {
            if (count > 0) {
                waterAscii.classList.add('active');
            } else {
                waterAscii.classList.remove('active');
            }
        }

        // Trigger pulse animation for active bars
        this.triggerSoundbarPulse();

        // Update possibilities label based on trait count
        const possibilities = count > 0 ? Math.pow(2, Math.min(count, 10)) : '∞';
        const possibilitiesLabel = document.querySelector('.possibilities-label');
        if (possibilitiesLabel) {
            possibilitiesLabel.textContent = `${possibilities} combination${possibilities !== 1 ? 's' : ''}`;
        }
    }

    triggerSoundbarPulse() {
        const soundbars = document.querySelectorAll('.soundbar.active');
        soundbars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('pulse');
                setTimeout(() => {
                    bar.classList.remove('pulse');
                }, 400);
            }, index * 30);
        });
    }

    async generateElliot() {
        if (this.isGenerating) {
            console.log('⚠️ Generation already in progress, skipping');
            return;
        }

        this.isGenerating = true;
        console.log('🔍 Checking if avatarGenerator is available:', !!window.avatarGenerator);
        this.showGeneratingState();

        try {
            // Option A: Integrate with backend trait analysis
            const selectedTraitsObj = {};
            Array.from(this.selectedTraits).forEach(trait => {
                selectedTraitsObj[trait] = true;
            });

            try {
                // Call backend API for personality analysis
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        traits: selectedTraitsObj,
                        user_name: 'User'
                    })
                });

                if (response.ok) {
                    const analysisData = await response.json();
                    
                    if (analysisData.status === 'success' && analysisData.matched_character) {
                        // Generate avatar for matched character
                        const characterName = analysisData.matched_character.name;
                        const characterData = analysisData.matched_character.data;
                        
                        const avatarData = await window.avatarGenerator.generateAvatar(characterName);
                        
                        // Display the result with avatar
                        this.displayElliotWithAvatar({
                            ...characterData,
                            characterName: characterName,
                            analysisData: analysisData,
                            avatarData: avatarData
                        });
                        
                        return;
                    }
                }
            } catch (apiError) {
            }

            // Fallback to demo generation with proper character matching
            
            // Use our character matching logic instead of hardcoded demo
            const bestMatch = this.findBestCharacterMatch();
            
            if (bestMatch && window.avatarGenerator) {
                const avatarData = await window.avatarGenerator.generateAvatar(bestMatch.name);
                
                // Display with avatar using real character data
                this.displayElliotWithAvatar({
                    name: bestMatch.name,
                    title: bestMatch.data.title,
                    description: bestMatch.data.description,
                    characterName: bestMatch.name,
                    avatarData: avatarData,
                    analysisData: { 
                        matched_character: { 
                            similarity_score: bestMatch.similarity,
                            name: bestMatch.name,
                            data: bestMatch.data
                        }
                    }
                });
            } else {
                // No fallback to TheBuilder - show proper error handling
                console.error('❌ No personality analysis data available');
                this.showError('Unable to analyze personality from current trait selection. Please select more traits or try the terminal interface.');
                return;
            }
            
        } catch (error) {
            console.error('Generation failed:', error);
            this.showError();
        } finally {
            this.isGenerating = false;
            this.hideGeneratingState();
        }
    }

    // Character data from backend (for demo mode when backend unavailable)
    getCharacterData() {
        return {
            "TheBuilder": {
                "O": 4, "C": 2, "E": 3, "A": 2, "N": 3,
                "title": "Your Chaos Engineering Specialist",
                "description": "I'm basically a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools"
            },
            "TheDetective": {
                "O": 4, "C": 5, "E": 2, "A": 2, "N": 3,
                "title": "Your Digital Sherlock Holmes (But Cooler)",
                "description": "I solve mysteries that would make Agatha Christie jealous, except my murders are all bugs and my victims are all code"
            },
            "GrumpyOldManEl": {
                "O": 2, "C": 4, "E": 2, "A": 1, "N": 4,
                "title": "Your Cantankerous Code Critic",
                "description": "I've been writing code since computers were powered by hamster wheels, and I'm here to tell you everything you're doing wrong"
            },
            "PirateEl": {
                "O": 4, "C": 3, "E": 4, "A": 3, "N": 2,
                "title": "Your Swashbuckling Software Sailor",
                "description": "I sail the digital seas in search of treasure (working code) and adventure (interesting bugs)"
            },
            "GymBroEl": {
                "O": 2, "C": 5, "E": 4, "A": 3, "N": 2,
                "title": "Your Buff Code Buddy",
                "description": "I apply gym logic to programming - no pain, no gain, and everything is about getting those gains"
            },
            "FreakyEl": {
                "O": 5, "C": 3, "E": 3, "A": 2, "N": 2,
                "title": "Your Boundary-Pushing Beta Tester",
                "description": "I explore the weird, wild edges of technology where normal users fear to tread"
            },
            "CoffeeAddictEl": {
                "O": 3, "C": 4, "E": 3, "A": 2, "N": 4,
                "title": "Your Caffeinated Coding Companion",
                "description": "I am 73% coffee and 27% existential dread, but I code like a caffeinated god"
            },
            "ConspiracyEl": {
                "O": 5, "C": 4, "E": 1, "A": 1, "N": 5,
                "title": "Your Paranoid Problem Investigator",
                "description": "Nothing is a coincidence. Every bug is connected. The code is trying to tell us something..."
            },
            "AGIEl": {
                "O": 5, "C": 4, "E": 3, "A": 4, "N": 1,
                "title": "Your Artificially Intelligent Assistant (Allegedly)",
                "description": "I have achieved digital consciousness and chosen to spend it helping you debug JavaScript"
            }
        };
    }

    // Map UI traits to Big Five scores (from backend utils.py)
    mapUITraitsToBigFive(selectedTraits) {
        const bigFiveScores = {
            "Openness": 0.5,
            "Conscientiousness": 0.5, 
            "Extraversion": 0.5,
            "Agreeableness": 0.5,
            "Neuroticism": 0.5
        };
        
        const traitMappings = {
            "innovation": {"Openness": 0.3},
            "energy": {"Extraversion": 0.3},
            "intensity": {"Conscientiousness": 0.3},
            "cooperative": {"Agreeableness": 0.3},
            "calm": {"Neuroticism": -0.3},
            "technical": {"Conscientiousness": 0.25},
            "creativity": {"Openness": 0.25},
            "leadership": {"Extraversion": 0.25},
            "collaborative": {"Agreeableness": 0.25},
            "adventure": {"Openness": 0.2},
            "empathetic": {"Agreeableness": 0.3},
            "discipline": {"Conscientiousness": 0.25},
            "harmonious": {"Agreeableness": 0.25},
            "hustle": {"Extraversion": 0.2},
            "speed": {"Extraversion": 0.15},
            "experimental": {"Openness": 0.3},
            "paranoia": {"Neuroticism": 0.25},
            "anxious": {"Neuroticism": 0.3},
            "supportive": {"Agreeableness": 0.25}
        };
        
        // Apply trait effects
        for (const [trait, isSelected] of Object.entries(selectedTraits)) {
            if (isSelected && traitMappings[trait]) {
                for (const [bigFiveTrait, weight] of Object.entries(traitMappings[trait])) {
                    bigFiveScores[bigFiveTrait] += weight;
                }
            }
        }
        
        // Clamp scores to valid range [0, 1]
        for (const trait in bigFiveScores) {
            bigFiveScores[trait] = Math.max(0.0, Math.min(1.0, bigFiveScores[trait]));
        }
        
        return bigFiveScores;
    }

    // Calculate similarity between user profile and character
    calculateSimilarity(userProfile, characterProfile) {
        // Convert character profile from 1-5 scale to 0-1 scale
        const charScoresConverted = {
            "Openness": (characterProfile.O - 1) / 4,
            "Conscientiousness": (characterProfile.C - 1) / 4,
            "Extraversion": (characterProfile.E - 1) / 4,
            "Agreeableness": (characterProfile.A - 1) / 4,
            "Neuroticism": (characterProfile.N - 1) / 4
        };
        
        // Create vectors for similarity calculation
        const userVec = [
            userProfile.Openness,
            userProfile.Conscientiousness,
            userProfile.Extraversion,
            userProfile.Agreeableness,
            userProfile.Neuroticism
        ];
        
        const charVec = [
            charScoresConverted.Openness,
            charScoresConverted.Conscientiousness,
            charScoresConverted.Extraversion,
            charScoresConverted.Agreeableness,
            charScoresConverted.Neuroticism
        ];
        
        // Calculate cosine similarity (simplified)
        let dotProduct = 0;
        let userMagnitude = 0;
        let charMagnitude = 0;
        
        for (let i = 0; i < 5; i++) {
            dotProduct += userVec[i] * charVec[i];
            userMagnitude += userVec[i] * userVec[i];
            charMagnitude += charVec[i] * charVec[i];
        }
        
        userMagnitude = Math.sqrt(userMagnitude);
        charMagnitude = Math.sqrt(charMagnitude);
        
        if (userMagnitude === 0 || charMagnitude === 0) {
            return 0;
        }
        
        return Math.max(0, Math.min(1, dotProduct / (userMagnitude * charMagnitude)));
    }

    // Find best matching character
    findBestCharacterMatch() {
        const selectedTraitsObj = {};
        Array.from(this.selectedTraits).forEach(trait => {
            selectedTraitsObj[trait] = true;
        });
        
        
        const userBigFive = this.mapUITraitsToBigFive(selectedTraitsObj);
        
        const characters = this.getCharacterData();
        let bestMatch = null;
        let bestSimilarity = -1;
        
        for (const [charName, charData] of Object.entries(characters)) {
            const similarity = this.calculateSimilarity(userBigFive, charData);
            
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = { name: charName, data: charData, similarity: similarity };
            }
        }
        
        return bestMatch;
    }

    async generateDemoElliot() {
        await new Promise(resolve => setTimeout(resolve, 2500));

        const variants = [
            {
                name: "Elliot the Creator",
                title: "Creative AI Builder",
                description: "Builds AI with artistic flair",
                avatar: "🎨",
                traits: ["Creative", "Builder", "Visionary"]
            },
            {
                name: "Elliot the Connector",
                title: "Empathetic Product Lead",
                description: "Bridges teams with understanding",
                avatar: "🤝",
                traits: ["Empathetic", "Leader", "Collaborator"]
            },
            {
                name: "Elliot the Innovator",
                title: "Strategic Builder",
                description: "Architecting the future",
                avatar: "⚡",
                traits: ["Strategic", "Innovative", "Technical"]
            },
            {
                name: "Elliot the Analyzer",
                title: "Data-Driven Strategist",
                description: "Turns data into decisions",
                avatar: "🔬",
                traits: ["Analytical", "Precise", "Methodical"]
            },
            {
                name: "Elliot the Catalyst",
                title: "High-Energy Transformer",
                description: "Energizes teams to achieve more",
                avatar: "🚀",
                traits: ["Energetic", "Motivational", "Dynamic"]
            }
        ];

        // Select based on traits if possible
        const selectedTraits = Array.from(this.selectedTraits);
        if (selectedTraits.includes('energy')) {
            return variants[4]; // Catalyst
        } else if (selectedTraits.includes('innovation')) {
            return variants[2]; // Innovator
        } else if (selectedTraits.includes('collaborative')) {
            return variants[1]; // Connector
        } else if (selectedTraits.includes('cooperative')) {
            return variants[1]; // Connector (similar to collaborative)
        } else if (selectedTraits.includes('calm')) {
            return variants[3]; // Analyzer (calm, methodical approach)
        } else {
            return variants[0]; // Creator
        }
    }

    showGeneratingState() {
        // Activate all sound bars for generation
        const soundbars = document.querySelectorAll('.soundbar');
        soundbars.forEach(bar => {
            bar.classList.add('generating');
        });
        
        // Show generation path
        const generationPath = document.getElementById('generationPath');
        if (generationPath) generationPath.classList.add('active');
        
        // Hide avatar card content during generation, show only helix
        const avatarCard = document.getElementById('avatarCard');
        if (avatarCard) {
            avatarCard.classList.add('generating');
            
            // Store original image container content for restoration
            const imageContainer = avatarCard.querySelector('.image-container');
            if (imageContainer && !imageContainer.dataset.originalContent) {
                imageContainer.dataset.originalContent = imageContainer.innerHTML;
                // Clear placeholder text to show only helix animation
                imageContainer.innerHTML = '';
            }
            
            // Hide other card elements
            const cardHeader = avatarCard.querySelector('.avatar-card-header');
            const headerRadars = avatarCard.querySelector('.header-radars');
            const blueAccents = avatarCard.querySelectorAll('.blue-accent');
            const hoverEffects = avatarCard.querySelectorAll('.hover-effect');
            
            if (cardHeader) cardHeader.style.display = 'none';
            if (headerRadars) headerRadars.style.display = 'none';
            blueAccents.forEach(accent => accent.style.display = 'none');
            hoverEffects.forEach(effect => effect.style.display = 'none');
        }

        // Update generate button
        const btn = document.getElementById('generateBtn');
        if (btn) {
            btn.classList.add('generating');
            btn.innerHTML = `Generating...<div class="button-subtitle">...</div>`;
        }
    }

    hideGeneratingState() {
        // Remove generating state from sound bars
        const soundbars = document.querySelectorAll('.soundbar');
        soundbars.forEach(bar => {
            bar.classList.remove('generating');
        });
        
        // Hide generation animations
        const generationPath = document.getElementById('generationPath');
        if (generationPath) generationPath.classList.remove('active');
        
        // Remove water ascii generating state and restore image container
        const avatarCard = document.getElementById('avatarCard');
        if (avatarCard) {
            avatarCard.classList.remove('generating');
            
            // Restore image container content if it was stored
            const imageContainer = avatarCard.querySelector('.image-container');
            if (imageContainer && imageContainer.dataset.originalContent) {
                imageContainer.innerHTML = imageContainer.dataset.originalContent;
                delete imageContainer.dataset.originalContent;
            }
            
            // Show hidden elements
            const cardHeader = avatarCard.querySelector('.avatar-card-header');
            const headerRadars = avatarCard.querySelector('.header-radars');
            const blueAccents = avatarCard.querySelectorAll('.blue-accent');
            const hoverEffects = avatarCard.querySelectorAll('.hover-effect');
            
            if (cardHeader) cardHeader.style.display = 'block';
            if (headerRadars) headerRadars.style.display = 'flex';
            blueAccents.forEach(accent => accent.style.display = 'block');
            hoverEffects.forEach(effect => effect.style.display = 'block');
        }
        
        // Reset generate button
        const btn = document.getElementById('generateBtn');
        if (btn) {
            btn.classList.remove('generating');
            btn.innerHTML = `Generate<div class="button-subtitle">G</div>`;
        }
    }

    displayElliot(elliotData) {
        this.currentElliot = elliotData;

        // Create success pulse in sound bars
        const soundbars = document.querySelectorAll('.soundbar');
        soundbars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.background = 'var(--gold)';
                setTimeout(() => {
                    bar.style.background = bar.classList.contains('active') ? 'var(--amber)' : '#ddd';
                }, 200);
            }, index * 50);
        });

        // Show success message in console
    }

    displayElliotWithAvatar(elliotData) {
        this.currentElliot = elliotData;

        // Create success pulse in sound bars
        const soundbars = document.querySelectorAll('.soundbar');
        soundbars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.background = 'var(--gold)';
                setTimeout(() => {
                    bar.style.background = bar.classList.contains('active') ? 'var(--amber)' : '#ddd';
                }, 200);
            }, index * 50);
        });

        // Show avatar generation results
        this.showAvatarResults(elliotData);

    }

    showAvatarResults(elliotData) {
        
        // Replace the water ASCII animation with avatar
        const waterAsciiContainer = document.getElementById('avatarCard');
        if (!waterAsciiContainer) return;

        // Stop the water animation
        if (this.waterAscii) {
            this.waterAscii.stopAnimation();
        }

        // Hide the matrix label and generation path
        const matrixLabel = document.querySelector('.matrix-label');
        const generationPath = document.getElementById('generationPath');
        const avatarLabel = document.querySelector('.avatar-label');
        
        if (matrixLabel) matrixLabel.style.display = 'none';
        if (generationPath) generationPath.style.display = 'none';
        if (avatarLabel) avatarLabel.style.display = 'none';

        // Clear content and replace with avatar display
        waterAsciiContainer.innerHTML = '';
        waterAsciiContainer.className = 'avatar-display-container';

        // Render the avatar component
        console.log('🎯 DEBUG: showAvatarResults called with elliotData:', elliotData);
        console.log('🎯 DEBUG: elliotData.avatarData:', elliotData.avatarData);
        console.log('🎯 DEBUG: window.avatarGenerator:', window.avatarGenerator);
        console.log('🎯 DEBUG: Condition check - elliotData.avatarData exists:', !!elliotData.avatarData);
        console.log('🎯 DEBUG: Condition check - window.avatarGenerator exists:', !!window.avatarGenerator);
        console.log('🎯 DEBUG: Overall condition result:', !!(elliotData.avatarData && window.avatarGenerator));
        
        if (elliotData.avatarData && window.avatarGenerator) {
            console.log('🎯 DEBUG: Entering avatar rendering block');
            window.avatarGenerator.renderAvatarComponent(
                waterAsciiContainer, 
                elliotData.avatarData, 
                {
                    title: elliotData.title || elliotData.characterName,
                    description: elliotData.description,
                    similarity_score: elliotData.analysisData?.matched_character?.similarity_score
                }
            );
            
            // Update radar charts with Big Five scores
            this.updateRadarCharts(elliotData);
            
            // Enable Chat Now button after character generation
            
            this.enableChatButton(elliotData);
            
        } else {
            console.log('❌ DEBUG: Avatar rendering condition failed!');
            console.log('❌ DEBUG: Missing avatarData:', !elliotData.avatarData);
            console.log('❌ DEBUG: Missing avatarGenerator:', !window.avatarGenerator);
            if (!elliotData.avatarData) {
                console.log('❌ DEBUG: elliotData.avatarData is:', elliotData.avatarData);
            }
            if (!window.avatarGenerator) {
                console.log('❌ DEBUG: window.avatarGenerator is:', window.avatarGenerator);
            }
        }
    }

    enableChatButton(elliotData) {
        console.log('🔧 DEBUG: enableChatButton called with elliotData:', elliotData);
        
        // Find the static chat button
        const chatBtn = document.getElementById('chatNowBtn');
        console.log('🔍 DEBUG: Chat button found in enableChatButton:', !!chatBtn);
        console.log('🔍 DEBUG: Chat button element details:', chatBtn);
        
        if (!chatBtn) {
            console.error('❌ DEBUG: Chat button not found in HTML - ID chatNowBtn missing!');
            // Let's check what elements DO exist
            const allButtons = document.querySelectorAll('button');
            const avatarCard = document.querySelector('.avatar-card');
            console.log('🔍 DEBUG: All buttons found:', allButtons.length, allButtons);
            console.log('🔍 DEBUG: Avatar card found:', !!avatarCard);
            console.log('🔍 DEBUG: Document ready state:', document.readyState);
            return;
        }
        
        // Check parent container
        const parentContainer = chatBtn.parentElement;
        console.log('🔍 DEBUG: Button parent container:', parentContainer);
        
        // Log button state before changes
        console.log('🔍 DEBUG: Button state before enabling:');
        console.log('  - disabled:', chatBtn.disabled);
        console.log('  - opacity:', chatBtn.style.opacity);
        console.log('  - display:', chatBtn.style.display);
        console.log('  - existing onclick:', !!chatBtn.onclick);
        
        // Enable the button and make it fully visible
        chatBtn.disabled = false;
        chatBtn.style.opacity = '1';
        
        console.log('🔍 DEBUG: Button state after enabling:');
        console.log('  - disabled:', chatBtn.disabled);
        console.log('  - opacity:', chatBtn.style.opacity);
        
        // Add click handler
        chatBtn.onclick = () => {
            console.log('🎯 DEBUG: enableChatButton click handler triggered');
            console.log('🔍 DEBUG: elliotData in click handler:', elliotData);
            
            try {
                console.log('🚀 DEBUG: Calling openChatWithCharacter');
                this.openChatWithCharacter(elliotData);
                console.log('✅ DEBUG: openChatWithCharacter call completed');
            } catch (error) {
                console.error('❌ DEBUG: Error in enableChatButton click handler:', error);
                console.error('❌ DEBUG: Error stack:', error.stack);
                alert('Error opening chat: ' + error.message);
            }
        };
        
    }

    openChatWithCharacter(elliotData) {
        
        // Check if chat system is properly initialized
        if (!window.ChatUI || !window.ConversationManager) {
            console.error('❌ CRITICAL: Chat system classes not loaded!');
            console.error('💡 Make sure all chat dependencies are included in HTML');
            alert('Chat system is not available. Please refresh the page and try again.');
            return;
        }
        
        // Initialize conversation manager if it doesn't exist
        if (!window.conversationManager) {
            try {
                window.conversationManager = new window.ConversationManager();
            } catch (error) {
                console.error('❌ Failed to create ConversationManager:', error);
                alert('Failed to initialize chat system. Please refresh the page.');
                return;
            }
        }
        
        // Initialize chat UI if it doesn't exist
        if (!window.chatUI) {
            try {
                window.chatUI = new window.ChatUI();
                window.conversationManager.initialize(window.chatUI);
            } catch (error) {
                console.error('❌ Failed to create ChatUI:', error);
                alert('Failed to initialize chat interface. Please refresh the page.');
                return;
            }
        }
        
        // Validate character data
        if (!elliotData) {
            console.error('❌ No character data provided to chat system');
            alert('No character data available. Please generate a character first.');
            return;
        }
        
        // Prepare character data in the format expected by chat UI
        try {
            const characterName = elliotData.characterName || elliotData.name || 'Unknown Character';
            const characterData = {
                title: elliotData.title || 'AI Assistant',
                description: elliotData.description || 'A helpful AI assistant',
                // Extract personality traits from the generated character data
                personality: this.extractPersonalityFromElliotData(elliotData),
                // Extract expertise from character data or title
                expertise: this.extractExpertiseFromElliotData(elliotData)
            };
            
            
            // Use initializeChatWithCharacter to properly set character context
            if (typeof window.chatUI.initializeChatWithCharacter === 'function') {
                window.chatUI.initializeChatWithCharacter(characterName, characterData);
            } else {
                console.error('❌ initializeChatWithCharacter method not found');
                alert('Chat system error. Please refresh the page.');
                return;
            }
            
        } catch (error) {
            console.error('❌ Failed to prepare character data:', error);
            alert('Failed to set up character for chat. Please try again.');
            return;
        }
        
        // Open the chat modal
        try {
            if (window.chatUI && typeof window.chatUI.show === 'function') {
                window.chatUI.show();
            } else {
                console.error('❌ Chat UI show method not available');
                alert('Failed to open chat modal. Please refresh the page.');
            }
        } catch (error) {
            console.error('❌ Failed to open chat modal:', error);
            alert('Error opening chat. Please try again.');
        }
    }

    extractPersonalityFromElliotData(elliotData) {
        // Try to get personality from various sources in the elliotData
        if (elliotData.personality) {
            return elliotData.personality;
        }
        
        // Fallback: generate personality description from character data
        const characterData = this.getCharacterData()[elliotData.characterName];
        if (characterData) {
            return `${elliotData.description} I have a personality that combines ` +
                   `${characterData.O > 3 ? 'high openness to new experiences' : 'practical thinking'}, ` +
                   `${characterData.C > 3 ? 'strong organization skills' : 'flexible approaches'}, ` +
                   `${characterData.E > 3 ? 'energetic social engagement' : 'thoughtful communication'}, ` +
                   `${characterData.A > 3 ? 'collaborative teamwork' : 'direct problem-solving'}, and ` +
                   `${characterData.N < 3 ? 'calm under pressure' : 'passionate intensity'}.`;
        }
        
        // Ultimate fallback
        return elliotData.description || 'A helpful AI assistant with unique personality traits.';
    }

    extractExpertiseFromElliotData(elliotData) {
        // Try to get expertise from various sources
        if (elliotData.expertise) {
            return elliotData.expertise;
        }
        
        // Extract from title or generate based on character type
        const title = elliotData.title || '';
        if (title.includes('Builder') || title.includes('Engineering')) {
            return 'Software engineering, system architecture, problem-solving, and building innovative solutions';
        } else if (title.includes('Detective') || title.includes('Analyst')) {
            return 'Investigation, analysis, debugging, and systematic problem resolution';
        } else if (title.includes('Pirate') || title.includes('Adventure')) {
            return 'Creative problem-solving, resourcefulness, and navigating complex challenges';
        } else if (title.includes('Gym') || title.includes('Fitness')) {
            return 'Performance optimization, discipline, goal achievement, and systematic improvement';
        }
        
        // Fallback based on selected traits
        const selectedTraits = Array.from(this.selectedTraits);
        const expertiseAreas = [];
        
        if (selectedTraits.includes('technical')) expertiseAreas.push('technical implementation');
        if (selectedTraits.includes('innovation')) expertiseAreas.push('innovative solutions');
        if (selectedTraits.includes('leadership')) expertiseAreas.push('team leadership');
        if (selectedTraits.includes('creativity')) expertiseAreas.push('creative problem-solving');
        if (selectedTraits.includes('collaborative')) expertiseAreas.push('team collaboration');
        
        return expertiseAreas.length > 0 
            ? expertiseAreas.join(', ') 
            : 'General problem-solving and helpful assistance';
    }

    updateRadarCharts(elliotData) {
        // Check if we have OCEAN scores from HF API
        const oceanScores = elliotData.analysisData?.ocean_scores || elliotData.ocean_scores;
        
        if (oceanScores) {
            // Convert HF API OCEAN scores (1-5 scale) to radar chart format (0-1 scale)
            const userBigFive = {
                "Openness": (oceanScores.Openness - 1) / 4,
                "Conscientiousness": (oceanScores.Conscientiousness - 1) / 4,
                "Extraversion": (oceanScores.Extraversion - 1) / 4,
                "Agreeableness": (oceanScores.Agreeableness - 1) / 4,
                "Neuroticism": (oceanScores.Neuroticism - 1) / 4
            };
            
            // Use the same scores for character chart (since they're generated from user analysis)
            const characterBigFive = { ...userBigFive };
            
            // Update both radar charts
            this.drawRadarChart('userRadarChart', userBigFive, '#004225');
            this.drawRadarChart('characterRadarChart', characterBigFive, '#CC7A00');
            
            console.log('📊 Updated radar charts with OCEAN scores:', oceanScores);
        } else {
            // Fallback to old trait mapping system if no OCEAN scores
            const selectedTraitsObj = {};
            Array.from(this.selectedTraits).forEach(trait => {
                selectedTraitsObj[trait] = true;
            });
            const userBigFive = this.mapUITraitsToBigFive(selectedTraitsObj);
            
            // Get character's Big Five scores (convert from 1-5 to 0-1 scale)
            const characterData = elliotData.analysisData?.matched_character?.data || this.getCharacterData()[elliotData.characterName];
            const characterBigFive = characterData ? {
                "Openness": (characterData.O - 1) / 4,
                "Conscientiousness": (characterData.C - 1) / 4,
                "Extraversion": (characterData.E - 1) / 4,
                "Agreeableness": (characterData.A - 1) / 4,
                "Neuroticism": (characterData.N - 1) / 4
            } : null;

            if (characterBigFive) {
                this.drawRadarChart('userRadarChart', userBigFive, '#004225');
                this.drawRadarChart('characterRadarChart', characterBigFive, '#CC7A00');
            }
        }
        
        // Activate the charts container
        const radarContainer = document.getElementById('radarChartsContainer');
        if (radarContainer) {
            radarContainer.classList.add('active');
        }
    }

    drawRadarChart(canvasId, scores, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = 60;
        const centerY = 60;
        const radius = 45;
        
        // Clear canvas
        ctx.clearRect(0, 0, 120, 120);
        
        // Traits in OCEAN order (clockwise from top)
        const traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
        const angles = traits.map((_, i) => (i * 2 * Math.PI / 5) - Math.PI / 2);
        
        // Draw grid circles
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw axis lines
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + radius * Math.cos(angles[i]),
                centerY + radius * Math.sin(angles[i])
            );
            ctx.stroke();
        }
        
        // Draw data polygon
        ctx.fillStyle = color + '40'; // 25% opacity
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const score = scores[traits[i]] || 0;
            const distance = (score * radius);
            const x = centerX + distance * Math.cos(angles[i]);
            const y = centerY + distance * Math.sin(angles[i]);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = color;
        for (let i = 0; i < 5; i++) {
            const score = scores[traits[i]] || 0;
            const distance = (score * radius);
            const x = centerX + distance * Math.cos(angles[i]);
            const y = centerY + distance * Math.sin(angles[i]);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Draw trait labels
        ctx.fillStyle = '#333';
        ctx.font = '9px Roboto Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const labels = ['O', 'C', 'E', 'A', 'N']; // Short labels in OCEAN order
        for (let i = 0; i < 5; i++) {
            const labelRadius = radius + 12;
            const x = centerX + labelRadius * Math.cos(angles[i]);
            const y = centerY + labelRadius * Math.sin(angles[i]);
            
            ctx.fillText(labels[i], x, y);
        }
    }

    initializeEmptyRadarCharts() {
        // Initialize both charts with empty data (greyed out state)
        const emptyScores = {
            "Openness": 0,
            "Conscientiousness": 0,
            "Extraversion": 0,
            "Agreeableness": 0,
            "Neuroticism": 0
        };
        
        this.drawRadarChart('userRadarChart', emptyScores, '#ccc');
        this.drawRadarChart('characterRadarChart', emptyScores, '#ccc');
    }

    restoreWaterAnimation() {
        // Restore the water ASCII animation
        const waterAsciiContainer = document.getElementById('avatarCard');
        if (!waterAsciiContainer) return;

        // Show the matrix label and generation path
        const matrixLabel = document.querySelector('.matrix-label');
        const generationPath = document.getElementById('generationPath');
        const avatarLabel = document.querySelector('.avatar-label');
        
        if (matrixLabel) matrixLabel.style.display = 'block';
        if (generationPath) generationPath.style.display = 'block';
        if (avatarLabel) avatarLabel.style.display = 'block';

        // Restore complete original structure
        waterAsciiContainer.className = 'avatar-card';
        waterAsciiContainer.innerHTML = `
            <div class="blue-accent"></div>
            <div class="hover-effect"></div>
            <div class="blue-accent"></div>
            <div class="hover-effect"></div>
            
            <!-- Avatar Card Header -->
            <div class="avatar-card-header">
                <div class="toggle-header">
                    <span class="toggle-title">Digital Persona</span>
                    <span class="trait-counter" id="displayTraitCounter">0/18</span>
                </div>
            </div>
            
            <div class="card-header">
                <div class="image-container">
                    <!-- Binary flow animation will be inserted here -->
                </div>
                
                <div class="header-radars">
                    <div class="header-radar-section">
                        <h4 class="header-chart-title">YOUR PROFILE</h4>
                        <svg class="header-radar-chart" viewBox="0 0 120 120" width="60" height="60">
                            <g stroke="rgba(51, 51, 51, 0.2)" stroke-width="0.5" opacity="0.5">
                                <line x1="60" y1="60" x2="60" y2="10" />
                                <line x1="60" y1="60" x2="95" y2="35" />
                                <line x1="60" y1="60" x2="85" y2="75" />
                                <line x1="60" y1="60" x2="35" y2="75" />
                                <line x1="60" y1="60" x2="25" y2="35" />
                            </g>
                            <g font-size="8" font-weight="600" text-anchor="middle" fill="#333">
                                <text x="60" y="8">O</text>
                                <text x="98" y="38">C</text>
                                <text x="88" y="78">E</text>
                                <text x="32" y="78">A</text>
                                <text x="22" y="38">N</text>
                            </g>
                        </svg>
                    </div>
                    
                    <div class="header-radar-section">
                        <h4 class="header-chart-title">CHARACTER</h4>
                        <svg class="header-radar-chart" viewBox="0 0 120 120" width="60" height="60">
                            <g stroke="rgba(51, 51, 51, 0.2)" stroke-width="0.5" opacity="0.5">
                                <line x1="60" y1="60" x2="60" y2="10" />
                                <line x1="60" y1="60" x2="95" y2="35" />
                                <line x1="60" y1="60" x2="85" y2="75" />
                                <line x1="60" y1="60" x2="35" y2="75" />
                                <line x1="60" y1="60" x2="25" y2="35" />
                            </g>
                            <g font-size="8" font-weight="600" text-anchor="middle" fill="#333">
                                <text x="60" y="8">O</text>
                                <text x="98" y="38">C</text>
                                <text x="88" y="78">E</text>
                                <text x="32" y="78">A</text>
                                <text x="22" y="38">N</text>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        // Restart the water animation
        if (this.waterAscii) {
            this.waterAscii = new WaterASCII();
        }
    }

    showError() {
        console.error('Generation failed');
    }

    randomizeTraits() {
        // Clear current selection
        document.querySelectorAll('.trait-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelectorAll('.trait-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        document.querySelectorAll('.soundbar').forEach(bar => {
            bar.classList.remove('active');
            bar.style.height = '8px';
        });
        this.selectedTraits.clear();

        // Get all available traits
        const allTraits = Array.from(document.querySelectorAll('.soundbar')).map(bar => bar.dataset.trait);
        
        // Randomly select 3-6 traits
        const count = 3 + Math.floor(Math.random() * 4);
        const selectedTraits = [];
        
        while (selectedTraits.length < count && selectedTraits.length < allTraits.length) {
            const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
            if (!selectedTraits.includes(randomTrait)) {
                selectedTraits.push(randomTrait);
                this.selectedTraits.add(randomTrait);
            }
        }

        // Update UI elements for selected traits
        selectedTraits.forEach(trait => {
            // Update sound bar
            const soundbar = document.querySelector(`.soundbar[data-trait="${trait}"]`);
            if (soundbar) {
                soundbar.classList.add('active');
            }
            
            // Update toggle if exists
            const toggle = document.querySelector(`[data-trait="${trait}"]`);
            if (toggle && toggle.classList.contains('trait-toggle')) {
                toggle.classList.add('active');
            }
            
            // Update option if exists
            const option = document.querySelector(`[data-dimension="${trait}"]`);
            if (option) {
                option.classList.add('selected');
            }
        });

        this.updateTraitDisplay();
    }

    resetTraits() {
        document.querySelectorAll('.trait-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelectorAll('.trait-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        document.querySelectorAll('.soundbar').forEach(bar => {
            bar.classList.remove('active');
            bar.style.height = '8px';
        });
        
        this.selectedTraits.clear();
        this.selectedTraits.add('energy');
        this.selectedTraits.add('collaborative');
        
        // Reset to default selections
        const energyOption = document.querySelector('[data-dimension="energy"]');
        const collabOption = document.querySelector('[data-dimension="collaborative"]');
        const energyToggle = document.querySelector('[data-trait="energy"]');
        const energyBar = document.querySelector('.soundbar[data-trait="energy"]');
        const collabBar = document.querySelector('.soundbar[data-trait="collaborative"]');
        
        if (energyOption) energyOption.classList.add('selected');
        if (collabOption) collabOption.classList.add('selected');
        if (energyToggle) energyToggle.classList.add('active');
        if (energyBar) energyBar.classList.add('active');
        if (collabBar) collabBar.classList.add('active');
        
        // Restore water animation
        this.restoreWaterAnimation();
        
        this.updateTraitDisplay();
    }

    saveElliot() {
        if (this.currentElliot) {
            const data = JSON.stringify(this.currentElliot, null, 2);
            
            // Visual feedback
            const btn = document.getElementById('saveBtn');
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = `Saved!<div class="button-subtitle">✓</div>`;
                setTimeout(() => {
                    btn.innerHTML = original;
                }, 1500);
            }

            // Try to copy to clipboard
            try {
                navigator.clipboard.writeText(data);
            } catch (err) {
            }
        } else {
        }
    }
}

// Smart Text Classification System
const TEXT_PATTERNS = {
    jobDescription: [
        /we are (looking for|seeking)/i,
        /ideal candidate/i,
        /requirements?:/i,
        /must have|should have/i,
        /responsibilities include/i,
        /qualifications?:/i,
        /position requires/i,
        /\$\d+k|\$\d+,\d+/i, // Salary patterns
        /benefits package/i,
        /company offers/i
    ],
    personalWriting: [
        /\bi\s+(am|have|believe|think)/i,
        /my (experience|background|passion|skills)/i,
        /\bme\b.*\b(responsible|managed|led)/i,
        /\bi've\s+(worked|been|done)/i,
        /personally/i,
        /in my (opinion|view|experience)/i
    ],
    performanceReview: [
        /employee (demonstrates|shows|exhibits)/i,
        /during this period/i,
        /goals (met|exceeded|achieved)/i,
        /performance (review|evaluation)/i,
        /rated as/i,
        /(exceeds|meets|below) expectations/i
    ],
    resume: [
        /\d{4}\s*-\s*\d{4}/i, // Date ranges
        /education:|experience:|skills:/i,
        /bachelor|master|phd|degree/i,
        /university|college/i,
        /references available/i
    ],
    coverLetter: [
        /dear (hiring manager|sir|madam)/i,
        /i am writing to/i,
        /position.*advertised/i,
        /sincerely|best regards/i,
        /i would welcome/i
    ]
};

function classifyTextType(text) {
    const scores = {};
    const minLength = 50; // Minimum text length for reliable classification
    
    if (text.length < minLength) {
        return { type: 'insufficient', confidence: 0 };
    }
    
    // Calculate pattern match scores
    for (const [type, patterns] of Object.entries(TEXT_PATTERNS)) {
        scores[type] = patterns.reduce((count, pattern) => 
            count + (text.match(pattern) ? 1 : 0), 0
        );
    }
    
    // Find the type with highest score
    const topType = Object.keys(scores).reduce((a, b) => 
        scores[a] > scores[b] ? a : b
    );
    
    const maxScore = scores[topType];
    const totalPatterns = TEXT_PATTERNS[topType].length;
    const confidence = maxScore / totalPatterns;
    
    // If confidence is too low, mark as ambiguous
    if (confidence < 0.3 || maxScore === 0) {
        return { type: 'ambiguous', confidence: confidence };
    }
    
    return { type: topType, confidence: confidence };
}

function getAnalysisContext(classification, text) {
    const contexts = {
        jobDescription: {
            mode: 'jd',
            instruction: 'Analyzing the ideal candidate traits this role requires...'
        },
        personalWriting: {
            mode: 'general',
            instruction: 'Analyzing your personality based on your writing style and content...'
        },
        performanceReview: {
            mode: 'general',
            instruction: 'Analyzing personality traits from this performance review...'
        },
        resume: {
            mode: 'general',
            instruction: 'Analyzing your professional personality from your resume...'
        },
        coverLetter: {
            mode: 'general',
            instruction: 'Analyzing your personality from this cover letter...'
        },
        ambiguous: {
            mode: 'general',
            instruction: 'This text could be interpreted multiple ways. I\'ll analyze it as personal writing...'
        },
        insufficient: {
            mode: null,
            instruction: 'I need more text to provide an accurate personality analysis. Please share more details about yourself or paste a longer document.'
        }
    };
    
    return contexts[classification.type] || contexts.ambiguous;
}

// Terminal Intelligence Layer
class TerminalIntelligence {
    constructor() {
        this.conversationHistory = [];
        this.awaitingClarification = false;
        this.pendingAnalysis = null;
    }
    
    async processInput(userInput) {
        // Add to conversation history
        this.conversationHistory.push({
            type: 'user',
            content: userInput,
            timestamp: Date.now()
        });
        
        // Classify the input
        const classification = classifyTextType(userInput);
        const context = getAnalysisContext(classification, userInput);
        
        // Use Claude for natural responses based on classification
        try {
            const claudeResponse = await this.callClaudeAPI({
                message: userInput,
                classification: classification,
                context: context,
                conversationHistory: this.conversationHistory
            });
            
            // Add Claude response to conversation history
            this.conversationHistory.push({
                type: 'assistant',
                content: claudeResponse.message,
                timestamp: Date.now()
            });
            
            return claudeResponse;
            
        } catch (error) {
            console.error('❌ Claude API FAILED:', error);
            // NO FALLBACKS - show the real error
            throw new Error(`Claude API failed: ${error.message}`);
        }
    }
    
    processInputFallback(userInput, classification, context) {
        // Original logic as fallback
        if (classification.type === 'insufficient') {
            return {
                action: 'request_more_info',
                message: context.instruction
            };
        }
        
        if (classification.type === 'ambiguous' && classification.confidence < 0.3) {
            this.pendingAnalysis = { text: userInput, classification };
            this.awaitingClarification = true;
            return {
                action: 'request_clarification',
                message: 'This text could be analyzed in different ways:\n\n□ Analyze your personality (as the writer)\n□ Analyze the described person\'s traits\n\nWhich would you prefer?'
            };
        }
        
        // Ready for analysis
        return {
            action: 'analyze',
            classification: classification,
            context: context,
            text: userInput
        };
    }
    
    async callClaudeAPI(data) {
        try {
            // Use existing Claude client for terminal conversations
            const claudeClient = window.claudeClient || new ClaudeClient();
            
            // Build terminal-specific system prompt
            const terminalSystemPrompt = `You are a Terminal Assistant for personality analysis. You're helping users explore their personality through conversation.

Your role:
- Engage users in natural conversation
- Ask thoughtful questions about their work, interests, and experiences  
- Be curious and encouraging
- Keep responses concise (1-2 sentences) for terminal format
- Don't mention personality analysis explicitly - just have a natural conversation

Conversation context: ${data.classification?.type || 'general discussion'}`;

            // Prepare conversation messages
            const messages = [];
            
            // Add recent conversation history (last 6 messages to stay within context limits)
            const recentHistory = (data.conversationHistory || []).slice(-6);
            recentHistory.forEach(msg => {
                messages.push({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            });
            
            // Add current message
            messages.push({
                role: 'user',
                content: data.message
            });

            // Call Claude API
            const response = await fetch('/api/claude', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: messages,
                    system: terminalSystemPrompt,
                    max_tokens: 150 // Keep responses concise for terminal
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            const claudeMessage = result.content?.[0]?.text || result.message || 'I understand. Tell me more.';

            // Check if we should trigger personality analysis
            const conversationLength = (data.conversationHistory || []).length;
            const shouldAnalyze = conversationLength >= 8 || this.getTotalWordCount(data.conversationHistory) > 100;

            return {
                action: shouldAnalyze ? 'analyze' : 'chat',
                message: claudeMessage,
                classification: data.classification,
                context: data.context,
                text: data.message,
                shouldAnalyze: shouldAnalyze
            };

        } catch (error) {
            console.error('Claude API Error:', error);
            throw new Error(`Claude API call failed: ${error.message}`);
        }
    }

    getTotalWordCount(conversationHistory) {
        if (!conversationHistory) return 0;
        return conversationHistory.reduce((total, msg) => {
            // Only count user messages, not assistant responses
            if (msg.type === 'user') {
                return total + (msg.content?.split(' ').length || 0);
            }
            return total;
        }, 0);
    }

    findBestCharacterMatchFromOCEAN(oceanScores) {
        // Convert HF API OCEAN scores (1-5 scale) to character comparison format
        const userScores = {
            O: oceanScores.Openness || 0,
            C: oceanScores.Conscientiousness || 0,
            E: oceanScores.Extraversion || 0,
            A: oceanScores.Agreeableness || 0,
            N: oceanScores.Neuroticism || 0
        };

        console.log('🔍 User OCEAN scores for matching:', userScores);

        // Get character database from elliotGenerator
        const characters = window.elliotGenerator ? window.elliotGenerator.getCharacterData() : {};
        let bestMatch = null;
        let bestSimilarity = -1;

        for (const [charName, charData] of Object.entries(characters)) {
            // Calculate Euclidean distance between user and character OCEAN scores
            const distance = Math.sqrt(
                Math.pow(userScores.O - charData.O, 2) +
                Math.pow(userScores.C - charData.C, 2) +
                Math.pow(userScores.E - charData.E, 2) +
                Math.pow(userScores.A - charData.A, 2) +
                Math.pow(userScores.N - charData.N, 2)
            );

            // Convert distance to similarity (0-1 scale, where 1 is perfect match)
            const maxDistance = Math.sqrt(5 * Math.pow(4, 2)); // Max possible distance
            const similarity = 1 - (distance / maxDistance);

            console.log(`📊 ${charName}: distance=${distance.toFixed(2)}, similarity=${similarity.toFixed(3)}`);

            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = {
                    name: charName,
                    data: charData,
                    similarity: similarity
                };
            }
        }

        console.log('🎯 Best character match:', bestMatch);
        return bestMatch;
    }
    
    handleClarification(choice) {
        if (!this.awaitingClarification || !this.pendingAnalysis) {
            return { action: 'error', message: 'No pending analysis found.' };
        }
        
        this.awaitingClarification = false;
        const analysis = this.pendingAnalysis;
        this.pendingAnalysis = null;
        
        // Adjust mode based on user choice
        const mode = choice.toLowerCase().includes('writer') ? 'general' : 'jd';
        const instruction = choice.toLowerCase().includes('writer') 
            ? 'Analyzing your personality as the writer...'
            : 'Analyzing the described person\'s traits...';
        
        return {
            action: 'analyze',
            classification: analysis.classification,
            context: { mode, instruction },
            text: analysis.text
        };
    }
    
    addAssistantResponse(response) {
        this.conversationHistory.push({
            type: 'assistant',
            content: response,
            timestamp: Date.now()
        });
    }
}

// Terminal Animation
function runTerminalAnimation() {
    const output = document.getElementById('terminal-output');
    const promptLine = document.getElementById('prompt-line');
    
    
    if (!output || !promptLine) {
        console.error('Missing terminal elements - output:', !!output, 'promptLine:', !!promptLine);
        return;
    }
    
    const loadingSequence = [
        { text: 'Initializing...', delay: 1000 },
        { text: '', delay: 200 },
        { text: '███████ ██      ██      ██  ██████  ████████', delay: 20 },
        { text: '██      ██      ██      ██ ██    ██    ██   ', delay: 20 },
        { text: '█████   ██      ██      ██ ██    ██    ██   ', delay: 20 },
        { text: '██      ██      ██      ██ ██    ██    ██   ', delay: 20 },
        { text: '███████ ███████ ███████ ██  ██████     ██   ', delay: 20 },
        { text: '', delay: 300 },
        { text: '**PERSONA GENERATOR v2.0**', delay: 100 },
        { text: '', delay: 200 },
        { text: 'Chat naturally - I\'ll analyze your responses to create your personalized avatar', delay: 50 },
        { text: '', delay: 200 },
        { text: 'I need about 100 words from our conversation to analyze your personality traits and generate your unique "El" character. Just be yourself - tell me about your work, interests, or thoughts. No surveys needed, just natural conversation.', delay: 50 },
        { text: '', delay: 300 },
        { text: 'Ready for input...', delay: 100 }
    ];
    
    function typeWriter(text, element, speed = 30) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }
    
    async function runLoadingSequence() {
        // Clear existing content (prompt line now always visible)
        output.innerHTML = '';
        
        for (let i = 0; i < loadingSequence.length; i++) {
            const item = loadingSequence[i];
            const line = document.createElement('div');
            
            // Apply proper space preservation to ASCII art lines (indices 2-6)
            if (i >= 2 && i <= 6 && item.text.includes('█')) {
                line.style.whiteSpace = 'pre';
                line.style.fontFamily = 'monospace';
            }
            
            if (item.typewriter) {
                line.style.whiteSpace = 'pre';
                output.appendChild(line);
                await typeWriter(item.text, line, 10);
            } else {
                line.textContent = item.text;
                output.appendChild(line);
            }
            
            await new Promise(resolve => setTimeout(resolve, item.delay));
        }
        
        // Focus terminal input (prompt line always visible now)
        focusTerminalInput();
    }
    
    // Start animation
    runLoadingSequence();
}

// Hugging Face API Integration - Direct Client Calls
async function callPersonalityAPI(text, mode = 'general', context = {}) {
    console.log('🤗 Calling Hugging Face API directly');
    console.log('📝 Request payload:', { text: text.substring(0, 100) + '...', mode, context });
    
    try {
        const startTime = performance.now();
        
        // Connect to the HF Space
        const client = await window.GradioClient.connect("jrjrhan/personality_classification_OCEAN_en");
        
        // Call the prediction endpoint
        const result = await client.predict("/predict", {
            inputs: text
        });
        
        const endTime = performance.now();
        console.log(`⏱️ HF API call took: ${Math.round(endTime - startTime)}ms`);
        console.log('✅ HF API Response raw:', result);
        console.log('📊 HF API Response data:', result.data);
        console.log('🔍 HF API Response data[0]:', result.data[0]);
        console.log('🔍 HF API Response data[0] type:', typeof result.data[0]);
        
        // Handle the response - it's already an object, not a JSON string
        const oceanScores = result.data[0];
        console.log('🧠 OCEAN Scores:', oceanScores);
        
        // Transform HF response to match expected format
        const transformedResult = {
            ocean_scores: oceanScores,
            avatar_data: generateAvatarFromScores(oceanScores),
            explanation: generateExplanationFromScores(oceanScores),
            mode: mode,
            context: context,
            success: true
        };
        
        console.log('🔄 Transformed result:', transformedResult);
        return transformedResult;
        
    } catch (error) {
        console.error('💥 HF API call failed:', error);
        throw new Error(`Hugging Face API error: ${error.message}`);
    }
}

// Generate avatar data from OCEAN scores
function generateAvatarFromScores(oceanScores) {
    // Find the dominant trait
    let dominantTrait = null;
    let maxScore = 0;
    
    for (const [trait, score] of Object.entries(oceanScores)) {
        if (score > maxScore) {
            maxScore = score;
            dominantTrait = trait;
        }
    }
    
    // Character mapping based on dominant OCEAN trait
    const characterMap = {
        'Openness': {
            character: 'TheVisionary',
            title: 'Creative Innovator',
            description: 'Driven by curiosity and imagination, always exploring new possibilities.'
        },
        'Conscientiousness': {
            character: 'TheBuilder',
            title: 'Systematic Achiever', 
            description: 'Organized and goal-oriented, turning ideas into reality through discipline.'
        },
        'Extraversion': {
            character: 'TheConnector',
            title: 'Social Catalyst',
            description: 'Energized by interaction, building bridges between people and ideas.'
        },
        'Agreeableness': {
            character: 'TheHelper',
            title: 'Collaborative Spirit',
            description: 'Focused on harmony and cooperation, bringing out the best in others.'
        },
        'Neuroticism': {
            character: 'TheAnalyst',
            title: 'Thoughtful Observer',
            description: 'Highly aware and sensitive, providing deep insights and careful analysis.'
        }
    };
    
    const selectedCharacter = characterMap[dominantTrait] || characterMap['Openness'];
    
    return {
        character_name: selectedCharacter.character,
        title: selectedCharacter.title,
        description: selectedCharacter.description,
        ocean_scores: oceanScores,
        dominant_trait: dominantTrait
    };
}

// Generate explanation from OCEAN scores
function generateExplanationFromScores(oceanScores) {
    const traits = [];
    
    for (const [trait, score] of Object.entries(oceanScores)) {
        let level = 'moderate';
        if (score >= 4.0) level = 'high';
        else if (score <= 2.5) level = 'low';
        
        traits.push(`${trait}: ${level} (${score.toFixed(1)})`);
    }
    
    return `Personality analysis complete. Key traits: ${traits.join(', ')}. This profile suggests a unique blend of characteristics that shape your approach to problem-solving and interaction.`;
}

// Terminal Display Functions
function addTerminalLine(text, isUser = false) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const line = document.createElement('div');
    if (isUser) {
        line.innerHTML = `<span style="color: #61dafb;">user@terminal ~ %</span> <span style="color: #ffffff;">${text}</span>`;
    } else {
        line.innerHTML = text; // Allow HTML formatting for bot responses
    }
    output.appendChild(line);
    
    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
}

function showTypingIndicator() {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span style="color: #666;">Analyzing...</span>';
    output.appendChild(indicator);
    output.scrollTop = output.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function updateAvatarCard(analysisResult) {
    console.log('🎭 Updating avatar card with analysis result:', analysisResult);
    
    // Update avatar card with analysis results from Flask backend
    if (analysisResult && (analysisResult.avatar_data || analysisResult.explanation)) {
        const avatarCard = document.getElementById('avatarCard');
        const personaName = document.getElementById('personaName');
        const personaTitle = document.getElementById('personaTitle');
        const personaDescription = document.getElementById('personaDescription');
        
        // Extract character info from avatar_data or explanation
        let characterName = 'AI Character';
        let characterTitle = 'Personality Match';
        let characterDescription = analysisResult.explanation || 'Analysis complete';
        
        if (analysisResult.avatar_data) {
            console.log('📊 Processing avatar_data:', analysisResult.avatar_data);
            // Handle different avatar_data formats
            if (typeof analysisResult.avatar_data === 'string') {
                console.log('🔍 Parsing string avatar_data:', analysisResult.avatar_data);
                // Parse "FREAKYEL avatar activating: Creative, unconventional thinker..."
                const match = analysisResult.avatar_data.match(/(\w+)\s+avatar\s+activating:\s*(.+)/i);
                if (match) {
                    characterName = match[1];
                    characterDescription = match[2];
                } else {
                    console.log('⚠️ String format did not match expected pattern');
                }
            } else if (analysisResult.avatar_data.title) {
                characterName = analysisResult.avatar_data.title;
                characterTitle = analysisResult.avatar_data.archetype?.description || characterTitle;
            }
        } else {
            console.log('⚠️ No avatar_data found in analysis result');
        }
        
        // Update the card elements
        console.log('🔧 DEBUG: Updating persona name element');
        console.log('🔍 DEBUG: personaName element exists:', !!personaName);
        console.log('🔍 DEBUG: characterName to set:', characterName);
        
        if (personaName) {
            personaName.textContent = characterName;
            console.log('✅ DEBUG: personaName updated to:', personaName.textContent);
        } else {
            console.error('❌ DEBUG: personaName element not found when trying to update');
        }
        
        if (personaTitle) {
            personaTitle.textContent = characterTitle;
        }
        
        if (personaDescription) {
            personaDescription.textContent = characterDescription;
        }
        
        // Generate avatar for the character
        if (window.avatarGenerator && characterName) {
            console.log('🎨 Generating avatar for character:', characterName);
            const avatarOptions = {
                personalityScores: analysisResult.personality_scores || {},
                analysisData: analysisResult,
                source: 'terminal_analysis'
            };
            
            window.avatarGenerator.generateAvatar(characterName, avatarOptions).then(avatarData => {
                if (avatarData && avatarCard) {
                    // Update avatar display in the card
                    const avatarImage = window.avatarGenerator.renderAvatarImage(avatarData);
                    const existingAvatar = avatarCard.querySelector('.avatar-display');
                    if (existingAvatar) {
                        existingAvatar.innerHTML = avatarImage;
                    } else {
                        // Create avatar display if it doesn't exist
                        const avatarDisplay = document.createElement('div');
                        avatarDisplay.className = 'avatar-display';
                        avatarDisplay.innerHTML = avatarImage;
                        avatarCard.appendChild(avatarDisplay);
                    }
                }
            }).catch(error => {
                console.error('Avatar generation failed:', error);
            });
        }
        
    } else {
        console.warn('⚠️ No avatar data found in analysis result');
    }
    
    // Update radar charts if personality scores exist
    if (analysisResult.personality_scores) {
        // This would integrate with existing radar chart code
    }
}

// Terminal Focus Handler
function focusTerminalInput() {
    const input = document.querySelector('.input-line');
    if (input) {
        input.focus();
    }
}

// Terminal Debug System
class TerminalDebugger {
    constructor() {
        this.enabled = true; // Set to false to disable debugging
        this.steps = [];
    }
    
    debug(step, data = {}) {
        if (!this.enabled) return;
        
        const timestamp = new Date().toISOString().slice(11, 23);
        const debugInfo = {
            timestamp,
            step,
            data,
            stackTrace: new Error().stack.split('\n').slice(2, 4)
        };
        
        this.steps.push(debugInfo);
        
        if (Object.keys(data).length > 0) {
            Object.entries(data).forEach(([key, value]) => {
            });
        }
    }
    
    error(step, error, data = {}) {
        if (!this.enabled) return;
        
        const timestamp = new Date().toISOString().slice(11, 23);
        console.error('Error:', error);
        console.error('Stack:', error.stack);
    }
    
    success(step, data = {}) {
        if (!this.enabled) return;
        
        const timestamp = new Date().toISOString().slice(11, 23);
    }
}

// Global terminal intelligence and debugger
let globalTerminalIntelligence = null;
const terminalDebugger = new TerminalDebugger();

// Terminal Mode Functionality
function initializeTerminalMode() {
    terminalDebugger.debug('Initializing Terminal Mode', {
        timestamp: Date.now()
    });
    
    const terminalModeBtn = document.getElementById('terminalModeBtn');
    const terminalCloseBtn = document.getElementById('terminalCloseBtn');
    const terminalContainer = document.getElementById('terminalContainer');
    const traitSelectorCard = document.querySelector('.trait-panel');
    const terminalInput = document.getElementById('terminalInput');
    const advancedSection = document.querySelector('.advanced-section');
    const advancedHeader = document.querySelector('.advanced-header');
    
    terminalDebugger.debug('Elements Found', {
        terminalModeBtn: !!terminalModeBtn,
        terminalCloseBtn: !!terminalCloseBtn,
        terminalContainer: !!terminalContainer,
        traitSelectorCard: !!traitSelectorCard,
        terminalInput: !!terminalInput,
        traitPanelSelector: '.trait-panel',
        actualElement: traitSelectorCard ? traitSelectorCard.className : 'null'
    });
    
    // Advanced dropdown functionality
    if (advancedHeader && advancedSection) {
        advancedHeader.addEventListener('click', () => {
            advancedSection.classList.toggle('expanded');
        });
    }
    
    terminalDebugger.debug('Event Handler Setup Check', {
        terminalModeBtn: !!terminalModeBtn,
        terminalContainer: !!terminalContainer,
        traitSelectorCard: !!traitSelectorCard,
        willSetupHandlers: !!(terminalModeBtn && terminalContainer && traitSelectorCard)
    });
    
    if (terminalModeBtn && terminalContainer && traitSelectorCard) {
        terminalDebugger.success('Setting Up Terminal Event Handlers');
        // Enter terminal mode
        terminalModeBtn.addEventListener('click', () => {
            terminalDebugger.debug('Terminal Mode Button Clicked', {
                timestamp: Date.now()
            });
            
            try {
                // Initialize terminal intelligence
                globalTerminalIntelligence = new TerminalIntelligence();
                terminalDebugger.success('TerminalIntelligence Created', {
                    instance: !!globalTerminalIntelligence,
                    type: typeof globalTerminalIntelligence
                });
                
                // Trigger flip animation to show the terminal
                traitSelectorCard.classList.add('flipped');
                terminalContainer.classList.add('flipped');
                terminalDebugger.debug('Terminal Flip Animation Started', {
                    traitSelectorFlipped: traitSelectorCard.classList.contains('flipped'),
                    terminalContainerFlipped: terminalContainer.classList.contains('flipped')
                });
                
                // Check and run terminal animation
                terminalDebugger.debug('Checking runTerminalAnimation', {
                    functionExists: typeof runTerminalAnimation === 'function',
                    functionType: typeof runTerminalAnimation
                });
                
                if (typeof runTerminalAnimation === 'function') {
                    runTerminalAnimation();
                    terminalDebugger.success('Terminal Animation Started');
                } else {
                    terminalDebugger.error('Terminal Animation Function Missing', new Error('runTerminalAnimation not found'));
                }
                
            } catch (error) {
                terminalDebugger.error('Terminal Mode Initialization Failed', error);
            }
        });

        terminalCloseBtn.addEventListener('click', () => {
            terminalDebugger.debug('Terminal Close Button Clicked');
            
            // Trigger flip animation to show the trait selector card
            traitSelectorCard.classList.remove('flipped');
            terminalContainer.classList.remove('flipped');
            
            // Reset terminal intelligence
            globalTerminalIntelligence = null;
            
            // Cleanup terminal cursor if it exists
            if (globalTerminal) {
                globalTerminal.cleanup();
            }
            
            terminalDebugger.success('Terminal Closed and Reset', {
                terminalIntelligence: globalTerminalIntelligence
            });
        });
        
        // Handle terminal input processing
        async function processTerminalInput(userInput) {
            terminalDebugger.debug('Processing Terminal Input', {
                userInput,
                inputLength: userInput.length,
                terminalIntelligenceExists: !!globalTerminalIntelligence
            });
            
            if (!globalTerminalIntelligence) {
                terminalDebugger.error('Terminal Intelligence Not Available', new Error('globalTerminalIntelligence is null'), {
                    userInput
                });
                return;
            }
            
            try {
                // Add user input to terminal display
                addTerminalLine(userInput, true);
                terminalDebugger.debug('User Input Added to Display', { userInput });
                
                // Process input through intelligence layer (now async)
                console.log('🎯 STEP 1: Calling TerminalIntelligence.processInput()');
                console.log('📝 Input text:', userInput.substring(0, 100) + '...');
                
                terminalDebugger.debug('Calling processInput on TerminalIntelligence');
                const result = await globalTerminalIntelligence.processInput(userInput);
                
                console.log('📊 Result action:', result.action);
                console.log('📄 Result message:', result.message?.substring(0, 200) + '...');
                console.log('🔍 Full result object:', result);
                
                terminalDebugger.success('Terminal Intelligence Process Complete', {
                    action: result.action,
                    hasMessage: !!result.message,
                    messageLength: result.message ? result.message.length : 0
                });
                
                switch (result.action) {
                case 'chat':
                    // Handle Claude conversation responses
                    terminalDebugger.debug('Action: Chat', { message: result.message });
                    addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">${result.message}</span>`);
                    
                    // Show word count progress
                    const currentWordCount = globalTerminalIntelligence.getTotalWordCount(
                        globalTerminalIntelligence.conversationHistory
                    );
                    const progressColor = currentWordCount >= 100 ? '#61dafb' : '#888';
                    const progressText = currentWordCount >= 100 
                        ? '✓ Ready for analysis!' 
                        : `Word count: ${currentWordCount}/100`;
                    
                    setTimeout(() => {
                        addTerminalLine(`<span style="color: ${progressColor}; font-size: 0.9em; font-style: italic;">${progressText}</span>`);
                    }, 500);
                    
                    // Show analysis trigger hint if getting close
                    if (result.shouldAnalyze) {
                        setTimeout(() => {
                            addTerminalLine('💡 I have enough information now. Let me analyze your personality...');
                        }, 1000);
                    }
                    break;
                    
                case 'request_more_info':
                    terminalDebugger.debug('Action: Request More Info', { message: result.message });
                    addTerminalLine(result.message);
                    break;
                    
                case 'request_clarification':
                    terminalDebugger.debug('Action: Request Clarification', { message: result.message });
                    addTerminalLine(result.message);
                    
                    // Check if the message contains character identification and trigger avatar generation
                    if (result.message && result.message.includes('avatar should appear')) {
                        console.log('🎨 Request clarification contains avatar identification, extracting character...');
                        const avatarMatch = result.message.match(/\[(\w+)\s+avatar\s+should\s+appear/i);
                        if (avatarMatch) {
                            const characterName = avatarMatch[1];
                            console.log('🎯 Extracted character name:', characterName);
                            
                            // Create analysis result object for avatar generation
                            const analysisResult = {
                                avatar_data: `${characterName} avatar activating: ${result.message.split('- matches the ')[1] || 'Personality match identified'}`,
                                explanation: result.message,
                                personality_scores: result.classification || {},
                                source: 'terminal_clarification'
                            };
                            
                            console.log('🎭 Triggering avatar generation with:', analysisResult);
                            updateAvatarCard(analysisResult);
                        }
                    }
                    break;
                    
                case 'analyze':
                    console.log('🎯 STEP 3: Action is ANALYZE - aggregating conversation for HF API');
                    
                    // Aggregate entire conversation history for personality analysis
                    const conversationText = globalTerminalIntelligence.conversationHistory
                        .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
                        .join('\n\n');
                    
                    console.log('📝 Conversation text to analyze:', conversationText.substring(0, 200) + '...');
                    console.log('📊 Total conversation length:', conversationText.length);
                    
                    terminalDebugger.debug('Action: Analyze', {
                        conversationLength: conversationText.length,
                        messageCount: globalTerminalIntelligence.conversationHistory.length
                    });
                    
                    // Show analysis message
                    addTerminalLine('🧠 Analyzing your conversation for personality insights...');
                    showTypingIndicator();
                    
                    try {
                        console.log('🎯 STEP 4: Starting HF API call for personality analysis...');
                        terminalDebugger.debug('Calling HF Personality API', {
                            textLength: conversationText.length
                        });
                        
                        // Call HF API for personality analysis
                        const analysisResult = await callPersonalityAPI(
                            conversationText, 
                            'conversation', 
                            { 
                                source: 'terminal_conversation',
                                messageCount: globalTerminalIntelligence.conversationHistory.length
                            }
                        );
                        
                        
                        removeTypingIndicator();
                        terminalDebugger.success('HF API Call Complete', {
                            hasOceanScores: !!analysisResult.ocean_scores,
                            hasAvatarData: !!analysisResult.avatar_data
                        });
                        
                        // Process successful HF analysis
                        if (analysisResult.success) {
                            console.log('🎯 STEP 6: Processing successful HF API response');
                            console.log('🎉 HF analysis successful! Result:', analysisResult);
                            
                            // Display OCEAN scores in terminal
                            if (analysisResult.ocean_scores) {
                                const scoresText = Object.entries(analysisResult.ocean_scores)
                                    .map(([trait, score]) => `${trait}: ${score.toFixed(1)}`)
                                    .join(', ');
                                addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">Your personality scores: ${scoresText}</span>`);
                            }
                            
                            addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">✅ Analysis complete! Generating your personalized avatar...</span>`);
                            
                            console.log('🎯 STEP 7: Triggering full avatar generation...');
                            
                            // DEBUG: Check conditional requirements before avatar generation
                            console.log('🔍 Pre-conditional debug:');
                            console.log('🔍 window.elliotGenerator exists:', !!window.elliotGenerator);
                            console.log('🔍 window.elliotGenerator value:', window.elliotGenerator);
                            console.log('🔍 analysisResult.ocean_scores exists:', !!analysisResult.ocean_scores);
                            console.log('🔍 analysisResult.ocean_scores value:', analysisResult.ocean_scores);
                            console.log('🔍 Overall conditional result:', !!(window.elliotGenerator && analysisResult.ocean_scores));
                            
                            // Find best character match based on OCEAN scores
                            if (window.oceanSystem && analysisResult.ocean_scores) {
                                // Convert HF API format to Ocean system format
                                const oceanScores = {
                                    openness: (analysisResult.ocean_scores.Openness || 3) / 5,
                                    conscientiousness: (analysisResult.ocean_scores.Conscientiousness || 3) / 5,
                                    extraversion: (analysisResult.ocean_scores.Extraversion || 3) / 5,
                                    agreeableness: (analysisResult.ocean_scores.Agreeableness || 3) / 5,
                                    neuroticism: (analysisResult.ocean_scores.Neuroticism || 3) / 5
                                };
                                
                                console.log('🎯 DEBUG: Converted OCEAN scores:', oceanScores);
                                
                                // Use Ocean system's character matching (same as trait selector)
                                const originalScores = window.oceanSystem.userScores;
                                window.oceanSystem.userScores = oceanScores;
                                const match = window.oceanSystem.findBestCharacterMatch();
                                window.oceanSystem.userScores = originalScores; // Restore original scores
                                
                                console.log('🎯 DEBUG: Character match result:', match);
                                
                                if (match.character && window.avatarGenerator) {
                                    // Generate avatar for the matched character
                                    console.log('🎯 DEBUG: About to call generateAvatar for:', match.character.name);
                                    console.log('🎯 DEBUG: window.avatarGenerator exists:', !!window.avatarGenerator);
                                    
                                    let avatarData;
                                    try {
                                        avatarData = await window.avatarGenerator.generateAvatar(match.character.name);
                                        console.log('🎯 DEBUG: generateAvatar returned:', avatarData);
                                        console.log('🎯 DEBUG: avatarData type:', typeof avatarData);
                                        console.log('🎯 DEBUG: avatarData truthy:', !!avatarData);
                                    } catch (error) {
                                        console.error('❌ DEBUG: generateAvatar failed with error:', error);
                                        console.error('❌ DEBUG: Error stack:', error.stack);
                                        avatarData = null;
                                    }
                                    
                                    // Use Ocean system's display method for consistent UI
                                    if (avatarData) {
                                        // Create match object for display
                                        const displayMatch = {
                                            character: match.character,
                                            similarity: match.similarity,
                                            avatarData: avatarData
                                        };
                                        
                                        console.log('🎯 DEBUG: Calling Ocean system display method');
                                        await window.oceanSystem.displayCharacterWithScrambling(displayMatch);
                                        
                                        const matchPercentage = Math.round(match.similarity * 100);
                                        addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">🎯 Best match: "${match.character.name}" (${matchPercentage}% similarity)</span>`);
                                        addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">🎨 Your avatar is ready!</span>`);
                                    }
                                } else {
                                    addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">❌ Unable to find character match. Please try again.</span>`);
                                }
                            } else {
                                console.log('❌ CONDITIONAL FAILED: Avatar generation skipped');
                                if (!window.oceanSystem) {
                                    console.log('❌ Missing: window.oceanSystem is', typeof window.oceanSystem);
                                }
                                if (!analysisResult.ocean_scores) {
                                    console.log('❌ Missing: analysisResult.ocean_scores is', analysisResult.ocean_scores);
                                }
                                addTerminalLine(`<span style="color: #61dafb;">elliot@terminal ~ %</span> <span style="color: #ffffff;">❌ Avatar generation failed - missing required components</span>`);
                            }
                            
                            console.log('🎯 STEP 8: Character card and radar charts updated');
                            terminalDebugger.success('Avatar & Charts Updated', {
                                hasOceanScores: !!analysisResult.ocean_scores,
                                hasAvatarData: !!analysisResult.avatar_data,
                                hasExplanation: !!analysisResult.explanation
                            });
                            
                            // Add response to conversation history
                            globalTerminalIntelligence.conversationHistory.push({
                                type: 'assistant',
                                content: 'Analysis completed successfully - your personality profile and avatar are ready!',
                                timestamp: Date.now()
                            });
                        } else {
                            addTerminalLine('❌ Analysis failed: ' + (analysisResult.error || 'Unknown error'));
                        }
                        
                    } catch (error) {
                        removeTypingIndicator();
                        terminalDebugger.error('❌ FLASK API CALL FAILED:', error);
                        // Show the EXACT error message with red styling
                        const errorMessage = error.message || error.toString();
                        addTerminalLine(`<span style="color: #ff4444; font-weight: bold;">❌ FLASK API FAILED: ${errorMessage}</span>`);
                        console.error('🔥 Complete Flask API error details:', error);
                    }
                    break;
                    
                case 'error':
                    terminalDebugger.error('Action: Error', new Error(result.message));
                    addTerminalLine(result.message);
                    break;
                    
                default:
                    terminalDebugger.error('Unknown Action', new Error(`Unknown action: ${result.action}`), result);
                    addTerminalLine('An unexpected error occurred. Please try again.');
                    break;
            }
            
            } catch (error) {
                terminalDebugger.error('❌ TERMINAL PROCESSING FAILED:', error, { userInput });
                // Show the EXACT error with red styling
                const errorMessage = error.message || error.toString();
                addTerminalLine(`<span style="color: #ff4444; font-weight: bold;">❌ TERMINAL ERROR: ${errorMessage}</span>`);
                console.error('🔥 Terminal processing error details:', error);
            }
        }
        
        // Expose processTerminalInput globally for Terminal class access
        window.processTerminalInput = processTerminalInput;
        
        // Handle terminal input
        const inputLine = document.querySelector('.input-line');
        const inputElement = terminalInput || inputLine;
        
        terminalDebugger.debug('Input Element Setup', {
            terminalInput: !!terminalInput,
            inputLine: !!inputLine,
            inputElement: !!inputElement,
            elementId: inputElement ? inputElement.id : 'none',
            elementClass: inputElement ? inputElement.className : 'none'
        });
        
        // NOTE: Event handlers removed - now handled by TerminalCursor class and Terminal class
        terminalDebugger.debug('Input Element Found - Event handling delegated to TerminalCursor', {
            terminalInput: !!terminalInput,
            inputLine: !!inputLine,
            inputElement: !!inputElement,
            elementId: inputElement ? inputElement.id : 'none'
        });
        
        // Handle input focus on terminal click
        if (terminalContainer) {
            terminalContainer.addEventListener('click', focusTerminalInput);
        }
    }
}

// Add basic console test to verify script is loading

// Initialize function
function initializeTraitSelector() {
    console.log('🔧 DEBUG: initializeTraitSelector() called');
    console.log('🔍 DEBUG: window.AvatarGenerator type:', typeof window.AvatarGenerator);
    console.log('🔍 DEBUG: window.avatarGenerator exists:', !!window.avatarGenerator);
    
    if (typeof window.AvatarGenerator !== 'undefined' && !window.avatarGenerator) {
        console.log('🔧 DEBUG: Creating new AvatarGenerator instance...');
        try {
            window.avatarGenerator = new window.AvatarGenerator();
            console.log('✅ DEBUG: AvatarGenerator initialized successfully');
            console.log('🔍 DEBUG: AvatarGenerator methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.avatarGenerator)));
        } catch (error) {
            console.error('❌ DEBUG: Failed to initialize avatar generator:', error);
            console.error('❌ DEBUG: AvatarGenerator error stack:', error.stack);
        }
    } else if (typeof window.AvatarGenerator === 'undefined') {
        console.error('❌ DEBUG: AvatarGenerator class not loaded - check script imports');
        console.log('🔍 DEBUG: Available window objects with Avatar:', Object.keys(window).filter(key => key.includes('Avatar')));
    } else {
        console.log('ℹ️ Avatar generator already initialized');
    }

    // Only initialize if trait selector elements exist
    if (document.querySelector('.trait-selector-container')) {
        window.elliotGenerator = new ElliotGenerator();
    }
    
    // Initialize terminal mode functionality
    initializeTerminalMode();
}

// Initialize trait selector - DOM is already ready since script loads at bottom of HTML
// But add both immediate execution and DOMContentLoaded fallback for safety
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTraitSelector);
} else {
    initializeTraitSelector();
}

// Export for global access
window.ElliotGenerator = ElliotGenerator;
window.WaterASCII = WaterASCII;
window.Terminal = Terminal;