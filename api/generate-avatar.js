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
        // Get API key from environment variables (no project ID needed for Gemini API)
        const googleApiKey = process.env.GOOGLE_API_KEY;
        
        if (!googleApiKey) {
            console.error('GOOGLE_API_KEY environment variable not set');
            return res.status(500).json({ 
                status: 'error',
                error: 'Server configuration error: Google API key not configured'
            });
        }

        const { characterName, description } = req.body;

        if (!characterName || !description) {
            return res.status(400).json({
                status: 'error',
                error: 'Character name and description are required'
            });
        }

        // Build the prompt for Google Imagen
        const prompt = `Professional headshot portrait of ${description}, high quality, digital art style, clean background, 512x512 resolution`;

        console.log(`🎨 Generating avatar for ${characterName} with Google Imagen API via Gemini`);
        console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

        // Call Google Imagen API via Gemini API endpoint
        const imageGenResponse = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': googleApiKey,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        responseModalities: ["IMAGE"],
                        aspectRatio: "1:1",
                        safetyFilterLevel: "BLOCK_SOME"
                    }
                })
            }
        );

        const responseText = await imageGenResponse.text();
        
        console.log(`📡 Imagen API response status: ${imageGenResponse.status}`);
        
        if (!imageGenResponse.ok) {
            console.error('❌ Google Imagen API error:', imageGenResponse.status, responseText);
            
            let userFriendlyError = 'Image generation service temporarily unavailable';
            if (imageGenResponse.status === 403) {
                userFriendlyError = 'API access denied - check project configuration';
            } else if (imageGenResponse.status === 400) {
                userFriendlyError = 'Invalid image generation request';
            } else if (imageGenResponse.status >= 500) {
                userFriendlyError = 'Google services temporarily down';
            }
            
            // Return error with fallback suggestion
            return res.status(500).json({
                status: 'error',
                error: userFriendlyError,
                details: `API Status: ${imageGenResponse.status}`,
                fallback: true // Signal client to use placeholder
            });
        }

        const data = JSON.parse(responseText);
        console.log(`📊 Parsed API response - has candidates: ${!!data.candidates}`);
        
        // Extract the generated image from Gemini API response format
        const imageUrl = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
            ? `data:${data.candidates[0].content.parts[0].inlineData.mimeType};base64,${data.candidates[0].content.parts[0].inlineData.data}`
            : null;

        if (!imageUrl) {
            console.error('❌ No image data returned from Google Imagen API');
            console.log('📋 API response structure:', JSON.stringify(data, null, 2).substring(0, 500));
            return res.status(500).json({
                status: 'error',
                error: 'Image generation completed but no image data received',
                fallback: true
            });
        }

        console.log(`✅ Successfully generated image for ${characterName}`);
        console.log(`📏 Image URL length: ${imageUrl.length} characters`);

        // Return successful response
        return res.status(200).json({
            status: 'success',
            avatar: {
                characterName,
                imageUrl,
                description,
                timestamp: new Date().toISOString(),
                source: 'google_imagen'
            }
        });

    } catch (error) {
        console.error('Avatar generation error:', error);
        
        return res.status(500).json({
            status: 'error',
            error: 'Internal server error during avatar generation',
            details: error.message,
            fallback: true // Signal client to use placeholder
        });
    }
}