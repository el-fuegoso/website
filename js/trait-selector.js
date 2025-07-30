// Trait Selector JavaScript - Interactive avatar generation interface

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
            }, index * 150);
        });
        
        // Add divider and instructions after ASCII art
        setTimeout(() => {
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace; font-weight: bold;">PERSONA GENERATOR | Custom Neural Architecture</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">════════════════════════════════════════════════════════════</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">I built a specialized LLM head that extracts Big Five personality</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">traits from any text input. Doesn't matter what you feed it.</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">Resume? Job description? Essay you wrote? Random thoughts?</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">The model reads between the lines and pulls your psychological</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">profile. Then generates your personalized "El" avatar.</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">No surveys. No questionnaires. Just raw text analysis.</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">────────────────────────────────────────────────────────────</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">Ready for input...</span>`);
            this.addPrompt();
        }, elliotLines.length * 150 + 300);
    }

    async processInput() {
        const userInput = this.input.value.trim();
        if (!userInput) return;

        this.isProcessing = true;
        
        // Replace the input line with the completed command
        this.input.parentNode.innerHTML = `<span style="color: #61dafb; font-family: 'Roboto Mono', monospace;">elliot@terminal ~ % </span><span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">${userInput}</span>`;
        
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
            
            // Add event listener for cursor positioning
            this.input.addEventListener('input', this.updateCursorPosition.bind(this));
            this.input.addEventListener('keyup', this.updateCursorPosition.bind(this));
            
            // Initialize cursor position
            this.updateCursorPosition();
        }
        
        // Scroll output to bottom
        if (this.output) {
            this.output.scrollTop = this.output.scrollHeight;
        }
    }

    updateCursorPosition() {
        const cursor = document.querySelector('.cursor');
        const input = this.input;
        
        if (cursor && input) {
            // Calculate character width in Roboto Mono
            const charWidth = 7.2; // pixels for 12px Roboto Mono
            const inputLength = input.value.length;
            const cursorPosition = inputLength * charWidth;
            
            // Update cursor position with margin-left
            cursor.style.marginLeft = `${cursorPosition + 2}px`;
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
        console.log('🔧 generateElliot() called - starting trait-based generation');
        if (this.isGenerating) {
            console.log('⚠️ Generation already in progress, skipping');
            return;
        }

        this.isGenerating = true;
        console.log('✅ Starting Elliot generation process');
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
                // Ultra fallback - just use TheBuilder
                if (window.avatarGenerator) {
                    const avatarData = await window.avatarGenerator.generateAvatar('TheBuilder');
                    const builderData = this.getCharacterData()['TheBuilder'];
                    this.displayElliotWithAvatar({
                        name: 'TheBuilder',
                        title: builderData.title,
                        description: builderData.description,
                        characterName: 'TheBuilder',
                        avatarData: avatarData,
                        analysisData: { matched_character: { similarity_score: 0.5 } }
                    });
                } else {
                    const elliotData = await this.generateDemoElliot();
                    this.displayElliot(elliotData);
                }
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
        
        // Activate water ascii generating animation
        const waterAscii = document.getElementById('avatarCard');
        if (waterAscii) waterAscii.classList.add('generating');

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
        
        // Remove water ascii generating state
        const waterAscii = document.getElementById('avatarCard');
        if (waterAscii) waterAscii.classList.remove('generating');
        
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

        // Clear the water ASCII content and replace with avatar
        waterAsciiContainer.innerHTML = '';
        waterAsciiContainer.className = 'avatar-display-container';

        // Render the avatar component
        if (elliotData.avatarData && window.avatarGenerator) {
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
        }
    }

    enableChatButton(elliotData) {
        
        // Find the static chat button
        const chatBtn = document.getElementById('chatNowBtn');
        
        if (!chatBtn) {
            console.error('❌ CRITICAL: Chat button not found in HTML - ID chatNowBtn missing!');
            // Let's check what elements DO exist
            const allButtons = document.querySelectorAll('button');
            const avatarCard = document.querySelector('.avatar-card');
            return;
        }
        
        // Check parent container
        const parentContainer = chatBtn.parentElement;
        
        // Enable the button and make it fully visible
        chatBtn.disabled = false;
        chatBtn.style.opacity = '1';
        
        
        // Add click handler
        chatBtn.onclick = () => {
            
            try {
                this.openChatWithCharacter(elliotData);
            } catch (error) {
                console.error('❌ CRITICAL: Error in button click handler:', error);
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
        // Get user's Big Five scores
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

        if (!characterBigFive) return;

        // Update both radar charts
        this.drawRadarChart('userRadarChart', userBigFive, '#004225');
        this.drawRadarChart('characterRadarChart', characterBigFive, '#CC7A00');
        
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

        // Restore original water ASCII structure
        waterAsciiContainer.className = 'water-ascii';
        waterAsciiContainer.innerHTML = '<pre id="asciiContent"></pre>';

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
        // Use HF backend for terminal API calls
        const result = await callPersonalityAPI(data.message, 'conversation', {
            character_name: 'TerminalAssistant',
            terminal_context: {
                classification: data.classification,
                context: data.context,
                conversation_history: data.conversationHistory
            }
        });
        
        if (result.status === 'success') {
            // Determine action based on classification
            let action = 'analyze';
            if (data.classification.type === 'insufficient') {
                action = 'request_more_info';
            } else if (data.classification.type === 'ambiguous' && data.classification.confidence < 0.3) {
                action = 'request_clarification';
                this.pendingAnalysis = { text: data.message, classification: data.classification };
                this.awaitingClarification = true;
            }
            
            return {
                action: action,
                message: result.response?.message || result.response || 'Analysis complete',
                classification: data.classification,
                context: data.context,
                text: data.message
            };
        } else {
            throw new Error(result.error || 'Claude API call failed');
        }
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
        { 
            text: `███████ ██      ██      ██  ██████  ████████
██      ██      ██      ██ ██    ██    ██   
█████   ██      ██      ██ ██    ██    ██   
██      ██      ██      ██ ██    ██    ██   
███████ ███████ ███████ ██  ██████     ██   `, 
            delay: 1200
        },
        { text: '', delay: 300 },
        { text: '**PERSONA GENERATOR v2.0**', delay: 100 },
        { text: '', delay: 200 },
        { text: 'I built a specialized LLM head that extracts Big Five', delay: 50 },
        { text: 'personality traits from any text input. Doesn\'t matter', delay: 50 },
        { text: 'what you feed it.', delay: 50 },
        { text: '', delay: 200 },
        { text: 'Resume? Job description? Essay you wrote? Random thoughts?', delay: 50 },
        { text: 'The model reads between the lines and pulls your', delay: 50 },
        { text: 'psychological profile. Then generates your personalized', delay: 50 },
        { text: '"El" avatar.', delay: 50 },
        { text: '', delay: 200 },
        { text: 'No surveys. No questionnaires. Just raw text analysis.', delay: 50 },
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

// Python Backend Integration
async function callPersonalityAPI(text, mode = 'general', context = {}) {
    const HF_BACKEND_URL = window.HF_BACKEND_URL || 'http://localhost:5002';
    const fullUrl = `${HF_BACKEND_URL}/api/analyze`;
    
    console.log('🚀 FLASK API CALL START');
    console.log('📡 URL:', fullUrl);
    console.log('📝 Request payload:', { text: text.substring(0, 100) + '...', mode, context });
    
    const requestBody = {
        text: text,
        mode: mode,
        context: context
    };
    
    try {
        const startTime = performance.now();
        
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const endTime = performance.now();
        console.log(`⏱️ API call took: ${Math.round(endTime - startTime)}ms`);
        console.log(`📊 Response status: ${response.status}`);
        console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            // Get the error response body for debugging
            let errorBody = '';
            try {
                errorBody = await response.text();
                console.error('❌ Error response body:', errorBody);
            } catch (e) {
                console.error('❌ Could not read error response body');
            }
            
            throw new Error(`Flask API HTTP ${response.status}: ${response.statusText}${errorBody ? ' - ' + errorBody : ''}`);
        }

        const jsonResponse = await response.json();
        console.log('✅ Flask API SUCCESS - Response:', jsonResponse);
        return jsonResponse;
        
    } catch (error) {
        console.error('🔥 FLASK API CALL FAILED:');
        console.error('🔗 URL:', fullUrl);
        console.error('📤 Request:', requestBody);
        console.error('💥 Error:', error);
        
        // Enhanced error message based on error type
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error(`Network error - Cannot reach Flask backend at ${fullUrl}. Check if Hugging Face Space is running.`);
        } else if (error.message.includes('HTTP')) {
            throw error; // Already has good HTTP error info
        } else {
            throw new Error(`Flask API error: ${error.message}`);
        }
    }
}

// Terminal Display Functions
function addTerminalLine(text, isUser = false) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const line = document.createElement('div');
    if (isUser) {
        line.innerHTML = `<span style="color: #00ff41;">elliot@terminal ~ %</span> ${text}`;
    } else {
        line.textContent = text;
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
                    console.log('✅ Extracted character:', { characterName, characterDescription });
                } else {
                    console.log('⚠️ String format did not match expected pattern');
                }
            } else if (analysisResult.avatar_data.title) {
                characterName = analysisResult.avatar_data.title;
                characterTitle = analysisResult.avatar_data.archetype?.description || characterTitle;
                console.log('✅ Used object format:', { characterName, characterTitle });
            }
        } else {
            console.log('⚠️ No avatar_data found in analysis result');
        }
        
        // Update the card elements
        if (personaName) {
            personaName.textContent = characterName;
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
        
        console.log('✅ Avatar card updated successfully');
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
                
                console.log('✅ STEP 2: TerminalIntelligence response received');
                console.log('📊 Result action:', result.action);
                console.log('📄 Result message:', result.message?.substring(0, 200) + '...');
                console.log('🔍 Full result object:', result);
                
                terminalDebugger.success('Terminal Intelligence Process Complete', {
                    action: result.action,
                    hasMessage: !!result.message,
                    messageLength: result.message ? result.message.length : 0
                });
                
                switch (result.action) {
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
                    console.log('🎯 STEP 3: Action is ANALYZE - calling Flask backend');
                    console.log('📝 Text to analyze:', result.text?.substring(0, 100) + '...');
                    console.log('⚙️ Analysis mode:', result.context?.mode);
                    console.log('🏷️ Classification:', result.classification);
                    
                    terminalDebugger.debug('Action: Analyze', {
                        text: result.text,
                        mode: result.context.mode,
                        classification: result.classification
                    });
                    
                    // Show analysis message
                    addTerminalLine(result.context.instruction);
                    showTypingIndicator();
                    
                    try {
                        console.log('🎯 STEP 4: Starting Flask API call...');
                        terminalDebugger.debug('Calling Personality API', {
                            text: result.text.substring(0, 100) + '...',
                            mode: result.context.mode
                        });
                        
                        // Call Python backend
                        const analysisResult = await callPersonalityAPI(
                            result.text, 
                            result.context.mode, 
                            { classification: result.classification }
                        );
                        
                        console.log('✅ STEP 5: Flask API call completed successfully');
                        
                        removeTypingIndicator();
                        terminalDebugger.success('API Call Complete', {
                            status: analysisResult.status,
                            hasData: !!analysisResult.data
                        });
                        
                        // Process successful analysis
                        if (analysisResult.status === 'success') {
                            console.log('🎯 STEP 6: Processing successful Flask response');
                            console.log('🎉 Flask analysis successful! Result:', analysisResult);
                            addTerminalLine('✅ Analysis complete! Your personalized avatar has been generated.');
                            
                            console.log('🎯 STEP 7: Updating character card...');
                            // Update avatar card with results
                            updateAvatarCard(analysisResult);
                            
                            console.log('🎯 STEP 8: Character card update completed');
                            terminalDebugger.success('Avatar Card Updated', {
                                hasAvatarData: !!analysisResult.avatar_data,
                                hasExplanation: !!analysisResult.explanation,
                                hasPersonalityScores: !!analysisResult.personality_scores
                            });
                            
                            // Add response to conversation history
                            globalTerminalIntelligence.addAssistantResponse('Analysis completed successfully');
                        } else {
                            addTerminalLine('Analysis failed: ' + (analysisResult.error || 'Unknown error'));
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
        
        if (inputElement) {
            terminalDebugger.success('Attaching Keydown Event Handler to Input Element');
            inputElement.addEventListener('keydown', async (e) => {
                terminalDebugger.debug('Keydown Event Detected', {
                    key: e.key,
                    inputValue: inputElement.value,
                    terminalIntelligenceExists: !!globalTerminalIntelligence
                });
                
                if (e.key === 'Enter') {
                    terminalDebugger.debug('Enter Key Pressed', {
                        inputValue: inputElement.value
                    });
                    
                    const value = inputElement.value.trim();
                    terminalDebugger.debug('Input Value Processed', {
                        originalValue: inputElement.value,
                        trimmedValue: value,
                        hasValue: !!value,
                        terminalIntelligenceExists: !!globalTerminalIntelligence
                    });
                    
                    if (value && globalTerminalIntelligence) {
                        try {
                            // Clear input immediately
                            inputElement.value = '';
                            terminalDebugger.debug('Input Field Cleared');
                            
                            // Handle clarification responses
                            if (globalTerminalIntelligence.awaitingClarification) {
                                terminalDebugger.debug('Handling Clarification Response');
                                const clarificationResult = globalTerminalIntelligence.handleClarification(value);
                                if (clarificationResult.action === 'analyze') {
                                    await processTerminalInput(clarificationResult.text);
                                } else {
                                    addTerminalLine(clarificationResult.message);
                                }
                            } else {
                                // Process normal input
                                terminalDebugger.debug('Processing Normal Input');
                                await processTerminalInput(value);
                            }
                        } catch (error) {
                            terminalDebugger.error('Input Processing Failed', error, { value });
                        }
                    } else {
                        if (!value) {
                            terminalDebugger.debug('Empty Input - No Action Taken');
                        }
                        if (!globalTerminalIntelligence) {
                            terminalDebugger.error('Terminal Intelligence Missing', new Error('globalTerminalIntelligence is null'));
                        }
                    }
                }
            });
        }
        
        // Handle input focus on terminal click
        if (terminalContainer) {
            terminalContainer.addEventListener('click', focusTerminalInput);
        }
    }
}

// Add basic console test to verify script is loading
console.log('🚀 trait-selector.js script loaded and executing');

// Initialize function
function initializeTraitSelector() {
    console.log('🔧 Initializing avatar generator system...');
    if (typeof window.AvatarGenerator !== 'undefined' && !window.avatarGenerator) {
        try {
            window.avatarGenerator = new window.AvatarGenerator();
            console.log('✅ Avatar generator initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize avatar generator:', error);
        }
    } else if (typeof window.AvatarGenerator === 'undefined') {
        console.error('❌ AvatarGenerator class not loaded - check script imports');
    } else {
        console.log('ℹ️ Avatar generator already initialized');
    }

    // Only initialize if trait selector elements exist
    if (document.querySelector('.trait-selector-container')) {
        window.elliotGenerator = new ElliotGenerator();
        console.log('✅ ElliotGenerator initialized');
    }
    
    // Initialize terminal mode functionality
    initializeTerminalMode();
    console.log('✅ Trait selector initialization complete');
}

// Initialize trait selector - DOM is already ready since script loads at bottom of HTML
// But add both immediate execution and DOMContentLoaded fallback for safety
if (document.readyState === 'loading') {
    console.log('📅 DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializeTraitSelector);
} else {
    console.log('📅 DOM already ready, initializing immediately...');
    initializeTraitSelector();
}

// Export for global access
window.ElliotGenerator = ElliotGenerator;
window.WaterASCII = WaterASCII;
window.Terminal = Terminal;