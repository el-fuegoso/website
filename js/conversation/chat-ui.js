class ChatUI {
    constructor() {
        this.container = null;
        this.chatContainer = null;
        this.messageContainer = null;
        this.inputContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.isVisible = false;
        this.streamingMessageElement = null;
        this.typingIndicator = null;
        this.apiKeyModal = null;
        this.isInitialized = false;
        
        this.onSendMessage = null;
        this.onApiKeySet = null;
        this.onClearHistory = null;
        
        this.avatarGenerator = new AvatarGenerator();
    }

    initialize() {
        if (this.isInitialized) return;
        
        this.createChatInterface();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    createChatInterface() {
        this.container = document.createElement('div');
        this.container.id = 'chat-interface';
        this.container.className = 'chat-interface hidden';
        
        this.container.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <div class="chat-avatar">${this.avatarGenerator.generateClaudeAvatar()}</div>
                    <span>Chat with Claude</span>
                </div>
                <div class="chat-controls">
                    <button class="chat-control-btn" id="clearHistoryBtn" title="Clear conversation">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                    <button class="chat-control-btn" id="settingsBtn" title="Settings">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                        </svg>
                    </button>
                    <button class="chat-control-btn" id="minimizeBtn" title="Minimize">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="welcome-message">
                    <div class="message-avatar">${this.avatarGenerator.generateClaudeAvatar()}</div>
                    <div class="message-content">
                        <div class="message-text">Hi! I'm Claude, an AI assistant. I can help answer questions about Elliot's work and projects. What would you like to know?</div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <textarea id="messageInput" placeholder="Type your message..." rows="1"></textarea>
                    <button id="sendBtn" class="send-button" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                    </button>
                </div>
                <div class="chat-status" id="chatStatus"></div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.setupReferences();
        this.createApiKeyModal();
    }

    setupReferences() {
        this.chatContainer = this.container.querySelector('#chat-interface');
        this.messageContainer = this.container.querySelector('#chatMessages');
        this.messageInput = this.container.querySelector('#messageInput');
        this.sendButton = this.container.querySelector('#sendBtn');
        this.statusElement = this.container.querySelector('#chatStatus');
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
            this.updateSendButton();
        });
        
        this.container.querySelector('#clearHistoryBtn').addEventListener('click', () => {
            if (confirm('Clear conversation history?')) {
                if (this.onClearHistory) this.onClearHistory();
            }
        });
        
        this.container.querySelector('#settingsBtn').addEventListener('click', () => {
            this.showApiKeyModal();
        });
        
        this.container.querySelector('#minimizeBtn').addEventListener('click', () => {
            this.hide();
        });
    }

    createApiKeyModal() {
        this.apiKeyModal = document.createElement('div');
        this.apiKeyModal.className = 'api-key-modal hidden';
        this.apiKeyModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Claude API Settings</h3>
                    <button class="modal-close" id="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="apiKeyInput">Claude API Key:</label>
                        <input type="password" id="apiKeyInput" placeholder="sk-ant-api03-...">
                        <small>Your API key is stored locally and never sent to any server except Anthropic's API.</small>
                    </div>
                    <div class="api-key-status" id="apiKeyStatus"></div>
                </div>
                <div class="modal-footer">
                    <button id="saveApiKey" class="primary-btn">Save</button>
                    <button id="cancelApiKey" class="secondary-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.apiKeyModal);
        this.setupApiKeyModalListeners();
    }

    setupApiKeyModalListeners() {
        const closeBtn = this.apiKeyModal.querySelector('#closeModal');
        const saveBtn = this.apiKeyModal.querySelector('#saveApiKey');
        const cancelBtn = this.apiKeyModal.querySelector('#cancelApiKey');
        const apiKeyInput = this.apiKeyModal.querySelector('#apiKeyInput');
        const overlay = this.apiKeyModal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => this.hideApiKeyModal());
        cancelBtn.addEventListener('click', () => this.hideApiKeyModal());
        overlay.addEventListener('click', () => this.hideApiKeyModal());
        
        saveBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                if (this.onApiKeySet) this.onApiKeySet(apiKey);
                this.hideApiKeyModal();
            }
        });
        
        apiKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });
    }

    show() {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.container.classList.remove('hidden');
        this.isVisible = true;
        
        setTimeout(() => {
            this.messageInput.focus();
        }, 100);
    }

    hide() {
        this.container.classList.add('hidden');
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    showApiKeyModal() {
        const storedKey = localStorage.getItem('claude_api_key');
        if (storedKey) {
            this.apiKeyModal.querySelector('#apiKeyInput').value = storedKey;
        }
        this.apiKeyModal.classList.remove('hidden');
        setTimeout(() => {
            this.apiKeyModal.querySelector('#apiKeyInput').focus();
        }, 100);
    }

    hideApiKeyModal() {
        this.apiKeyModal.classList.add('hidden');
        this.apiKeyModal.querySelector('#apiKeyInput').value = '';
        this.apiKeyModal.querySelector('#apiKeyStatus').textContent = '';
    }

    showApiKeyStatus(success, message = '') {
        const statusElement = this.apiKeyModal.querySelector('#apiKeyStatus');
        if (success) {
            statusElement.textContent = 'API key saved successfully!';
            statusElement.className = 'api-key-status success';
        } else {
            statusElement.textContent = message || 'Invalid API key';
            statusElement.className = 'api-key-status error';
        }
    }

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.onSendMessage) return;
        
        this.messageInput.value = '';
        this.adjustTextareaHeight();
        this.updateSendButton();
        
        this.onSendMessage(message);
    }

    addMessage(content, role = 'user') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;
        
        const avatar = role === 'user' ? 
            this.avatarGenerator.generateUserAvatar() : 
            this.avatarGenerator.generateClaudeAvatar();
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(content)}</div>
                <div class="message-timestamp">${this.formatTimestamp(new Date())}</div>
            </div>
        `;
        
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        return messageElement;
    }

    startStreamingMessage() {
        this.streamingMessageElement = this.addMessage('', 'assistant');
        return this.streamingMessageElement;
    }

    updateStreamingMessage(content) {
        if (this.streamingMessageElement) {
            const messageText = this.streamingMessageElement.querySelector('.message-text');
            messageText.innerHTML = this.formatMessage(content);
            this.scrollToBottom();
        }
    }

    finalizeStreamingMessage() {
        this.streamingMessageElement = null;
    }

    showTypingIndicator(show) {
        if (show && !this.typingIndicator) {
            this.typingIndicator = document.createElement('div');
            this.typingIndicator.className = 'typing-indicator';
            this.typingIndicator.innerHTML = `
                <div class="message-avatar">${this.avatarGenerator.generateClaudeAvatar()}</div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            this.messageContainer.appendChild(this.typingIndicator);
            this.scrollToBottom();
        } else if (!show && this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <div class="message-avatar">⚠️</div>
            <div class="message-content">
                <div class="message-text error-text">${message}</div>
            </div>
        `;
        this.messageContainer.appendChild(errorElement);
        this.scrollToBottom();
    }

    clearMessages() {
        this.messageContainer.innerHTML = `
            <div class="welcome-message">
                <div class="message-avatar">${this.avatarGenerator.generateClaudeAvatar()}</div>
                <div class="message-content">
                    <div class="message-text">Hi! I'm Claude, an AI assistant. I can help answer questions about Elliot's work and projects. What would you like to know?</div>
                </div>
            </div>
        `;
    }

    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    formatTimestamp(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    updateSendButton() {
        const hasContent = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasContent;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }, 10);
    }
}

window.ChatUI = ChatUI;