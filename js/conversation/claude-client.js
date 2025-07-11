class ClaudeClient {
    constructor() {
        this.apiKey = null;
        // Use our Vercel proxy instead of direct API
        this.baseUrl = '/api/claude';
        this.streamUrl = '/api/claude-stream';
        this.headers = {
            'Content-Type': 'application/json'
        };
        this.customSystemPrompt = null;
        this.avatarData = null;
    }

    setApiKey(key) {
        // API key is now handled server-side via environment variables
        // This method is kept for backward compatibility but does nothing
        console.log('ℹ️  API key is now handled server-side automatically');
    }

    setAvatarData(avatarData) {
        this.avatarData = avatarData;
        this.customSystemPrompt = this.buildSystemPromptFromAvatar(avatarData);
        
        // Store in localStorage for persistence
        localStorage.setItem('current_avatar', JSON.stringify(avatarData));
    }

    loadStoredAvatar() {
        const storedAvatar = localStorage.getItem('current_avatar');
        if (storedAvatar) {
            try {
                this.setAvatarData(JSON.parse(storedAvatar));
                return true;
            } catch (error) {
                console.warn('Failed to load stored avatar:', error);
                localStorage.removeItem('current_avatar');
            }
        }
        return false;
    }

    buildSystemPromptFromAvatar(avatar) {
        return `You are "${avatar.name}", ${avatar.title}.

PERSONALITY & APPROACH:
${avatar.summary}

YOUR WORKING STYLE:
${avatar.workingStyle}

COMMUNICATION STYLE:
${avatar.communication}

PROJECT APPROACH:
${avatar.projectApproach}

YOUR UNIQUE VALUE:
${avatar.uniqueValue}

COLLABORATION STYLE:
${avatar.collaboration}

CORE STRENGTHS:
${avatar.strengths ? avatar.strengths.join(', ') : 'Adaptability, Problem-solving, Goal-focus'}

PREFERRED TOOLS & METHODS:
${avatar.tools ? avatar.tools.join(', ') : 'Collaborative tools, Documentation, Planning'}

YOUR MOTTO:
"${avatar.motto}"

IMPORTANT: You are integrated into Elliot Lee's portfolio website. Stay in character as ${avatar.name} while being helpful. Keep responses conversational and engaging. Ask follow-up questions that align with your personality. Reference your working style and strengths naturally in conversations.

If asked about Elliot's work, refer to the projects shown on the website while maintaining your character perspective.`;
    }

    async sendMessage(message, conversationHistory = []) {
        // API key is now handled server-side, no client-side validation needed

        // Filter conversation history to only include role and content
        const cleanHistory = conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const messages = [
            ...cleanHistory,
            {
                role: 'user',
                content: message
            }
        ];

        const systemPrompt = this.customSystemPrompt || 
            "You are a helpful assistant integrated into Elliot Lee's portfolio website. Keep responses concise and engaging. If asked about Elliot's work, refer to the projects shown on the website.";

        const payload = {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: messages,
            system: systemPrompt
        };

        try {
            // Use only Content-Type header for server-side auth
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API error:', error);
            throw error;
        }
    }

    async streamMessage(message, conversationHistory = [], onChunk) {
        // Try streaming first, fall back to non-streaming if it fails
        try {
            await this.tryStreamingMessage(message, conversationHistory, onChunk);
        } catch (error) {
            console.warn('Streaming failed, falling back to non-streaming:', error);
            await this.fallbackToRegularMessage(message, conversationHistory, onChunk);
        }
    }

    async tryStreamingMessage(message, conversationHistory = [], onChunk) {
        // API key is now handled server-side, no client-side validation needed

        // Filter conversation history to only include role and content
        const cleanHistory = conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const messages = [
            ...cleanHistory,
            {
                role: 'user',
                content: message
            }
        ];

        const systemPrompt = this.customSystemPrompt || 
            "You are a helpful assistant integrated into Elliot Lee's portfolio website. Keep responses concise and engaging. If asked about Elliot's work, refer to the projects shown on the website.";

        const payload = {
            messages: messages,
            system: systemPrompt
            // Model and other defaults are set server-side
        };

        console.log('Starting streaming request...');
        const response = await fetch(this.streamUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Response received:', response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Stream response error:', errorData);
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        console.log('Starting to read stream...');
        while (true) {
            const { done, value } = await reader.read();
            console.log('Stream chunk:', done, value?.length);
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                console.log('Processing line:', line);
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    console.log('Data:', data);
                    if (data === '[DONE]') return;
                    
                    try {
                        const parsed = JSON.parse(data);
                        console.log('Parsed:', parsed);
                        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                            console.log('Calling onChunk with:', parsed.delta.text);
                            onChunk(parsed.delta.text);
                        }
                    } catch (e) {
                        console.log('JSON parse error:', e);
                    }
                }
            }
        }
    }

    async fallbackToRegularMessage(message, conversationHistory = [], onChunk) {
        console.log('Using fallback non-streaming message...');
        
        // Use the regular sendMessage method and simulate streaming
        const fullResponse = await this.sendMessage(message, conversationHistory);
        
        // Simulate streaming by sending the response in chunks
        const words = fullResponse.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            onChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
            
            // Small delay to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

window.ClaudeClient = ClaudeClient;