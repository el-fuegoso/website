/**
 * Simple test endpoint to verify Claude API connectivity and API key
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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
        const { apiKey } = req.body;

        // Validate API key
        if (!apiKey) {
            return res.status(400).json({ 
                error: 'API key is required',
                received: {
                    hasApiKey: !!apiKey,
                    bodyKeys: Object.keys(req.body)
                }
            });
        }

        if (!apiKey.startsWith('sk-ant-api03-') || apiKey.length < 50) {
            return res.status(400).json({ 
                error: 'Invalid API key format',
                expected: 'API key should start with sk-ant-api03- and be at least 50 characters',
                received: {
                    prefix: apiKey.substring(0, 15),
                    length: apiKey.length
                }
            });
        }

        // Make simple test request to Claude
        const testResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 10,
                messages: [{
                    role: 'user',
                    content: 'Say "Hello"'
                }]
            })
        });

        if (!testResponse.ok) {
            const errorData = await testResponse.json().catch(() => ({}));
            
            console.error('Claude API Test Error:', {
                status: testResponse.status,
                statusText: testResponse.statusText,
                errorData,
                apiKeyLength: apiKey.length,
                apiKeyPrefix: apiKey.substring(0, 10) + '...'
            });

            return res.status(testResponse.status).json({
                success: false,
                error: `Claude API test failed: ${testResponse.status}`,
                details: errorData.error?.message || testResponse.statusText,
                debug: {
                    status: testResponse.status,
                    apiKeyLength: apiKey.length,
                    apiKeyPrefix: apiKey.substring(0, 10) + '...',
                    errorType: errorData.error?.type || 'unknown'
                }
            });
        }

        const responseData = await testResponse.json();
        
        res.status(200).json({
            success: true,
            message: 'Claude API connection successful',
            response: responseData.content?.[0]?.text || 'No response text',
            usage: responseData.usage || {},
            model: responseData.model || 'claude-3-sonnet-20240229'
        });

    } catch (error) {
        console.error('Test connection error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error during connection test',
            details: error.message,
            debug: {
                errorType: error.name,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
    }
}