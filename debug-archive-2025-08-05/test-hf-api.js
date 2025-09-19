// Test script to reproduce the Hugging Face API issue
import { Client } from "@gradio/client";

async function testHFAPI() {
    try {
        console.log("🔗 Attempting to connect to HF Space...");
        const client = await Client.connect("thoucentric/Big-Five-Personality-Traits-Detection");
        console.log("✅ Successfully connected to HF Space");
        
        // Test a prediction
        console.log("🧠 Testing prediction...");
        const result = await client.predict("/predict", {
            inputs: "Hello!!"
        });
        
        console.log(result.data);
        
    } catch (error) {
        console.error("💥 Error:", error.message);
        console.error("🔍 Full error:", error);
    }
}

testHFAPI();