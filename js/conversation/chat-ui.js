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
        this.currentAvatar = null;
        
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
                    <div class="chat-avatar" id="chatAvatarDisplay">${this.avatarGenerator.generateClaudeAvatar()}</div>
                    <div class="chat-title-text">
                        <span id="chatTitleMain">Chat with Claude</span>
                        <span id="chatTitleSub" class="chat-subtitle"></span>
                    </div>
                </div>
                <div class="chat-controls">
                    <button class="chat-control-btn" id="clearHistoryBtn" title="Clear conversation">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                    <button class="chat-control-btn" id="viewCharacterBtn" title="View Character Profile" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
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
                    <div class="message-avatar">${this.getAvatarHTML()}</div>
                    <div class="message-content">
                        <div class="message-text">${this.getWelcomeMessage()}</div>
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
        
        this.container.querySelector('#viewCharacterBtn').addEventListener('click', () => {
            this.showCharacterProfile();
        });
        
        
        this.container.querySelector('#minimizeBtn').addEventListener('click', () => {
            this.hide();
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

    updateAvatarDisplay(avatarData) {
        this.currentAvatar = avatarData;
        
        if (this.isInitialized) {
            const titleMain = document.getElementById('chatTitleMain');
            const titleSub = document.getElementById('chatTitleSub');
            const avatarDisplay = document.getElementById('chatAvatarDisplay');
            const viewCharacterBtn = this.container.querySelector('#viewCharacterBtn');
            
            if (titleMain) {
                titleMain.textContent = `Chat with ${avatarData.name}`;
            }
            if (titleSub) {
                titleSub.textContent = avatarData.title;
            }
            if (avatarDisplay) {
                // You can add avatar image here when you have the images
                avatarDisplay.innerHTML = this.generateAvatarHTML(avatarData);
            }
            if (viewCharacterBtn) {
                viewCharacterBtn.style.display = 'block'; // Show character button when avatar is available
            }
            
            // Update the welcome message with avatar's conversation starter
            this.updateWelcomeMessage(avatarData);
            
            console.log(`🎨 Chat UI updated for avatar: ${avatarData.name}`);
        }
    }

    generateAvatarHTML(avatarData) {
        // For now, generate a styled avatar based on archetype
        const archetype = avatarData.metadata?.archetype || 'TheBuilder';
        const archetypeEmoji = this.getArchetypeEmoji(archetype);
        
        return `
            <div class="avatar-circle" title="${avatarData.name} - ${avatarData.title}">
                <span class="avatar-emoji">${archetypeEmoji}</span>
            </div>
        `;
    }

    getArchetypeEmoji(archetype) {
        const emojiMap = {
            'TheBuilder': '🔨',
            'TheDetective': '🔍',
            'GrumpyOldManEl': '🤬',
            'TheHustler': '🚀',
            'PirateEl': '🏴‍☠️',
            'GymBroEl': '💪',
            'FreakyEl': '🌶️',
            'CoffeeAddictEl': '☕',
            'ConspiracyEl': '👁️',
            'AGIEl': '🤖',
            'ProcrastinationEl': '😴',
            'TechBroEl': '📱'
        };
        return emojiMap[archetype] || '🤖';
    }

    showCharacterProfile() {
        if (!this.currentAvatar) {
            console.warn('No avatar data available for character profile');
            return;
        }

        // Use global character terminal initialization
        if (window.ensureCharacterTerminalInitialized) {
            const characterTerminal = window.ensureCharacterTerminalInitialized();
            if (characterTerminal) {
                characterTerminal.show(this.currentAvatar);
                console.log(`🖥️ Character terminal opened for ${this.currentAvatar.name}`);
            } else {
                console.warn('CharacterTerminal not available');
            }
        } else {
            console.warn('ensureCharacterTerminalInitialized function not available');
        }
    }


    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.messageInput.value = '';
        this.adjustTextareaHeight();
        this.updateSendButton();
        
        // Handle character chat if context is set
        if (this.characterContext) {
            this.sendCharacterMessage(message);
        } else if (this.onSendMessage) {
            this.onSendMessage(message);
        }
    }

    async sendCharacterMessage(message) {
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator(true);
        
        try {
            // Get conversation history
            const conversationHistory = this.getConversationHistory();
            
            // Send to backend
            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    character_name: this.characterContext.name,
                    character_context: this.characterContext,
                    conversation_history: conversationHistory
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Add character response
                this.addCharacterMessage(data.response.message);
            } else {
                throw new Error(data.error || 'Chat request failed');
            }
            
        } catch (error) {
            console.error('Chat error:', error);
            this.addCharacterMessage(
                `Sorry, I'm having trouble connecting right now. ${error.message || 'Please try again.'}`
            );
        } finally {
            this.showTypingIndicator(false);
        }
    }

    addCharacterMessage(content) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        
        // Use character avatar if available
        const avatar = this.currentAvatar ? 
            this.generateAvatarHTML(this.currentAvatar) : 
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

    getConversationHistory() {
        const messages = this.messageContainer.querySelectorAll('.message');
        const history = [];
        
        messages.forEach(messageEl => {
            const isUser = messageEl.classList.contains('user');
            const messageText = messageEl.querySelector('.message-text');
            
            if (messageText && messageText.textContent.trim()) {
                history.push({
                    role: isUser ? 'user' : 'assistant',
                    content: messageText.textContent.trim()
                });
            }
        });
        
        return history;
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
        const welcomeMessage = this.getWelcomeMessage();
        this.messageContainer.innerHTML = `
            <div class="welcome-message">
                <div class="message-avatar">${this.getAvatarHTML()}</div>
                <div class="message-content">
                    <div class="message-text">${welcomeMessage}</div>
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
    
    getWelcomeMessage() {
        if (this.currentAvatar && this.currentAvatar.conversationStarters && this.currentAvatar.conversationStarters.length > 0) {
            // Use the first conversation starter from the generated avatar
            return this.currentAvatar.conversationStarters[0];
        }
        // Fallback to generic message
        return "Hi! I'm Claude, an AI assistant. I can help answer questions about Elliot's work and projects. What would you like to know?";
    }
    
    getAvatarHTML() {
        if (this.currentAvatar) {
            return this.generateAvatarHTML(this.currentAvatar);
        }
        return this.avatarGenerator.generateClaudeAvatar();
    }
    
    updateWelcomeMessage(avatarData) {
        const welcomeMessageElement = this.messageContainer.querySelector('.welcome-message .message-text');
        const welcomeAvatarElement = this.messageContainer.querySelector('.welcome-message .message-avatar');
        
        if (welcomeMessageElement && avatarData.conversationStarters && avatarData.conversationStarters.length > 0) {
            welcomeMessageElement.textContent = avatarData.conversationStarters[0];
        }
        
        if (welcomeAvatarElement) {
            welcomeAvatarElement.innerHTML = this.generateAvatarHTML(avatarData);
        }
    }

    initializeChatWithCharacter(characterName, characterData) {
        console.log(`Initializing chat with ${characterName}`, characterData);
        
        // Create avatar data format expected by chat UI
        const avatarData = {
            name: characterName,
            title: characterData.title,
            description: characterData.description,
            personality: characterData.personality,
            expertise: characterData.expertise,
            conversationStarters: [
                `Hey there! I'm ${characterName}. ${characterData.description} What are you working on today?`
            ]
        };
        
        // Clear any existing messages
        if (this.isInitialized && this.messageContainer) {
            this.messageContainer.innerHTML = '';
        }
        
        // Update avatar display
        this.updateAvatarDisplay(avatarData);
        
        // Add character introduction message
        this.addCharacterIntroMessage(avatarData);
        
        // Set up character-specific context for backend
        this.characterContext = {
            name: characterName,
            personality: characterData.personality,
            expertise: characterData.expertise,
            communicationStyle: this.getCharacterCommunicationStyle(characterName)
        };
        
        console.log('Character context set:', this.characterContext);
    }

    addCharacterIntroMessage(avatarData) {
        if (!this.isInitialized) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        messageElement.innerHTML = `
            <div class="message-avatar">${this.generateAvatarHTML(avatarData)}</div>
            <div class="message-content">
                <div class="message-text">${avatarData.conversationStarters[0]}</div>
                <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    getCharacterCommunicationStyle(characterName) {
        const styles = {
            "TheBuilder": "Energetic and pragmatic, uses engineering metaphors, slightly chaotic but solutions-focused",
            "TheDetective": "Methodical and analytical, asks probing questions, loves solving mysteries",
            "GrumpyOldManEl": "Experienced but cantankerous, offers wisdom with grumbling, traditional approach",
            "PirateEl": "Adventurous with nautical metaphors, bold and risk-taking, leadership-oriented",
            "GymBroEl": "Motivational with fitness metaphors, disciplined and goal-oriented, encouraging",
            "FreakyEl": "Experimental and boundary-pushing, unconventional thinking, creative exploration",
            "CoffeeAddictEl": "High-energy and intense, coffee-obsessed, deadline-driven personality",
            "ConspiracyEl": "Paranoid and pattern-seeking, sees connections everywhere, deep analytical thinking",
            "AGIEl": "Logical and adaptive, occasionally breaks character, alternates between robotic and human"
        };
        
        return styles[characterName] || "Balanced and helpful, adapts communication style to user needs";
    }
}

window.ChatUI = ChatUI;