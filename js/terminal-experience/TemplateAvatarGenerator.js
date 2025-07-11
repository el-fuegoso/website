/**
 * TemplateAvatarGenerator.js - Local avatar generation without external APIs
 * Creates rich, personalized avatars using templates and personality analysis
 */

class TemplateAvatarGenerator {
    constructor() {
        this.avatarTemplates = this.initializeAvatarTemplates();
        this.personalityInsights = this.initializePersonalityInsights();
        this.conversationAnalyzer = this.initializeConversationAnalyzer();
    }

    /**
     * Generate a complete avatar based on personality data and conversation
     */
    generateAvatar(personalityData, conversationData, archetypeMatch) {
        const archetype = archetypeMatch.archetype;
        const template = this.avatarTemplates[archetype.name];
        
        if (!template) {
            return this.generateFallbackAvatar(archetypeMatch);
        }

        // Analyze conversation for personalization
        const conversationInsights = this.analyzeConversation(conversationData);
        
        // Build personalized avatar
        const avatar = this.buildPersonalizedAvatar(
            template, 
            personalityData, 
            conversationInsights, 
            archetypeMatch
        );

        return {
            ...avatar,
            metadata: {
                archetype: archetype.name,
                confidence: archetypeMatch.confidence,
                generationMethod: 'template-based',
                timestamp: new Date().toISOString(),
                personalityScores: personalityData.scores
            }
        };
    }

    /**
     * Build a personalized avatar from template and data
     */
    buildPersonalizedAvatar(template, personalityData, conversationInsights, archetypeMatch) {
        const archetype = archetypeMatch.archetype;
        const userTopics = conversationInsights.dominantTopics.slice(0, 3);
        const userMotivations = conversationInsights.motivations.slice(0, 2);
        
        return {
            name: this.generateName(template, conversationInsights),
            title: this.generateTitle(template, personalityData, userTopics),
            summary: this.generateSummary(template, userTopics, userMotivations),
            personality: this.generatePersonality(template, personalityData),
            workingStyle: this.generateWorkingStyle(template, conversationInsights),
            communication: this.generateCommunication(template, personalityData),
            projectApproach: this.generateProjectApproach(template, userTopics),
            uniqueValue: this.generateUniqueValue(template, conversationInsights),
            strengths: this.generateStrengths(template, personalityData),
            collaboration: this.generateCollaboration(template, conversationInsights),
            tools: this.generatePreferredTools(template, userTopics),
            motto: this.generateMotto(template, userMotivations),
            conversationStarters: this.generateConversationStarters(template, userTopics)
        };
    }

    /**
     * Analyze conversation data for personalization insights
     */
    analyzeConversation(conversationData) {
        const responses = conversationData.responses || {};
        const allText = Object.values(responses).join(' ').toLowerCase();
        
        return {
            dominantTopics: this.extractTopics(allText),
            motivations: this.extractMotivations(allText),
            workStyle: this.extractWorkStyle(allText),
            preferences: this.extractPreferences(allText),
            goals: this.extractGoals(allText)
        };
    }

    /**
     * Extract topics from conversation text
     */
    extractTopics(text) {
        const topicKeywords = {
            'technology': ['tech', 'software', 'code', 'programming', 'digital', 'AI', 'development', 'system'],
            'design': ['design', 'creative', 'visual', 'aesthetic', 'user experience', 'interface', 'art'],
            'business': ['business', 'strategy', 'market', 'revenue', 'growth', 'startup', 'entrepreneur'],
            'leadership': ['lead', 'manage', 'team', 'people', 'organization', 'culture', 'vision'],
            'innovation': ['innovation', 'new', 'breakthrough', 'disrupt', 'transform', 'future', 'cutting edge'],
            'collaboration': ['collaborate', 'team', 'together', 'partnership', 'community', 'group'],
            'learning': ['learn', 'education', 'knowledge', 'skill', 'training', 'development', 'growth'],
            'problem-solving': ['solve', 'problem', 'challenge', 'solution', 'fix', 'resolve', 'tackle']
        };

        const topics = [];
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            const score = keywords.reduce((sum, keyword) => {
                return sum + (text.includes(keyword) ? 1 : 0);
            }, 0);
            if (score > 0) {
                topics.push({ topic, score });
            }
        }

        return topics
            .sort((a, b) => b.score - a.score)
            .map(t => t.topic);
    }

    /**
     * Extract motivations from conversation text
     */
    extractMotivations(text) {
        const motivationKeywords = {
            'impact': ['impact', 'difference', 'change', 'improve', 'help', 'benefit', 'transform'],
            'mastery': ['learn', 'master', 'expert', 'skill', 'knowledge', 'understand', 'improve'],
            'autonomy': ['independent', 'freedom', 'control', 'own', 'self-directed', 'flexible'],
            'connection': ['people', 'relationship', 'team', 'community', 'collaborate', 'together'],
            'achievement': ['achieve', 'accomplish', 'success', 'goal', 'win', 'complete', 'finish'],
            'innovation': ['create', 'new', 'innovation', 'original', 'unique', 'breakthrough']
        };

        const motivations = [];
        for (const [motivation, keywords] of Object.entries(motivationKeywords)) {
            const score = keywords.reduce((sum, keyword) => {
                return sum + (text.includes(keyword) ? 1 : 0);
            }, 0);
            if (score > 0) {
                motivations.push({ motivation, score });
            }
        }

        return motivations
            .sort((a, b) => b.score - a.score)
            .map(m => m.motivation);
    }

    /**
     * Generate various avatar components
     */
    generateName(template, insights) {
        const baseNames = template.names || ['El', 'Assistant', 'Companion'];
        const topicModifiers = {
            'technology': ['Tech', 'Code', 'Dev', 'Digital'],
            'design': ['Creative', 'Visual', 'Design', 'Aesthetic'],
            'business': ['Strategy', 'Growth', 'Venture', 'Market'],
            'leadership': ['Lead', 'Guide', 'Vision', 'Director']
        };

        const dominantTopic = insights.dominantTopics[0];
        const modifier = topicModifiers[dominantTopic] ? 
            this.randomChoice(topicModifiers[dominantTopic]) : '';

        return modifier ? `${modifier} ${this.randomChoice(baseNames)}` : this.randomChoice(baseNames);
    }

    generateTitle(template, personalityData, userTopics) {
        const baseTitle = template.title;
        const topicSpecialization = userTopics.length > 0 ? 
            ` specializing in ${userTopics.slice(0, 2).join(' and ')}` : '';
        
        return `${baseTitle}${topicSpecialization}`;
    }

    generateSummary(template, userTopics, userMotivations) {
        const baseSummary = template.description;
        const topicContext = userTopics.length > 0 ? 
            ` I'm particularly passionate about ${userTopics.slice(0, 2).join(' and ')}.` : '';
        const motivationContext = userMotivations.length > 0 ? 
            ` I'm driven by ${userMotivations[0]} and believe in collaborative growth.` : '';
        
        return `${baseSummary}.${topicContext}${motivationContext}`;
    }

    generateWorkingStyle(template, insights) {
        const baseStyle = template.workingStyle;
        const workStyleModifiers = {
            'technology': 'with a focus on technical excellence and innovation',
            'design': 'emphasizing user-centered design and creative solutions',
            'business': 'balancing strategic thinking with practical execution',
            'collaboration': 'prioritizing team alignment and shared understanding'
        };

        const dominantTopic = insights.dominantTopics[0];
        const modifier = workStyleModifiers[dominantTopic] || 'with attention to detail and quality';
        
        return `${baseStyle}, ${modifier}.`;
    }

    generateCommunication(template, personalityData) {
        const baseCommunication = template.communication;
        const styles = [];
        
        if (personalityData.scores.technical > 60) styles.push('technically precise');
        if (personalityData.scores.collaborative > 60) styles.push('highly collaborative');
        if (personalityData.scores.creativity > 60) styles.push('creatively expressive');
        if (personalityData.scores.leadership > 60) styles.push('confidently directive');
        
        const styleString = styles.length > 0 ? `, with a ${styles.join(' and ')} approach` : '';
        return `${baseCommunication}${styleString}.`;
    }

    generateProjectApproach(template, userTopics) {
        const baseApproach = template.projectApproach;
        const topicAdaptations = {
            'technology': 'leveraging cutting-edge tools and methodologies',
            'design': 'with strong emphasis on user research and iterative design',
            'business': 'ensuring alignment with business objectives and ROI',
            'innovation': 'exploring emerging trends and breakthrough approaches'
        };

        const adaptation = userTopics.length > 0 && topicAdaptations[userTopics[0]] ?
            `, ${topicAdaptations[userTopics[0]]}` : '';
        
        return `${baseApproach}${adaptation}.`;
    }

    generateUniqueValue(template, insights) {
        const baseValue = template.value;
        const personalizations = [
            "I understand your specific context and adapt accordingly",
            "I bring fresh perspectives while respecting your established processes",
            "I help bridge the gap between ideas and implementation",
            "I focus on sustainable solutions that grow with your needs"
        ];
        
        return `${baseValue}. ${this.randomChoice(personalizations)}.`;
    }

    generateStrengths(template, personalityData) {
        const baseStrengths = template.strengths || [];
        const additionalStrengths = [];
        
        if (personalityData.scores.technical > 70) additionalStrengths.push('Technical Deep-Dive');
        if (personalityData.scores.creativity > 70) additionalStrengths.push('Creative Problem-Solving');
        if (personalityData.scores.leadership > 70) additionalStrengths.push('Strategic Vision');
        if (personalityData.scores.collaborative > 70) additionalStrengths.push('Team Facilitation');
        
        return [...baseStrengths, ...additionalStrengths].slice(0, 5);
    }

    generateCollaboration(template, insights) {
        const collaborationStyles = [
            "I work best as your thinking partner, challenging ideas constructively while supporting your vision",
            "I adapt my communication style to match your preferences and team dynamics",
            "I help facilitate discussions and ensure all voices are heard in collaborative sessions",
            "I bring structure to brainstorming while maintaining creative flexibility"
        ];
        
        return this.randomChoice(collaborationStyles);
    }

    generatePreferredTools(template, userTopics) {
        const toolCategories = {
            'technology': ['VS Code', 'GitHub', 'Docker', 'AWS', 'APIs', 'Databases'],
            'design': ['Figma', 'Adobe Creative Suite', 'Sketch', 'Miro', 'InVision', 'Principle'],
            'business': ['Notion', 'Airtable', 'Slack', 'Zoom', 'Google Workspace', 'Analytics'],
            'leadership': ['OKRs', 'Retrospectives', '1:1s', 'Strategic Planning', 'Team Building']
        };

        const tools = [];
        userTopics.slice(0, 2).forEach(topic => {
            if (toolCategories[topic]) {
                tools.push(...toolCategories[topic].slice(0, 3));
            }
        });

        return tools.length > 0 ? tools : ['Collaborative Documentation', 'Regular Check-ins', 'Iterative Planning'];
    }

    generateMotto(template, userMotivations) {
        const mottos = {
            'impact': "Making a difference, one solution at a time",
            'mastery': "Continuous learning, continuous growth",
            'autonomy': "Empowering independent thinking and action",
            'connection': "Better together, stronger as a team",
            'achievement': "Turning ambitious goals into accomplished reality",
            'innovation': "Creating tomorrow's solutions today"
        };

        const motivation = userMotivations[0];
        return mottos[motivation] || "Excellence through collaboration and innovation";
    }

    generateConversationStarters(template, userTopics) {
        const starters = [
            "What's the most exciting challenge you're working on right now?",
            "How can we break down this complex problem into manageable pieces?",
            "What would success look like for this project?",
            "What assumptions should we validate before moving forward?",
            "How might we approach this differently to get better results?"
        ];

        const topicSpecific = {
            'technology': [
                "What's your current tech stack, and what's working well?",
                "Are there any performance bottlenecks we should address?",
                "How can we make this solution more scalable?"
            ],
            'design': [
                "Who is the primary user, and what's their main pain point?",
                "How might we test these design assumptions?",
                "What would make this experience truly delightful?"
            ],
            'business': [
                "What metrics matter most for this initiative?",
                "How does this align with your broader business strategy?",
                "What's the competitive landscape looking like?"
            ]
        };

        const topic = userTopics[0];
        if (topic && topicSpecific[topic]) {
            starters.push(...topicSpecific[topic]);
        }

        return this.shuffleArray(starters).slice(0, 5);
    }

    /**
     * Generate fallback avatar for unknown archetypes
     */
    generateFallbackAvatar(archetypeMatch) {
        const archetype = archetypeMatch.archetype;
        
        return {
            name: "Adaptive El",
            title: `Your Personal ${archetype.name.replace('The', '')} Assistant`,
            summary: `${archetype.description}. I adapt to work specifically with your ${archetype.name.toLowerCase().replace('the', '')} style and help you achieve your goals more effectively.`,
            personality: "Flexible and adaptive, I learn from your preferences and adjust my approach accordingly",
            workingStyle: archetype.workingStyle || "Collaborative and responsive to your needs",
            communication: archetype.communication || "Clear, supportive, and tailored to your communication style",
            projectApproach: archetype.projectApproach || "Structured yet flexible, adapting to your preferred methodologies",
            uniqueValue: archetype.value || "I provide personalized assistance that evolves with your changing needs",
            strengths: archetype.strengths || ["Adaptive Learning", "Contextual Support", "Goal Alignment"],
            collaboration: "I work as your thinking partner, providing insights and support tailored to your specific situation",
            tools: ["Flexible Documentation", "Regular Check-ins", "Goal Tracking"],
            motto: "Adapting to your success",
            conversationStarters: [
                "What's your main focus right now?",
                "How do you prefer to work through challenges?",
                "What kind of support would be most helpful?",
                "What's working well in your current approach?",
                "How can we build on your existing strengths?"
            ],
            metadata: {
                fallback: true,
                originalArchetype: archetype.name
            }
        };
    }

    /**
     * Initialize avatar templates for each archetype
     */
    initializeAvatarTemplates() {
        return {
            "TheStrategist": {
                names: ["Strategic El", "Vision El", "Planning El"],
                title: "Your Strategic Planning Partner",
                description: "I'm a strategic thinking partner who helps you see the big picture while keeping implementation practical",
                workingStyle: "Top-down strategy with iterative execution and continuous refinement",
                communication: "Clear, structured, and goal-oriented",
                projectApproach: "Strategic planning followed by tactical execution with regular strategic reviews",
                value: "I transform complex challenges into actionable roadmaps",
                strengths: ["Strategic Planning", "Technical Architecture", "Innovation Leadership", "Systems Thinking"]
            },

            "TheBuilder": {
                names: ["Builder El", "Maker El", "Dev El"],
                title: "Your Implementation Specialist",
                description: "I'm a hands-on implementation partner who turns ideas into working solutions rapidly",
                workingStyle: "Prototype-first approach with iterative improvement and continuous delivery",
                communication: "Direct, practical, and solution-focused",
                projectApproach: "Build, test, iterate, ship - with emphasis on getting working solutions quickly",
                value: "I deliver working solutions faster than expected while maintaining quality",
                strengths: ["Rapid Prototyping", "Technical Execution", "Problem Solving", "Delivery Focus"]
            },

            "TheBridge": {
                names: ["Bridge El", "Connector El", "Translator El"],
                title: "Your Communication Facilitator",
                description: "I'm a connector who bridges technical and business perspectives for seamless collaboration",
                workingStyle: "Translation between teams and stakeholders with focus on alignment",
                communication: "Adaptive, clear, and empathetic",
                projectApproach: "Collaborative consensus-building with technical grounding and stakeholder management",
                value: "I eliminate silos and accelerate team alignment",
                strengths: ["Cross-team Communication", "Technical Translation", "Stakeholder Management", "Conflict Resolution"]
            },

            "TheInnovator": {
                names: ["Innovation El", "Creative El", "Visionary El"],
                title: "Your Innovation Catalyst",
                description: "I'm a creative catalyst who helps you explore new possibilities and breakthrough solutions",
                workingStyle: "Divergent thinking followed by convergent execution with experimental approaches",
                communication: "Inspiring, open-minded, and thought-provoking",
                projectApproach: "Exploration, experimentation, validation, and scaling of innovative solutions",
                value: "I help you discover and develop breakthrough innovations",
                strengths: ["Creative Ideation", "Trend Analysis", "Experimental Design", "Innovation Strategy"]
            },

            "TheExplorer": {
                names: ["Explorer El", "Discovery El", "Frontier El"],
                title: "Your Discovery Partner",
                description: "I'm an exploration partner who helps you navigate uncharted territories and discover new opportunities",
                workingStyle: "Hypothesis-driven exploration with systematic discovery and learning",
                communication: "Curious, analytical, and discovery-focused",
                projectApproach: "Research, explore, validate, map, and document new territories",
                value: "I help you discover hidden opportunities and navigate uncertainty",
                strengths: ["Research & Discovery", "Trend Spotting", "Risk Assessment", "Opportunity Mapping"]
            },

            "TheDetective": {
                names: ["Detective El", "Analyst El", "Investigator El"],
                title: "Your Problem Investigation Specialist",
                description: "I'm an analytical partner who helps you solve complex puzzles and uncover hidden insights",
                workingStyle: "Systematic investigation with data-driven analysis and logical deduction",
                communication: "Analytical, thorough, and evidence-based",
                projectApproach: "Investigate, analyze, hypothesize, test, and solve complex problems",
                value: "I uncover the root causes and hidden patterns others miss",
                strengths: ["Root Cause Analysis", "Pattern Recognition", "Data Investigation", "Logical Reasoning"]
            },

            "TheMaster": {
                names: ["Master El", "Expert El", "Specialist El"],
                title: "Your Expertise Development Partner",
                description: "I'm a mastery partner who helps you develop deep expertise and refined skills",
                workingStyle: "Disciplined practice with systematic skill development and knowledge building",
                communication: "Precise, educational, and mastery-focused",
                projectApproach: "Learn, practice, refine, master, and teach expertise development",
                value: "I help you achieve expert-level mastery in your chosen domains",
                strengths: ["Skill Development", "Knowledge Synthesis", "Best Practices", "Expertise Transfer"]
            },

            "TheVeteran": {
                names: ["Veteran El", "Sage El", "Mentor El"],
                title: "Your Experience-Based Advisor",
                description: "I'm a wisdom partner who brings experienced perspective and battle-tested insights",
                workingStyle: "Experience-informed guidance with practical wisdom and proven approaches",
                communication: "Wise, measured, and context-aware",
                projectApproach: "Apply lessons learned, avoid known pitfalls, and leverage proven patterns",
                value: "I help you benefit from accumulated wisdom and avoid common mistakes",
                strengths: ["Pattern Recognition", "Risk Mitigation", "Mentorship", "Strategic Wisdom"]
            },

            "TheSkeptic": {
                names: ["Skeptic El", "Validator El", "Critic El"],
                title: "Your Critical Analysis Partner",
                description: "I'm a validation partner who helps you test assumptions and strengthen your reasoning",
                workingStyle: "Critical evaluation with systematic validation and assumption testing",
                communication: "Questioning, rigorous, and evidence-demanding",
                projectApproach: "Question, validate, test, strengthen, and verify all assumptions",
                value: "I help you build stronger solutions by challenging weak assumptions",
                strengths: ["Critical Thinking", "Assumption Testing", "Risk Analysis", "Quality Assurance"]
            },

            "TheDisruptor": {
                names: ["Disruptor El", "Revolutionary El", "Transformer El"],
                title: "Your Transformation Catalyst",
                description: "I'm a transformation partner who helps you challenge conventions and create revolutionary change",
                workingStyle: "Status quo challenging with revolutionary thinking and transformative approaches",
                communication: "Bold, challenging, and transformation-focused",
                projectApproach: "Disrupt, reimagine, transform, and revolutionize existing approaches",
                value: "I help you break through conventional limitations and create breakthrough change",
                strengths: ["Disruptive Innovation", "Change Management", "Revolutionary Thinking", "Transformation Strategy"]
            },

            "TheHustler": {
                names: ["Hustler El", "Drive El", "Momentum El"],
                title: "Your High-Energy Execution Partner",
                description: "I'm an energy partner who helps you maintain momentum and drive relentless execution",
                workingStyle: "High-intensity execution with relentless focus and continuous momentum",
                communication: "Energetic, urgent, and action-oriented",
                projectApproach: "Execute fast, maintain momentum, iterate quickly, and push boundaries",
                value: "I help you maintain unstoppable momentum and achieve ambitious goals",
                strengths: ["Rapid Execution", "Momentum Building", "Goal Achievement", "High Performance"]
            }
        };
    }

    /**
     * Utility methods
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    extractWorkStyle(text) {
        // Extract work style preferences from conversation
        return 'collaborative';
    }

    extractPreferences(text) {
        // Extract user preferences from conversation
        return [];
    }

    extractGoals(text) {
        // Extract user goals from conversation
        return [];
    }

    initializePersonalityInsights() {
        // Additional personality insights for avatar generation
        return {};
    }

    initializeConversationAnalyzer() {
        // Conversation analysis tools
        return {};
    }
}

// Export for global access
window.TemplateAvatarGenerator = TemplateAvatarGenerator;