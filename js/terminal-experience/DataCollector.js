/**
 * DataCollector.js - Enhanced data collection and keyword extraction system
 * Handles user response storage, keyword analysis, and profile generation
 */

class DataCollector {
    constructor() {
        this.storageKey = 'terminal_user_data';
        this.sessionKey = 'terminal_session';
        this.keywords = this.initializeKeywords();
    }

    initializeKeywords() {
        return {
            // Personality indicators
            enthusiasm: ['excited', 'passionate', 'love', 'amazing', 'incredible', 'fantastic', 'awesome', 'brilliant'],
            creativity: ['creative', 'design', 'art', 'innovative', 'build', 'create', 'develop', 'make'],
            technical: ['code', 'programming', 'software', 'development', 'engineer', 'tech', 'algorithm', 'data'],
            leadership: ['lead', 'manage', 'team', 'organize', 'coordinate', 'director', 'manager', 'founder'],
            analytical: ['analyze', 'research', 'study', 'investigate', 'examine', 'evaluate', 'optimize'],
            collaborative: ['collaborate', 'work together', 'team', 'partnership', 'community', 'group'],
            
            // Work/Industry indicators
            startup: ['startup', 'entrepreneur', 'founder', 'venture', 'scale', 'growth', 'mvp'],
            corporate: ['corporation', 'enterprise', 'company', 'business', 'corporate', 'organization'],
            freelance: ['freelance', 'consultant', 'independent', 'contractor', 'client'],
            academic: ['research', 'university', 'professor', 'student', 'academic', 'scholar'],
            nonprofit: ['nonprofit', 'charity', 'volunteer', 'community', 'social impact', 'mission'],
            
            // Technology areas
            frontend: ['frontend', 'ui', 'ux', 'react', 'vue', 'angular', 'javascript', 'css', 'html'],
            backend: ['backend', 'server', 'api', 'database', 'node', 'python', 'java', 'sql'],
            ai: ['ai', 'machine learning', 'ml', 'artificial intelligence', 'neural', 'deep learning'],
            mobile: ['mobile', 'ios', 'android', 'app', 'react native', 'flutter', 'swift'],
            devops: ['devops', 'cloud', 'aws', 'docker', 'kubernetes', 'deployment', 'infrastructure'],
            
            // Interests and values
            impact: ['impact', 'change', 'difference', 'improve', 'help', 'solve', 'benefit'],
            innovation: ['innovation', 'new', 'future', 'cutting edge', 'revolutionary', 'breakthrough'],
            learning: ['learn', 'grow', 'develop', 'education', 'knowledge', 'skill', 'study'],
            communication: ['communicate', 'explain', 'teach', 'present', 'write', 'speak', 'share']
        };
    }

    extractKeywords(text) {
        const lowerText = text.toLowerCase();
        const extractedKeywords = {};
        
        Object.entries(this.keywords).forEach(([category, words]) => {
            const matches = words.filter(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                return regex.test(lowerText);
            });
            
            if (matches.length > 0) {
                extractedKeywords[category] = matches;
            }
        });
        
        return extractedKeywords;
    }

    extractUserName(response) {
        // Try to extract name from common patterns
        const patterns = [
            /(?:i'm|i am|my name is|call me)\s+([a-zA-Z]+)/i,
            /^([a-zA-Z]+)[,\s-]/,
            /([a-zA-Z]+)(?:\s+and\s+i|,\s+i)/i
        ];
        
        for (const pattern of patterns) {
            const match = response.match(pattern);
            if (match && match[1] && match[1].length > 1) {
                return this.capitalizeFirstLetter(match[1]);
            }
        }
        
        // Fallback: try to get first word if it looks like a name
        const words = response.trim().split(/\s+/);
        if (words.length > 0 && words[0].length > 1 && /^[a-zA-Z]+$/.test(words[0])) {
            return this.capitalizeFirstLetter(words[0]);
        }
        
        return null;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    analyzePersonality(responses) {
        const allKeywords = {};
        const combinedText = Object.values(responses).join(' ');
        
        // Extract keywords from all responses
        const keywords = this.extractKeywords(combinedText);
        
        // Calculate personality scores
        const personalityProfile = {
            enthusiasm: this.calculateScore(keywords, ['enthusiasm', 'impact', 'innovation']),
            technical: this.calculateScore(keywords, ['technical', 'frontend', 'backend', 'ai', 'devops']),
            creative: this.calculateScore(keywords, ['creativity', 'innovation', 'frontend']),
            leadership: this.calculateScore(keywords, ['leadership', 'startup', 'impact']),
            collaborative: this.calculateScore(keywords, ['collaborative', 'communication', 'learning']),
            analytical: this.calculateScore(keywords, ['analytical', 'technical', 'ai'])
        };
        
        return {
            keywords,
            personality: personalityProfile,
            dominantTrait: this.getDominantTrait(personalityProfile)
        };
    }

    calculateScore(keywords, categories) {
        let score = 0;
        categories.forEach(category => {
            if (keywords[category]) {
                score += keywords[category].length;
            }
        });
        return Math.min(100, score * 10); // Scale to 0-100
    }

    getDominantTrait(profile) {
        return Object.entries(profile).reduce((a, b) => 
            profile[a[0]] > profile[b[0]] ? a : b
        )[0];
    }

    saveUserData(responses, userName = null) {
        const timestamp = new Date().toISOString();
        const analysis = this.analyzePersonality(responses);
        
        const userData = {
            responses,
            userName: userName || this.extractUserName(responses.question_0 || ''),
            analysis,
            timestamp,
            sessionId: this.generateSessionId(),
            completionStatus: 'completed'
        };
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(userData));
        
        // Save session data for temporary access
        sessionStorage.setItem(this.sessionKey, JSON.stringify({
            userName: userData.userName,
            dominantTrait: analysis.dominantTrait,
            timestamp
        }));
        
        return userData;
    }

    getUserData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : null;
    }

    getSessionData() {
        const stored = sessionStorage.getItem(this.sessionKey);
        return stored ? JSON.parse(stored) : null;
    }

    hasCompletedExperience() {
        const userData = this.getUserData();
        return userData && userData.completionStatus === 'completed';
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    exportData() {
        const userData = this.getUserData();
        if (!userData) return null;
        
        return {
            export_timestamp: new Date().toISOString(),
            user_profile: {
                name: userData.userName,
                responses: userData.responses,
                personality_analysis: userData.analysis,
                session_info: {
                    id: userData.sessionId,
                    completion_time: userData.timestamp
                }
            }
        };
    }

    clearUserData() {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
    }

    // Analytics methods
    trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data,
            sessionId: this.getSessionData()?.sessionId || 'unknown'
        };
        
        // Store events for analytics (could be sent to external service)
        const events = JSON.parse(localStorage.getItem('terminal_analytics') || '[]');
        events.push(event);
        
        // Keep only last 100 events to prevent storage bloat
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('terminal_analytics', JSON.stringify(events));
    }

    getAnalytics() {
        return JSON.parse(localStorage.getItem('terminal_analytics') || '[]');
    }
}

// Export for use in other modules
window.DataCollector = DataCollector;