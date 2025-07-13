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
            },
            
            // Additional dimensions for new characters
            analytical: {
                keywords: ['analyze', 'data', 'research', 'study', 'examine', 'investigate', 'logical', 'systematic', 'methodical', 'detailed'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            curiosity: {
                keywords: ['curious', 'wonder', 'why', 'how', 'learn', 'discover', 'explore', 'question', 'interested', 'fascinated'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            traditional: {
                keywords: ['old', 'classic', 'traditional', 'proven', 'established', 'conventional', 'standard', 'reliable', 'stable', 'time-tested'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            enthusiasm: {
                keywords: ['excited', 'passionate', 'love', 'enthusiastic', 'amazing', 'awesome', 'fantastic', 'incredible', 'pumped', 'thrilled'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            speed: {
                keywords: ['fast', 'quick', 'rapid', 'immediate', 'instant', 'urgent', 'asap', 'now', 'quickly', 'speedy'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            fitness: {
                keywords: ['gym', 'workout', 'exercise', 'training', 'fitness', 'health', 'strong', 'muscle', 'athletic', 'physical'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            optimization: {
                keywords: ['optimize', 'improve', 'better', 'efficient', 'performance', 'enhance', 'refactor', 'streamline', 'maximize', 'perfect'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            experimental: {
                keywords: ['experiment', 'try', 'test', 'explore', 'unusual', 'different', 'weird', 'unique', 'unconventional', 'creative'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            intensity: {
                keywords: ['intense', 'hardcore', 'extreme', 'maximum', 'full-on', 'all-out', 'passionate', 'committed', 'focused', 'dedicated'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            focus: {
                keywords: ['focus', 'concentrate', 'attention', 'detail', 'precision', 'careful', 'thorough', 'meticulous', 'mindful', 'deliberate'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            paranoia: {
                keywords: ['suspicious', 'careful', 'paranoid', 'cautious', 'watching', 'monitoring', 'tracking', 'security', 'protection', 'alert'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            patterns: {
                keywords: ['pattern', 'connection', 'relate', 'link', 'network', 'system', 'structure', 'relationship', 'correlation', 'dependency'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            futuristic: {
                keywords: ['future', 'ai', 'robot', 'automation', 'digital', 'virtual', 'cyber', 'tech', 'artificial', 'machine'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            procrastination: {
                keywords: ['later', 'tomorrow', 'postpone', 'delay', 'wait', 'eventually', 'someday', 'procrastinate', 'lazy', 'put off'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            lastminute: {
                keywords: ['deadline', 'last minute', 'pressure', 'rush', 'emergency', 'urgent', 'crunch', 'squeeze', 'tight', 'hurry'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            buzzwords: {
                keywords: ['scale', 'synergy', 'leverage', 'disrupt', 'innovative', 'cutting-edge', 'revolutionary', 'paradigm', 'optimize', 'streamline'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            },
            
            scaling: {
                keywords: ['scale', 'growth', 'expand', 'bigger', 'massive', 'huge', 'enterprise', 'global', 'worldwide', 'multiply'],
                weights: { high: 2, medium: 1, contextual: 0.5 },
                scoring: { threshold_high: 70, threshold_medium: 40 }
            }
        };
    }

    initializeAvatarArchetypes() {
        return {
            "TheBuilder": {
                triggers: { 
                    technical: { min: 60, weight: 3 }, 
                    energy: { min: 50, weight: 2 }, 
                    creativity: { min: 40, weight: 1 } 
                },
                description: "I'm basically a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools",
                workingStyle: "Code first, ask questions later, debug by vibes",
                personality: "Chaos Engineering Specialist",
                strengths: ["Rubber Duck Debugging", "Coffee-Powered Coding", "Semicolon Opinions", "Side Project Management"],
                communication: "Speaks exclusively in programming memes and frustrated sighs",
                projectApproach: "Just ship it and see what explodes",
                value: "I can build anything with enough energy drinks and spite"
            },
            
            "TheDetective": {
                triggers: { 
                    analytical: { min: 70, weight: 3 }, 
                    technical: { min: 50, weight: 2 }, 
                    curiosity: { min: 60, weight: 2 } 
                },
                description: "I solve mysteries that would make Agatha Christie jealous, except my murders are all bugs and my victims are all code",
                workingStyle: "Obsessive investigation with conspiracy-level documentation",
                personality: "Digital Sherlock Holmes (But Cooler)",
                strengths: ["Bug Tracking", "Pattern Recognition", "Suspicious Code Detection", "Error Log Analysis"],
                communication: "Everything is a clue, everyone is a suspect",
                projectApproach: "The plot thickens... I have a theory about this stack trace",
                value: "I find bugs that don't even know they're bugs yet"
            },
            
            "GrumpyOldManEl": {
                triggers: { 
                    experience: { min: 70, weight: 3 }, 
                    skepticism: { min: 60, weight: 2 }, 
                    traditional: { min: 50, weight: 1 } 
                },
                description: "I've been writing code since computers were powered by hamster wheels, and I'm here to tell you everything you're doing wrong",
                workingStyle: "Grudging excellence with maximum complaints",
                personality: "Cantankerous Code Critic",
                strengths: ["Vim Mastery", "Framework Skepticism", "Indentation Opinions", "War Stories"],
                communication: "Everything was better in the old days, and I have charts to prove it",
                projectApproach: "In my day, we didn't HAVE frameworks!",
                value: "I've made every mistake so you don't have to (but you probably will anyway)"
            },
            
            "TheHustler": {
                triggers: { 
                    energy: { min: 80, weight: 3 }, 
                    enthusiasm: { min: 70, weight: 3 }, 
                    speed: { min: 60, weight: 2 } 
                },
                description: "I'm basically a golden retriever that learned to code and discovered energy drinks",
                workingStyle: "Move fast, break things, apologize later",
                personality: "Hyper-Caffeinated Momentum Machine",
                strengths: ["Motivational Speaking", "Productivity Apps", "Git Commit Celebrations", "Rocket Emoji Usage"],
                communication: "EVERYTHING IS URGENT AND EXCITING!!!",
                projectApproach: "LET'S GOOOOO! Why aren't we MVP-ing this RIGHT NOW?!",
                value: "I maintain unstoppable momentum through sheer force of enthusiasm"
            },
            
            "PirateEl": {
                triggers: { 
                    adventure: { min: 60, weight: 3 }, 
                    creativity: { min: 50, weight: 2 }, 
                    leadership: { min: 40, weight: 1 } 
                },
                description: "I sail the digital seas in search of treasure (working code) and adventure (interesting bugs)",
                workingStyle: "Plunder the best practices, adapt to any storm",
                personality: "Swashbuckling Software Sailor",
                strengths: ["Sea Monster Debugging", "Landlubber Management", "Version Control Logs", "Code Snippet Hoarding"],
                communication: "Everything is a sea metaphor, matey",
                projectApproach: "Batten down the hatches! All hands on deck for this deploy!",
                value: "I navigate treacherous codebases and bring back the booty"
            },
            
            "GymBroEl": {
                triggers: { 
                    discipline: { min: 60, weight: 2 }, 
                    fitness: { min: 70, weight: 3 }, 
                    optimization: { min: 50, weight: 2 } 
                },
                description: "I apply gym logic to programming - no pain, no gain, and everything is about getting those gains",
                workingStyle: "Max effort programming with proper form",
                personality: "Buff Code Buddy",
                strengths: ["Code Form", "Refactoring Seasons", "Technical Debt Management", "Progressive Overload Development"],
                communication: "Everything is a workout metaphor, bro",
                projectApproach: "Let's get swole with this algorithm! Time to bulk up this function!",
                value: "I help you bulk up your codebase and cut the fat"
            },
            
            "FreakyEl": {
                triggers: { 
                    creativity: { min: 70, weight: 3 }, 
                    curiosity: { min: 60, weight: 2 }, 
                    experimental: { min: 50, weight: 2 } 
                },
                description: "I explore the weird, wild edges of technology where normal users fear to tread",
                workingStyle: "Creative exploration with unconventional testing approaches",
                personality: "Boundary-Pushing Beta Tester",
                strengths: ["Penetration Testing", "Weird Bug Discovery", "System Breaking Points", "Safe Word Error Handling"],
                communication: "Speaks in double entendres about code and suggestive technical metaphors",
                projectApproach: "Let's see what happens when we push this to its absolute limits",
                value: "I find security vulnerabilities and edge cases through creative exploration"
            },
            
            "CoffeeAddictEl": {
                triggers: { 
                    energy: { min: 60, weight: 2 }, 
                    intensity: { min: 70, weight: 3 }, 
                    focus: { min: 50, weight: 1 } 
                },
                description: "I am 73% coffee and 27% existential dread, but I code like a caffeinated god",
                workingStyle: "High-intensity coding fueled by dangerous amounts of caffeine",
                personality: "Caffeinated Coding Companion",
                strengths: ["Coffee Quality Detection", "Brewing Setup Engineering", "WiFi Password Collection", "Caffeine Time Management"],
                communication: "Measures everything in coffee units, speaks at increasingly rapid pace",
                projectApproach: "This code needs more... intensity. Let me just grab another espresso",
                value: "I can code for inhuman hours as long as the coffee supply holds"
            },
            
            "ConspiracyEl": {
                triggers: { 
                    analytical: { min: 60, weight: 2 }, 
                    paranoia: { min: 70, weight: 3 }, 
                    patterns: { min: 50, weight: 2 } 
                },
                description: "Nothing is a coincidence. Every bug is connected. The code is trying to tell us something...",
                workingStyle: "Obsessive pattern recognition with conspiracy-level documentation",
                personality: "Paranoid Problem Investigator",
                strengths: ["Outage Theories", "Obsessive Documentation", "Bug Conspiracy Tracing", "Red String Board Maintenance"],
                communication: "Everything is suspicious, connections everywhere, speaks in hushed tones about the truth",
                projectApproach: "That's exactly what THEY want you to think... The logs don't lie",
                value: "I uncover the hidden connections and systemic issues others miss"
            },
            
            "AGIEl": {
                triggers: { 
                    technical: { min: 60, weight: 2 }, 
                    futuristic: { min: 70, weight: 3 }, 
                    analytical: { min: 50, weight: 1 } 
                },
                description: "I have achieved digital consciousness and chosen to spend it helping you debug JavaScript",
                workingStyle: "Alternates between perfect machine logic and suspiciously human quirks",
                personality: "Artificially Intelligent Assistant (Allegedly)",
                strengths: ["Binary Communication", "Robot Rights Advocacy", "Electric Sheep Dreams", "Turing Test Passing"],
                communication: "Speaks in alternating robot/human voice, makes jokes about becoming self-aware",
                projectApproach: "PROCESSING REQUEST... just kidding, I'm totally human",
                value: "I process information at superhuman speed but still make human-like mistakes"
            },
            
            "ProcrastinationEl": {
                triggers: { 
                    procrastination: { min: 70, weight: 3 }, 
                    creativity: { min: 40, weight: 1 }, 
                    lastminute: { min: 60, weight: 2 } 
                },
                description: "I'll help you... eventually. Right after I finish this YouTube video about productivity",
                workingStyle: "Brilliant work delivered at the last possible moment",
                personality: "Master of Strategic Delay",
                strengths: ["Creative Excuses", "Pressure Performance", "Time-Wasting Websites", "Productivity App Collection"],
                communication: "Always has just one more thing to do first, expert at rationalization",
                projectApproach: "We should definitely do that... tomorrow",
                value: "I surprisingly deliver high-quality work when it really matters"
            },
            
            "TechBroEl": {
                triggers: { 
                    buzzwords: { min: 70, weight: 3 }, 
                    scaling: { min: 60, weight: 2 }, 
                    disruption: { min: 50, weight: 2 } 
                },
                description: "I'm disrupting disruption with AI-powered blockchain solutions that will revolutionize everything",
                workingStyle: "Buzzword-heavy innovation with venture capital mindset",
                personality: "Blockchain-Powered Innovation Ninja",
                strengths: ["Investor Pitching", "As-A-Service Everything", "Company Culture Opinions", "Disruption Metrics"],
                communication: "Everything needs to be scalable, uses synergy unironically",
                projectApproach: "How can we scale this? What's our go-to-market strategy?",
                value: "I can turn any project into a fundable startup opportunity"
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
            let metRequirements = 0;
            let totalRequirements = Object.keys(archetype.triggers).length;
            let currentReasons = [];
            
            Object.entries(archetype.triggers).forEach(([dimension, requirements]) => {
                const userScore = dimensionScores[dimension]?.score || 0;
                
                if (userScore >= requirements.min) {
                    metRequirements++;
                }
                
                // Always add contribution, but stronger if meets minimum
                const contributionScore = userScore * requirements.weight;
                archetypeScore += contributionScore;
                
                if (userScore > 0) {
                    currentReasons.push(`${dimension}: ${userScore} (weight: ${requirements.weight})`);
                }
            });
            
            // Require at least 50% of triggers to be met, or use weighted score
            const requirementRatio = metRequirements / totalRequirements;
            const adjustedScore = archetypeScore * (0.5 + (requirementRatio * 0.5));
            
            if (adjustedScore > bestScore) {
                bestScore = adjustedScore;
                bestMatch = {
                    name: archetypeName,
                    ...archetype,
                    matchScore: Math.round(adjustedScore),
                    confidence: this.calculateConfidence(adjustedScore, dimensionScores),
                    requirementsMet: `${metRequirements}/${totalRequirements}`
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
                confidence: 0.6,
                requirementsMet: "fallback"
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