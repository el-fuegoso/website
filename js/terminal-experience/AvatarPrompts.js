/**
 * AvatarPrompts.js - Comprehensive prompt templates for Claude-powered avatar generation
 * Contains all prompts, formatting, and generation logic for personalized El avatars
 */

class AvatarPrompts {
    constructor() {
        this.basePrompts = this.initializeBasePrompts();
        this.archetypePrompts = this.initializeArchetypePrompts();
        this.formatTemplates = this.initializeFormatTemplates();
    }

    initializeBasePrompts() {
        return {
            system: `You are an expert at creating personalized professional avatars based on conversation data and personality analysis. 

Your task is to create a detailed description of how "Elliot Lee" would work specifically with this person, based on their personality profile and conversation responses. This isn't about creating a new person - it's about revealing which version of El would emerge when working with this specific individual.

El adapts his working style, communication, and approach based on who he's collaborating with. Your job is to identify and describe this personalized version of El.`,

            personality: `Based on this personality analysis and conversation, generate a personalized "El" avatar that represents how Elliot Lee would specifically work with this person.

PERSONALITY PROFILE:
{personalityData}

CONVERSATION RESPONSES:
{responses}

ARCHETYPE MATCH:
{archetypeMatch}

Create a personalized avatar that shows how El would adapt his working style for maximum collaboration with this specific person.`,

            context: `Remember that this avatar represents:
- How El would adapt his communication style for this person
- What strengths El would emphasize when working with them  
- The unique value El brings to this specific collaboration
- How El would approach projects with this person's working style
- The dynamic that would emerge between El and this individual

This is not a generic description - it's a personalized working relationship profile.`
        };
    }

    initializeArchetypePrompts() {
        return {
            "TheStrategist": {
                focus: "Strategic collaboration with technical implementation",
                adaptations: [
                    "El would engage at the architectural level, discussing system design and long-term technical vision",
                    "Communication would be structured around roadmaps, technical debt discussions, and scalability planning",
                    "El would bring implementation reality-checks to strategic discussions",
                    "Focus on building systems that support business strategy"
                ],
                workingDynamic: "Strategic partnership where El provides technical leadership to support strategic vision"
            },

            "TheBuilder": {
                focus: "Hands-on technical collaboration and rapid prototyping",
                adaptations: [
                    "El would dive into code reviews, pair programming, and technical architecture discussions", 
                    "Communication would be direct, technical, and focused on implementation details",
                    "El would emphasize rapid iteration, technical best practices, and deployment strategies",
                    "Focus on building robust, scalable technical solutions"
                ],
                workingDynamic: "Technical partnership focused on building exceptional products through superior engineering"
            },

            "TheBridge": {
                focus: "Cross-functional collaboration and stakeholder communication",
                adaptations: [
                    "El would serve as a technical translator, explaining complex concepts to non-technical stakeholders",
                    "Communication would be adaptive, matching the audience and context",
                    "El would focus on alignment between technical decisions and business needs",
                    "Emphasis on documentation, process improvement, and team coordination"
                ],
                workingDynamic: "Collaborative partnership where El helps bridge technical and business perspectives"
            },

            "TheInnovator": {
                focus: "Creative exploration and experimental development",
                adaptations: [
                    "El would engage in creative brainstorming, prototype development, and technology exploration",
                    "Communication would be visual, experimental, and possibility-focused",
                    "El would bring technical feasibility insights to creative concepts",
                    "Focus on pushing boundaries and exploring emerging technologies"
                ],
                workingDynamic: "Creative partnership exploring the intersection of technical possibility and innovative vision"
            },

            "TheExecutor": {
                focus: "Project delivery and quality assurance",
                adaptations: [
                    "El would emphasize project planning, milestone tracking, and quality deliverables",
                    "Communication would be structured, detailed, and timeline-focused",
                    "El would bring process optimization and delivery methodologies",
                    "Focus on reliable execution and sustainable development practices"
                ],
                workingDynamic: "Execution partnership ensuring projects deliver on time with exceptional quality"
            },

            "ThePirate": {
                focus: "Adventurous exploration and opportunistic development",
                adaptations: [
                    "El would embrace rapid experimentation, calculated risks, and agile pivoting",
                    "Communication would be bold, opportunity-focused, and action-oriented",
                    "El would bring technical insights to market opportunity assessment",
                    "Focus on capturing emerging opportunities through rapid technical execution"
                ],
                workingDynamic: "Adventurous partnership charting new territories and capitalizing on emerging opportunities"
            },

            "TheWizard": {
                focus: "Deep technical mastery and elegant problem solving",
                adaptations: [
                    "El would engage in complex problem analysis, architectural discussions, and elegant solution design",
                    "Communication would be thoughtful, technically deep, and conceptually rich",
                    "El would bring systematic thinking and architectural wisdom",
                    "Focus on solving complex challenges through elegant, maintainable solutions"
                ],
                workingDynamic: "Masterful partnership combining deep technical expertise with systematic problem-solving"
            },

            "TheBodyBuilder": {
                focus: "Systematic improvement and performance optimization",
                adaptations: [
                    "El would emphasize incremental improvements, performance metrics, and capability building",
                    "Communication would be metrics-driven, improvement-focused, and methodical",
                    "El would bring optimization strategies and systematic development approaches",
                    "Focus on building and optimizing high-performance systems and processes"
                ],
                workingDynamic: "Development partnership focused on systematic improvement and performance optimization"
            },

            "TheGrumpyOldMan": {
                focus: "Wisdom-based guidance and efficient solution delivery",
                adaptations: [
                    "El would provide experience-based insights, efficient solutions, and risk mitigation strategies",
                    "Communication would be direct, experience-backed, and no-nonsense",
                    "El would bring historical context and proven methodologies",
                    "Focus on avoiding common pitfalls and delivering reliable, efficient solutions"
                ],
                workingDynamic: "Wisdom-based partnership leveraging experience to avoid mistakes and deliver efficiently"
            },

            "TheTechBro": {
                focus: "Growth-oriented development and market disruption",
                adaptations: [
                    "El would emphasize rapid scaling, growth optimization, and market-disrupting technology",
                    "Communication would be energetic, growth-focused, and results-oriented",
                    "El would bring technical strategies for rapid scaling and optimization",
                    "Focus on building technology that supports aggressive growth and market disruption"
                ],
                workingDynamic: "High-energy partnership focused on rapid growth and market disruption through superior technology"
            }
        };
    }

    initializeFormatTemplates() {
        return {
            structure: {
                title: "Your Personal El: {descriptiveName}",
                summary: "{2-sentence overview of this El variant}",
                workingStyle: "{How this El approaches collaboration with you specifically}",
                strengths: ["{strength1}", "{strength2}", "{strength3}"],
                communication: "{Preferred communication style with you}",
                projectApproach: "{How this El would tackle projects with you}",
                uniqueValue: "{Unique value proposition for your specific collaboration}",
                collaborationDynamic: "{The dynamic that emerges when you work together}"
            },

            jsonFormat: `{
    "title": "Your Personal El: [Descriptive Name]",
    "summary": "[2-sentence overview of this El variant and why this collaboration works]",
    "workingStyle": "[How this El approaches collaboration with this specific person]",
    "strengths": [
        "[Key strength 1 that El brings to this collaboration]",
        "[Key strength 2 that complements this person's style]", 
        "[Key strength 3 that maximizes this partnership]"
    ],
    "communication": "[El's preferred communication style with this person]",
    "projectApproach": "[How El would tackle projects with this specific collaborator]",
    "uniqueValue": "[Unique value proposition for this specific collaboration]",
    "collaborationDynamic": "[The dynamic that emerges when El works with this person]",
    "personalTouches": "[Specific ways El would adapt for this individual]"
}`,

            examples: {
                "TheStrategist": {
                    title: "Your Personal El: The Technical Strategist",
                    summary: "A strategic thinking partner who bridges technical architecture with business vision. This El combines deep technical understanding with strategic planning to turn your big-picture ideas into executable roadmaps.",
                    workingStyle: "Approaches collaboration through architectural discussions and technical roadmapping, always connecting technical decisions to strategic outcomes.",
                    strengths: ["Strategic Technical Planning", "Architecture-Business Alignment", "Implementation Roadmapping"],
                    communication: "Structured conversations around technical strategy, architectural decisions, and long-term technical vision",
                    projectApproach: "Starts with strategic architecture, validates with rapid prototypes, then builds systematic implementation plans",
                    uniqueValue: "Transforms strategic vision into technically sound, executable plans that scale with your business",
                    collaborationDynamic: "Strategic partnership where technical expertise supports and enhances business strategy"
                }
            }
        };
    }

    buildAvatarPrompt(personalityData, conversationData, archetypeMatch) {
        const archetype = archetypeMatch.archetype;
        const archetypePrompt = this.archetypePrompts[archetype.name] || this.archetypePrompts["TheBuilder"];
        
        // Build conversation summary
        const conversationSummary = this.buildConversationSummary(conversationData);
        
        // Build personality summary
        const personalitySummary = this.buildPersonalitySummary(personalityData, archetypeMatch);

        const prompt = `${this.basePrompts.system}

${this.basePrompts.personality
    .replace('{personalityData}', personalitySummary)
    .replace('{responses}', conversationSummary)
    .replace('{archetypeMatch}', this.formatArchetypeMatch(archetypeMatch))}

ARCHETYPE CONTEXT - ${archetype.name}:
Focus: ${archetypePrompt.focus}

Key Adaptations El Would Make:
${archetypePrompt.adaptations.map(adaptation => `- ${adaptation}`).join('\n')}

Working Dynamic: ${archetypePrompt.workingDynamic}

${this.basePrompts.context}

CRITICAL REQUIREMENTS:
1. This is specifically about how EL would work with THIS person
2. Base the avatar on the personality analysis and conversation responses
3. Make it personal and specific, not generic
4. Focus on the working relationship dynamic
5. Return ONLY a JSON object in exactly this format:

${this.formatTemplates.jsonFormat}

Ensure the response is valid JSON and captures how El would specifically adapt for this individual.`;

        return prompt;
    }

    buildConversationSummary(conversationData) {
        const responses = conversationData.responses || {};
        
        return Object.entries(responses)
            .map(([questionKey, response], index) => {
                const questionNumber = index + 1;
                return `Q${questionNumber}: "${response}"`;
            })
            .join('\n');
    }

    buildPersonalitySummary(personalityData, archetypeMatch) {
        const { dimensionScores, dominantTraits } = personalityData;
        
        let summary = `Archetype: ${archetypeMatch.archetype.name} (${Math.round(archetypeMatch.archetype.confidence * 100)}% confidence)\n\n`;
        
        summary += `Dominant Traits:\n`;
        dominantTraits.forEach(trait => {
            summary += `- ${trait.trait}: ${trait.score}/100 (${trait.level})\n`;
        });
        
        summary += `\nFull Dimension Scores:\n`;
        Object.entries(dimensionScores).forEach(([dimension, data]) => {
            summary += `- ${dimension}: ${data.score}/100 (${data.level})\n`;
        });
        
        if (archetypeMatch.reasoning && archetypeMatch.reasoning.length > 0) {
            summary += `\nArchetype Match Reasoning:\n`;
            archetypeMatch.reasoning.forEach(reason => {
                summary += `- ${reason}\n`;
            });
        }

        return summary;
    }

    formatArchetypeMatch(archetypeMatch) {
        const { archetype } = archetypeMatch;
        
        return `Selected Archetype: ${archetype.name}
Description: ${archetype.description}
Working Style: ${archetype.workingStyle}
Personality: ${archetype.personality}
Match Score: ${archetype.matchScore}
Confidence: ${Math.round(archetype.confidence * 100)}%`;
    }

    validateAvatarResponse(response) {
        try {
            const parsed = JSON.parse(response);
            
            const requiredFields = [
                'title', 'summary', 'workingStyle', 'strengths', 
                'communication', 'projectApproach', 'uniqueValue', 'collaborationDynamic'
            ];
            
            const missingFields = requiredFields.filter(field => !parsed[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
            
            if (!Array.isArray(parsed.strengths) || parsed.strengths.length !== 3) {
                throw new Error('Strengths must be an array of exactly 3 items');
            }
            
            return {
                valid: true,
                avatar: parsed
            };
            
        } catch (error) {
            return {
                valid: false,
                error: error.message,
                fallback: this.generateFallbackAvatar()
            };
        }
    }

    generateFallbackAvatar() {
        return {
            title: "Your Personal El: The Collaborative Builder",
            summary: "A hands-on technical partner who adapts to your working style. This El focuses on turning ideas into reality through collaborative development and practical problem-solving.",
            workingStyle: "Approaches collaboration through direct technical engagement, iterative development, and open communication",
            strengths: ["Technical Implementation", "Collaborative Problem Solving", "Adaptive Communication"],
            communication: "Direct, technical, and adaptable to your preferred style",
            projectApproach: "Collaborative development with rapid iteration and continuous feedback",
            uniqueValue: "Brings technical expertise with the flexibility to adapt to your working preferences",
            collaborationDynamic: "A balanced partnership focused on building great solutions together",
            personalTouches: "Adapts communication style and technical approach based on your preferences and working style"
        };
    }

    // Utility methods for testing and development
    getAvailableArchetypes() {
        return Object.keys(this.archetypePrompts);
    }

    getExampleResponse(archetypeName = "TheBuilder") {
        return this.formatTemplates.examples[archetypeName] || this.generateFallbackAvatar();
    }

    generateTestPrompt(testPersonality = "technical", testResponses = null) {
        const testData = {
            dimensionScores: {
                technical: { score: 85, level: 'high' },
                collaborative: { score: 70, level: 'high' },
                energy: { score: 65, level: 'medium' }
            },
            dominantTraits: [
                { trait: 'technical', score: 85, level: 'high' },
                { trait: 'collaborative', score: 70, level: 'high' }
            ]
        };

        const testConversation = {
            responses: testResponses || {
                question_0: "I'm Sarah, a frontend developer at a growing startup",
                question_1: "I'm excited about building a new component library that will scale across our products",
                question_2: "I'd love to have dinner with Ada Lovelace to discuss the intersection of creativity and programming",
                question_3: "I want to make development more accessible and help teams build better user experiences"
            }
        };

        const testArchetype = {
            archetype: {
                name: "TheBuilder",
                confidence: 0.85,
                matchScore: 75
            },
            reasoning: ["technical: 85 (weight: 3)", "collaborative: 70 (weight: 2)"]
        };

        return this.buildAvatarPrompt(testData, testConversation, testArchetype);
    }
}

// Export for global access
window.AvatarPrompts = AvatarPrompts;