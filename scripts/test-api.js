#!/usr/bin/env node

/**
 * Simple script to test Claude API endpoints locally
 * Run with: node scripts/test-api.js
 */

const testPayload = {
    messages: [
        {
            role: "user",
            content: "Hello! Can you say hi back?"
        }
    ],
    system: "You are a helpful assistant. Keep responses brief."
};

async function testNonStreaming() {
    console.log('🧪 Testing non-streaming API...');
    
    try {
        const response = await fetch('http://localhost:3000/api/claude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testPayload)
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Non-streaming API success!');
            console.log('Response:', data.content?.[0]?.text || 'No text content');
        } else {
            console.log('❌ Non-streaming API failed:', response.status);
            console.log('Error:', data);
        }
    } catch (error) {
        console.log('❌ Non-streaming API error:', error.message);
    }
}

async function testStreaming() {
    console.log('\n🧪 Testing streaming API...');
    
    try {
        const response = await fetch('http://localhost:3000/api/claude-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Streaming API failed:', response.status, errorText);
            return;
        }

        console.log('✅ Streaming API connected, reading stream...');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let chunks = 0;

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log(`🏁 Streaming completed (${chunks} chunks)`);
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim() && line.startsWith('data: ')) {
                    chunks++;
                    const data = line.substring(6);
                    
                    if (data === '[DONE]') {
                        console.log('🏁 Stream end marker');
                        return;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.delta?.text) {
                            process.stdout.write(parsed.delta.text);
                        } else if (parsed.type) {
                            console.log(`\n📝 Event: ${parsed.type}`);
                        }
                    } catch (e) {
                        console.log(`\n⚠️ Parse error: ${line.substring(0, 100)}...`);
                    }
                }
            }
        }
        
        console.log('\n');
        
    } catch (error) {
        console.log('❌ Streaming API error:', error.message);
    }
}

async function testConnection() {
    console.log('🧪 Testing API connection...');
    
    try {
        const response = await fetch('http://localhost:3000/api/test-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{}'
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Connection test success!');
            console.log('Response:', data.response);
            console.log('Model:', data.model);
        } else {
            console.log('❌ Connection test failed:', response.status);
            console.log('Error:', data);
        }
    } catch (error) {
        console.log('❌ Connection test error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting Claude API tests...\n');
    
    await testConnection();
    await testNonStreaming();
    await testStreaming();
    
    console.log('\n🏁 Tests completed!');
}

// Check if running directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testConnection, testNonStreaming, testStreaming };