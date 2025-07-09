class ClaudeClient {
    constructor() {
        this.apiKey = null;
        // Use our Vercel proxy instead of direct API
        this.baseUrl = '/api/claude';
        this.streamUrl = '/api/claude-stream';
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    setApiKey(key) {
        this.apiKey = key;
        this.headers['x-api-key'] = key;
    }

    async sendMessage(message, conversationHistory = []) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

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

        const payload = {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: messages,
            system: "You are a helpful assistant integrated into Elliot Lee's portfolio website. Keep responses concise and engaging. If asked about Elliot's work, refer to the projects shown on the website."
        };

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.headers,
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
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

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

        const payload = {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: messages,
            system: "You are a helpful assistant integrated into Elliot Lee's portfolio website. Keep responses concise and engaging. If asked about Elliot's work, refer to the projects shown on the website.",
            stream: true
        };

        try {
            const response = await fetch(this.streamUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;
                        
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                                onChunk(parsed.delta.text);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Claude streaming error:', error);
            throw error;
        }
    }
}

window.ClaudeClient = ClaudeClient;