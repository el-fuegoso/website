class RosieExperience {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.isVisible = false;
        this.isInitialized = false;
        
        // Experience state
        this.currentQuestion = 0;
        this.answers = [];
        this.robotPhase = 0;
        this.isTransitioning = false;
        this.personalityProfile = {};
        
        // Components
        this.rosieCharacter = null;
        this.robotConstruction = null;
        this.questionInterface = null;
        this.progressBar = null;
        this.particleSystem = null;
        
        // Animation
        this.animationFrame = null;
        this.lastFrameTime = 0;
        
        // Questions data
        this.questions = [
            {
                id: 1,
                text: "What's your name, and what do you do for work?",
                placeholder: "Hi! I'm...",
                robotPhase: 1,
                rosieAnimation: "headTilt"
            },
            {
                id: 2,
                text: "What's something you've been working on lately that you're genuinely excited about?",
                placeholder: "I've been working on...",
                robotPhase: 2,
                rosieAnimation: "tailWag"
            },
            {
                id: 3,
                text: "If you could have dinner with anyone (dead or alive), who would it be and what would you want to talk about?",
                placeholder: "I'd love to have dinner with...",
                robotPhase: 3,
                rosieAnimation: "excitement"
            },
            {
                id: 4,
                text: "What kind of impact do you hope to make in your work or the world?",
                placeholder: "I hope to...",
                robotPhase: 4,
                rosieAnimation: "excitement"
            }
        ];
        
        // Callbacks
        this.onComplete = null;
    }
    
    initialize() {
        if (this.isInitialized) return;
        
        this.createExperienceInterface();
        this.setupCanvas();
        this.setupComponents();
        this.setupEventListeners();
        this.startAnimationLoop();
        
        this.isInitialized = true;
        console.log('Rosie Experience initialized');
    }
    
    createExperienceInterface() {
        this.container = document.createElement('div');
        this.container.id = 'rosie-experience';
        this.container.className = 'rosie-experience hidden';
        
        this.container.innerHTML = `
            <div class="experience-overlay"></div>
            <div class="experience-container">
                <canvas id="rosie-canvas" width="800" height="600"></canvas>
                <div class="ui-overlay">
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="rosie-progress"></div>
                        </div>
                        <span class="progress-text" id="rosie-progress-text">Getting to know you...</span>
                    </div>
                    
                    <div class="question-container" id="rosie-question-container">
                        <div class="question-text" id="rosie-question-text"></div>
                        <div class="question-input-container">
                            <textarea 
                                id="rosie-answer-input" 
                                placeholder="Type your answer here..."
                                rows="3"
                                maxlength="500"
                            ></textarea>
                            <div class="input-actions">
                                <button id="rosie-skip-btn" class="skip-btn">Skip</button>
                                <button id="rosie-submit-btn" class="submit-btn">Continue</button>
                            </div>
                            <div class="char-count" id="rosie-char-count">0/500</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.canvas = this.container.querySelector('#rosie-canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    setupCanvas() {
        // Set up canvas for crisp pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = 800 * dpr;
        this.canvas.height = 600 * dpr;
        this.canvas.style.width = '800px';
        this.canvas.style.height = '600px';
        
        this.ctx.scale(dpr, dpr);
        
        // Make canvas responsive
        this.handleResize();
    }
    
    setupComponents() {
        // Initialize character and robot systems
        this.rosieCharacter = new RosieCharacter(this.ctx);
        this.robotConstruction = new RobotConstruction(this.ctx);
        this.particleSystem = new ParticleSystem(this.ctx);
        
        // Position components
        this.rosieCharacter.setPosition(150, 400);
        this.robotConstruction.setPosition(650, 400);
        
        // Setup UI references
        this.progressBar = this.container.querySelector('#rosie-progress');
        this.progressText = this.container.querySelector('#rosie-progress-text');
        this.questionText = this.container.querySelector('#rosie-question-text');
        this.answerInput = this.container.querySelector('#rosie-answer-input');
        this.submitBtn = this.container.querySelector('#rosie-submit-btn');
        this.skipBtn = this.container.querySelector('#rosie-skip-btn');
        this.charCount = this.container.querySelector('#rosie-char-count');
    }
    
    setupEventListeners() {
        // Submit button
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        
        // Skip button
        this.skipBtn.addEventListener('click', () => this.handleSkip());
        
        // Enter key submission
        this.answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
        
        // Character counter
        this.answerInput.addEventListener('input', () => {
            this.updateCharCount();
            this.updateSubmitButton();
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Close on overlay click (disabled during experience)
        this.container.querySelector('.experience-overlay').addEventListener('click', () => {
            // Don't allow closing during experience
        });
    }
    
    startAnimationLoop() {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            if (this.isVisible) {
                this.update(deltaTime);
                this.render();
            }
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    update(deltaTime) {
        if (this.rosieCharacter) {
            this.rosieCharacter.update(deltaTime);
        }
        
        if (this.robotConstruction) {
            this.robotConstruction.update(deltaTime);
        }
        
        if (this.particleSystem) {
            this.particleSystem.update(deltaTime);
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, 800, 600);
        
        // Draw background
        this.drawBackground();
        
        // Draw components
        if (this.rosieCharacter) {
            this.rosieCharacter.render();
        }
        
        if (this.robotConstruction) {
            this.robotConstruction.render();
        }
        
        if (this.particleSystem) {
            this.particleSystem.render();
        }
    }
    
    drawBackground() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#F0EEE6');
        gradient.addColorStop(1, '#E8E6DE');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Draw subtle grid pattern
        this.ctx.strokeStyle = 'rgba(51, 51, 51, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= 800; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, 600);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= 600; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(800, y);
            this.ctx.stroke();
        }
    }
    
    show() {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.container.classList.remove('hidden');
        this.isVisible = true;
        
        // Start with first question
        this.showQuestion(0);
        
        // Focus input
        setTimeout(() => {
            this.answerInput.focus();
        }, 500);
    }
    
    hide() {
        this.container.classList.add('hidden');
        this.isVisible = false;
    }
    
    showQuestion(questionIndex) {
        if (questionIndex >= this.questions.length) {
            this.completeExperience();
            return;
        }
        
        const question = this.questions[questionIndex];
        this.currentQuestion = questionIndex;
        
        // Update progress
        this.updateProgress(questionIndex + 1, this.questions.length);
        
        // Update question text
        this.typeQuestionText(question.text);
        
        // Update input
        this.answerInput.placeholder = question.placeholder;
        this.answerInput.value = '';
        this.updateCharCount();
        this.updateSubmitButton();
        
        // Trigger Rosie animation
        if (this.rosieCharacter) {
            this.rosieCharacter.playAnimation(question.rosieAnimation);
        }
        
        // Update robot phase
        this.robotConstruction.setPhase(question.robotPhase);
        
        // Focus input immediately since there's no typing animation
        setTimeout(() => {
            this.answerInput.focus();
        }, 500);
    }
    
    typeQuestionText(text) {
        // Disable typing animation for now - just show the text directly
        this.questionText.textContent = text;
        
        // TODO: Fix typing animation character doubling issue later
        // For now, instant text display is more reliable
    }
    
    updateProgress(current, total) {
        const percentage = ((current - 1) / (total - 1)) * 100;
        this.progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        this.progressText.textContent = `Question ${current} of ${total}`;
    }
    
    handleSubmit() {
        const answer = this.answerInput.value.trim();
        
        if (!answer) {
            this.shakeInput();
            return;
        }
        
        // Store answer
        this.answers[this.currentQuestion] = answer;
        
        // Show feedback
        this.showFeedback();
        
        // Move to next question
        setTimeout(() => {
            this.showQuestion(this.currentQuestion + 1);
        }, 2000);
    }
    
    handleSkip() {
        this.answers[this.currentQuestion] = '';
        this.showQuestion(this.currentQuestion + 1);
    }
    
    showFeedback() {
        // Trigger particle effect
        if (this.particleSystem) {
            this.particleSystem.burst(400, 300);
        }
        
        // Animate Rosie
        if (this.rosieCharacter) {
            this.rosieCharacter.playAnimation('tailWag');
        }
    }
    
    completeExperience() {
        // Analyze personality
        if (typeof PersonalityAnalyzer !== 'undefined') {
            const analyzer = new PersonalityAnalyzer();
            const responses = {};
            
            // Convert answers to expected format
            this.answers.forEach((answer, index) => {
                const questionKeys = ['name_work', 'current_project', 'dinner_guest', 'impact'];
                if (questionKeys[index]) {
                    responses[questionKeys[index]] = { answer: answer };
                }
            });
            
            this.personalityProfile = analyzer.analyze(responses);
            
            // Save user data to localStorage
            if (window.mainConversation) {
                window.mainConversation.saveUserData(this.personalityProfile);
            }
        }
        
        // Final robot animation
        this.robotConstruction.setPhase(4);
        
        // Apply personality to robot
        if (this.robotConstruction && this.personalityProfile) {
            this.robotConstruction.applyPersonalityTraits(this.personalityProfile);
        }
        
        // Completion celebration
        setTimeout(() => {
            if (this.particleSystem) {
                this.particleSystem.celebrate();
            }
            
            if (this.rosieCharacter) {
                this.rosieCharacter.playAnimation('excitement');
            }
            
            // Call completion callback
            if (this.onComplete) {
                this.onComplete(this.personalityProfile);
            }
        }, 1000);
    }
    
    updateCharCount() {
        const length = this.answerInput.value.length;
        this.charCount.textContent = `${length}/500`;
        
        if (length > 450) {
            this.charCount.classList.add('warning');
        } else {
            this.charCount.classList.remove('warning');
        }
    }
    
    updateSubmitButton() {
        const hasText = this.answerInput.value.trim().length > 0;
        this.submitBtn.disabled = !hasText;
    }
    
    shakeInput() {
        this.answerInput.classList.add('shake');
        setTimeout(() => {
            this.answerInput.classList.remove('shake');
        }, 500);
    }
    
    handleResize() {
        if (!this.container) return;
        
        const container = this.container.querySelector('.experience-container');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Scale canvas to fit window while maintaining aspect ratio
        const scale = Math.min(windowWidth / 800, windowHeight / 600) * 0.9;
        
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'center center';
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.isInitialized = false;
        console.log('Rosie Experience destroyed');
    }
}

window.RosieExperience = RosieExperience;