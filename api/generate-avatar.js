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

        // Build the prompt for Google Imagen with comic book style
        const baseStyleDescription = "A bold, distinctive, and dynamic, comic book inspired, digital, vibrant avatar with exaggerated features, energetic composition, clean lines and glowing elements. The character should subtly incorporate green eyes and a short beard.";
        const prompt = `${baseStyleDescription} Depicting ${description} with a background that matches the style of the character.`;

        console.log(`🎨 Generating avatar for ${characterName} with Google Imagen API via Gemini`);
        console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
        console.log(`🔑 API Key present: ${!!googleApiKey} (length: ${googleApiKey?.length || 0})`);

        const requestBody = {
            instances: [{
                prompt: prompt
            }],
            parameters: {
                sampleCount: 1,
                aspectRatio: "1:1",
                personGeneration: "allow_adult"
            }
        };

        console.log(`📤 Request body:`, JSON.stringify(requestBody, null, 2));
        console.log(`📡 Making request to: https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict`);

        // Call Google Imagen API via Gemini API endpoint
        const imageGenResponse = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': googleApiKey,
                },
                body: JSON.stringify(requestBody)
            }
        );

        const responseText = await imageGenResponse.text();
        
        console.log(`📡 Imagen API response status: ${imageGenResponse.status}`);
        console.log(`📥 Full response body:`, responseText);
        
        // Log response headers for additional debugging
        console.log(`📋 Response headers:`);
        for (const [key, value] of imageGenResponse.headers.entries()) {
            console.log(`  ${key}: ${value}`);
        }
        
        if (!imageGenResponse.ok) {
            console.error('❌ Google Imagen API error details:');
            console.error('  Status:', imageGenResponse.status, imageGenResponse.statusText);
            console.error('  Response body:', responseText);
            
            // Try to parse error response for more details
            let errorDetails = null;
            try {
                errorDetails = JSON.parse(responseText);
                console.error('  Parsed error:', JSON.stringify(errorDetails, null, 2));
            } catch (e) {
                console.error('  Could not parse error response as JSON');
            }
            
            let userFriendlyError = 'Image generation service temporarily unavailable';
            let specificError = errorDetails?.error?.message || responseText;
            
            if (imageGenResponse.status === 403) {
                userFriendlyError = 'API access denied - check project configuration';
                console.error('  🚨 403 Forbidden - Possible causes:');
                console.error('    - Imagen API not enabled for this API key');
                console.error('    - API key lacks image generation permissions');
                console.error('    - Billing not enabled for Imagen usage');
                console.error('    - Project restrictions blocking access');
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
                specificError: specificError,
                fallback: true // Signal client to use placeholder
            });
        }

        const data = JSON.parse(responseText);
        console.log(`📊 Parsed API response structure:`, Object.keys(data));
        console.log(`📊 Full response data:`, JSON.stringify(data, null, 2).substring(0, 1000) + '...');
        
        // Extract the generated image from Imagen API response format
        // Try multiple possible response structures
        let imageUrl = null;
        
        // Check for predictions array (typical for predict endpoint)
        if (data.predictions && data.predictions.length > 0) {
            const prediction = data.predictions[0];
            console.log(`📊 Prediction structure:`, Object.keys(prediction));
            
            // Look for base64 encoded image data
            if (prediction.imageBytes) {
                imageUrl = `data:image/jpeg;base64,${prediction.imageBytes}`;
            } else if (prediction.bytesBase64Encoded) {
                imageUrl = `data:image/jpeg;base64,${prediction.bytesBase64Encoded}`;
            }
        }
        
        // Fallback: check for candidates format (if still using that)
        if (!imageUrl && data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
            imageUrl = `data:${data.candidates[0].content.parts[0].inlineData.mimeType};base64,${data.candidates[0].content.parts[0].inlineData.data}`;
        }

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