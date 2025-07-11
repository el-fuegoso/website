export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

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
        // Get API key from request headers
        const apiKey = req.headers['x-api-key'];
        
        if (!apiKey) {
            return res.status(401).json({ error: 'API key required' });
        }

        // Validate API key format
        if (!apiKey.startsWith('sk-ant-api03-') || apiKey.length < 50) {
            return res.status(401).json({ error: 'Invalid API key format. Claude API keys should start with sk-ant-api03-' });
        }

        // Set up streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Forward streaming request to Claude API
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                ...req.body,
                stream: true
            })
        });

        if (!claudeResponse.ok) {
            const errorData = await claudeResponse.json();
            return res.status(claudeResponse.status).json(errorData);
        }

        // Stream the response
        const reader = claudeResponse.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    res.write('data: [DONE]\n\n');
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                res.write(chunk);
            }
        } finally {
            reader.releaseLock();
            res.end();
        }

    } catch (error) {
        console.error('Streaming proxy error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}