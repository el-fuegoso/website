class ConversationManager {
    constructor() {
        this.client = new ClaudeClient();
        this.conversationHistory = [];
        this.isActive = false;
        this.ui = null;
        this.maxHistoryLength = 20;
        this.onMessageCallback = null;
        this.onErrorCallback = null;
    }

    initialize(ui) {
        this.ui = ui;
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.ui) {
            this.ui.onSendMessage = (message) => this.handleUserMessage(message);
            this.ui.onApiKeySet = (key) => this.setApiKey(key);
            this.ui.onClearHistory = () => this.clearHistory();
        }
    }

    setApiKey(key) {
        // API key is now handled server-side via environment variables
        console.log('ℹ️  API key is now handled server-side automatically');
    }

    loadStoredApiKey() {
        // API key is now handled server-side, always return true
        return true;
    }

    async handleUserMessage(message) {
        if (!message.trim()) return;

        this.addMessageToHistory('user', message);
        
        if (this.ui) {
            this.ui.addMessage(message, 'user');
            this.ui.showTypingIndicator(true);
        }

        try {
            let fullResponse = '';
            let streamingStarted = false;
            
            const onChunk = (chunk) => {
                fullResponse += chunk;
                
                if (!streamingStarted && this.ui) {
                    this.ui.startStreamingMessage();
                    streamingStarted = true;
                }
                
                if (this.ui) {
                    this.ui.updateStreamingMessage(fullResponse);
                }
            };

            await this.client.streamMessage(message, this.conversationHistory, onChunk);
            
            this.addMessageToHistory('assistant', fullResponse);
            
            if (this.ui) {
                this.ui.finalizeStreamingMessage();
                this.ui.showTypingIndicator(false);
            }

            if (this.onMessageCallback) {
                this.onMessageCallback(fullResponse);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            
            if (this.ui) {
                this.ui.showTypingIndicator(false);
                this.ui.showError(this.getErrorMessage(error));
            }

            if (this.onErrorCallback) {
                this.onErrorCallback(error);
            }
        }
    }

    addMessageToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });

        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
    }

    clearHistory() {
        this.conversationHistory = [];
        if (this.ui) {
            this.ui.clearMessages();
        }
    }

    getErrorMessage(error) {
        const errorMsg = error.message || 'Unknown error';
        
        if (errorMsg.includes('401')) {
            return 'Invalid API key. Please check your Claude API key.';
        } else if (errorMsg.includes('429')) {
            return 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (errorMsg.includes('500')) {
            return 'Server error. Please try again in a moment.';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
            return 'Network error. Please check your internet connection.';
        } else {
            return `Error: ${errorMsg}`;
        }
    }

    activate() {
        this.isActive = true;
        this.loadStoredApiKey();
    }

    deactivate() {
        this.isActive = false;
        if (this.ui) {
            this.ui.hide();
        }
    }

    getConversationSummary() {
        return {
            messageCount: this.conversationHistory.length,
            lastMessage: this.conversationHistory[this.conversationHistory.length - 1],
            isActive: this.isActive
        };
    }

    exportConversation() {
        const exportData = {
            timestamp: new Date().toISOString(),
            messages: this.conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }
}

window.ConversationManager = ConversationManager;