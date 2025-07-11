/**
 * Environment variable checker for debugging Vercel deployment
 * This endpoint helps verify that environment variables are properly set
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const apiKey = process.env.CLAUDE_API_KEY;
        
        // Get deployment information
        const deploymentInfo = {
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV,
            vercelUrl: process.env.VERCEL_URL,
            vercelRegion: process.env.VERCEL_REGION,
            timestamp: new Date().toISOString()
        };

        // Check API key status
        const apiKeyStatus = {
            isSet: !!apiKey,
            length: apiKey ? apiKey.length : 0,
            prefix: apiKey ? apiKey.substring(0, 15) + '...' : 'not set',
            isValidFormat: apiKey ? apiKey.startsWith('sk-ant-api') : false
        };

        // List environment variables (filter sensitive ones)
        const envKeys = Object.keys(process.env)
            .filter(key => !key.includes('SECRET') && !key.includes('TOKEN') && !key.includes('KEY'))
            .sort();

        // Count all environment variables
        const envStats = {
            totalEnvVars: Object.keys(process.env).length,
            claudeRelatedVars: Object.keys(process.env).filter(key => 
                key.toLowerCase().includes('claude') || key.toLowerCase().includes('anthropic')
            ),
            apiRelatedVars: Object.keys(process.env).filter(key => 
                key.toLowerCase().includes('api')
            )
        };

        res.status(200).json({
            success: true,
            deploymentInfo,
            apiKeyStatus,
            envStats,
            publicEnvKeys: envKeys.slice(0, 20), // First 20 public env vars
            message: apiKey ? 
                '✅ API key is properly configured' : 
                '❌ API key is missing - please set CLAUDE_API_KEY in Vercel dashboard'
        });

    } catch (error) {
        console.error('Environment check error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Environment check failed',
            message: error.message
        });
    }
}