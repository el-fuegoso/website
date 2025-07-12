/**
 * ClaudeAvatarService.js - Claude API integration for avatar generation
 * Handles API calls, error handling, and response processing for personalized avatar creation
 */

class ClaudeAvatarService {
    constructor() {
        this.templateGenerator = new TemplateAvatarGenerator();
        this.analytics = new DataCollector();
        this.fallbackEnabled = true; // Always use local generation
        this.apiKey = null;
        this.baseUrl = 'https://api.anthropic.com/v1/messages';
    }

    // API key management
    hasValidApiKey() {
        return !!this.apiKey || this.hasStoredApiKey();
    }
    
    hasStoredApiKey() {
        return !!localStorage.getItem('claude_api_key');
    }
    
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('claude_api_key', apiKey);
    }
    
    loadStoredApiKey() {
        const stored = localStorage.getItem('claude_api_key');
        if (stored) {
            this.apiKey = stored;
            return true;
        }
        return false;
    }
    
    clearApiKey() {
        this.apiKey = null;
        localStorage.removeItem('claude_api_key');
    }

    async generateAvatar(personalityData, conversationData, archetypeMatch) {
        const startTime = Date.now();
        
        console.log('🎭 ClaudeAvatarService: Starting LOCAL avatar generation (no API calls)');
        
        try {
            // Validate inputs
            if (!this.templateGenerator) {
                throw new Error('TemplateAvatarGenerator not initialized');
            }
            
            if (!archetypeMatch || !archetypeMatch.archetype) {
                throw new Error('Invalid archetype match provided');
            }
            
            // Track avatar generation start
            this.analytics.trackEvent('avatar_generation_started', {
                archetype: archetypeMatch.archetype.name,
                confidence: archetypeMatch.archetype.confidence,
                method: 'template-based'
            });

            // Generate avatar using template system (no API call needed)
            console.log('🎭 Calling template generator for archetype:', archetypeMatch.archetype.name);
            const avatarData = this.templateGenerator.generateAvatar(
                personalityData, 
                conversationData, 
                archetypeMatch
            );
            
            const endTime = Date.now();
            const generationTime = endTime - startTime;
            
            console.log('🎭 Avatar generated successfully in', generationTime, 'ms:', avatarData.name);
            
            // Track successful generation
            this.analytics.trackEvent('avatar_generation_completed', {
                archetype: archetypeMatch.archetype.name,
                generationTime,
                success: true,
                method: 'template-based'
            });

            return {
                ...avatarData,
                metadata: {
                    ...avatarData.metadata,
                    generationTime,
                    generationMethod: 'template-based',
                    reliable: true
                }
            };

        } catch (error) {
            const endTime = Date.now();
            const generationTime = endTime - startTime;
            
            console.error('🚨 Template avatar generation failed:', error);
            
            // Track failed generation
            this.analytics.trackEvent('avatar_generation_failed', {
                error: error.message,
                generationTime,
                archetype: archetypeMatch?.archetype?.name || 'unknown',
                method: 'template-based'
            });

            // Create a basic fallback avatar
            console.log('🔄 Creating basic fallback avatar');
            return this.createBasicFallback(archetypeMatch, generationTime);
        }
    }

    createBasicFallback(archetypeMatch, generationTime) {
        const archetype = archetypeMatch.archetype;
        
        return {
            name: "Reliable El",
            title: `Your ${archetype.name.replace('The', '')} Assistant`,
            summary: `${archetype.description}. I'm designed to work with your specific style and preferences.`,
            personality: "Adaptable and reliable, focused on helping you achieve your goals",
            workingStyle: archetype.workingStyle || "Collaborative and responsive to your needs",
            communication: archetype.communication || "Clear and supportive",
            projectApproach: archetype.projectApproach || "Systematic and goal-oriented",
            uniqueValue: archetype.value || "Consistent support tailored to your working style",
            strengths: archetype.strengths || ["Reliability", "Adaptability", "Goal Focus"],
            collaboration: "I work as your steady partner, providing consistent support",
            tools: ["Documentation", "Planning", "Regular Check-ins"],
            motto: "Reliable support, consistent results",
            conversationStarters: [
                "What would you like to work on today?",
                "How can I best support your current goals?",
                "What's your priority right now?"
            ],
            metadata: {
                generationTime,
                archetype: archetype.name,
                confidence: archetypeMatch.confidence,
                generationMethod: 'basic-fallback',
                fallback: true,
                timestamp: new Date().toISOString()
            }
        };
    }

    // Method to test local avatar generation
    async testConnection() {
        try {
            const testPersonality = {
                scores: { technical: 80, collaborative: 60, creativity: 40 }
            };
            const testConversation = {
                responses: { question_0: 'I love building software solutions' }
            };
            const testArchetype = {
                archetype: { name: 'TheBuilder', description: 'Test archetype' },
                confidence: 85
            };

            const startTime = Date.now();
            const avatar = this.templateGenerator.generateAvatar(
                testPersonality, 
                testConversation, 
                testArchetype
            );
            const endTime = Date.now();

            return {
                success: true,
                message: 'Local avatar generation working perfectly',
                generationTime: endTime - startTime,
                method: 'template-based',
                testAvatar: avatar.name
            };
        } catch (error) {
            return {
                success: false,
                message: `Local generation error: ${error.message}`,
                canRetry: true
            };
        }
    }

    // Method to estimate generation performance
    estimatePerformance(personalityData, conversationData) {
        // Local generation is fast and free
        return {
            estimatedGenerationTime: 50, // milliseconds
            cost: 0, // No API costs
            method: 'template-based',
            reliability: 'high'
        };
    }

    // Batch avatar generation for testing
    async generateMultipleAvatars(personalityDataList, maxConcurrent = 10) {
        const results = [];
        const errors = [];
        
        // Process in batches (higher concurrency since no API limits)
        for (let i = 0; i < personalityDataList.length; i += maxConcurrent) {
            const batch = personalityDataList.slice(i, i + maxConcurrent);
            
            const batchPromises = batch.map(async (data) => {
                try {
                    const avatar = await this.generateAvatar(
                        data.personalityData,
                        data.conversationData,
                        data.archetypeMatch
                    );
                    return { success: true, data: avatar, originalData: data };
                } catch (error) {
                    return { success: false, error: error.message, originalData: data };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            
            batchResults.forEach(result => {
                if (result.success) {
                    results.push(result);
                } else {
                    errors.push(result);
                }
            });
            
            // No delay needed for local generation
        }
        
        return { results, errors, totalProcessed: personalityDataList.length };
    }

    // Get analytics for avatar generation
    getGenerationAnalytics() {
        const events = this.analytics.getAnalytics();
        const avatarEvents = events.filter(e => e.type.startsWith('avatar_generation'));
        
        const stats = {
            totalAttempts: avatarEvents.filter(e => e.type === 'avatar_generation_started').length,
            totalCompletions: avatarEvents.filter(e => e.type === 'avatar_generation_completed').length,
            totalFailures: avatarEvents.filter(e => e.type === 'avatar_generation_failed').length,
            averageGenerationTime: 0,
            archetypeDistribution: {},
            errorTypes: {}
        };
        
        // Calculate average generation time
        const completedEvents = avatarEvents.filter(e => e.type === 'avatar_generation_completed');
        if (completedEvents.length > 0) {
            const totalTime = completedEvents.reduce((sum, event) => sum + event.data.generationTime, 0);
            stats.averageGenerationTime = Math.round(totalTime / completedEvents.length);
        }
        
        // Archetype distribution
        avatarEvents.forEach(event => {
            if (event.data.archetype) {
                stats.archetypeDistribution[event.data.archetype] = 
                    (stats.archetypeDistribution[event.data.archetype] || 0) + 1;
            }
        });
        
        // Error types
        const errorEvents = avatarEvents.filter(e => e.type === 'avatar_generation_failed');
        errorEvents.forEach(event => {
            const errorType = event.data.error.split(':')[0]; // Get error category
            stats.errorTypes[errorType] = (stats.errorTypes[errorType] || 0) + 1;
        });
        
        stats.successRate = stats.totalAttempts > 0 
            ? Math.round((stats.totalCompletions / stats.totalAttempts) * 100) 
            : 0;
        
        return stats;
    }
    
    // Claude API methods for conversation analysis
    async makeClaudeRequest(messages, maxTokens = 1000) {
        if (!this.apiKey) {
            this.loadStoredApiKey();
        }
        
        if (!this.apiKey) {
            throw new Error('No Claude API key available');
        }
        
        const requestBody = {
            model: 'claude-3-haiku-20240307',
            max_tokens: maxTokens,
            messages: messages
        };
        
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            return data.content[0].text;
            
        } catch (error) {
            console.error('Claude API request failed:', error);
            throw error;
        }
    }
    
    async testConnection() {
        if (!this.hasValidApiKey()) {
            return {
                success: false,
                message: 'No API key available',
                canRetry: false
            };
        }
        
        try {
            const testResponse = await this.makeClaudeRequest([
                { role: 'user', content: 'Respond with just "API working" if you receive this message.' }
            ], 50);
            
            if (testResponse.toLowerCase().includes('api working')) {
                return {
                    success: true,
                    message: 'Claude API connection successful',
                    method: 'claude-api'
                };
            } else {
                return {
                    success: false,
                    message: 'Unexpected response from Claude API',
                    canRetry: true
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                canRetry: error.message.includes('rate limit') || error.message.includes('timeout')
            };
        }
    }
}

// Export for global access
window.ClaudeAvatarService = ClaudeAvatarService;