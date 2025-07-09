class PersonalityAnalyzer {
    constructor() {
        this.patterns = {
            enthusiasm: {
                high: /(!{2,}|amazing|incredible|love|passion|excited|thrilled|awesome)/gi,
                medium: /(!|great|good|nice|interesting|cool|fun)/gi,
                low: /okay|fine|alright|decent|standard/gi
            },
            communication: {
                casual: /gonna|wanna|can't|don't|won't|yeah|yep|nah|hey|hi|sup/gi,
                formal: /shall|would|should|therefore|furthermore|moreover|indeed|certainly/gi,
                creative: /imagine|envision|dream|create|build|design|art|beauty|inspire/gi
            },
            values: {
                impact: /change|world|help|improve|better|impact|difference|society|community/gi,
                growth: /learn|grow|develop|progress|advance|skill|knowledge|experience/gi,
                innovation: /new|innovative|creative|original|unique|cutting.edge|breakthrough/gi,
                collaboration: /team|together|collaborate|partnership|community|collective|share/gi
            },
            interests: {
                technology: /tech|code|software|AI|digital|app|programming|development|data/gi,
                arts: /art|design|creative|music|visual|aesthetic|beauty|culture|expression/gi,
                business: /business|entrepreneur|startup|company|market|strategy|leadership|management/gi,
                social: /social|people|community|society|human|relationship|connection|network/gi,
                science: /science|research|study|analysis|experiment|theory|discovery|knowledge/gi
            }
        };
    }

    analyze(responses) {
        const profile = {
            name: this.extractName(responses.name_work?.answer || ''),
            work: this.extractWork(responses.name_work?.answer || ''),
            enthusiasmLevel: this.analyzeEnthusiasm(responses),
            communicationStyle: this.analyzeCommunicationStyle(responses),
            coreValues: this.analyzeValues(responses),
            interests: this.analyzeInterests(responses),
            personality: this.generatePersonalityInsights(responses),
            avatarSeed: this.generateAvatarSeed(responses),
            completedAt: new Date().toISOString()
        };

        return profile;
    }

    extractName(nameWorkResponse) {
        // Try to extract name from various patterns
        const patterns = [
            /I'm\s+([A-Za-z]+)/i,
            /My name is\s+([A-Za-z]+)/i,
            /^([A-Za-z]+),/,
            /^([A-Za-z]+)\s+/,
            /I am\s+([A-Za-z]+)/i
        ];

        for (const pattern of patterns) {
            const match = nameWorkResponse.match(pattern);
            if (match) {
                return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
            }
        }

        return 'Friend'; // Fallback
    }

    extractWork(nameWorkResponse) {
        const workKeywords = [
            'developer', 'designer', 'engineer', 'manager', 'artist', 'writer', 
            'teacher', 'student', 'consultant', 'entrepreneur', 'researcher',
            'analyst', 'marketer', 'creator', 'founder', 'director'
        ];

        const lowerResponse = nameWorkResponse.toLowerCase();
        for (const keyword of workKeywords) {
            if (lowerResponse.includes(keyword)) {
                return keyword.charAt(0).toUpperCase() + keyword.slice(1);
            }
        }

        return 'Professional'; // Fallback
    }

    analyzeEnthusiasm(responses) {
        const allText = Object.values(responses)
            .map(r => r.answer || '')
            .join(' ');

        const highMatches = (allText.match(this.patterns.enthusiasm.high) || []).length;
        const mediumMatches = (allText.match(this.patterns.enthusiasm.medium) || []).length;
        const lowMatches = (allText.match(this.patterns.enthusiasm.low) || []).length;

        if (highMatches > 2 || (highMatches > 0 && mediumMatches > 3)) {
            return 'high';
        } else if (mediumMatches > 2 || highMatches > 0) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    analyzeCommunicationStyle(responses) {
        const allText = Object.values(responses)
            .map(r => r.answer || '')
            .join(' ');

        const casualScore = (allText.match(this.patterns.communication.casual) || []).length;
        const formalScore = (allText.match(this.patterns.communication.formal) || []).length;
        const creativeScore = (allText.match(this.patterns.communication.creative) || []).length;

        // Determine dominant style
        if (creativeScore > casualScore && creativeScore > formalScore) {
            return 'creative';
        } else if (casualScore > formalScore) {
            return 'casual';
        } else if (formalScore > 0) {
            return 'formal';
        } else {
            return 'conversational';
        }
    }

    analyzeValues(responses) {
        const allText = Object.values(responses)
            .map(r => r.answer || '')
            .join(' ');

        const values = {};
        for (const [value, pattern] of Object.entries(this.patterns.values)) {
            values[value] = (allText.match(pattern) || []).length;
        }

        // Return top 2 values
        return Object.entries(values)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([value]) => value);
    }

    analyzeInterests(responses) {
        const allText = Object.values(responses)
            .map(r => r.answer || '')
            .join(' ');

        const interests = {};
        for (const [interest, pattern] of Object.entries(this.patterns.interests)) {
            interests[interest] = (allText.match(pattern) || []).length;
        }

        // Return top 3 interests
        return Object.entries(interests)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([interest]) => interest);
    }

    generatePersonalityInsights(responses) {
        const insights = [];
        
        // Dinner guest analysis
        const dinnerResponse = responses.dinner_guest?.answer || '';
        if (dinnerResponse.includes('Einstein') || dinnerResponse.includes('scientist')) {
            insights.push('intellectually_curious');
        }
        if (dinnerResponse.includes('artist') || dinnerResponse.includes('creative')) {
            insights.push('artistically_inclined');
        }
        if (dinnerResponse.includes('leader') || dinnerResponse.includes('change')) {
            insights.push('leadership_oriented');
        }

        // Current project analysis
        const projectResponse = responses.current_project?.answer || '';
        if (projectResponse.length > 100) {
            insights.push('detailed_thinker');
        }
        if (projectResponse.includes('team') || projectResponse.includes('collaborate')) {
            insights.push('collaborative');
        }

        // Impact analysis
        const impactResponse = responses.impact?.answer || '';
        if (impactResponse.includes('world') || impactResponse.includes('global')) {
            insights.push('big_picture_thinker');
        }
        if (impactResponse.includes('local') || impactResponse.includes('community')) {
            insights.push('community_focused');
        }

        return insights;
    }

    generateAvatarSeed(responses) {
        // Create a unique seed based on their responses for consistent avatar generation
        const seedString = [
            responses.name_work?.answer || '',
            responses.current_project?.answer || '',
            responses.dinner_guest?.answer || '',
            responses.impact?.answer || ''
        ].join('|');

        // Simple hash function
        let hash = 0;
        for (let i = 0; i < seedString.length; i++) {
            const char = seedString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return Math.abs(hash).toString(36);
    }

    getAvatarColors(profile) {
        const colorSchemes = {
            high: {
                primary: '#FF6B6B', // Energetic red
                secondary: '#4ECDC4', // Vibrant teal
                accent: '#45B7D1' // Bright blue
            },
            medium: {
                primary: '#96CEB4', // Calm green
                secondary: '#FECA57', // Warm yellow
                accent: '#48CAE4' // Soft blue
            },
            low: {
                primary: '#74B9FF', // Gentle blue
                secondary: '#A29BFE', // Soft purple
                accent: '#6C5CE7' // Muted violet
            }
        };

        const baseColors = colorSchemes[profile.enthusiasmLevel] || colorSchemes.medium;
        
        // Modify based on interests
        if (profile.interests.includes('technology')) {
            baseColors.accent = '#00D2FF';
        }
        if (profile.interests.includes('arts')) {
            baseColors.primary = '#FF9FF3';
        }
        if (profile.interests.includes('business')) {
            baseColors.secondary = '#54A0FF';
        }

        return baseColors;
    }

    generateSummary(profile) {
        const enthusiasm = profile.enthusiasmLevel === 'high' ? 'highly enthusiastic' : 
                          profile.enthusiasmLevel === 'medium' ? 'moderately enthusiastic' : 'thoughtfully measured';
        
        const style = profile.communicationStyle === 'casual' ? 'casual and friendly' :
                     profile.communicationStyle === 'formal' ? 'professional and structured' :
                     profile.communicationStyle === 'creative' ? 'creative and imaginative' : 'conversational';

        return `${profile.name} is a ${enthusiasm} ${profile.work} with a ${style} communication style. They're passionate about ${profile.interests.slice(0, 2).join(' and ')}, and value ${profile.coreValues.join(' and ')}.`;
    }
}

window.PersonalityAnalyzer = PersonalityAnalyzer;