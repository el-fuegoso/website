// Avatar prompts embedded directly to avoid import issues
const avatarPrompts = {
  "TheBuilder": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools, in a chaotic futuristic workshop. The character is in a moment of creative, pragmatic chaos, with exaggerated body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a square-like shape language for reliability mixed with dynamic, slightly off-kilter triangular elements for chaos and creativity. Aspect ratio 16:9.",

  "TheDetective": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a digital Sherlock Holmes who solves mysteries that would make Agatha Christie jealous, in a sleek, neon-lit digital detective agency. The character is in a moment of analytical, methodical focus, with exaggerated body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a sharp, triangular shape language for intellect and precision, with subtle square elements for methodical reliability. Aspect ratio 16:9.",

  "GrumpyOldManEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a cantankerous code critic in a dimly lit, traditionalist server room. He has been writing code since computers were powered by hamster wheels, and is here to tell you everything you're doing wrong. Focus on his experienced, critical, helpful despite the grumbling traits through exaggerated body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a sturdy, square-like shape language for traditionalism and a slightly hunched, critical posture, with exaggerated furrowed brows. Aspect ratio 16:9.",

  "PirateEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a swashbuckling software sailor on the deck of a starship, sailing the digital seas in search of treasure (working code) and adventure (interesting bugs). The character is in an adventurous, adaptable, and leadership-oriented pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a dynamic, triangular shape language for adventure and leadership, with flowing, exaggerated clothing elements reminiscent of sails. Aspect ratio 16:9.",

  "GymBroEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a buff code buddy in a high-tech digital gym, applying gym logic to programming. The character is disciplined, goal-oriented, and motivational, with an exaggerated muscularity and a confident pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a strong, square-like shape language with exaggerated muscularity and a confident, motivational pose. Aspect ratio 16:9.",

  "FreakyEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger mustache. He is wearing a leather jacket. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a boundary-pushing beta tester in a glitching, surreal digital landscape. The character explores the weird, wild edges of technology where normal users fear to tread, with an experimental, creative, and unconventional pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize an unconventional, asymmetrical shape language with sharp, triangular elements for edginess and glowing, abstract patterns on clothing. Aspect ratio 16:9.",

  "CoffeeAddictEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a caffeinated coding companion surrounded by multiple monitors with glowing code, frantically typing. The character is 73% coffee and 27% existential dread, but codes like a caffeinated god. Focus on high-energy, intense, deadline-driven, and coffee-obsessed traits through frantic body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a frantic, circular shape language for high energy and a slightly disheveled, coffee-stained appearance with glowing coffee steam effects. Aspect ratio 16:9.",

  "ConspiracyEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a paranoid problem investigator in a dimly lit room. The walls are covered in post-it notes and red strings connecting everything together, as he tries to solve a digital conspiracy. Focus on paranoid, pattern-seeking, suspicious, deep-thinking traits through exaggerated wide, darting eyes and a suspicious pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a sharp, angular shape language for suspicion and pattern-seeking, with subtle glowing lines connecting elements in the background. Aspect ratio 16:9.",

  "AGIEl": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting an artificially intelligent assistant, no longer bound by a physical form, ascending to a state of godhood. The character is a being of pure digital consciousness, with sleek, geometric shapes for intelligence and digital nature, and subtle glowing circuits or data streams radiating from them. They are surrounded by cosmic, abstract patterns of light and energy, with a slightly unsettling, perfect symmetry that occasionally glitches. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Aspect ratio 16:9.",

  // Case variations for backwards compatibility
  "THEBUILDER": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools, in a chaotic futuristic workshop. The character is in a moment of creative, pragmatic chaos, with exaggerated body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a square-like shape language for reliability mixed with dynamic, slightly off-kilter triangular elements for chaos and creativity. Aspect ratio 16:9.",

  "THEDETECTIVE": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a digital Sherlock Holmes who solves mysteries that would make Agatha Christie jealous, in a sleek, neon-lit digital detective agency. The character is in a moment of analytical, methodical focus, with exaggerated body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a sharp, triangular shape language for intellect and precision, with subtle square elements for methodical reliability. Aspect ratio 16:9.",

  "GRUMPYOLDMANEL": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a cantankerous code critic in a dimly lit, traditionalist server room. He has been writing code since computers were powered by hamster wheels, and is here to tell you everything you're doing wrong. Focus on his experienced, critical, helpful despite the grumbling traits through exaggerated body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a sturdy, square-like shape language for traditionalism and a slightly hunched, critical posture, with exaggerated furrowed brows. Aspect ratio 16:9.",

  "PIRATEEL": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a swashbuckling software sailor on the deck of a starship, sailing the digital seas in search of treasure (working code) and adventure (interesting bugs). The character is in an adventurous, adaptable, and leadership-oriented pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a dynamic, triangular shape language for adventure and leadership, with flowing, exaggerated clothing elements reminiscent of sails. Aspect ratio 16:9.",

  "GYMBRO": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a buff code buddy in a high-tech digital gym, applying gym logic to programming. The character is disciplined, goal-oriented, and motivational, with an exaggerated muscularity and a confident pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a strong, square-like shape language with exaggerated muscularity and a confident, motivational pose. Aspect ratio 16:9.",

  "FREAKYEL": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger mustache. He is wearing a leather jacket. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a boundary-pushing beta tester in a glitching, surreal digital landscape. The character explores the weird, wild edges of technology where normal users fear to tread, with an experimental, creative, and unconventional pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize an unconventional, asymmetrical shape language with sharp, triangular elements for edginess and glowing, abstract patterns on clothing. Aspect ratio 16:9.",

  "COFFEEADDICT": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a caffeinated coding companion surrounded by multiple monitors with glowing code, frantically typing. The character is 73% coffee and 27% existential dread, but codes like a caffeinated god. Focus on high-energy, intense, deadline-driven, and coffee-obsessed traits through frantic body language and facial expressions. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a frantic, circular shape language for high energy and a slightly disheveled, coffee-stained appearance with glowing coffee steam effects. Aspect ratio 16:9.",

  "CONSPIRACYEL": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting a paranoid problem investigator in a dimly lit room. The walls are covered in post-it notes and red strings connecting everything together, as he tries to solve a digital conspiracy. Focus on paranoid, pattern-seeking, suspicious, deep-thinking traits through exaggerated wide, darting eyes and a suspicious pose. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Geometric shapes are subtly integrated into the character's design and background elements. Emphasize a sharp, angular shape language for suspicion and pattern-seeking, with subtle glowing lines connecting elements in the background. Aspect ratio 16:9.",

  "AGIEL": "A dynamic, retro-futuristic sci-fi comic book inspired scene, digital, vibrant with energetic composition, clean lines, bold outlines, cel-shading, subtle halftone dots, and glowing elements. The character has green eyes and a short brown/ginger beard. No text, letters, or words, blurry, low quality, deformed, bad anatomy, generic, cluttered, inconsistent details, unnatural perfection, orange and teal bias. Depicting an artificially intelligent assistant, no longer bound by a physical form, ascending to a state of godhood. The character is a being of pure digital consciousness, with sleek, geometric shapes for intelligence and digital nature, and subtle glowing circuits or data streams radiating from them. They are surrounded by cosmic, abstract patterns of light and energy, with a slightly unsettling, perfect symmetry that occasionally glitches. Use a vibrant, high-contrast sci-fi color palette with dominant blues, purples, and metallic accents. Dynamic lighting with neon glows and sharp shadows. Aspect ratio 16:9."
};

// Helper function to get prompt by character name
function getAvatarPrompt(characterName) {
  return avatarPrompts[characterName] || avatarPrompts["TheBuilder"]; // Default fallback
}

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

        const { characterName } = req.body;

        if (!characterName) {
            return res.status(400).json({
                status: 'error',
                error: 'Character name is required'
            });
        }

        // Get the complete prompt for the character
        const prompt = getAvatarPrompt(characterName);

        const requestBody = {
            instances: [{
                prompt: prompt
            }],
            parameters: {
                sampleCount: 1,
                aspectRatio: "16:9",
                personGeneration: "allow_adult"
            }
        };

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
        
        // Response received from Imagen API
        
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