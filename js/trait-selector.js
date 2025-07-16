// Trait Selector JavaScript - Interactive avatar generation interface

// Terminal interface class - Claude Code style with Elliot
class Terminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
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
        if (!this.input) return; // Guard against missing elements
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isProcessing) {
                this.processInput();
            }
        });
        
        // Show welcome message and ELLIOT ASCII art on initialization
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
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
                this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace; letter-spacing: 1px; white-space: pre;">${line}</span>`);
            }, index * 150);
        });
        
        // Add divider and instructions after ASCII art
        setTimeout(() => {
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">════════════════════════════════════════════════════════════</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace; font-size: 1.1em; font-weight: bold;">PERSONA GENERATOR v1.0</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">────────────────────────</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;"><strong>Instructions:</strong></span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">• Type 'quest' for guided personality analysis</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">• Or just start talking to explore El personas</span>`);
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace;">• Your unique profile will be generated</span>`);
            this.addToOutput('');
            this.addToOutput(`<span style="color: #ffffff; font-family: 'Roboto Mono', monospace; font-size: 0.9em;">Ready for input...</span>`);
            this.addPrompt();
        }, elliotLines.length * 150 + 300);
    }

    async processInput() {
        const userInput = this.input.value.trim();
        if (!userInput) return;

        this.isProcessing = true;
        this.addToOutput(`<span class="terminal-user">user@terminal ~ % ${userInput}</span>`);
        this.input.value = '';
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
            // Send quest responses to backend for analysis
            const response = await fetch('http://localhost:5001/api/quest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    responses: this.userResponses,
                    questions: this.questions
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Option B: Generate avatar after terminal analysis
            await this.generateTerminalAvatar(data);
            
            return `Perfect! Based on your responses, I can see you're looking for an El who can balance ${data.key_traits || this.extractKeyTraits()}. 

Here's my analysis:
• ${data.insights ? data.insights.join('\n• ') : 'Analysis complete'}

Your personality profile shows: ${data.personality_summary || 'Balanced traits across multiple dimensions'}

🎨 I've also generated a character avatar for you! Check the area below.`;
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
            
            // Send to backend for analysis
            const response = await fetch('http://localhost:5001/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: userInput,
                    mode: mode,
                    context: this.conversationHistory
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Option B: Check if we should generate an avatar after significant conversation
            if (this.conversationHistory.length >= 6 && !this.hasGeneratedAvatar) {
                await this.generateTerminalAvatar(data, userInput);
                this.hasGeneratedAvatar = true;
                return `${data.response || this.getFallbackResponse(userInput)}

🎨 Based on our conversation, I've generated a character avatar that matches your profile! Check below the terminal.`;
            }
            
            return data.response || this.getFallbackResponse(userInput);
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
        this.addToOutput(`<span class="terminal-loading">elliot@terminal ~ % Thinking...</span>`);
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
        this.addToOutput(`<span class="terminal-prompt">elliot@terminal ~ % _</span>`);
    }

    async generateTerminalAvatar(analysisData, userText = null) {
        try {
            // Option B: Generate avatar after terminal analysis
            let characterName = 'TheBuilder'; // Default
            let characterData = {};

            // Try to extract character match from analysis data
            if (analysisData && analysisData.matched_character) {
                characterName = analysisData.matched_character.name;
                characterData = analysisData.matched_character.data;
            } else if (analysisData && analysisData.analysis && analysisData.analysis.matched_character) {
                characterName = analysisData.analysis.matched_character.name;
                characterData = analysisData.analysis.matched_character.data;
            } else {
                // Fallback: try to analyze text for character matching
                if (userText) {
                    try {
                        const matchResponse = await fetch('http://localhost:5001/api/match_character', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                text: userText,
                                mode: 'conversation'
                            })
                        });
                        
                        if (matchResponse.ok) {
                            const matchData = await matchResponse.json();
                            if (matchData.status === 'success' && matchData.matched_character) {
                                characterName = matchData.matched_character.name;
                                characterData = matchData.matched_character.data;
                            }
                        }
                    } catch (matchError) {
                        console.log('Character matching failed, using default');
                    }
                }
            }

            // Generate avatar and replace water ASCII animation
            if (window.avatarGenerator) {
                const avatarData = await window.avatarGenerator.generateAvatar(characterName);
                
                // Replace the water ASCII animation with avatar (same as trait selector)
                const waterAsciiContainer = document.getElementById('waterAscii');
                if (waterAsciiContainer) {
                    // Stop any running water animation
                    if (window.elliotGenerator && window.elliotGenerator.waterAscii) {
                        window.elliotGenerator.waterAscii.stopAnimation();
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
                    window.avatarGenerator.renderAvatarComponent(
                        waterAsciiContainer,
                        avatarData,
                        {
                            title: characterData.title || characterName,
                            description: characterData.description || 'Your matched character profile',
                            similarity_score: characterData.similarity_score || analysisData?.matched_character?.similarity_score
                        }
                    );
                }
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
        
        // Initialize terminal if elements exist
        if (document.getElementById('terminalInput')) {
            this.terminal = new Terminal();
        }

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
        const waterAscii = document.getElementById('waterAscii');
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
                const terminalInput = document.getElementById('terminalInput');
                if (terminalInput) terminalInput.focus();
                
                // Show welcome message if terminal output is empty
                const terminalOutput = document.getElementById('terminalOutput');
                if (terminalOutput && this.terminal && terminalOutput.children.length === 0) {
                    this.terminal.showWelcomeMessage();
                }
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

        const waterAscii = document.getElementById('waterAscii');
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
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.showGeneratingState();

        try {
            // Option A: Integrate with backend trait analysis
            const selectedTraitsObj = {};
            Array.from(this.selectedTraits).forEach(trait => {
                selectedTraitsObj[trait] = true;
            });

            try {
                // Call backend API for personality analysis
                const response = await fetch('http://localhost:5001/api/analyze_traits', {
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
                console.log('Backend API not available, using demo generation');
            }

            // Fallback to demo generation with proper character matching
            console.log('Using demo mode with proper Big Five character matching');
            
            // Use our character matching logic instead of hardcoded demo
            const bestMatch = this.findBestCharacterMatch();
            
            if (bestMatch && window.avatarGenerator) {
                console.log('Generating avatar for matched character:', bestMatch.name);
                const avatarData = await window.avatarGenerator.generateAvatar(bestMatch.name);
                console.log('Avatar data:', avatarData);
                
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
                console.log('Character matching failed, using fallback');
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
            "innovation": {"Openness": 0.3, "Conscientiousness": 0.1},
            "energy": {"Extraversion": 0.3, "Neuroticism": -0.1},
            "intensity": {"Conscientiousness": 0.3, "Neuroticism": -0.05},
            "cooperative": {"Agreeableness": 0.3, "Extraversion": 0.1},
            "calm": {"Neuroticism": -0.3, "Conscientiousness": 0.1},
            "technical": {"Conscientiousness": 0.25, "Openness": 0.1},
            "creativity": {"Openness": 0.25},
            "leadership": {"Extraversion": 0.25, "Conscientiousness": 0.1},
            "collaborative": {"Agreeableness": 0.25, "Extraversion": 0.1},
            "adventure": {"Openness": 0.2, "Extraversion": 0.15},
            "mystery": {"Openness": 0.2, "Conscientiousness": 0.15},
            "discipline": {"Conscientiousness": 0.25, "Neuroticism": -0.1},
            "curiosity": {"Openness": 0.25},
            "hustle": {"Extraversion": 0.2, "Conscientiousness": 0.2},
            "speed": {"Extraversion": 0.15, "Neuroticism": 0.1},
            "experimental": {"Openness": 0.3},
            "paranoia": {"Neuroticism": 0.25, "Conscientiousness": 0.1},
            "procrastination": {"Conscientiousness": -0.3},
            "futuristic": {"Openness": 0.25, "Conscientiousness": 0.1}
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
        
        console.log('Selected traits:', selectedTraitsObj);
        
        const userBigFive = this.mapUITraitsToBigFive(selectedTraitsObj);
        console.log('User Big Five scores:', userBigFive);
        
        const characters = this.getCharacterData();
        let bestMatch = null;
        let bestSimilarity = -1;
        
        for (const [charName, charData] of Object.entries(characters)) {
            const similarity = this.calculateSimilarity(userBigFive, charData);
            console.log(`${charName} similarity:`, similarity);
            
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = { name: charName, data: charData, similarity: similarity };
            }
        }
        
        console.log('Best match:', bestMatch);
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
        const waterAscii = document.getElementById('waterAscii');
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
        const waterAscii = document.getElementById('waterAscii');
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
        console.log('Generated Elliot:', elliotData);
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

        console.log('Generated Elliot with Avatar:', elliotData);
    }

    showAvatarResults(elliotData) {
        // Replace the water ASCII animation with avatar
        const waterAsciiContainer = document.getElementById('waterAscii');
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
        }
    }

    restoreWaterAnimation() {
        // Restore the water ASCII animation
        const waterAsciiContainer = document.getElementById('waterAscii');
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
            console.log('Saved Elliot:', data);
            
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
                console.log('Elliot data copied to clipboard');
            } catch (err) {
                console.log('Clipboard access not available');
            }
        } else {
            console.log('No Elliot to save - generate one first!');
        }
    }
}

// Initialize trait selector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global avatar generator first
    console.log('Initializing avatar generator, AvatarGenerator available:', typeof window.AvatarGenerator !== 'undefined');
    if (typeof window.AvatarGenerator !== 'undefined' && !window.avatarGenerator) {
        window.avatarGenerator = new window.AvatarGenerator();
        console.log('Avatar generator initialized:', !!window.avatarGenerator);
    } else if (typeof window.AvatarGenerator === 'undefined') {
        console.warn('AvatarGenerator class not found - make sure avatar-generator.js is loaded');
    }

    // Only initialize if trait selector elements exist
    if (document.querySelector('.trait-selector-container')) {
        window.elliotGenerator = new ElliotGenerator();
    }
});

// Export for global access
window.ElliotGenerator = ElliotGenerator;
window.WaterASCII = WaterASCII;
window.Terminal = Terminal;