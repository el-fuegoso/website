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
        
        // Conversation flow management
        this.conversationState = 'asking'; // 'asking', 'clarifying', 'answering'
        this.pendingClarification = null;
        this.conversationHistory = [];
        
        // Avatar generation state
        this.isGeneratingAvatar = false;
        this.avatarData = null;
        
        // Initialize questions with dynamic responses
        this.questions = [
            {
                text: "What's your name, and what do you do for work?",
                followUp: (response) => this.generateClaudeFollowUp(response, 'work_intro')
            },
            {
                text: "What's something you've been working on lately that you're genuinely excited about?",
                followUp: (response) => this.generateClaudeFollowUp(response, 'passion_project')
            },
            {
                text: "If you could have dinner with anyone (dead or alive), who would it be and what would you want to talk about?",
                followUp: (response) => this.generateClaudeFollowUp(response, 'dinner_conversation')
            },
            {
                text: "What kind of impact do you hope to make in your work or the world?",
                followUp: (response) => this.generateClaudeFollowUp(response, 'impact_vision')
            }
        ];
        
        // Welcome message variations
        this.welcomeMessages = [
            "Woof! I'm El's welcome dog Blue :) ¡Bienvenidos! I'd love to find out a little more about you.",
            "Hey there! *tail wagging* Blue here - El's furry assistant. Ready for some fun questions?",
            "Woof woof! 🐕 I'm Blue, and I'm super excited to meet you! Let's dig into what makes you tick!",
            "Hello friend! *excited panting* Blue reporting for duty! I've got some great questions to help us understand you better."
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
        
        // Start initial greeting with random welcome message
        setTimeout(() => {
            const randomWelcome = this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)];
            this.typeMessage(randomWelcome, true, () => {
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
        // Check if mobile
        const isMobile = window.innerWidth <= 768;
        
        this.container.style.cssText = `
            position: fixed;
            left: ${isMobile ? '5px' : this.position.x + 'px'};
            top: ${isMobile ? '5px' : this.position.y + 'px'};
            width: ${isMobile ? 'calc(100vw - 10px)' : '600px'};
            max-width: ${isMobile ? 'none' : '90vw'};
            height: ${isMobile ? 'calc(100vh - 10px)' : 'auto'};
            max-height: ${isMobile ? 'none' : '80vh'};
            background: #1a1a1a;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: ${isMobile ? '16px' : '14px'};
            border-radius: ${isMobile ? '12px' : '8px'};
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
        const isMobile = window.innerWidth <= 768;
        
        this.header.style.cssText = `
            background: #2a2a2a;
            padding: ${isMobile ? '16px 20px' : '12px 16px'};
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #444;
            cursor: ${isMobile ? 'default' : 'grab'};
            user-select: none;
            touch-action: ${isMobile ? 'none' : 'auto'};
        `;
        
        // Left side with terminal buttons
        const leftSide = document.createElement('div');
        leftSide.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        
        const buttons = document.createElement('div');
        buttons.style.cssText = 'display: flex; gap: 8px;';
        
        // Close button
        const closeBtn = document.createElement('button');
        const isMobileBtn = window.innerWidth <= 768;
        closeBtn.style.cssText = `
            width: ${isMobileBtn ? '16px' : '12px'}; 
            height: ${isMobileBtn ? '16px' : '12px'}; 
            border-radius: 50%;
            background: #ff5f56; border: none; cursor: pointer;
            touch-action: manipulation;
        `;
        closeBtn.onclick = this.close;
        closeBtn.title = 'Close';
        
        // Minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.style.cssText = `
            width: ${isMobileBtn ? '16px' : '12px'}; 
            height: ${isMobileBtn ? '16px' : '12px'}; 
            border-radius: 50%;
            background: #ffbd2e; border: none; cursor: pointer;
            touch-action: manipulation;
        `;
        minimizeBtn.onclick = this.minimize;
        minimizeBtn.title = 'Minimize';
        
        // Maximize button (non-functional, just for aesthetics)
        const maximizeBtn = document.createElement('button');
        maximizeBtn.style.cssText = `
            width: ${isMobileBtn ? '16px' : '12px'}; 
            height: ${isMobileBtn ? '16px' : '12px'}; 
            border-radius: 50%;
            background: #27ca3f; border: none; cursor: pointer;
            touch-action: manipulation;
        `;
        
        buttons.appendChild(closeBtn);
        buttons.appendChild(minimizeBtn);
        buttons.appendChild(maximizeBtn);
        
        const title = document.createElement('span');
        title.textContent = 'blue@elliot-portfolio:~$ chat';
        title.style.cssText = 'color: #ccc; font-size: 12px; margin-left: 16px;';
        
        leftSide.appendChild(buttons);
        leftSide.appendChild(title);
        
        // Right side with drag hint (hide on mobile)
        const rightSide = document.createElement('span');
        const isMobileDrag = window.innerWidth <= 768;
        rightSide.textContent = isMobileDrag ? '' : '⋮⋮ Drag to move';
        rightSide.style.cssText = `color: #666; font-size: 10px; display: ${isMobileDrag ? 'none' : 'block'};`;
        
        this.header.appendChild(leftSide);
        this.header.appendChild(rightSide);
        this.container.appendChild(this.header);
    }
    
    createContent() {
        this.content = document.createElement('div');
        this.content.className = 'terminal-content';
        const isMobileContent = window.innerWidth <= 768;
        this.content.style.cssText = `
            padding: ${isMobileContent ? '16px' : '20px'};
            height: ${isMobileContent ? 'calc(100vh - 140px)' : '400px'};
            overflow-y: auto;
            background: #1a1a1a;
            -webkit-overflow-scrolling: touch;
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
        const isMobileInput = window.innerWidth <= 768;
        this.inputField.style.cssText = `
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #00ff00;
            font-family: inherit;
            font-size: inherit;
            font-size: ${isMobileInput ? '16px' : 'inherit'};
            -webkit-appearance: none;
            touch-action: manipulation;
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
        // Only add drag listeners on desktop
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            this.header.addEventListener('mousedown', this.handleMouseDown);
        }
        
        this.inputField.addEventListener('keydown', this.handleKeyPress);
        
        // Focus input field (with delay for mobile keyboard)
        setTimeout(() => this.inputField.focus(), isMobile ? 300 : 100);
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
    
    async submitResponse() {
        if (!this.inputField.value.trim() || this.isTyping) return;
        
        const response = this.inputField.value.trim();
        
        // Add user message
        this.addMessage(response, false);
        this.conversationHistory.push({ role: 'user', content: response });
        
        // Clear input immediately
        this.inputField.value = '';
        
        // Handle based on conversation state
        if (this.conversationState === 'clarifying') {
            await this.handleClarificationResponse(response);
        } else {
            await this.handleQuestionResponse(response);
        }
    }
    
    async handleQuestionResponse(response) {
        // Extract name from first response
        if (this.currentQuestion === 0) {
            const extractedName = this.dataCollector.extractUserName(response);
            if (extractedName) {
                this.userName = extractedName;
            }
        }
        
        // Check if this is a clarification request or a proper answer
        const needsClarification = await this.analyzeResponseForClarification(response);
        
        if (needsClarification.isRequest) {
            // Handle clarification request
            this.conversationState = 'clarifying';
            this.pendingClarification = {
                question: this.questions[this.currentQuestion],
                originalResponse: response
            };
            
            setTimeout(() => {
                this.typeMessage(needsClarification.clarification, true);
            }, 500);
            
        } else {
            // Process as normal answer
            this.responses[`question_${this.currentQuestion}`] = response;
            this.conversationState = 'answering';
            
            // Add to conversation history
            this.conversationHistory.push(
                { role: 'user', content: response },
            );
            
            const currentQ = this.questions[this.currentQuestion];
            
            // Get dynamic follow-up response
            setTimeout(async () => {
                try {
                    const followUpResponse = await currentQ.followUp(response);
                    
                    // Add Blue's response to conversation history
                    this.conversationHistory.push(
                        { role: 'assistant', content: followUpResponse }
                    );
                    
                    if (this.currentQuestion < this.questions.length - 1) {
                        this.typeMessage(followUpResponse, true, () => {
                            setTimeout(() => {
                                this.currentQuestion++;
                                this.conversationState = 'asking';
                                this.updateProgress();
                                this.typeMessage(this.questions[this.currentQuestion].text, true);
                            }, 1000);
                        });
                    } else {
                        // Final response
                        this.typeMessage(followUpResponse, true, () => {
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
                } catch (error) {
                    console.error('Error generating follow-up:', error);
                    // Fallback to simple response
                    const fallbackResponse = this.getFallbackFollowUp(response, 'general');
                    this.typeMessage(fallbackResponse, true, () => {
                        if (this.currentQuestion < this.questions.length - 1) {
                            setTimeout(() => {
                                this.currentQuestion++;
                                this.conversationState = 'asking';
                                this.updateProgress();
                                this.typeMessage(this.questions[this.currentQuestion].text, true);
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                this.typeMessage(
                                    `Thanks for sharing, ${this.userName || 'friend'}! 🐕 El will love learning about you. Feel free to explore the rest of the site, and don't hesitate to reach out if you want to chat more!`,
                                    true,
                                    () => {
                                        this.completeExperience();
                                    }
                                );
                            }, 1500);
                        }
                    });
                }
            }, 500);
            
            this.dataCollector.trackEvent('question_answered', { 
                questionIndex: this.currentQuestion,
                responseLength: response.length 
            });
        }
    }
    
    async handleClarificationResponse(response) {
        // User responded to clarification - check if they're ready to answer or need more help
        const followupAnalysis = await this.analyzeFollowupResponse(response);
        
        if (followupAnalysis.isAnswer) {
            // They provided an actual answer after clarification
            this.responses[`question_${this.currentQuestion}`] = response;
            this.conversationState = 'answering';
            
            const currentQ = this.questions[this.currentQuestion];
            
            setTimeout(async () => {
                try {
                    const followUpResponse = await currentQ.followUp(response);
                    
                    if (this.currentQuestion < this.questions.length - 1) {
                        this.typeMessage(followUpResponse, true, () => {
                            setTimeout(() => {
                                this.currentQuestion++;
                                this.conversationState = 'asking';
                                this.updateProgress();
                                this.typeMessage(this.questions[this.currentQuestion].text, true);
                            }, 1000);
                        });
                    } else {
                        // Final response
                        this.typeMessage(followUpResponse, true, () => {
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
                } catch (error) {
                    console.error('Error generating follow-up after clarification:', error);
                    const fallbackResponse = this.getFallbackFollowUp(response, 'general');
                    this.typeMessage(fallbackResponse, true, () => {
                        if (this.currentQuestion < this.questions.length - 1) {
                            setTimeout(() => {
                                this.currentQuestion++;
                                this.conversationState = 'asking';
                                this.updateProgress();
                                this.typeMessage(this.questions[this.currentQuestion].text, true);
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                this.typeMessage(
                                    `Thanks for sharing, ${this.userName || 'friend'}! 🐕 El will love learning about you. Feel free to explore the rest of the site, and don't hesitate to reach out if you want to chat more!`,
                                    true,
                                    () => {
                                        this.completeExperience();
                                    }
                                );
                            }, 1500);
                        }
                    });
                }
            }, 500);
            
            this.dataCollector.trackEvent('question_answered', { 
                questionIndex: this.currentQuestion,
                responseLength: response.length 
            });
            
        } else if (followupAnalysis.needsMoreHelp) {
            // They still need more clarification
            setTimeout(() => {
                this.typeMessage(followupAnalysis.additionalHelp, true);
            }, 500);
            
        } else {
            // Still clarifying, continue conversation
            setTimeout(() => {
                this.typeMessage(followupAnalysis.response, true);
            }, 500);
        }
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
            
            // Always generate avatar using template system (no API key needed)
            generatingMessage.innerHTML = 'Generating personalized avatar... <span style="animation: blink 1s infinite;">▊</span>';
            
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
        
        // Auto-close after delay on mobile, keep open on desktop
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            setTimeout(() => {
                this.close();
            }, 5000);
        } else {
            // On desktop, add a close button instead
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.cssText = `
                background: #ff5f56;
                color: white;
                border: none;
                padding: 8px 16px;
                margin-top: 16px;
                border-radius: 4px;
                cursor: pointer;
                font-family: inherit;
                font-size: 12px;
            `;
            closeButton.onclick = () => this.close();
            this.content.appendChild(closeButton);
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Dynamic response generation methods
    async generateClaudeFollowUp(response, context) {
        try {
            // Try to get a personalized Claude response
            return await this.getClaudeFollowUp(response, context);
        } catch (error) {
            console.warn('Claude API unavailable for follow-up, using fallback:', error);
            // Fallback to simpler responses if Claude API fails
            return this.getFallbackFollowUp(response, context);
        }
    }
    
    async getClaudeFollowUp(response, context) {
        const name = this.userName || 'friend';
        const conversationHistory = this.getConversationContext();
        
        const prompt = this.buildBluePrompt(response, context, name, conversationHistory);
        
        const claudeResponse = await this.avatarService.makeClaudeRequest([
            { role: 'user', content: prompt }
        ], 150);
        
        return claudeResponse.trim();
    }
    
    buildBluePrompt(response, context, name, conversationHistory) {
        const basePersonality = `You are Blue, El's enthusiastic welcome dog assistant. You're friendly, energetic, curious, and genuinely excited to learn about people. You use dog expressions occasionally (*tail wagging*, *ears perking up*) but naturally. Keep responses to 1-2 sentences and always sound authentically interested in what the person shared.`;
        
        const contextPrompts = {
            'work_intro': `The user just introduced themselves and their work. Respond with genuine curiosity about their field, acknowledge their name warmly, and maybe ask a follow-up question or show enthusiasm about their work.`,
            'passion_project': `The user shared something they're excited about working on. Match their energy level and show genuine interest in their passion. If they seem really excited, be more energetic. If it's more subdued, be thoughtfully encouraging.`,
            'dinner_conversation': `The user shared who they'd want to have dinner with and what they'd discuss. Show curiosity about their choice and what it reveals about their interests or values.`,
            'impact_vision': `The user shared their hopes for impact. Be supportive and encouraging about their vision while showing you understand what drives them.`
        };
        
        let conversationContext = '';
        if (conversationHistory.length > 0) {
            conversationContext = `\nPrevious conversation context: ${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;
        }
        
        return `${basePersonality}

${contextPrompts[context] || 'Respond encouragingly to what the user shared.'}

User's response: "${response}"
User's name: ${name}${conversationContext}

Your response as Blue:`;
    }
    
    getConversationContext() {
        // Return recent conversation for context
        return this.conversationHistory.slice(-4); // Last 4 exchanges
    }
    
    getFallbackFollowUp(response, context) {
        const name = this.userName || 'friend';
        const lowerResponse = response.toLowerCase();
        
        // Simplified fallbacks based on context
        switch(context) {
            case 'work_intro':
                if (lowerResponse.includes('design') || lowerResponse.includes('creative')) {
                    return `Nice to meet you, ${name}! The creative world needs more people like you. *tail wagging*`;
                } else if (lowerResponse.includes('tech') || lowerResponse.includes('engineer')) {
                    return `Hey ${name}! That sounds like fascinating problem-solving work.`;
                } else {
                    return `Nice to meet you, ${name}! That sounds like meaningful work.`;
                }
            case 'passion_project':
                if (response.includes('!') && response.length > 50) {
                    return "Wow! *ears perking up* That excitement is absolutely infectious!";
                } else {
                    return "That passion really comes through! I love hearing about projects that spark genuine excitement.";
                }
            case 'dinner_conversation':
                return "What a fascinating choice! Those would definitely be some memorable conversations.";
            case 'impact_vision':
                return "Incredible! It's inspiring to meet someone with such purposeful vision.";
            default:
                return `That's really interesting, ${name}! Tell me more!`;
        }
    }
    
    
    // Claude API methods for conversation analysis
    async analyzeResponseForClarification(response) {
        // Check if user is asking for clarification or seems confused
        const clarificationIndicators = [
            'what do you mean', 'i don\'t understand', 'can you explain', 'what does that mean',
            'i\'m not sure', 'confused', 'clarify', 'example', 'help me understand',
            'what kind of', 'like what', 'such as', '?'
        ];
        
        const lowerResponse = response.toLowerCase();
        const seemsLikeClarification = clarificationIndicators.some(indicator => 
            lowerResponse.includes(indicator)
        );
        
        // If it seems like a clarification request, use Claude for intelligent response
        if (seemsLikeClarification || response.length < 10) {
            try {
                const clarification = await this.generateClarificationWithClaude(response);
                return {
                    isRequest: true,
                    clarification: clarification
                };
            } catch (error) {
                console.warn('Claude clarification failed, using fallback:', error);
                return {
                    isRequest: true,
                    clarification: this.getFallbackClarification(response)
                };
            }
        }
        
        return { isRequest: false };
    }
    
    async analyzeFollowupResponse(response) {
        // Analyze if the user is now providing an answer or still needs help
        try {
            const analysis = await this.analyzeFollowupWithClaude(response);
            return analysis;
        } catch (error) {
            console.warn('Claude followup analysis failed, using fallback:', error);
            return this.getFallbackFollowupAnalysis(response);
        }
    }
    
    async generateClarificationWithClaude(userResponse) {
        // Check if Claude API is available for clarification
        if (!this.hasClaudeApiForClarification()) {
            throw new Error('No Claude API key available');
        }
        
        const currentQuestion = this.questions[this.currentQuestion];
        const questionContext = this.getQuestionContext(this.currentQuestion);
        
        const prompt = `You are Blue, a friendly dog assistant helping someone through a questionnaire. The user just responded "${userResponse}" to the question "${currentQuestion.text}".

They seem to need clarification. As Blue the dog, provide a helpful, warm clarification that:
1. Stays in character as a friendly dog (use dog expressions like *tail wagging*, *head tilt*)
2. Explains the question in simpler terms with examples
3. Encourages them without being pushy
4. Keeps it concise (1-2 sentences max)

Context: ${questionContext}

Respond as Blue would:`;

        try {
            const response = await this.avatarService.makeClaudeRequest([
                { role: 'user', content: prompt }
            ]);
            
            return response;
        } catch (error) {
            throw new Error(`Claude API call failed: ${error.message}`);
        }
    }
    
    async analyzeFollowupWithClaude(userResponse) {
        const currentQuestion = this.questions[this.currentQuestion];
        const questionContext = this.getQuestionContext(this.currentQuestion);
        
        const prompt = `You are analyzing a conversation where a user previously asked for clarification on the question "${currentQuestion.text}" and now responded with "${userResponse}".

Determine if this response is:
1. A proper answer to the original question
2. Still asking for more clarification/help
3. A conversational response that needs encouragement to answer

Context: ${questionContext}

Respond with a JSON object:
{
  "isAnswer": boolean,
  "needsMoreHelp": boolean, 
  "response": "Blue's response as a friendly dog",
  "additionalHelp": "if they need more help, what Blue should say"
}

Blue should use dog expressions like *wags tail*, *encouraging bark*, etc.`;

        try {
            const response = await this.avatarService.makeClaudeRequest([
                { role: 'user', content: prompt }
            ]);
            
            // Try to parse JSON response
            try {
                return JSON.parse(response);
            } catch (parseError) {
                // If JSON parsing fails, treat as conversational response
                return {
                    isAnswer: false,
                    needsMoreHelp: false,
                    response: response
                };
            }
        } catch (error) {
            throw new Error(`Claude API call failed: ${error.message}`);
        }
    }
    
    getQuestionContext(questionIndex) {
        const contexts = [
            "This is about getting to know their name and what they do professionally or as a student.",
            "This asks about current projects or activities they're passionate about - work, hobbies, learning, etc.",
            "This is a fun question about who they'd want to have a conversation with if they could meet anyone.",
            "This asks about the positive difference they want to make - big or small, personal or global."
        ];
        return contexts[questionIndex] || "General getting-to-know-you question.";
    }
    
    getFallbackClarification(userResponse) {
        const currentQuestion = this.questions[this.currentQuestion];
        
        // Simple fallback clarifications based on question
        const fallbacks = [
            "No worries! *friendly tail wag* I'm just asking for your name and what you do - like your job, studies, or main activity. For example: 'I'm Sarah and I'm a teacher' or 'I'm Alex and I'm studying computer science.'",
            
            "*head tilt* I'm curious about something you're working on that gets you excited! It could be a work project, hobby, learning something new, or even a personal goal. What's been on your mind lately?",
            
            "This is a fun one! *excited panting* If you could sit down for dinner with anyone - alive, from history, or even fictional - who would it be? And what would you want to chat about with them?",
            
            "*thoughtful ear perk* I'm asking about the positive difference you'd like to make! It could be big (changing the world) or small (helping your neighbors), in your work or personal life. What impact matters to you?"
        ];
        
        return fallbacks[this.currentQuestion] || "Let me know if you need help with this question! *encouraging wag*";
    }
    
    getFallbackFollowupAnalysis(userResponse) {
        const lowerResponse = userResponse.toLowerCase();
        
        // Simple heuristics for fallback
        if (lowerResponse.includes('still') || lowerResponse.includes('more help') || 
            lowerResponse.includes('don\'t') || lowerResponse.includes('confused')) {
            return {
                isAnswer: false,
                needsMoreHelp: true,
                additionalHelp: "No problem at all! *patient tail wag* Take your time. You can share whatever feels comfortable - there's no wrong answer here!"
            };
        }
        
        if (userResponse.length > 15 && !lowerResponse.includes('?')) {
            return {
                isAnswer: true,
                needsMoreHelp: false
            };
        }
        
        return {
            isAnswer: false,
            needsMoreHelp: false,
            response: "That's helpful! *encouraging nod* Feel free to share more, or if you're ready, go ahead and answer the question however feels right to you!"
        };
    }
    
    // Helper method to check if Claude API is available for clarification
    hasClaudeApiForClarification() {
        return this.avatarService.apiKey || localStorage.getItem('claude_api_key');
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