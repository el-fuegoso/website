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
        console.log('🔍 Environment check:', {
            hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
            hasClaudeKey: !!process.env.CLAUDE_API_KEY,
            keyLength: apiKey ? apiKey.length : 0,
            keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'undefined',
            keyFormat: apiKey ? (apiKey.startsWith('sk-ant-api') ? 'valid' : 'invalid') : 'missing'
        });
        
        if (!apiKey) {
            console.error('❌ ANTHROPIC_API_KEY environment variable not set');
            return res.status(500).json({ 
                error: 'Server configuration error: API key not configured',
                hint: 'Please set ANTHROPIC_API_KEY environment variable in Vercel dashboard'
            });
        }

        // Prepare request body with defaults
        const requestBody = {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            ...req.body
        };

        console.log('📤 Non-streaming request to Claude API...', {
            model: requestBody.model,
            messageCount: requestBody.messages?.length || 0
        });

        // Forward request to Claude API with correct headers
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

        // Get response data
        const responseData = await claudeResponse.json();

        if (!claudeResponse.ok) {
            console.error('❌ Claude API error:', responseData);
        } else {
            console.log('✅ Claude API success:', {
                model: responseData.model,
                usage: responseData.usage
            });
        }

        // Forward Claude's response status and data
        res.status(claudeResponse.status).json(responseData);

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}