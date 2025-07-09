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
        // Initialize welcome bot components
        this.welcomeUI = new WelcomeUI();
        this.personalityAnalyzer = new PersonalityAnalyzer();
        this.welcomeBot = new WelcomeBot();
        
        // Initialize chat components
        this.chatUI = new ChatUI();
        this.conversationManager = new ConversationManager();
        
        // Setup welcome bot
        this.welcomeBot.initialize(this.welcomeUI, this.personalityAnalyzer);
        this.welcomeBot.onComplete = (profile) => this.handleWelcomeComplete(profile);
        
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
        this.userProfile = WelcomeBot.getUserData();
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
        if (!this.userProfile && !WelcomeBot.hasCompletedWelcome()) {
            this.startWelcomeFlow();
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

    startWelcomeFlow() {
        if (!this.welcomeBot) {
            console.error('Welcome bot not initialized');
            return;
        }
        
        this.welcomeBot.start();
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

    getStatus() {
        return {
            initialized: this.isInitialized,
            chatVisible: this.chatUI ? this.chatUI.isVisible : false,
            hasApiKey: this.hasApiKey(),
            conversationActive: this.conversationManager ? this.conversationManager.isActive : false
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
        
        if (typeof AvatarGenerator === 'undefined') {
            console.error('AvatarGenerator not found. Please ensure all conversation scripts are loaded.');
            return;
        }
        
        mainConversation = new MainConversation();
        mainConversation.initialize();
        
        window.mainConversation = mainConversation;
        
        console.log('Conversation system ready!');
        console.log('Keyboard shortcuts:');
        console.log('- Ctrl+K: Toggle chat');
        console.log('- Ctrl+Shift+C: Open chat settings');
        console.log('- Escape: Close chat (when open)');
        
    } catch (error) {
        console.error('Failed to initialize conversation system:', error);
    }
}

function waitForDependencies() {
    const dependencies = [
        'ClaudeClient', 'ChatUI', 'ConversationManager', 'AvatarGenerator',
        'WelcomeBot', 'WelcomeUI', 'PersonalityAnalyzer'
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