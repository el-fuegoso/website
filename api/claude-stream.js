export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get API key from environment variables (Anthropic SDK standard)
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
        
        // Debug logging for environment variable
        console.log('🔍 Streaming API environment check:', {
            hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
            hasClaudeKey: !!process.env.CLAUDE_API_KEY,
            keyLength: apiKey ? apiKey.length : 0,
            keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'undefined',
            keyFormat: apiKey ? (apiKey.startsWith('sk-ant-api') ? 'valid' : 'invalid') : 'missing',
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV
        });
        
        if (!apiKey) {
            console.error('❌ ANTHROPIC_API_KEY environment variable not set in streaming API');
            return res.status(500).json({ 
                error: 'Server configuration error: API key not configured',
                hint: 'Please set ANTHROPIC_API_KEY environment variable in Vercel dashboard'
            });
        }

        console.log('🔄 Starting streaming request to Claude API...');

        // Set up Server-Sent Events headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

        // Send initial connection confirmation
        res.write('data: {"type":"connection_started"}\n\n');

        // Prepare request body with updated model and version
        const requestBody = {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            stream: true,
            ...req.body
        };

        console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

        // Forward streaming request to Claude API with correct headers
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('📥 Claude API response status:', claudeResponse.status);

        if (!claudeResponse.ok) {
            const errorData = await claudeResponse.json().catch(() => ({}));
            console.error('❌ Claude API error:', errorData);
            
            res.write(`data: ${JSON.stringify({
                type: 'error',
                error: `Claude API error: ${claudeResponse.status}`,
                details: errorData.error?.message || claudeResponse.statusText
            })}\n\n`);
            res.end();
            return;
        }

        // Stream the response with proper SSE formatting
        const reader = claudeResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('✅ Streaming completed');
                    res.write('data: {"type":"stream_end"}\n\n');
                    break;
                }

                // Decode the chunk and add to buffer
                buffer += decoder.decode(value, { stream: true });
                
                // Process complete lines from buffer
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer
                
                for (const line of lines) {
                    if (line.trim()) {
                        // Forward the line as-is (Claude already formats as SSE)
                        res.write(line + '\n');
                        
                        // Log content chunks for debugging
                        if (line.startsWith('data: {') && line.includes('"delta"')) {
                            try {
                                const data = JSON.parse(line.substring(6));
                                if (data.delta?.text) {
                                    console.log('📝 Text chunk:', data.delta.text);
                                }
                            } catch (e) {
                                // Ignore JSON parse errors for logging
                            }
                        }
                    }
                }
                
                // Add newline if we just processed lines
                if (lines.length > 1) {
                    res.write('\n');
                }
            }
        } catch (streamError) {
            console.error('❌ Streaming error:', streamError);
            res.write(`data: ${JSON.stringify({
                type: 'error',
                error: 'Streaming error',
                message: streamError.message
            })}\n\n`);
        } finally {
            reader.releaseLock();
            res.end();
        }

    } catch (error) {
        console.error('❌ Streaming proxy error:', error);
        
        // Try to send error as SSE if headers not sent
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/event-stream');
        }
        
        res.write(`data: ${JSON.stringify({
            type: 'error',
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })}\n\n`);
        res.end();
    }
}