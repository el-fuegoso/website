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
        // Get API key from environment variables
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
        
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY environment variable not set');
            return res.status(500).json({ 
                error: 'Server configuration error: API key not configured'
            });
        }

        // Handle different request types
        let requestBody;
        let responseFormat = 'claude'; // Default to direct Claude response
        
        // Check if this is a personality analysis request
        if (req.body.text && (req.body.mode || req.body.context)) {
            // This is a personality analysis request
            responseFormat = 'personality';
            const { text, mode, context } = req.body;
            
            let systemPrompt = `You are Elliot, a friendly AI personality analyzer. Analyze the user's message and respond conversationally as if you're getting to know them. Be warm, engaging, and insightful.`;
            
            if (mode === 'job_description') {
                systemPrompt += ` The user has shared what appears to be a job description or professional experience. Focus on understanding their professional background and aspirations.`;
            }
            
            requestBody = {
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1000,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: text }
                ]
            };
        } else {
            // Default Claude API passthrough
            requestBody = {
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                ...req.body
            };
        }

        // Forward request to Claude API
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });

        // Get response data
        const responseData = await claudeResponse.json();

        if (!claudeResponse.ok) {
            console.error('Claude API error:', claudeResponse.status, responseData.error?.message || responseData.error);
            return res.status(claudeResponse.status).json(responseData);
        }

        // Format response based on request type
        if (responseFormat === 'personality') {
            // Extract message content for personality analysis format
            const messageContent = responseData.content?.[0]?.text || 'I\'d love to learn more about you!';
            res.status(200).json({
                response: messageContent
            });
        } else {
            // Forward Claude's raw response for other uses
            res.status(claudeResponse.status).json(responseData);
        }

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}