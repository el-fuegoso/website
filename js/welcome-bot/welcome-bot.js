class WelcomeBot {
    constructor() {
        this.currentQuestion = 0;
        this.responses = {};
        this.questions = [
            {
                id: 'intro',
                text: "Hello! I'm El's welcome bot :) ¡Bienvenidos! I'd love to find out a little more about you.",
                type: 'intro',
                skipInput: true
            },
            {
                id: 'name_work',
                text: "What's your name, and what do you do for work?",
                type: 'text',
                placeholder: "e.g., I'm Sarah, I'm a graphic designer..."
            },
            {
                id: 'current_project',
                text: "What's something you've been working on lately that you're genuinely excited about?",
                type: 'text',
                placeholder: "Tell me about a project, idea, or goal you're passionate about..."
            },
            {
                id: 'dinner_guest',
                text: "If you could have dinner with anyone (dead or alive), who would it be and what would you want to talk about?",
                type: 'text',
                placeholder: "e.g., Marie Curie - I'd love to hear about her research process..."
            },
            {
                id: 'impact',
                text: "What kind of impact do you hope to make in your work or the world?",
                type: 'text',
                placeholder: "What change do you want to see or create?"
            },
            {
                id: 'completion',
                text: "Thank you for sharing! I'm creating your personalized avatar and connecting you with El's main chat system...",
                type: 'completion',
                skipInput: true
            }
        ];
        
        this.ui = null;
        this.personalityAnalyzer = null;
        this.onComplete = null;
        this.isActive = false;
    }

    initialize(ui, personalityAnalyzer) {
        this.ui = ui;
        this.personalityAnalyzer = personalityAnalyzer;
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.ui) {
            this.ui.onResponse = (response) => this.handleResponse(response);
            this.ui.onSkip = () => this.skipQuestion();
            this.ui.onRestart = () => this.restart();
        }
    }

    start() {
        if (!this.ui) {
            console.error('WelcomeBot: UI not initialized');
            return;
        }

        this.isActive = true;
        this.currentQuestion = 0;
        this.responses = {};
        
        this.ui.show();
        this.showCurrentQuestion();
    }

    showCurrentQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;

        this.ui.showQuestion(question, this.currentQuestion, this.questions.length);
        
        // Auto-advance intro and completion screens
        if (question.skipInput) {
            if (question.id === 'intro') {
                setTimeout(() => this.nextQuestion(), 2000);
            } else if (question.id === 'completion') {
                setTimeout(() => this.complete(), 3000);
            }
        }
    }

    handleResponse(response) {
        const question = this.questions[this.currentQuestion];
        if (!question || question.skipInput) return;

        // Store response
        this.responses[question.id] = {
            question: question.text,
            answer: response,
            timestamp: new Date().toISOString()
        };

        // Show encouraging feedback
        this.showFeedback(response);

        // Move to next question after feedback
        setTimeout(() => this.nextQuestion(), 1500);
    }

    showFeedback(response) {
        const feedbacks = [
            "That's fascinating! ✨",
            "I love that! 🌟",
            "Interesting perspective! 💭",
            "That sounds amazing! 🚀",
            "Great insight! 💡",
            "How inspiring! ⭐"
        ];

        const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        this.ui.showFeedback(feedback);
    }

    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showCurrentQuestion();
        } else {
            this.complete();
        }
    }

    skipQuestion() {
        // Store that they skipped
        const question = this.questions[this.currentQuestion];
        if (question && !question.skipInput) {
            this.responses[question.id] = {
                question: question.text,
                answer: '[skipped]',
                timestamp: new Date().toISOString(),
                skipped: true
            };
        }
        
        this.nextQuestion();
    }

    restart() {
        this.currentQuestion = 0;
        this.responses = {};
        this.showCurrentQuestion();
    }

    complete() {
        this.isActive = false;
        
        // Analyze personality
        let personalityProfile = null;
        if (this.personalityAnalyzer) {
            personalityProfile = this.personalityAnalyzer.analyze(this.responses);
        }

        // Store user data
        this.storeUserData(personalityProfile);

        // Hide welcome bot UI
        this.ui.hide();

        // Trigger completion callback
        if (this.onComplete) {
            this.onComplete(personalityProfile);
        }
    }

    storeUserData(personalityProfile) {
        const userData = {
            responses: this.responses,
            personalityProfile: personalityProfile,
            completedAt: new Date().toISOString(),
            version: '1.0'
        };

        try {
            localStorage.setItem('elliot_welcome_bot_completed', JSON.stringify(userData));
        } catch (error) {
            console.error('Error storing user data:', error);
        }
    }

    static hasCompletedWelcome() {
        try {
            const data = localStorage.getItem('elliot_welcome_bot_completed');
            return !!data;
        } catch (error) {
            console.error('Error checking welcome completion:', error);
            return false;
        }
    }

    static getUserData() {
        try {
            const data = localStorage.getItem('elliot_welcome_bot_completed');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    static clearUserData() {
        try {
            localStorage.removeItem('elliot_welcome_bot_completed');
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    }

    getProgress() {
        return {
            current: this.currentQuestion,
            total: this.questions.length,
            percentage: Math.round((this.currentQuestion / this.questions.length) * 100)
        };
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    getResponses() {
        return { ...this.responses };
    }

    isRunning() {
        return this.isActive;
    }
}

window.WelcomeBot = WelcomeBot;