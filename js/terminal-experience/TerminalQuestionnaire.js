/**
 * TerminalQuestionnaire.js - Draggable terminal interface for user onboarding
 * Converted from React component to vanilla JavaScript for integration
 */

class TerminalQuestionnaire {
    constructor() {
        this.messages = [];
        this.currentInput = '';
        this.currentQuestion = 0;
        this.isTyping = false;
        this.userName = '';
        this.responses = {};
        this.isComplete = false;
        this.position = { x: 50, y: 50 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.isMinimized = false;
        this.isVisible = false;
        
        // Initialize data collector and avatar generation components
        this.dataCollector = new DataCollector();
        this.personalityAnalyzer = new AdvancedPersonalityAnalyzer();
        this.avatarService = new ClaudeAvatarService();
        this.avatarDisplay = new AvatarDisplay();
        this.characterTerminal = null; // Initialize CharacterTerminal on demand
        
        // Avatar generation state
        this.isGeneratingAvatar = false;
        this.avatarData = null;
        
        // Initialize questions
        this.questions = [
            {
                text: "What's your name, and what do you do for work?",
                followUp: (response) => `Nice to meet you${this.userName ? `, ${this.userName}` : ''}! That sounds interesting.`
            },
            {
                text: "What's something you've been working on lately that you're genuinely excited about?",
                followUp: () => "That passion really comes through! I love hearing about projects that spark genuine excitement."
            },
            {
                text: "If you could have dinner with anyone (dead or alive), who would it be and what would you want to talk about?",
                followUp: () => "What a fascinating choice! Those would definitely be some memorable conversations."
            },
            {
                text: "What kind of impact do you hope to make in your work or the world?",
                followUp: () => "Incredible! It's inspiring to meet someone with such purposeful vision."
            }
        ];
        
        this.dogAscii = `         .--.             .---.
        /:.  '.         .' ..  '._.---.
       /:::-.  \\.-"""-;\` .-:::.     .::\\
      /::'|  \`\\/  _ _  \\'   \`\\:'   ::::|
  __.'    |   /  (o|o)  \\     \`'.   ':/
 /    .:. /   |   ___   |        '---'
|    ::::'   /:  (._.) .:\\
\\    .='    |:'        :::|
 \`""\`       \\     .-.   ':/
             '---\`|I|\`---'
                  '-'`;
        
        this.bindMethods();
    }
    
    bindMethods() {
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submitResponse = this.submitResponse.bind(this);
        this.close = this.close.bind(this);
        this.minimize = this.minimize.bind(this);
    }
    
    show() {
        if (this.isVisible) return;
        
        this.createTerminalElement();
        this.isVisible = true;
        
        // Start initial greeting
        setTimeout(() => {
            this.typeMessage("Woof! I'm El's welcome dog Blue :) ¡Bienvenidos! I'd love to find out a little more about you.", true, () => {
                setTimeout(() => {
                    this.typeMessage(this.questions[0].text, true);
                }, 1000);
            });
        }, 1000);
        
        // Track analytics
        this.dataCollector.trackEvent('terminal_opened');
    }
    
    createTerminalElement() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'terminal-questionnaire';
        this.container.style.cssText = `
            position: fixed;
            left: ${this.position.x}px;
            top: ${this.position.y}px;
            width: 600px;
            max-width: 90vw;
            background: #1a1a1a;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            border-radius: 8px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            overflow: hidden;
            transition: all 0.2s ease;
        `;
        
        this.createHeader();
        this.createContent();
        this.createFooter();
        
        document.body.appendChild(this.container);
        this.addEventListeners();
    }
    
    createHeader() {
        this.header = document.createElement('div');
        this.header.className = 'terminal-header';
        this.header.style.cssText = `
            background: #2a2a2a;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #444;
            cursor: grab;
            user-select: none;
        `;
        
        // Left side with terminal buttons
        const leftSide = document.createElement('div');
        leftSide.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        
        const buttons = document.createElement('div');
        buttons.style.cssText = 'display: flex; gap: 8px;';
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = `
            width: 12px; height: 12px; border-radius: 50%;
            background: #ff5f56; border: none; cursor: pointer;
        `;
        closeBtn.onclick = this.close;
        closeBtn.title = 'Close';
        
        // Minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.style.cssText = `
            width: 12px; height: 12px; border-radius: 50%;
            background: #ffbd2e; border: none; cursor: pointer;
        `;
        minimizeBtn.onclick = this.minimize;
        minimizeBtn.title = 'Minimize';
        
        // Maximize button (non-functional, just for aesthetics)
        const maximizeBtn = document.createElement('button');
        maximizeBtn.style.cssText = `
            width: 12px; height: 12px; border-radius: 50%;
            background: #27ca3f; border: none; cursor: pointer;
        `;
        
        buttons.appendChild(closeBtn);
        buttons.appendChild(minimizeBtn);
        buttons.appendChild(maximizeBtn);
        
        const title = document.createElement('span');
        title.textContent = 'blue@elliot-portfolio:~$ chat';
        title.style.cssText = 'color: #ccc; font-size: 12px; margin-left: 16px;';
        
        leftSide.appendChild(buttons);
        leftSide.appendChild(title);
        
        // Right side with drag hint
        const rightSide = document.createElement('span');
        rightSide.textContent = '⋮⋮ Drag to move';
        rightSide.style.cssText = 'color: #666; font-size: 10px;';
        
        this.header.appendChild(leftSide);
        this.header.appendChild(rightSide);
        this.container.appendChild(this.header);
    }
    
    createContent() {
        this.content = document.createElement('div');
        this.content.className = 'terminal-content';
        this.content.style.cssText = `
            padding: 20px;
            height: 400px;
            overflow-y: auto;
            background: #1a1a1a;
        `;
        
        // ASCII Dog
        const asciiContainer = document.createElement('pre');
        asciiContainer.textContent = this.dogAscii;
        asciiContainer.style.cssText = `
            color: #ffff00;
            font-size: 10px;
            margin-bottom: 20px;
            white-space: pre;
            line-height: 1.2;
        `;
        
        this.content.appendChild(asciiContainer);
        
        // Messages container
        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'messages-container';
        this.content.appendChild(this.messagesContainer);
        
        // Input container
        this.inputContainer = document.createElement('div');
        this.inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
        `;
        
        const prompt = document.createElement('span');
        prompt.textContent = 'you@terminal:';
        prompt.style.cssText = 'color: #9d4edd; font-weight: bold;';
        
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.style.cssText = `
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #00ff00;
            font-family: inherit;
            font-size: inherit;
        `;
        this.inputField.placeholder = 'Type your response and press Enter...';
        
        const cursor = document.createElement('span');
        cursor.textContent = '▊';
        cursor.style.cssText = 'color: #00ff00; animation: blink 1s infinite;';
        
        this.inputContainer.appendChild(prompt);
        this.inputContainer.appendChild(this.inputField);
        this.inputContainer.appendChild(cursor);
        
        this.content.appendChild(this.inputContainer);
        this.container.appendChild(this.content);
        
        // Add blinking cursor animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    createFooter() {
        this.footer = document.createElement('div');
        this.footer.style.cssText = `
            background: #2a2a2a;
            padding: 8px 16px;
            border-top: 1px solid #444;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #666;
        `;
        
        this.progressSpan = document.createElement('span');
        this.updateProgress();
        
        const helpSpan = document.createElement('span');
        helpSpan.textContent = 'Press Enter to send • Type naturally';
        
        this.footer.appendChild(this.progressSpan);
        this.footer.appendChild(helpSpan);
        this.container.appendChild(this.footer);
    }
    
    updateProgress() {
        const current = Math.min(this.currentQuestion + 1, this.questions.length);
        const total = this.questions.length;
        const status = this.isComplete ? ' ✓ Complete' : '';
        this.progressSpan.textContent = `Questions: ${current}/${total}${status}`;
    }
    
    addEventListeners() {
        this.header.addEventListener('mousedown', this.handleMouseDown);
        this.inputField.addEventListener('keydown', this.handleKeyPress);
        
        // Focus input field
        setTimeout(() => this.inputField.focus(), 100);
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.header.style.cursor = 'grabbing';
        this.dragStart = {
            x: e.clientX - this.position.x,
            y: e.clientY - this.position.y
        };
        
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.position = {
            x: e.clientX - this.dragStart.x,
            y: e.clientY - this.dragStart.y
        };
        
        this.container.style.left = `${this.position.x}px`;
        this.container.style.top = `${this.position.y}px`;
    }
    
    handleMouseUp() {
        this.isDragging = false;
        this.header.style.cursor = 'grab';
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
    
    handleKeyPress(e) {
        if (e.key === 'Enter' && this.inputField.value.trim() && !this.isTyping) {
            this.submitResponse();
        }
    }
    
    submitResponse() {
        if (!this.inputField.value.trim() || this.isTyping) return;
        
        const response = this.inputField.value.trim();
        
        // Add user message
        this.addMessage(response, false);
        
        // Store response
        this.responses[`question_${this.currentQuestion}`] = response;
        
        // Extract name from first response
        if (this.currentQuestion === 0) {
            const extractedName = this.dataCollector.extractUserName(response);
            if (extractedName) {
                this.userName = extractedName;
            }
        }
        
        // Process response
        const currentQ = this.questions[this.currentQuestion];
        
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.typeMessage(currentQ.followUp(response), true, () => {
                    setTimeout(() => {
                        this.currentQuestion++;
                        this.updateProgress();
                        this.typeMessage(this.questions[this.currentQuestion].text, true);
                    }, 1000);
                });
            } else {
                // Final response
                this.typeMessage(currentQ.followUp(response), true, () => {
                    setTimeout(() => {
                        this.typeMessage(
                            `Thanks for sharing, ${this.userName || 'friend'}! 🐕 El will love learning about you. Feel free to explore the rest of the site, and don't hesitate to reach out if you want to chat more!`,
                            true,
                            () => {
                                this.completeExperience();
                            }
                        );
                    }, 1500);
                });
            }
        }, 500);
        
        this.inputField.value = '';
        this.dataCollector.trackEvent('question_answered', { 
            questionIndex: this.currentQuestion,
            responseLength: response.length 
        });
    }
    
    addMessage(text, isBot) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 12px;
        `;
        
        const prompt = document.createElement('span');
        prompt.style.cssText = 'font-weight: bold; white-space: nowrap;';
        
        if (isBot) {
            prompt.textContent = 'blue@terminal:';
            prompt.style.color = '#4cc9f0';
        } else {
            prompt.textContent = 'you@terminal:';
            prompt.style.color = '#9d4edd';
        }
        
        const message = document.createElement('span');
        message.textContent = text;
        message.style.cssText = `
            color: ${isBot ? '#ccc' : '#fff'};
            line-height: 1.4;
            flex: 1;
        `;
        
        messageDiv.appendChild(prompt);
        messageDiv.appendChild(message);
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.content.scrollTop = this.content.scrollHeight;
    }
    
    typeMessage(text, isBot = true, callback) {
        this.isTyping = true;
        this.inputField.disabled = true;
        this.inputField.placeholder = "Blue is typing...";
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 12px;
        `;
        
        const prompt = document.createElement('span');
        prompt.textContent = 'blue@terminal:';
        prompt.style.cssText = 'font-weight: bold; color: #4cc9f0; white-space: nowrap;';
        
        const message = document.createElement('span');
        message.style.cssText = 'color: #ccc; line-height: 1.4; flex: 1;';
        
        messageDiv.appendChild(prompt);
        messageDiv.appendChild(message);
        this.messagesContainer.appendChild(messageDiv);
        
        // Typing effect
        const words = text.split(' ');
        let currentText = '';
        let wordIndex = 0;
        
        const typeInterval = setInterval(() => {
            if (wordIndex >= words.length) {
                clearInterval(typeInterval);
                message.textContent = currentText;
                this.isTyping = false;
                this.inputField.disabled = false;
                this.inputField.placeholder = "Type your response and press Enter...";
                this.inputField.focus();
                if (callback) callback();
                return;
            }
            
            currentText += (currentText ? ' ' : '') + words[wordIndex];
            message.textContent = currentText + '▊';
            wordIndex++;
            
            // Scroll to bottom
            this.content.scrollTop = this.content.scrollHeight;
        }, 150 + Math.random() * 100);
    }
    
    completeExperience() {
        this.isComplete = true;
        this.updateProgress();
        
        // Hide input
        this.inputContainer.style.display = 'none';
        
        // Start avatar generation process
        this.startAvatarGeneration();
    }

    async startAvatarGeneration() {
        // Add generating message
        const generatingDiv = document.createElement('div');
        generatingDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
            padding: 12px;
            background: #2a4a2a;
            border-radius: 4px;
        `;
        
        const generatingPrompt = document.createElement('span');
        generatingPrompt.textContent = 'system@analysis:';
        generatingPrompt.style.cssText = 'font-weight: bold; color: #ffaa00;';
        
        const generatingMessage = document.createElement('span');
        generatingMessage.innerHTML = 'Analyzing personality and generating your personalized El avatar... <span style="animation: blink 1s infinite;">▊</span>';
        generatingMessage.style.color = '#aaa';
        
        generatingDiv.appendChild(generatingPrompt);
        generatingDiv.appendChild(generatingMessage);
        this.content.appendChild(generatingDiv);
        
        this.isGeneratingAvatar = true;
        
        try {
            // Generate personality insights
            const personalityData = this.personalityAnalyzer.generatePersonalityInsights(this.responses, this.userName);
            
            // Track personality analysis
            this.dataCollector.trackEvent('personality_analyzed', {
                archetype: personalityData.archetype.archetype.name,
                confidence: personalityData.archetype.archetype.confidence,
                dominantTraits: personalityData.dominantTraits.map(t => t.trait)
            });
            
            // Check if API key is available
            if (!this.avatarService.hasValidApiKey()) {
                this.avatarService.loadStoredApiKey();
            }
            
            if (this.avatarService.hasValidApiKey()) {
                // Generate avatar with Claude
                generatingMessage.innerHTML = 'Generating personalized avatar with Claude AI... <span style="animation: blink 1s infinite;">▊</span>';
                
                const avatarData = await this.avatarService.generateAvatar(
                    personalityData,
                    { responses: this.responses },
                    personalityData.archetype
                );
                
                this.avatarData = avatarData;
                
                // Set avatar for chat conversations
                if (window.setGeneratedAvatarForChat) {
                    window.setGeneratedAvatarForChat(avatarData);
                }
                
                this.showAvatarResults(personalityData, avatarData);
                
            } else {
                // No API key available - show results without Claude generation
                this.showPersonalityResults(personalityData);
            }
            
        } catch (error) {
            console.error('Avatar generation failed:', error);
            this.showAvatarError(error);
        } finally {
            this.isGeneratingAvatar = false;
        }
    }

    showAvatarResults(personalityData, avatarData) {
        // Update generating message to success
        const generatingDiv = this.content.lastElementChild;
        if (generatingDiv) {
            generatingDiv.querySelector('span:first-child').textContent = 'avatar@generated:';
            generatingDiv.querySelector('span:first-child').style.color = '#00ff88';
            generatingDiv.querySelector('span:last-child').innerHTML = `Avatar generated! Your personalized El: <strong>${avatarData.title.replace('Your Personal El: ', '')}</strong>`;
        }
        
        // Add view avatar button
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View Your Personalized El Avatar';
        viewButton.style.cssText = `
            background: #00ff88;
            color: #1a1a1a;
            border: none;
            padding: 12px 24px;
            margin: 16px 0;
            border-radius: 6px;
            cursor: pointer;
            font-family: inherit;
            font-weight: bold;
            width: 100%;
            transition: all 0.2s ease;
        `;
        
        viewButton.onmouseover = () => {
            viewButton.style.background = '#00cc77';
            viewButton.style.transform = 'translateY(-2px)';
        };
        
        viewButton.onmouseout = () => {
            viewButton.style.background = '#00ff88';
            viewButton.style.transform = 'translateY(0)';
        };
        
        viewButton.onclick = () => {
            // Use global character terminal initialization
            if (window.ensureCharacterTerminalInitialized) {
                const characterTerminal = window.ensureCharacterTerminalInitialized();
                if (characterTerminal) {
                    characterTerminal.show(avatarData);
                } else {
                    console.warn('CharacterTerminal not available, using fallback');
                    this.showFallbackAvatarDisplay(avatarData, personalityData);
                }
            } else {
                // Fallback to old avatar display
                this.showFallbackAvatarDisplay(avatarData, personalityData);
            }
            
            // Continue with completion after showing character
            this.finalizeCompletion(personalityData);
        };
        
        this.content.appendChild(viewButton);
        
        // Save complete user data
        this.saveCompleteUserData(personalityData, avatarData);
    }

    showFallbackAvatarDisplay(avatarData, personalityData) {
        this.avatarDisplay.setRegenerationCallback(() => {
            this.regenerateAvatar(personalityData);
        });
        this.avatarDisplay.show(avatarData, personalityData, () => {
            // Avatar display closed - continue with completion
            this.finalizeCompletion(personalityData);
        });
    }

    showPersonalityResults(personalityData) {
        // Update generating message for no API key
        const generatingDiv = this.content.lastElementChild;
        if (generatingDiv) {
            generatingDiv.querySelector('span:first-child').textContent = 'analysis@complete:';
            generatingDiv.querySelector('span:first-child').style.color = '#4cc9f0';
            generatingDiv.querySelector('span:last-child').innerHTML = `Personality analyzed! You're a <strong>${personalityData.archetype.archetype.name.replace('The', '')}</strong> type.`;
        }
        
        // Add personality summary
        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            margin-top: 16px;
            padding: 16px;
            background: #2a2a2a;
            border-radius: 4px;
            border-left: 4px solid #4cc9f0;
        `;
        
        summaryDiv.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: #4cc9f0;">Your Personality Profile</h4>
            <p style="margin: 0 0 12px 0; color: #ccc;">${personalityData.personalityOverview}</p>
            <div style="font-size: 12px; color: #666;">
                <strong>Dominant Traits:</strong> ${personalityData.dominantTraits.map(t => t.trait).join(', ')}<br>
                <strong>Archetype:</strong> ${personalityData.archetype.archetype.name} (${Math.round(personalityData.archetype.archetype.confidence * 100)}% confidence)
            </div>
        `;
        
        this.content.appendChild(summaryDiv);
        
        // Add API key setup prompt
        const apiPrompt = document.createElement('div');
        apiPrompt.style.cssText = `
            margin-top: 16px;
            padding: 16px;
            background: #3a3a2a;
            border-radius: 4px;
            border-left: 4px solid #ffaa00;
        `;
        
        apiPrompt.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: #ffaa00;">Want a Personalized El Avatar?</h4>
            <p style="margin: 0 0 12px 0; color: #ccc; font-size: 14px;">
                To generate your personalized El avatar with detailed collaboration insights, 
                you'll need a Claude API key. This creates a unique description of how El would 
                work specifically with your personality type.
            </p>
            <button id="setupApiKey" style="background: #ffaa00; color: #1a1a1a; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: inherit;">
                Setup API Key
            </button>
        `;
        
        // Add API key setup handler
        apiPrompt.querySelector('#setupApiKey').onclick = () => {
            this.showApiKeySetup(personalityData);
        };
        
        this.content.appendChild(apiPrompt);
        
        // Save basic user data
        this.saveCompleteUserData(personalityData, null);
        
        // Auto-continue after delay
        setTimeout(() => {
            this.finalizeCompletion(personalityData);
        }, 10000);
    }

    showApiKeySetup(personalityData) {
        const setupDiv = document.createElement('div');
        setupDiv.style.cssText = `
            margin-top: 16px;
            padding: 16px;
            background: #2a2a2a;
            border-radius: 4px;
        `;
        
        setupDiv.innerHTML = `
            <h4 style="margin: 0 0 12px 0; color: #00ff88;">Claude API Key Setup</h4>
            <p style="margin: 0 0 12px 0; color: #ccc; font-size: 14px;">
                Enter your Claude API key to generate personalized avatars. 
                Get one at <a href="https://console.anthropic.com/" target="_blank" style="color: #4cc9f0;">console.anthropic.com</a>
            </p>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <input type="password" id="apiKeyInput" placeholder="sk-ant-..." style="flex: 1; background: #1a1a1a; border: 1px solid #666; color: #ccc; padding: 8px; border-radius: 4px; font-family: inherit;">
                <button id="saveApiKey" style="background: #00ff88; color: #1a1a1a; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: inherit;">Save</button>
            </div>
            <div id="apiKeyStatus" style="font-size: 12px; color: #666;"></div>
        `;
        
        const input = setupDiv.querySelector('#apiKeyInput');
        const button = setupDiv.querySelector('#saveApiKey');
        const status = setupDiv.querySelector('#apiKeyStatus');
        
        button.onclick = async () => {
            const apiKey = input.value.trim();
            if (!apiKey) {
                status.textContent = 'Please enter an API key';
                status.style.color = '#ff6666';
                return;
            }
            
            try {
                this.avatarService.setApiKey(apiKey);
                status.textContent = 'Testing connection...';
                status.style.color = '#ffaa00';
                
                const testResult = await this.avatarService.testConnection();
                if (testResult.success) {
                    status.textContent = 'API key saved! Generating avatar...';
                    status.style.color = '#00ff88';
                    
                    // Remove setup and regenerate avatar
                    setupDiv.remove();
                    setTimeout(() => {
                        this.regenerateAvatar(personalityData);
                    }, 1000);
                } else {
                    status.textContent = `Connection failed: ${testResult.message}`;
                    status.style.color = '#ff6666';
                }
            } catch (error) {
                status.textContent = `Error: ${error.message}`;
                status.style.color = '#ff6666';
            }
        };
        
        // Enter key handler
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                button.click();
            }
        };
        
        this.content.appendChild(setupDiv);
        input.focus();
    }

    async regenerateAvatar(personalityData) {
        try {
            const avatarData = await this.avatarService.generateAvatar(
                personalityData,
                { responses: this.responses },
                personalityData.archetype
            );
            
            this.avatarData = avatarData;
            
            // Set avatar for chat conversations
            if (window.setGeneratedAvatarForChat) {
                window.setGeneratedAvatarForChat(avatarData);
            }
            
            if (this.avatarDisplay.isVisible) {
                this.avatarDisplay.updateAvatar(avatarData);
            } else {
                this.avatarDisplay.show(avatarData, personalityData, () => {
                    this.finalizeCompletion(personalityData);
                });
            }
            
            // Update saved data
            this.saveCompleteUserData(personalityData, avatarData);
            
        } catch (error) {
            console.error('Avatar regeneration failed:', error);
            alert('Failed to regenerate avatar: ' + error.message);
        }
    }

    showAvatarError(error) {
        const generatingDiv = this.content.lastElementChild;
        if (generatingDiv) {
            generatingDiv.querySelector('span:first-child').textContent = 'error@generation:';
            generatingDiv.querySelector('span:first-child').style.color = '#ff6666';
            generatingDiv.querySelector('span:last-child').innerHTML = `Avatar generation failed: ${error.message}`;
        }
        
        // Show fallback if available
        if (error.fallbackAvatar) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.style.cssText = `
                margin-top: 16px;
                padding: 16px;
                background: #3a2a2a;
                border-radius: 4px;
                border-left: 4px solid #ffaa00;
            `;
            
            fallbackDiv.innerHTML = `
                <h4 style="margin: 0 0 8px 0; color: #ffaa00;">Fallback Avatar Available</h4>
                <p style="margin: 0 0 12px 0; color: #ccc; font-size: 14px;">
                    ${error.fallbackAvatar.summary}
                </p>
                <button id="viewFallback" style="background: #ffaa00; color: #1a1a1a; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: inherit;">
                    View Fallback Avatar
                </button>
            `;
            
            fallbackDiv.querySelector('#viewFallback').onclick = () => {
                this.avatarDisplay.show(error.fallbackAvatar, null, () => {
                    this.finalizeCompletion(null);
                });
            };
            
            this.content.appendChild(fallbackDiv);
        }
        
        // Auto-continue after delay
        setTimeout(() => {
            this.finalizeCompletion(null);
        }, 8000);
    }

    saveCompleteUserData(personalityData, avatarData) {
        // Save comprehensive user data
        const completeData = {
            responses: this.responses,
            userName: this.userName,
            personalityData,
            avatarData,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            completionStatus: 'completed'
        };
        
        localStorage.setItem('terminal_user_data', JSON.stringify(completeData));
        
        // Track completion
        this.dataCollector.trackEvent('experience_completed', {
            userName: this.userName,
            archetype: personalityData?.archetype?.archetype?.name || 'unknown',
            hasAvatar: !!avatarData,
            totalResponses: Object.keys(this.responses).length
        });
    }

    finalizeCompletion(personalityData) {
        // Add final completion message
        const completionDiv = document.createElement('div');
        completionDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
            padding: 12px;
            background: #2a4a2a;
            border-radius: 4px;
        `;
        
        const completionPrompt = document.createElement('span');
        completionPrompt.textContent = 'session@complete:';
        completionPrompt.style.cssText = 'font-weight: bold; color: #00ff88;';
        
        const completionMessage = document.createElement('span');
        completionMessage.textContent = "Experience complete. Welcome to El's world! 🌟";
        completionMessage.style.color = '#aaa';
        
        completionDiv.appendChild(completionPrompt);
        completionDiv.appendChild(completionMessage);
        this.content.appendChild(completionDiv);
        
        // Auto-close after delay
        setTimeout(() => {
            this.close();
        }, 5000);
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    minimize() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.content.style.display = 'none';
            this.footer.style.display = 'none';
            this.container.style.height = 'auto';
        } else {
            this.content.style.display = 'block';
            this.footer.style.display = 'flex';
        }
    }
    
    close() {
        if (this.container && this.container.parentNode) {
            this.container.style.transform = 'scale(0)';
            this.container.style.opacity = '0';
            setTimeout(() => {
                this.container.parentNode.removeChild(this.container);
                this.isVisible = false;
                
                // Trigger chat system if experience was completed
                if (this.isComplete && window.initializeConversation) {
                    setTimeout(() => {
                        window.initializeConversation();
                    }, 500);
                }
            }, 200);
        }
        
        this.dataCollector.trackEvent('terminal_closed', { 
            completed: this.isComplete,
            questionsAnswered: this.currentQuestion 
        });
    }
    
    // Static methods
    static hasCompletedExperience() {
        const dataCollector = new DataCollector();
        return dataCollector.hasCompletedExperience();
    }
    
    static getUserData() {
        const dataCollector = new DataCollector();
        return dataCollector.getUserData();
    }
    
    static clearUserData() {
        const dataCollector = new DataCollector();
        dataCollector.clearUserData();
    }
}

// Export for global access
window.TerminalQuestionnaire = TerminalQuestionnaire;