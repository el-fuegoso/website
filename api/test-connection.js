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
        // Get API key from environment variables
        const apiKey = process.env.CLAUDE_API_KEY;
        
        if (!apiKey) {
            console.error('CLAUDE_API_KEY environment variable not set');
            return res.status(500).json({ 
                error: 'Server configuration error. Claude API key not configured.',
                hint: 'Administrator needs to set CLAUDE_API_KEY environment variable'
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