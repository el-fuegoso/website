/**
 * ClaudeAvatarService.js - Claude API integration for avatar generation
 * Handles API calls, error handling, and response processing for personalized avatar creation
 */

class ClaudeAvatarService {
    constructor() {
        this.baseURL = '/api/generate-avatar'; // Use our serverless function
        this.model = 'claude-3-sonnet-20240229';
        this.maxTokens = 1500;
        this.temperature = 0.7;
        this.promptGenerator = new AvatarPrompts();
        this.analytics = new DataCollector();
    }

    // API key is now handled server-side via environment variables
    hasValidApiKey() {
        return true; // Always true since we use server-side API key
    }

    async generateAvatar(personalityData, conversationData, archetypeMatch) {

        const startTime = Date.now();
        
        try {
            // Track avatar generation start
            this.analytics.trackEvent('avatar_generation_started', {
                archetype: archetypeMatch.archetype.name,
                confidence: archetypeMatch.archetype.confidence
            });

            // Build the prompt
            const prompt = this.promptGenerator.buildAvatarPrompt(
                personalityData, 
                conversationData, 
                archetypeMatch
            );

            // Make API request
            const response = await this.makeClaudeRequest(prompt);
            
            // Process and validate response
            const avatarData = await this.processAvatarResponse(response, archetypeMatch);
            
            const endTime = Date.now();
            const generationTime = endTime - startTime;
            
            // Track successful generation
            this.analytics.trackEvent('avatar_generation_completed', {
                archetype: archetypeMatch.archetype.name,
                generationTime,
                success: true
            });

            return {
                ...avatarData,
                metadata: {
                    generationTime,
                    archetype: archetypeMatch.archetype.name,
                    confidence: archetypeMatch.archetype.confidence,
                    model: this.model,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            const endTime = Date.now();
            const generationTime = endTime - startTime;
            
            // Track failed generation
            this.analytics.trackEvent('avatar_generation_failed', {
                error: error.message,
                generationTime,
                archetype: archetypeMatch?.archetype?.name || 'unknown'
            });

            throw this.handleAvatarError(error, archetypeMatch);
        }
    }

    async makeClaudeRequest(prompt) {
        const requestBody = {
            prompt,
            model: this.model,
            maxTokens: this.maxTokens,
            temperature: this.temperature
        };

        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        
        // Convert our serverless function response to Claude API format
        return {
            content: [{
                text: data.content
            }],
            usage: data.usage || {},
            model: data.model || this.model
        };
    }

    async processAvatarResponse(response, archetypeMatch) {
        if (!response.content || !response.content[0] || !response.content[0].text) {
            throw new Error('Invalid response format from Claude API');
        }

        const rawText = response.content[0].text.trim();
        
        // Try to extract JSON from the response
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in Claude response');
        }

        const jsonText = jsonMatch[0];
        
        // Validate and parse the avatar data
        const validation = this.promptGenerator.validateAvatarResponse(jsonText);
        
        if (!validation.valid) {
            console.warn('Avatar validation failed:', validation.error);
            
            // Use fallback avatar with archetype customization
            const fallbackAvatar = this.customizeFallbackAvatar(
                validation.fallback, 
                archetypeMatch
            );
            
            return {
                ...fallbackAvatar,
                metadata: {
                    fallback: true,
                    originalError: validation.error
                }
            };
        }

        return validation.avatar;
    }

    customizeFallbackAvatar(fallbackAvatar, archetypeMatch) {
        const archetype = archetypeMatch.archetype;
        
        return {
            ...fallbackAvatar,
            title: `Your Personal El: The ${archetype.name.replace('The', '')}`,
            summary: `${archetype.description}. This El adapts to work specifically with your ${archetype.name.toLowerCase().replace('the', '')} style.`,
            workingStyle: archetype.workingStyle,
            communication: archetype.communication || fallbackAvatar.communication,
            projectApproach: archetype.projectApproach || fallbackAvatar.projectApproach,
            uniqueValue: archetype.value || fallbackAvatar.uniqueValue
        };
    }

    handleAvatarError(error, archetypeMatch) {
        let userMessage = 'Unable to generate personalized avatar';
        let fallbackAvatar = null;

        if (error.message.includes('API key')) {
            userMessage = 'API key issue. Please check your Claude API configuration.';
        } else if (error.message.includes('rate limit') || error.message.includes('429')) {
            userMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            userMessage = 'Network error. Please check your connection and try again.';
        } else {
            // For other errors, provide a fallback avatar
            fallbackAvatar = this.customizeFallbackAvatar(
                this.promptGenerator.generateFallbackAvatar(),
                archetypeMatch
            );
        }

        const enhancedError = new Error(userMessage);
        enhancedError.originalError = error;
        enhancedError.fallbackAvatar = fallbackAvatar;
        enhancedError.canRetry = !error.message.includes('API key');

        return enhancedError;
    }

    // Method to test API connection
    async testConnection() {
        try {
            // Use dedicated test endpoint for simpler debugging
            const response = await fetch('/api/test-connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.error || 'Connection test failed',
                    details: data.details || 'No additional details',
                    debug: data.debug || {},
                    canRetry: response.status !== 401 // Don't retry on auth errors
                };
            }

            return {
                success: true,
                message: data.message || 'Claude API connection successful',
                model: data.model || this.model,
                response: data.response || 'Test response received'
            };
        } catch (error) {
            return {
                success: false,
                message: `Network error: ${error.message}`,
                canRetry: true
            };
        }
    }

    // Method to estimate avatar generation cost
    estimateTokenUsage(personalityData, conversationData) {
        const promptGenerator = new AvatarPrompts();
        const testPrompt = promptGenerator.buildAvatarPrompt(
            personalityData, 
            conversationData, 
            { archetype: { name: 'TheBuilder' } }
        );
        
        // Rough token estimation (1 token ≈ 4 characters)
        const inputTokens = Math.ceil(testPrompt.length / 4);
        const outputTokens = this.maxTokens;
        
        return {
            estimatedInputTokens: inputTokens,
            maxOutputTokens: outputTokens,
            totalTokens: inputTokens + outputTokens,
            estimatedCost: ((inputTokens * 0.003) + (outputTokens * 0.015)) / 1000 // Rough Claude pricing
        };
    }

    // Batch avatar generation for testing
    async generateMultipleAvatars(personalityDataList, maxConcurrent = 3) {
        const results = [];
        const errors = [];
        
        // Process in batches to avoid rate limiting
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
            
            // Small delay between batches
            if (i + maxConcurrent < personalityDataList.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
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
}

// Export for global access
window.ClaudeAvatarService = ClaudeAvatarService;