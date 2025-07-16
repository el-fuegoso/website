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
        return res.status(405).json({ 
            status: 'error', 
            error: 'Method not allowed' 
        });
    }

    try {
        // Get API key from environment variables
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
        
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY environment variable not set');
            return res.status(500).json({ 
                status: 'error',
                error: 'Server configuration error: API key not configured'
            });
        }

        const { message, character_name, character_context, conversation_history } = req.body;

        if (!message) {
            return res.status(400).json({
                status: 'error',
                error: 'Message is required'
            });
        }

        // Build system prompt with character context
        let systemPrompt = `You are ${character_name || 'an AI assistant'}.`;
        
        if (character_context) {
            systemPrompt += `\n\nCHARACTER CONTEXT:\n`;
            systemPrompt += `Name: ${character_context.name || character_name}\n`;
            if (character_context.title) systemPrompt += `Title: ${character_context.title}\n`;
            if (character_context.summary) systemPrompt += `Personality: ${character_context.summary}\n`;
            if (character_context.workingStyle) systemPrompt += `Working Style: ${character_context.workingStyle}\n`;
            if (character_context.personality_traits) {
                systemPrompt += `\nPersonality Traits:\n`;
                Object.entries(character_context.personality_traits).forEach(([trait, value]) => {
                    systemPrompt += `- ${trait}: ${value}\n`;
                });
            }
        }

        systemPrompt += `\n\nRespond in character, keeping your responses conversational and engaging. Match the personality traits and working style described above.`;

        // Build messages array
        const messages = [];
        
        // Add conversation history if provided
        if (conversation_history && Array.isArray(conversation_history)) {
            conversation_history.forEach(item => {
                if (item.type === 'user') {
                    messages.push({ role: 'user', content: item.message });
                } else if (item.type === 'character') {
                    messages.push({ role: 'assistant', content: item.message });
                }
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Prepare request body for Claude API
        const requestBody = {
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            system: systemPrompt,
            messages: messages
        };

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

        const responseData = await claudeResponse.json();

        if (!claudeResponse.ok) {
            console.error('Claude API error:', claudeResponse.status, responseData.error?.message || responseData.error);
            return res.status(500).json({
                status: 'error',
                error: responseData.error?.message || 'Failed to get response from Claude'
            });
        }

        // Extract the message content from Claude's response
        const messageContent = responseData.content?.[0]?.text || 'Sorry, I couldn\'t generate a response.';

        // Return in the expected format
        res.status(200).json({
            status: 'success',
            response: {
                message: messageContent
            }
        });

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ 
            status: 'error',
            error: 'Internal server error',
            message: error.message 
        });
    }
}