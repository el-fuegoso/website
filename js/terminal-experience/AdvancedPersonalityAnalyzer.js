/**
 * AdvancedPersonalityAnalyzer.js - Enhanced personality analysis for avatar generation
 * Extends the basic DataCollector with sophisticated psychological profiling
 */

class AdvancedPersonalityAnalyzer extends DataCollector {
    constructor() {
        super();
        this.dimensions = this.initializeAdvancedDimensions();
        this.avatarArchetypes = this.initializeAvatarArchetypes();
    }

    initializeAdvancedDimensions() {
        return {
            // Core personality dimensions
            energy: {
                keywords: ['excited', 'energetic', 'fast', 'quick', 'rapid', 'active', 'dynamic', 'intensive', 'high-energy', 'bustling'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            creativity: {
                keywords: ['creative', 'design', 'art', 'innovative', 'unique', 'original', 'imaginative', 'artistic', 'inventive', 'novel'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            technical: {
                keywords: ['code', 'programming', 'software', 'development', 'engineer', 'tech', 'algorithm', 'data', 'system', 'API', 'database', 'architecture'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            collaborative: {
                keywords: ['collaborate', 'work together', 'team', 'partnership', 'community', 'group', 'communicate', 'share', 'together', 'cooperation'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            leadership: {
                keywords: ['lead', 'manage', 'team', 'organize', 'coordinate', 'director', 'manager', 'founder', 'strategy', 'decision', 'guide'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            innovation: {
                keywords: ['innovation', 'new', 'future', 'cutting edge', 'revolutionary', 'breakthrough', 'disrupt', 'transform', 'pioneer', 'advance'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },

            // Extended dimensions for avatar archetypes
            adventure: {
                keywords: ['explore', 'risk', 'unknown', 'adventure', 'bold', 'challenge', 'discover', 'venture', 'frontier', 'uncharted'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            mystery: {
                keywords: ['complex', 'deep', 'understand', 'solve', 'figure out', 'analyze', 'investigate', 'research', 'puzzle', 'intricate'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            discipline: {
                keywords: ['consistent', 'routine', 'practice', 'improve', 'training', 'methodology', 'systematic', 'structured', 'process', 'disciplined'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            persistence: {
                keywords: ['never give up', 'keep going', 'persevere', 'push through', 'determined', 'resilient', 'persistent', 'tenacious', 'dedicated'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            experience: {
                keywords: ['years', 'learned', 'seen', 'before', 'veteran', 'experienced', 'seasoned', 'mature', 'wisdom', 'knowledge'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            skepticism: {
                keywords: ['doubt', 'question', 'prove', 'skeptical', 'critical', 'careful', 'cautious', 'verify', 'validate', 'challenge'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            disruption: {
                keywords: ['disrupt', 'change', 'revolution', 'transform', 'break', 'shake up', 'reimagine', 'reinvent', 'overthrow', 'radical'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            hustle: {
                keywords: ['grind', 'hustle', 'work hard', 'non-stop', 'always on', 'intense', 'driven', 'ambitious', 'relentless', 'focused'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            }
        };
    }

    initializeAvatarArchetypes() {
        return {
            "TheStrategist": {
                triggers: { 
                    leadership: { min: 60, weight: 3 }, 
                    technical: { min: 40, weight: 2 }, 
                    innovation: { min: 50, weight: 2 } 
                },
                description: "Strategic thinking with technical understanding",
                workingStyle: "Big picture planning with implementation awareness",
                personality: "Visionary leader who bridges strategy and execution",
                strengths: ["Strategic Planning", "Technical Architecture", "Innovation Leadership"],
                communication: "Clear, structured, and goal-oriented",
                projectApproach: "Top-down strategy with iterative execution",
                value: "Transforms complex challenges into actionable roadmaps"
            },
            
            "TheBuilder": {
                triggers: { 
                    technical: { min: 70, weight: 3 }, 
                    energy: { min: 60, weight: 2 }, 
                    collaborative: { min: 40, weight: 1 } 
                },
                description: "Hands-on implementation with rapid execution",
                workingStyle: "Prototype-first approach with iterative improvement",
                personality: "Pragmatic maker who turns ideas into reality",
                strengths: ["Rapid Prototyping", "Technical Execution", "Problem Solving"],
                communication: "Direct, practical, and solution-focused",
                projectApproach: "Build, test, iterate, ship",
                value: "Delivers working solutions faster than expected"
            },
            
            "TheBridge": {
                triggers: { 
                    collaborative: { min: 70, weight: 3 }, 
                    technical: { min: 40, weight: 2 }, 
                    leadership: { min: 30, weight: 1 } 
                },
                description: "Connects technical and business perspectives",
                workingStyle: "Translation between teams and stakeholders",
                personality: "Natural communicator who speaks everyone's language",
                strengths: ["Cross-team Communication", "Technical Translation", "Stakeholder Management"],
                communication: "Adaptive, clear, and empathetic",
                projectApproach: "Collaborative consensus-building with technical grounding",
                value: "Eliminates silos and accelerates team alignment"
            },
            
            "TheInnovator": {
                triggers: { 
                    creativity: { min: 70, weight: 3 }, 
                    innovation: { min: 60, weight: 3 }, 
                    energy: { min: 50, weight: 2 } 
                },
                description: "Cutting-edge exploration and creative problem solving",
                workingStyle: "Experimental approaches with rapid iteration",
                personality: "Visionary creator who sees possibilities others miss",
                strengths: ["Creative Problem Solving", "Emerging Technologies", "Design Thinking"],
                communication: "Inspiring, visual, and possibility-focused",
                projectApproach: "Divergent exploration followed by convergent execution",
                value: "Discovers breakthrough solutions through creative experimentation"
            },
            
            "TheExecutor": {
                triggers: { 
                    technical: { min: 60, weight: 2 }, 
                    discipline: { min: 60, weight: 3 }, 
                    persistence: { min: 50, weight: 2 } 
                },
                description: "Reliable delivery with technical excellence",
                workingStyle: "Structured execution with quality focus",
                personality: "Dependable professional who delivers on promises",
                strengths: ["Project Delivery", "Quality Assurance", "Process Optimization"],
                communication: "Structured, detailed, and results-oriented",
                projectApproach: "Methodical planning with consistent execution",
                value: "Ensures projects ship on time with exceptional quality"
            },
            
            "ThePirate": {
                triggers: { 
                    adventure: { min: 70, weight: 3 }, 
                    innovation: { min: 50, weight: 2 }, 
                    energy: { min: 60, weight: 2 } 
                },
                description: "Bold exploration of uncharted territories with calculated risks",
                workingStyle: "Agile treasure hunting - quick pivots to capitalize on opportunities",
                personality: "Arr! Charts a course through uncertain waters with confidence and swagger",
                strengths: ["Risk Assessment", "Opportunity Recognition", "Agile Execution"],
                communication: "Bold, adventurous, and opportunity-focused",
                projectApproach: "Rapid exploration with strategic risk-taking",
                value: "Discovers untapped markets and breakthrough opportunities"
            },
            
            "TheWizard": {
                triggers: { 
                    creativity: { min: 60, weight: 2 }, 
                    technical: { min: 70, weight: 3 }, 
                    mystery: { min: 60, weight: 2 } 
                },
                description: "Deep technical mastery combined with mystical problem-solving approaches",
                workingStyle: "Conjures elegant solutions from complex requirements using ancient wisdom and modern magic",
                personality: "Wise sage who transforms impossible challenges into breakthrough innovations",
                strengths: ["Technical Mastery", "Complex Problem Solving", "Elegant Architecture"],
                communication: "Thoughtful, deep, and metaphor-rich",
                projectApproach: "Deep analysis followed by elegant, seemingly magical solutions",
                value: "Solves the 'impossible' problems others can't even understand"
            },
            
            "TheBodyBuilder": {
                triggers: { 
                    discipline: { min: 70, weight: 3 }, 
                    persistence: { min: 70, weight: 3 }, 
                    energy: { min: 50, weight: 1 } 
                },
                description: "Methodical strength building through consistent, progressive effort",
                workingStyle: "No-pain, no-gain approach - incremental improvements compound into massive results",
                personality: "Relentlessly optimizes processes and teams for maximum performance gains",
                strengths: ["Process Optimization", "Team Development", "Performance Improvement"],
                communication: "Motivational, metrics-driven, and improvement-focused",
                projectApproach: "Systematic capability building with measurable progress",
                value: "Transforms teams and processes into high-performance machines"
            },
            
            "TheGrumpyOldMan": {
                triggers: { 
                    experience: { min: 70, weight: 3 }, 
                    skepticism: { min: 60, weight: 2 }, 
                    technical: { min: 50, weight: 1 } 
                },
                description: "Battle-tested veteran who's seen every mistake and learned from all of them",
                workingStyle: "Cuts through BS with decades of hard-won wisdom and zero tolerance for inefficiency",
                personality: "Gruff exterior hiding deep expertise - will grumble while delivering exactly what you need",
                strengths: ["Risk Mitigation", "Architecture Wisdom", "Efficient Solutions"],
                communication: "Direct, no-nonsense, and experience-backed",
                projectApproach: "Prevents disasters through hard-earned wisdom",
                value: "Saves projects from repeating expensive historical mistakes"
            },
            
            "TheTechBro": {
                triggers: { 
                    disruption: { min: 60, weight: 2 }, 
                    hustle: { min: 70, weight: 3 }, 
                    innovation: { min: 50, weight: 2 } 
                },
                description: "Moves fast, breaks things, and builds the future with infectious enthusiasm",
                workingStyle: "Leverages synergies to scale solutions and disrupt industries at 10x velocity",
                personality: "Optimizes everything for growth hacking and maximum impact - always ready to pivot",
                strengths: ["Growth Hacking", "Rapid Scaling", "Market Disruption"],
                communication: "Energetic, buzzword-rich, and growth-focused",
                projectApproach: "MVP fast, scale faster, disrupt the market",
                value: "Accelerates growth through aggressive optimization and market disruption"
            }
        };
    }

    analyzeAdvancedPersonality(responses) {
        const combinedText = Object.values(responses).join(' ').toLowerCase();
        const dimensionScores = {};
        
        // Calculate scores for each personality dimension
        Object.entries(this.dimensions).forEach(([dimension, config]) => {
            let score = 0;
            let matchCount = 0;
            
            config.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = combinedText.match(regex) || [];
                if (matches.length > 0) {
                    score += matches.length * config.weights.high;
                    matchCount += matches.length;
                }
            });
            
            // Normalize score to 0-100 scale
            const normalizedScore = Math.min(100, (score / Math.max(1, combinedText.split(' ').length)) * 1000);
            
            dimensionScores[dimension] = {
                score: Math.round(normalizedScore),
                matchCount,
                level: this.categorizeScore(normalizedScore, config.scoring)
            };
        });
        
        return dimensionScores;
    }

    categorizeScore(score, scoring) {
        if (score >= scoring.threshold_high) return 'high';
        if (score >= scoring.threshold_medium) return 'medium';
        return 'low';
    }

    identifyAvatarArchetype(dimensionScores) {
        let bestMatch = null;
        let bestScore = 0;
        let matchReasons = [];
        
        Object.entries(this.avatarArchetypes).forEach(([archetypeName, archetype]) => {
            let archetypeScore = 0;
            let meetsRequirements = true;
            let currentReasons = [];
            
            Object.entries(archetype.triggers).forEach(([dimension, requirements]) => {
                const userScore = dimensionScores[dimension]?.score || 0;
                
                if (userScore >= requirements.min) {
                    const contributionScore = userScore * requirements.weight;
                    archetypeScore += contributionScore;
                    currentReasons.push(`${dimension}: ${userScore} (weight: ${requirements.weight})`);
                } else {
                    meetsRequirements = false;
                }
            });
            
            if (meetsRequirements && archetypeScore > bestScore) {
                bestScore = archetypeScore;
                bestMatch = {
                    name: archetypeName,
                    ...archetype,
                    matchScore: Math.round(archetypeScore),
                    confidence: this.calculateConfidence(archetypeScore, dimensionScores)
                };
                matchReasons = currentReasons;
            }
        });
        
        // Fallback to Builder if no archetype matches
        if (!bestMatch) {
            bestMatch = {
                name: "TheBuilder",
                ...this.avatarArchetypes["TheBuilder"],
                matchScore: 50,
                confidence: 0.6
            };
            matchReasons = ["Default fallback - Builder archetype"];
        }
        
        return {
            archetype: bestMatch,
            reasoning: matchReasons,
            alternativeMatches: this.findAlternativeMatches(dimensionScores, bestMatch.name)
        };
    }

    calculateConfidence(score, dimensionScores) {
        const totalPossibleScore = Object.keys(dimensionScores).length * 100 * 3; // max weight is 3
        const confidence = Math.min(1, score / (totalPossibleScore * 0.3)); // 30% of max = high confidence
        return Math.round(confidence * 100) / 100;
    }

    findAlternativeMatches(dimensionScores, excludeArchetype) {
        const alternatives = [];
        
        Object.entries(this.avatarArchetypes).forEach(([archetypeName, archetype]) => {
            if (archetypeName === excludeArchetype) return;
            
            let partialScore = 0;
            let metRequirements = 0;
            
            Object.entries(archetype.triggers).forEach(([dimension, requirements]) => {
                const userScore = dimensionScores[dimension]?.score || 0;
                if (userScore >= requirements.min * 0.7) { // 70% threshold for alternatives
                    partialScore += userScore * requirements.weight;
                    metRequirements++;
                }
            });
            
            if (metRequirements >= Object.keys(archetype.triggers).length * 0.5) { // At least 50% requirements
                alternatives.push({
                    name: archetypeName,
                    score: partialScore,
                    description: archetype.description
                });
            }
        });
        
        return alternatives
            .sort((a, b) => b.score - a.score)
            .slice(0, 2); // Top 2 alternatives
    }

    generatePersonalityInsights(responses, userName) {
        const dimensionScores = this.analyzeAdvancedPersonality(responses);
        const archetypeMatch = this.identifyAvatarArchetype(dimensionScores);
        const basicAnalysis = super.analyzePersonality(responses); // Use parent class method
        
        return {
            userName: userName || super.extractUserName(responses.question_0 || ''),
            dimensionScores,
            archetype: archetypeMatch,
            basicKeywords: basicAnalysis.keywords,
            dominantTraits: this.getDominantTraits(dimensionScores),
            personalityOverview: this.generatePersonalityOverview(dimensionScores, archetypeMatch),
            timestamp: new Date().toISOString()
        };
    }

    getDominantTraits(dimensionScores) {
        return Object.entries(dimensionScores)
            .filter(([_, data]) => data.level === 'high')
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, 3)
            .map(([dimension, data]) => ({
                trait: dimension,
                score: data.score,
                level: data.level
            }));
    }

    generatePersonalityOverview(dimensionScores, archetypeMatch) {
        const highScores = Object.entries(dimensionScores)
            .filter(([_, data]) => data.level === 'high')
            .map(([dimension, _]) => dimension);
        
        let overview = `You exhibit strong ${highScores.join(', ')} characteristics`;
        
        if (archetypeMatch.archetype.confidence > 0.7) {
            overview += `, making you a natural ${archetypeMatch.archetype.name}.`;
        } else {
            overview += `, with elements of ${archetypeMatch.archetype.name}.`;
        }
        
        return overview;
    }

    exportAvatarData(responses, userName) {
        const personalityInsights = this.generatePersonalityInsights(responses, userName);
        
        return {
            version: '2.0',
            timestamp: new Date().toISOString(),
            userProfile: {
                name: personalityInsights.userName,
                responses,
                personality: personalityInsights,
                avatarReady: true
            }
        };
    }
}

// Export for global access
window.AdvancedPersonalityAnalyzer = AdvancedPersonalityAnalyzer;