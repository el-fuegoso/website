class MainConversation {
    constructor() {
        this.chatUI = null;
        this.conversationManager = null;
        this.welcomeBot = null;
        this.welcomeUI = null;
        this.personalityAnalyzer = null;
        this.isInitialized = false;
        this.chatTrigger = null;
        this.userProfile = null;
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.setupComponents();
        this.setupEventListeners();
        this.setupTriggerButton();
        this.setupKeyboardShortcuts();
        
        this.isInitialized = true;
        console.log('Conversation system initialized');
    }

    setupComponents() {
        // Initialize Rosie experience
        this.rosieExperience = new RosieExperience();
        this.personalityAnalyzer = new PersonalityAnalyzer();
        
        // Initialize chat components
        this.chatUI = new ChatUI();
        this.conversationManager = new ConversationManager();
        
        // Setup Rosie experience
        this.rosieExperience.onComplete = (profile) => this.handleWelcomeComplete(profile);
        
        // Setup conversation manager
        this.conversationManager.initialize(this.chatUI);
        
        this.conversationManager.onMessage((message) => {
            console.log('New message received:', message.substring(0, 50) + '...');
        });
        
        this.conversationManager.onError((error) => {
            console.error('Conversation error:', error);
            this.handleConversationError(error);
        });
        
        // Check if user has completed welcome flow
        this.userProfile = this.getUserData();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#chatTrigger')) {
                e.preventDefault();
                this.toggleChat();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatUI && this.chatUI.isVisible) {
                this.chatUI.hide();
            }
        });
    }

    setupTriggerButton() {
        this.chatTrigger = document.getElementById('chatTrigger');
        if (!this.chatTrigger) {
            console.warn('Chat trigger button not found');
            return;
        }
        
        this.chatTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleChat();
        });
        
        this.chatTrigger.setAttribute('aria-label', 'Open chat with Claude AI assistant');
        this.chatTrigger.setAttribute('title', 'Chat with Claude AI');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.toggleChat();
            }
            
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.showChatSettings();
            }
            
            // Reset welcome bot flow (Ctrl+Shift+X - changed from R to avoid browser refresh)
            if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                e.preventDefault();
                this.resetWelcomeFlow();
                console.log('Reset shortcut triggered!');
            }
        });
    }

    toggleChat() {
        if (!this.chatUI) {
            console.error('Chat UI not initialized');
            return;
        }
        
        if (this.chatUI.isVisible) {
            this.chatUI.hide();
            this.updateTriggerButton(false);
        } else {
            this.showChat();
        }
    }

    handleWelcomeComplete(profile) {
        console.log('Welcome bot completed:', profile);
        this.userProfile = profile;
        
        // Show chat after welcome completion
        setTimeout(() => {
            this.showChat();
            
            // Send a personalized greeting to the chat
            if (profile && profile.name) {
                const greeting = `Hey ${profile.name}! Thanks for sharing a bit about yourself. I'm Claude, and I'm here to help you learn more about El's work and projects. What would you like to know?`;
                this.chatUI.addMessage(greeting, 'assistant');
            }
        }, 1000);
    }

    showChat() {
        if (!this.chatUI) return;
        
        // Check if user has completed welcome flow
        if (!this.userProfile && !this.hasCompletedWelcome()) {
            this.startRosieExperience();
            return;
        }
        
        this.chatUI.show();
        this.updateTriggerButton(true);
        this.conversationManager.activate();
        
        if (!this.hasApiKey()) {
            setTimeout(() => {
                this.promptForApiKey();
            }, 500);
        }
    }

    startRosieExperience() {
        if (!this.rosieExperience) {
            console.error('Rosie experience not initialized');
            return;
        }
        
        this.rosieExperience.show();
        this.updateTriggerButton(true);
    }

    hideChat() {
        if (!this.chatUI) return;
        
        this.chatUI.hide();
        this.updateTriggerButton(false);
        this.conversationManager.deactivate();
    }

    showChatSettings() {
        if (!this.chatUI) return;
        
        if (!this.chatUI.isVisible) {
            this.showChat();
        }
        
        setTimeout(() => {
            this.chatUI.showApiKeyModal();
        }, 200);
    }

    updateTriggerButton(isActive) {
        if (!this.chatTrigger) return;
        
        if (isActive) {
            this.chatTrigger.style.color = 'var(--accent-color)';
            this.chatTrigger.setAttribute('aria-pressed', 'true');
        } else {
            this.chatTrigger.style.color = '';
            this.chatTrigger.setAttribute('aria-pressed', 'false');
        }
    }

    hasApiKey() {
        return !!localStorage.getItem('claude_api_key');
    }

    promptForApiKey() {
        if (this.chatUI) {
            this.chatUI.showApiKeyModal();
        }
    }

    handleConversationError(error) {
        const errorMessage = error.message || 'Unknown error occurred';
        
        if (errorMessage.includes('401') || errorMessage.includes('API key')) {
            this.promptForApiKey();
        } else {
            console.error('Conversation error:', error);
        }
    }

    handleVisibilityChange() {
        if (document.hidden && this.chatUI && this.chatUI.isVisible) {
            console.log('Page hidden - chat remains active');
        }
    }

    destroy() {
        if (this.chatUI) {
            this.chatUI.hide();
        }
        
        if (this.conversationManager) {
            this.conversationManager.deactivate();
        }
        
        this.isInitialized = false;
        console.log('Conversation system destroyed');
    }

    resetWelcomeFlow() {
        // Clear Rosie experience data
        this.clearUserData();
        
        // Reset user profile
        this.userProfile = null;
        
        // Hide any open interfaces
        if (this.chatUI && this.chatUI.isVisible) {
            this.chatUI.hide();
        }
        
        if (this.rosieExperience && this.rosieExperience.isVisible) {
            this.rosieExperience.hide();
        }
        
        // Reset button state
        this.updateTriggerButton(false);
        
        // Show confirmation
        this.showResetConfirmation();
        
        console.log('Rosie experience reset! Click CHAT to start over.');
    }

    showResetConfirmation() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'reset-notification';
        notification.textContent = '🔄 Rosie experience reset! Click CHAT to start over.';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #004225;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Roboto Mono', monospace;
            font-size: 0.9rem;
            z-index: 25000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#reset-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'reset-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Data management methods
    getUserData() {
        try {
            const data = localStorage.getItem('rosie_user_data');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading user data:', error);
            return null;
        }
    }
    
    saveUserData(data) {
        try {
            localStorage.setItem('rosie_user_data', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
    
    clearUserData() {
        try {
            localStorage.removeItem('rosie_user_data');
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    }
    
    hasCompletedWelcome() {
        const userData = this.getUserData();
        return userData && userData.completedAt;
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            chatVisible: this.chatUI ? this.chatUI.isVisible : false,
            hasApiKey: this.hasApiKey(),
            conversationActive: this.conversationManager ? this.conversationManager.isActive : false,
            welcomeCompleted: this.hasCompletedWelcome()
        };
    }
}

let mainConversation = null;

function initializeConversation() {
    try {
        if (typeof ClaudeClient === 'undefined') {
            console.error('ClaudeClient not found. Please ensure all conversation scripts are loaded.');
            return;
        }
        
        if (typeof ChatUI === 'undefined') {
            console.error('ChatUI not found. Please ensure all conversation scripts are loaded.');
            return;
        }
        
        if (typeof ConversationManager === 'undefined') {
            console.error('ConversationManager not found. Please ensure all conversation scripts are loaded.');
            return;
        }
        
        if (typeof RosieExperience === 'undefined') {
            console.error('RosieExperience not found. Please ensure all conversation scripts are loaded.');
            return;
        }
        
        mainConversation = new MainConversation();
        mainConversation.initialize();
        
        window.mainConversation = mainConversation;
        
        console.log('Conversation system ready!');
        console.log('Keyboard shortcuts:');
        console.log('- Ctrl+K: Toggle chat');
        console.log('- Ctrl+Shift+C: Open chat settings');
        console.log('- Ctrl+Shift+X: Reset Rosie experience');
        console.log('- Escape: Close chat (when open)');
        
    } catch (error) {
        console.error('Failed to initialize conversation system:', error);
    }
}

function waitForDependencies() {
    const dependencies = [
        'ClaudeClient', 'ChatUI', 'ConversationManager', 'AvatarGenerator',
        'RosieExperience', 'PersonalityAnalyzer'
    ];
    const checkInterval = 100;
    const maxWait = 5000;
    let waited = 0;
    
    const check = () => {
        const allLoaded = dependencies.every(dep => typeof window[dep] !== 'undefined');
        
        if (allLoaded) {
            initializeConversation();
        } else if (waited < maxWait) {
            waited += checkInterval;
            setTimeout(check, checkInterval);
        } else {
            console.error('Timeout waiting for conversation dependencies to load');
            console.log('Missing dependencies:', dependencies.filter(dep => typeof window[dep] === 'undefined'));
        }
    };
    
    check();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing conversation system...');
    waitForDependencies();
});

document.addEventListener('visibilitychange', () => {
    if (mainConversation) {
        mainConversation.handleVisibilityChange();
    }
});

window.addEventListener('beforeunload', () => {
    if (mainConversation) {
        mainConversation.destroy();
    }
});

window.addEventListener('error', (e) => {
    if (e.message.includes('conversation') || e.message.includes('claude')) {
        console.error('Conversation system error:', e.error);
    }
});

window.MainConversation = MainConversation;