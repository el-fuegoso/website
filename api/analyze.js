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
        // Get Flask backend URL from environment variable
        const flaskBackendUrl = process.env.FLASK_BACKEND_URL || 'http://localhost:5001';
        
        // Forward request to Flask backend
        const flaskResponse = await fetch(`${flaskBackendUrl}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        // Check if Flask backend is reachable
        if (!flaskResponse.ok) {
            console.error(`Flask backend error: ${flaskResponse.status} ${flaskResponse.statusText}`);
            return res.status(502).json({
                status: 'error',
                error: `Backend service unavailable (${flaskResponse.status})`,
                details: 'Flask OCEAN personality analysis service is not responding'
            });
        }

        // Parse and return Flask response
        const flaskData = await flaskResponse.json();
        
        // Log successful analysis for monitoring
        console.log(`✅ OCEAN analysis completed - Status: ${flaskData.status}`);
        
        return res.status(200).json(flaskData);

    } catch (error) {
        console.error('Proxy to Flask backend failed:', error.message);
        
        // Handle different error types
        if (error.code === 'ECONNREFUSED' || error.cause?.code === 'ECONNREFUSED') {
            return res.status(503).json({
                status: 'error',
                error: 'OCEAN analysis service unavailable',
                details: 'Flask backend is not running or unreachable'
            });
        }
        
        return res.status(500).json({
            status: 'error',
            error: 'Internal proxy error',
            details: error.message
        });
    }
}