class WelcomeUI {
    constructor() {
        this.container = null;
        this.questionContainer = null;
        this.inputContainer = null;
        this.progressBar = null;
        this.isVisible = false;
        this.isInitialized = false;
        this.currentTypingAnimation = null;
        
        this.onResponse = null;
        this.onSkip = null;
        this.onRestart = null;
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.createWelcomeInterface();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    createWelcomeInterface() {
        this.container = document.createElement('div');
        this.container.id = 'welcome-bot-interface';
        this.container.className = 'welcome-bot-interface hidden';
        
        this.container.innerHTML = `
            <div class="welcome-bot-overlay"></div>
            <div class="welcome-bot-card">
                <div class="welcome-bot-header">
                    <div class="welcome-bot-avatar">
                        <div class="avatar-circle">
                            <span class="avatar-emoji">🤖</span>
                        </div>
                        <div class="avatar-pulse"></div>
                    </div>
                    <div class="welcome-bot-title">
                        <h2>Welcome to El's Portfolio</h2>
                        <p>Let's get to know you!</p>
                    </div>
                </div>
                
                <div class="welcome-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <span class="progress-text" id="progressText">Question 1 of 4</span>
                </div>
                
                <div class="welcome-question-container" id="questionContainer">
                    <div class="question-text" id="questionText"></div>
                    <div class="question-feedback" id="questionFeedback"></div>
                </div>
                
                <div class="welcome-input-container" id="inputContainer">
                    <textarea 
                        id="responseInput" 
                        placeholder="Type your response here..."
                        rows="3"
                        maxlength="500"
                    ></textarea>
                    <div class="input-actions">
                        <button id="skipBtn" class="skip-btn">Skip</button>
                        <button id="submitBtn" class="submit-btn">Continue</button>
                    </div>
                    <div class="char-count" id="charCount">0/500</div>
                </div>
                
                <div class="welcome-footer">
                    <button id="restartBtn" class="restart-btn">↻ Start Over</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.setupReferences();
    }

    setupReferences() {
        this.questionContainer = this.container.querySelector('#questionContainer');
        this.inputContainer = this.container.querySelector('#inputContainer');
        this.progressBar = this.container.querySelector('#progressFill');
        this.progressText = this.container.querySelector('#progressText');
        this.questionText = this.container.querySelector('#questionText');
        this.questionFeedback = this.container.querySelector('#questionFeedback');
        this.responseInput = this.container.querySelector('#responseInput');
        this.submitBtn = this.container.querySelector('#submitBtn');
        this.skipBtn = this.container.querySelector('#skipBtn');
        this.restartBtn = this.container.querySelector('#restartBtn');
        this.charCount = this.container.querySelector('#charCount');
    }

    setupEventListeners() {
        // Submit button
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        
        // Enter key (but allow Shift+Enter for new lines)
        this.responseInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit();
            }
        });
        
        // Skip button
        this.skipBtn.addEventListener('click', () => {
            if (this.onSkip) this.onSkip();
        });
        
        // Restart button
        this.restartBtn.addEventListener('click', () => {
            if (this.onRestart) this.onRestart();
        });
        
        // Character counter
        this.responseInput.addEventListener('input', () => {
            this.updateCharCount();
            this.updateSubmitButton();
        });
        
        // Auto-resize textarea
        this.responseInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
        
        // Close on overlay click
        this.container.querySelector('.welcome-bot-overlay').addEventListener('click', () => {
            // Don't allow closing during welcome flow
        });
    }

    show() {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.container.classList.remove('hidden');
        this.isVisible = true;
        
        // Add entrance animation
        requestAnimationFrame(() => {
            this.container.classList.add('entering');
        });
        
        // Focus on input after animation
        setTimeout(() => {
            if (this.responseInput && !this.responseInput.disabled) {
                this.responseInput.focus();
            }
        }, 500);
    }

    hide() {
        this.container.classList.add('hidden');
        this.isVisible = false;
        
        // Clear any ongoing animations
        if (this.currentTypingAnimation) {
            clearTimeout(this.currentTypingAnimation);
        }
    }

    showQuestion(question, currentIndex, totalQuestions) {
        // Update progress
        this.updateProgress(currentIndex + 1, totalQuestions);
        
        // Show/hide input based on question type
        if (question.skipInput) {
            this.inputContainer.style.display = 'none';
            this.skipBtn.style.display = 'none';
        } else {
            this.inputContainer.style.display = 'block';
            this.skipBtn.style.display = 'inline-block';
            this.responseInput.placeholder = question.placeholder || 'Type your response here...';
            this.responseInput.value = '';
            this.updateCharCount();
            this.updateSubmitButton();
        }
        
        // Clear feedback
        this.questionFeedback.textContent = '';
        this.questionFeedback.className = 'question-feedback';
        
        // Animate question text
        this.typeText(question.text);
        
        // Focus input after typing animation
        if (!question.skipInput) {
            setTimeout(() => {
                this.responseInput.focus();
            }, question.text.length * 30 + 500);
        }
    }

    typeText(text) {
        this.questionText.textContent = '';
        let index = 0;
        
        const typeNextChar = () => {
            if (index < text.length) {
                this.questionText.textContent += text.charAt(index);
                index++;
                this.currentTypingAnimation = setTimeout(typeNextChar, 30);
            }
        };
        
        typeNextChar();
    }

    showFeedback(feedback) {
        this.questionFeedback.textContent = feedback;
        this.questionFeedback.className = 'question-feedback show';
        
        // Animate feedback
        requestAnimationFrame(() => {
            this.questionFeedback.classList.add('animate');
        });
    }

    updateProgress(current, total) {
        const percentage = ((current - 1) / (total - 2)) * 100; // Exclude intro and completion
        this.progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        
        // Only show progress for actual questions
        if (current <= 1) {
            this.progressText.textContent = 'Getting started...';
        } else if (current >= total) {
            this.progressText.textContent = 'Almost done!';
        } else {
            this.progressText.textContent = `Question ${current - 1} of ${total - 2}`;
        }
    }

    handleSubmit() {
        const response = this.responseInput.value.trim();
        
        if (!response) {
            this.shakeInput();
            return;
        }
        
        // Disable input during processing
        this.responseInput.disabled = true;
        this.submitBtn.disabled = true;
        
        // Add loading state
        this.submitBtn.textContent = 'Processing...';
        this.submitBtn.classList.add('loading');
        
        // Call response handler
        if (this.onResponse) {
            this.onResponse(response);
        }
        
        // Re-enable after feedback (will be reset in next question)
        setTimeout(() => {
            this.responseInput.disabled = false;
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Continue';
            this.submitBtn.classList.remove('loading');
        }, 1500);
    }

    shakeInput() {
        this.responseInput.classList.add('shake');
        setTimeout(() => {
            this.responseInput.classList.remove('shake');
        }, 500);
    }

    updateCharCount() {
        const length = this.responseInput.value.length;
        this.charCount.textContent = `${length}/500`;
        
        if (length > 450) {
            this.charCount.classList.add('warning');
        } else {
            this.charCount.classList.remove('warning');
        }
    }

    updateSubmitButton() {
        const hasText = this.responseInput.value.trim().length > 0;
        this.submitBtn.disabled = !hasText;
    }

    autoResizeTextarea() {
        this.responseInput.style.height = 'auto';
        this.responseInput.style.height = Math.min(this.responseInput.scrollHeight, 150) + 'px';
    }

    isOpen() {
        return this.isVisible;
    }
}

window.WelcomeUI = WelcomeUI;