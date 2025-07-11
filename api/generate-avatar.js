/**
 * Vercel serverless function to proxy Claude API requests
 * Handles CORS and API key security for avatar generation
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
        const { prompt, apiKey, model = 'claude-3-sonnet-20240229', maxTokens = 1500, temperature = 0.7 } = req.body;

        // Validate required fields
        if (!prompt || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required fields: prompt and apiKey are required' 
            });
        }

        // Validate API key format
        if (!apiKey.startsWith('sk-ant-') || apiKey.length < 20) {
            return res.status(400).json({ 
                error: 'Invalid API key format' 
            });
        }

        // Prepare request to Claude API
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model,
                max_tokens: maxTokens,
                temperature,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        // Handle Claude API errors
        if (!claudeResponse.ok) {
            const errorData = await claudeResponse.json().catch(() => ({}));
            
            // Enhanced logging for debugging (remove in production)
            console.error('Claude API Error:', {
                status: claudeResponse.status,
                statusText: claudeResponse.statusText,
                errorData,
                apiKeyLength: apiKey ? apiKey.length : 0,
                apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
            });
            
            // Map common errors to user-friendly messages
            let errorMessage = 'Unknown error occurred';
            
            if (claudeResponse.status === 401) {
                errorMessage = 'Invalid API key. Please check your Claude API key is correct and has proper permissions.';
            } else if (claudeResponse.status === 429) {
                errorMessage = 'Rate limit exceeded. Please try again in a moment.';
            } else if (claudeResponse.status === 400) {
                errorMessage = errorData.error?.message || 'Bad request. Please check your input.';
            } else if (claudeResponse.status === 500) {
                errorMessage = 'Claude API is experiencing issues. Please try again later.';
            }

            return res.status(claudeResponse.status).json({
                error: errorMessage,
                details: errorData.error?.message || 'No additional details',
                status: claudeResponse.status,
                // Add debug info for development
                debug: process.env.NODE_ENV === 'development' ? {
                    apiKeyProvided: !!apiKey,
                    apiKeyLength: apiKey ? apiKey.length : 0,
                    requestHeaders: Object.keys(claudeResponse.headers || {}),
                    errorData
                } : undefined
            });
        }

        // Parse successful response
        const data = await claudeResponse.json();
        
        // Validate response format
        if (!data.content || !data.content[0] || !data.content[0].text) {
            return res.status(500).json({
                error: 'Invalid response format from Claude API',
                details: 'Expected content with text field'
            });
        }

        // Return successful response
        res.status(200).json({
            success: true,
            content: data.content[0].text,
            usage: data.usage || {},
            model: data.model || model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Avatar generation error:', error);
        
        // Handle different types of errors
        let errorMessage = 'Internal server error';
        let statusCode = 500;
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Network error connecting to Claude API';
            statusCode = 503;
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again.';
            statusCode = 408;
        }

        res.status(statusCode).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : 'Contact support if this persists',
            timestamp: new Date().toISOString()
        });
    }
}