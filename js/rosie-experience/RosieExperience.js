class RosieExperience {
    constructor() {
        this.container = null;
        this.isVisible = false;
        this.isInitialized = false;
        
        // Experience state
        this.currentQuestion = 0;
        this.answers = [];
        this.personalityProfile = {};
        this.isTransitioning = false;
        
        // Animation state
        this.animationFrame = null;
        this.floatingElements = [];
        
        // Questions data
        this.questions = [
            {
                id: 1,
                text: "What's your name, and what do you do for work?",
                placeholder: "Hi! I'm Alex, and I work as a...",
                rosieState: "normal",
                tailState: "normal",
                robotPhase: 1
            },
            {
                id: 2,
                text: "What's something you've been working on lately that you're genuinely excited about?",
                placeholder: "I've been working on this project where...",
                rosieState: "alternate",
                tailState: "wagging",
                robotPhase: 2
            },
            {
                id: 3,
                text: "If you could have dinner with anyone (dead or alive), who would it be and what would you want to talk about?",
                placeholder: "I'd love to have dinner with...",
                rosieState: "happy",
                tailState: "wagging",
                robotPhase: 3
            },
            {
                id: 4,
                text: "What kind of impact do you hope to make in your work or the world?",
                placeholder: "I hope to make a difference by...",
                rosieState: "happy",
                tailState: "wagging",
                robotPhase: 4
            }
        ];
        
        // Callbacks
        this.onComplete = null;
        this.onQuestionChange = null;
        
        // SVG Assets
        this.assets = {
            rosie: {
                normal: 'Assets/Rosie1.svg',
                alternate: 'Assets/Rosie2.svg',
                happy: 'Assets/Happy1.svg'
            },
            tails: {
                normal: 'Assets/Tail1.svg',
                wagging: 'Assets/Tail2.svg'
            },
            robots: {
                phase1: 'Assets/Robot1.svg',
                phase2: 'Assets/Robot2.svg',
                phase3: 'Assets/Robot3.svg',
                phase4: 'Assets/Robot4.svg'
            },
            scene: {
                element1: 'Assets/Asset 1.svg',
                element3: 'Assets/Asset 3.svg'
            }
        };
        
        // Current states
        this.currentRosieState = 'normal';
        this.currentTailState = 'normal';
        this.currentRobotPhase = 1;
    }
    
    initialize() {
        if (this.isInitialized) return;
        
        this.createModernInterface();
        this.setupEventListeners();
        this.startAnimationLoop();
        this.preloadAssets();
        
        this.isInitialized = true;
        console.log('Rosie Experience initialized');
    }
    
    createModernInterface() {
        this.container = document.createElement('div');
        this.container.id = 'rosie-experience';
        this.container.className = 'rosie-experience hidden';
        
        this.container.innerHTML = `
            <div class="modern-layout-container">
                <!-- Hero Character Section -->
                <div class="rosie-hero-section">
                    <div class="rosie-character-container" id="rosie-container">
                        <object class="rosie-main-character" id="main-character" type="image/svg+xml" data="Assets/Rosie1.svg">Rosie</object>
                        <object class="rosie-tail" id="rosie-tail" type="image/svg+xml" data="Assets/Tail1.svg">Tail</object>
                    </div>
                </div>
                
                <!-- Robot Construction Area -->
                <div class="robot-construction-area">
                    <object class="robot-character" id="robot-character" type="image/svg+xml" data="Assets/Robot1.svg">Robot</object>
                </div>
                
                <!-- Scene Elements -->
                <div class="scene-elements">
                    <object class="scene-element scene-1" id="scene-1" type="image/svg+xml" data="Assets/Asset 1.svg">Scene 1</object>
                    <object class="scene-element scene-3" id="scene-3" type="image/svg+xml" data="Assets/Asset 3.svg">Scene 3</object>
                </div>
                
                <!-- Floating Elements -->
                <div class="floating-elements">
                    <div class="floating-element float-1">
                        <svg width="60" height="60" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="15" fill="rgba(74, 144, 226, 0.3)" />
                            <circle cx="30" cy="30" r="8" fill="rgba(74, 144, 226, 0.6)" />
                        </svg>
                    </div>
                    <div class="floating-element float-2">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <polygon points="40,10 60,50 20,50" fill="rgba(76, 175, 80, 0.3)" />
                            <polygon points="40,20 50,40 30,40" fill="rgba(76, 175, 80, 0.6)" />
                        </svg>
                    </div>
                    <div class="floating-element float-3">
                        <svg width="50" height="50" viewBox="0 0 50 50">
                            <rect x="15" y="15" width="20" height="20" fill="rgba(255, 107, 53, 0.3)" />
                            <rect x="20" y="20" width="10" height="10" fill="rgba(255, 107, 53, 0.6)" />
                        </svg>
                    </div>
                    <div class="floating-element float-4">
                        <svg width="70" height="70" viewBox="0 0 70 70">
                            <ellipse cx="35" cy="35" rx="20" ry="15" fill="rgba(156, 39, 176, 0.3)" />
                            <ellipse cx="35" cy="35" rx="12" ry="8" fill="rgba(156, 39, 176, 0.6)" />
                        </svg>
                    </div>
                </div>
                
                <!-- SVG Graphics Container -->
                <div class="svg-graphics-container">
                    <div class="decorative-svg svg-top-left">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <path d="M20,80 Q50,20 80,80" stroke="rgba(74, 144, 226, 0.4)" stroke-width="3" fill="none" />
                            <circle cx="50" cy="50" r="5" fill="rgba(74, 144, 226, 0.6)" />
                        </svg>
                    </div>
                    <div class="decorative-svg svg-top-right">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <path d="M20,60 Q60,20 100,60 Q60,100 20,60" fill="rgba(76, 175, 80, 0.3)" />
                            <circle cx="60" cy="60" r="8" fill="rgba(76, 175, 80, 0.6)" />
                        </svg>
                    </div>
                    <div class="decorative-svg svg-bottom-left">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            <star cx="40" cy="40" r="20" fill="rgba(255, 107, 53, 0.3)" />
                        </svg>
                    </div>
                    <div class="decorative-svg svg-bottom-right">
                        <svg width="90" height="90" viewBox="0 0 90 90">
                            <path d="M10,45 Q45,10 80,45 Q45,80 10,45" fill="rgba(156, 39, 176, 0.3)" />
                        </svg>
                    </div>
                </div>
                
                <!-- Progress Indicator -->
                <div class="modern-progress-container">
                    <div class="progress-dots" id="progress-dots"></div>
                    <span class="progress-label" id="progress-label">Getting to know you...</span>
                </div>
                
                <!-- Question Interface -->
                <div class="modern-question-container modern-fade-in" id="question-container">
                    <div class="modern-question-text" id="question-text"></div>
                    <div class="modern-input-container">
                        <textarea 
                            id="answer-input" 
                            class="modern-textarea"
                            placeholder="Type your answer here..."
                            rows="4"
                            maxlength="500"
                        ></textarea>
                        <div class="modern-char-count" id="char-count">0/500</div>
                    </div>
                    <div class="modern-actions">
                        <button id="skip-btn" class="modern-skip-btn">Skip Question</button>
                        <button id="submit-btn" class="modern-submit-btn">Continue</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.setupDOMReferences();
    }
    
    setupDOMReferences() {
        // Main elements
        this.mainCharacter = this.container.querySelector('#main-character');
        this.rosieTail = this.container.querySelector('#rosie-tail');
        this.robotCharacter = this.container.querySelector('#robot-character');
        this.questionContainer = this.container.querySelector('#question-container');
        this.questionText = this.container.querySelector('#question-text');
        this.answerInput = this.container.querySelector('#answer-input');
        this.submitBtn = this.container.querySelector('#submit-btn');
        this.skipBtn = this.container.querySelector('#skip-btn');
        this.charCount = this.container.querySelector('#char-count');
        this.progressDots = this.container.querySelector('#progress-dots');
        this.progressLabel = this.container.querySelector('#progress-label');
        
        // Scene elements
        this.sceneElements = {
            scene1: this.container.querySelector('#scene-1'),
            scene3: this.container.querySelector('#scene-3')
        };
        
        // Floating elements
        this.floatingElements = this.container.querySelectorAll('.floating-element');
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
        
        // Character counter and button state
        this.answerInput.addEventListener('input', () => {
            this.updateCharCount();
            this.updateSubmitButton();
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    preloadAssets() {
        // SVG objects will load automatically via the data attribute
        // We can add load event listeners if needed for timing
        
        if (this.mainCharacter) {
            this.mainCharacter.addEventListener('load', () => {
                console.log('Rosie character loaded');
                this.onRosieLoaded();
            });
        }
        
        if (this.robotCharacter) {
            this.robotCharacter.addEventListener('load', () => {
                console.log('Robot character loaded');
                this.onRobotLoaded();
            });
        }
    }
    
    onRosieLoaded() {
        // Rosie is ready for animations
        this.mainCharacter.classList.add('loaded');
    }
    
    onRobotLoaded() {
        // Robot is ready for phase transitions
        this.robotCharacter.classList.add('loaded');
    }
    
    startAnimationLoop() {
        const animate = () => {
            if (this.isVisible) {
                this.updateAnimations();
            }
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    updateAnimations() {
        const time = Date.now() * 0.001;
        
        // Animate Rosie with subtle breathing
        const breathe = Math.sin(time * 0.5) * 0.02;
        if (this.mainCharacter) {
            this.mainCharacter.style.transform = `scale(${1 + breathe})`;
        }
        
        // Animate tail separately for better control
        if (this.rosieTail && this.currentTailState === 'wagging') {
            const wag = Math.sin(time * 3) * 10; // Tail wag animation
            this.rosieTail.style.transform = `rotate(${wag}deg)`;
        }
        
        // Animate robot with subtle hover effect
        if (this.robotCharacter) {
            const hover = Math.sin(time * 0.3) * 0.01;
            this.robotCharacter.style.transform = `translateY(${hover * 5}px)`;
        }
        
        // Animate scene elements
        Object.values(this.sceneElements).forEach((element, index) => {
            if (element) {
                const offset = index * 0.7;
                const float = Math.sin(time * 0.4 + offset) * 0.01;
                element.style.transform = `translateY(${float * 8}px)`;
            }
        });
    }
    
    show() {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.container.classList.remove('hidden');
        this.isVisible = true;
        
        // Start with first question
        this.showQuestion(0);
        
        // Animate in all elements
        this.animateElementsIn();
        
        // Focus input
        setTimeout(() => {
            this.answerInput.focus();
        }, 800);
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
        this.updateProgress();
        
        // Update question text with animation
        this.animateQuestionText(question.text);
        
        // Update input
        this.answerInput.placeholder = question.placeholder;
        this.answerInput.value = '';
        this.updateCharCount();
        this.updateSubmitButton();
        
        // Update character states based on question
        this.updateRosieState(question.rosieState);
        this.updateTailState(question.tailState);
        this.updateRobotPhase(question.robotPhase);
        
        // Call question change callback
        if (this.onQuestionChange) {
            this.onQuestionChange(questionIndex, question);
        }
    }
    
    animateQuestionText(text) {
        this.questionText.style.opacity = '0';
        this.questionText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.questionText.textContent = text;
            this.questionText.style.transition = 'all 0.5s ease';
            this.questionText.style.opacity = '1';
            this.questionText.style.transform = 'translateY(0)';
        }, 200);
    }
    
    updateProgress() {
        // Clear existing dots
        this.progressDots.innerHTML = '';
        
        // Create progress dots
        for (let i = 0; i < this.questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            
            if (i < this.currentQuestion) {
                dot.classList.add('completed');
            } else if (i === this.currentQuestion) {
                dot.classList.add('active');
            }
            
            this.progressDots.appendChild(dot);
        }
        
        // Update label
        this.progressLabel.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
    }
    
    updateRosieState(newState) {
        if (this.currentRosieState === newState) return;
        
        this.currentRosieState = newState;
        const assetPath = this.assets.rosie[newState];
        
        if (this.mainCharacter && assetPath) {
            this.mainCharacter.data = assetPath;
            
            // Add transition animation
            this.mainCharacter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.mainCharacter.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    updateTailState(newState) {
        if (this.currentTailState === newState) return;
        
        this.currentTailState = newState;
        const assetPath = this.assets.tails[newState];
        
        if (this.rosieTail && assetPath) {
            this.rosieTail.data = assetPath;
            
            // Add tail wag animation class if wagging
            if (newState === 'wagging') {
                this.rosieTail.classList.add('wagging');
            } else {
                this.rosieTail.classList.remove('wagging');
            }
        }
    }
    
    updateRobotPhase(newPhase) {
        if (this.currentRobotPhase === newPhase) return;
        
        this.currentRobotPhase = newPhase;
        const assetPath = this.assets.robots[`phase${newPhase}`];
        
        if (this.robotCharacter && assetPath) {
            // Add building animation
            this.robotCharacter.style.opacity = '0';
            this.robotCharacter.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.robotCharacter.data = assetPath;
                this.robotCharacter.style.transition = 'all 0.5s ease';
                this.robotCharacter.style.opacity = '1';
                this.robotCharacter.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    triggerCharacterAnimation(animationType) {
        // Animate main character based on animation type
        this.mainCharacter.classList.remove('animate');
        
        setTimeout(() => {
            this.mainCharacter.classList.add('animate');
            
            // Add specific animation classes based on type
            switch (animationType) {
                case 'wave':
                    this.mainCharacter.style.transform = 'scale(1.05) rotate(5deg)';
                    break;
                case 'excited':
                    this.mainCharacter.style.transform = 'scale(1.1) rotate(-3deg)';
                    break;
                case 'thinking':
                    this.mainCharacter.style.transform = 'scale(1.02) rotate(2deg)';
                    break;
                case 'inspired':
                    this.mainCharacter.style.transform = 'scale(1.08) rotate(0deg)';
                    break;
            }
        }, 100);
        
        // Reset after animation
        setTimeout(() => {
            this.mainCharacter.style.transform = 'scale(1) rotate(0deg)';
        }, 2000);
    }
    
    animateElementsIn() {
        // Animate Rosie character in
        if (this.mainCharacter) {
            this.mainCharacter.style.opacity = '0';
            this.mainCharacter.style.transform = 'scale(0.5) translateY(50px)';
            
            setTimeout(() => {
                this.mainCharacter.style.transition = 'all 0.8s ease';
                this.mainCharacter.style.opacity = '1';
                this.mainCharacter.style.transform = 'scale(1) translateY(0)';
            }, 200);
        }
        
        // Animate tail in
        if (this.rosieTail) {
            this.rosieTail.style.opacity = '0';
            this.rosieTail.style.transform = 'scale(0.5) rotate(-20deg)';
            
            setTimeout(() => {
                this.rosieTail.style.transition = 'all 0.6s ease';
                this.rosieTail.style.opacity = '1';
                this.rosieTail.style.transform = 'scale(1) rotate(0deg)';
            }, 400);
        }
        
        // Animate robot in
        if (this.robotCharacter) {
            this.robotCharacter.style.opacity = '0';
            this.robotCharacter.style.transform = 'scale(0.3) translateX(100px)';
            
            setTimeout(() => {
                this.robotCharacter.style.transition = 'all 1s ease';
                this.robotCharacter.style.opacity = '1';
                this.robotCharacter.style.transform = 'scale(1) translateX(0)';
            }, 600);
        }
        
        // Animate scene elements in
        Object.values(this.sceneElements).forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8) translateY(-20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.7s ease';
                    element.style.opacity = '0.7';
                    element.style.transform = 'scale(1) translateY(0)';
                }, 800 + index * 200);
            }
        });
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
        }, 1500);
    }
    
    handleSkip() {
        this.answers[this.currentQuestion] = '';
        this.showQuestion(this.currentQuestion + 1);
    }
    
    showFeedback() {
        // Animate main character
        this.mainCharacter.classList.add('animate');
        
        // Add success animation to question container
        this.questionContainer.style.transform = 'scale(1.02)';
        this.questionContainer.style.boxShadow = '0 25px 70px rgba(76, 175, 80, 0.3)';
        
        setTimeout(() => {
            this.questionContainer.style.transform = 'scale(1)';
            this.questionContainer.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
        }, 500);
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
            
            // Save user data
            if (window.mainConversation) {
                window.mainConversation.saveUserData(this.personalityProfile);
            }
        }
        
        // Final celebration animation
        this.celebrateCompletion();
        
        // Call completion callback
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(this.personalityProfile);
            }
        }, 2000);
    }
    
    celebrateCompletion() {
        // Final main character animation
        this.mainCharacter.style.transform = 'scale(1.2) rotate(0deg)';
        
        // Animate robot celebration
        if (this.robotCharacter) {
            this.robotCharacter.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        // Animate scene elements celebration
        Object.values(this.sceneElements).forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.style.transform = `scale(1.2) rotate(${index * 10}deg)`;
                }, index * 100);
            }
        });
        
        // Update progress to completed
        this.progressLabel.textContent = 'Welcome to my world! 🎉';
        
        // Animate question container out
        setTimeout(() => {
            this.questionContainer.style.opacity = '0';
            this.questionContainer.style.transform = 'translateY(50px)';
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
        this.answerInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.answerInput.style.animation = '';
        }, 500);
    }
    
    handleResize() {
        // Handle responsive layout adjustments
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Hide robot on mobile for space
            if (this.robotCharacter) {
                this.robotCharacter.style.display = 'none';
            }
            
            // Reduce scene element opacity on mobile
            Object.values(this.sceneElements).forEach(element => {
                if (element) {
                    element.style.opacity = '0.3';
                    element.style.transform = 'scale(0.7)';
                }
            });
        } else {
            // Show robot on desktop
            if (this.robotCharacter) {
                this.robotCharacter.style.display = 'block';
            }
            
            // Restore scene element opacity on desktop
            Object.values(this.sceneElements).forEach(element => {
                if (element) {
                    element.style.opacity = '0.6';
                    element.style.transform = 'scale(1)';
                }
            });
        }
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
    
    // Public API methods
    getCurrentQuestion() {
        return this.currentQuestion;
    }
    
    getAnswers() {
        return [...this.answers];
    }
    
    getPersonalityProfile() {
        return this.personalityProfile;
    }
    
    setCustomAssets(assets) {
        this.assetUrls = { ...this.assetUrls, ...assets };
        if (this.isInitialized) {
            this.preloadAssets();
        }
    }
}

// Add shake animation to CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

window.RosieExperience = RosieExperience;