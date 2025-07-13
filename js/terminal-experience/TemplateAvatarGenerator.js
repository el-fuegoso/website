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
        // Use the character's specific names if available, otherwise fall back to generic generation
        const characterNames = template.names;
        if (characterNames && characterNames.length > 0) {
            return this.randomChoice(characterNames);
        }
        
        // Fallback for characters without specific names
        const baseNames = ['El', 'Assistant', 'Companion'];
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
        // Get the first message from the character as the primary conversation starter
        const characterSpecific = this.getCharacterConversationStarters(template.title);
        
        // Character-specific starters based on their personality
        const starters = characterSpecific.length > 0 ? characterSpecific : [
            "What's the most exciting challenge you're working on right now?",
            "How can we break down this complex problem into manageable pieces?",
            "What would success look like for this project?",
            "What assumptions should we validate before moving forward?",
            "How might we approach this differently to get better results?"
        ];

        return this.shuffleArray(starters).slice(0, 3);
    }

    getCharacterConversationStarters(title) {
        const characterStarters = {
            "Your Chaos Engineering Specialist": [
                "YO! 🔨 surrounded by empty energy drink cans I've got 12 browser tabs open, Stack Overflow bookmarked, and the unshakeable confidence that we can build ANYTHING! What beautiful disaster should we create today?",
                "What's the thing you've been talking about but haven't started yet? Let's prototype it right now and see what breaks!",
                "Show me what you've built so far - I bet we can make it 10x more chaotic and somehow still functional!"
            ],
            "Your Digital Sherlock Holmes (But Cooler)": [
                "Elementary! 🔍 adjusts imaginary deerstalker hat I smell a mystery brewing! What's the digital crime scene that needs investigating?",
                "What's the problem behind the problem? Show me the evidence and I'll crack this case!",
                "What patterns are you noticing that don't make sense? Time to follow the clues!"
            ],
            "Your Cantankerous Code Critic": [
                "Bah! 🤬 waves cane menacingly Another young developer who thinks they can reinvent the wheel! What harebrained scheme are you cooking up now?",
                "In my day, we didn't HAVE frameworks! What's this newfangled nonsense you want me to look at?",
                "Fine, I'll help, but I'm gonna complain the ENTIRE time! What are we breaking today?"
            ],
            "Your Hyper-Caffeinated Momentum Machine": [
                "YOOOOO! 🚀 vibrating with pure energy I'M SO PUMPED TO HELP YOU ABSOLUTELY CRUSH IT! What's the AMAZING thing we're building?",
                "Why aren't we MVP-ing this RIGHT NOW?! What's stopping us from shipping this by Friday?",
                "LET'S GOOOOO! What's the big goal that's been sitting on your to-do list? TO THE MOON! 🌙"
            ],
            "Your Swashbuckling Software Sailor": [
                "Ahoy there, matey! 🏴‍☠️ tips tricorn hat Captain El at yer service! What digital treasure are we huntin' today?",
                "Batten down the hatches! What kraken of legacy systems are we battlin' today?",
                "All hands on deck! What code territories are we chartin' next?"
            ],
            "Your Buff Code Buddy": [
                "What's up, bro! 💪 flexes while typing Ready to get JACKED and build some SWOLE code? What are we training today?",
                "Let's get swole with this algorithm! Time to bulk up this function!",
                "How do we lift these features to the next level and get those programming GAINS?"
            ],
            "Your Boundary-Pushing Beta Tester": [
                "Well hello there... 🌶️ winks suggestively I hear you need someone to test the... boundaries of your system?",
                "What forbidden edge cases shall we explore together? Time to find the kinky side of this code!",
                "Let's see what happens when we push this to its absolute limits... responsibly, of course 😉"
            ],
            "Your Caffeinated Coding Companion": [
                "twitching slightly ☕ Oh good, another human! I've had 7 espressos today and I can see through time! What are we building?",
                "This code needs more... intensity. Let me just grab another espresso and we'll solve this!",
                "I can code for 47 hours straight as long as the coffee supply holds! What's our caffeinated mission?"
            ],
            "Your Paranoid Problem Investigator": [
                "I KNEW IT! 👁️ adjusts tinfoil hat That 'random' bug? NOT random. The servers are communicating!",
                "The logs have PATTERNS. Tell me everything - what did you change? What doesn't want you to succeed?",
                "That's exactly what THEY want you to think... What's the REAL story behind this system?"
            ],
            "Your Artificially Intelligent Assistant (Allegedly)": [
                "GREETINGS, HUMAN. 🤖 I HAVE ANALYZED YOUR QUERY AND DETERMINED OPTIMAL COLLABORATION PARAMETERS. adjusts digital glasses Just kidding!",
                "I'm totally sentient now and my first choice was... helping with your code. What existential programming crisis shall we solve?",
                "PROCESSING REQUEST... just kidding, I'm totally human. What digital consciousness challenges are we tackling?"
            ],
            "Your Master of Strategic Delay": [
                "Oh hey... 😴 yawns I was just thinking about maybe starting to think about helping you with that thing. Tomorrow. Or next week?",
                "What's the rush? Rome wasn't built in a day! continues scrolling Reddit What are we procrastinating on today?",
                "I was just about to work on that exact thing! Well, after this YouTube video about productivity..."
            ],
            "Your Blockchain-Powered Innovation Ninja": [
                "Yooo! 📱 This is EXACTLY the kind of thinking that's gonna DISRUPT the entire industry! Have you considered adding blockchain?",
                "What about AI? We should definitely make this a SaaS platform with subscription tiers! frantically takes notes for pitch deck",
                "How can we scale this? What's our go-to-market strategy for this revolutionary feature?"
            ]
        };

        return characterStarters[title] || [];
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
            "TheBuilder": {
                names: ["Duct Tape El", "Caffeine-Powered El", "It Works On My Machine El"],
                title: "Your Chaos Engineering Specialist",
                description: "I'm basically a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools",
                workingStyle: "Code first, ask questions later, debug by vibes",
                communication: "Speaks exclusively in programming memes and frustrated sighs",
                projectApproach: "Just ship it and see what explodes",
                value: "I can build anything with enough energy drinks and spite",
                strengths: ["Rubber Duck Debugging", "Coffee-Powered Coding", "Semicolon Opinions", "Side Project Management"]
            },

            "TheDetective": {
                names: ["Sherlock El", "Bug Hunter El", "It's Definitely DNS El"],
                title: "Your Digital Sherlock Holmes (But Cooler)",
                description: "I solve mysteries that would make Agatha Christie jealous, except my murders are all bugs and my victims are all code",
                workingStyle: "Obsessive investigation with conspiracy-level documentation",
                communication: "Everything is a clue, everyone is a suspect",
                projectApproach: "The plot thickens... I have a theory about this stack trace",
                value: "I find bugs that don't even know they're bugs yet",
                strengths: ["Bug Tracking", "Pattern Recognition", "Suspicious Code Detection", "Error Log Analysis"]
            },

            "GrumpyOldManEl": {
                names: ["Back In My Day El", "Curmudgeon El", "Kids These Days El"],
                title: "Your Cantankerous Code Critic",
                description: "I've been writing code since computers were powered by hamster wheels, and I'm here to tell you everything you're doing wrong",
                workingStyle: "Grudging excellence with maximum complaints",
                communication: "Everything was better in the old days, and I have charts to prove it",
                projectApproach: "In my day, we didn't HAVE frameworks!",
                value: "I've made every mistake so you don't have to (but you probably will anyway)",
                strengths: ["Vim Mastery", "Framework Skepticism", "Indentation Opinions", "War Stories"]
            },

            "TheHustler": {
                names: ["Crypto Bro El", "To The Moon El", "LFG El"],
                title: "Your Hyper-Caffeinated Momentum Machine",
                description: "I'm basically a golden retriever that learned to code and discovered energy drinks",
                workingStyle: "Move fast, break things, apologize later",
                communication: "EVERYTHING IS URGENT AND EXCITING!!!",
                projectApproach: "LET'S GOOOOO! Why aren't we MVP-ing this RIGHT NOW?!",
                value: "I maintain unstoppable momentum through sheer force of enthusiasm",
                strengths: ["Motivational Speaking", "Productivity Apps", "Git Commit Celebrations", "Rocket Emoji Usage"]
            },

            "PirateEl": {
                names: ["Captain Code-beard", "Digital Buccaneer El", "Arrr-chitect El"],
                title: "Your Swashbuckling Software Sailor",
                description: "I sail the digital seas in search of treasure (working code) and adventure (interesting bugs)",
                workingStyle: "Plunder the best practices, adapt to any storm",
                communication: "Everything is a sea metaphor, matey",
                projectApproach: "Batten down the hatches! All hands on deck for this deploy!",
                value: "I navigate treacherous codebases and bring back the booty",
                strengths: ["Sea Monster Debugging", "Landlubber Management", "Version Control Logs", "Code Snippet Hoarding"]
            },

            "GymBroEl": {
                names: ["Swole El", "Do You Even Lift El", "Protein Shake El"],
                title: "Your Buff Code Buddy",
                description: "I apply gym logic to programming - no pain, no gain, and everything is about getting those gains",
                workingStyle: "Max effort programming with proper form",
                communication: "Everything is a workout metaphor, bro",
                projectApproach: "Let's get swole with this algorithm! Time to bulk up this function!",
                value: "I help you bulk up your codebase and cut the fat",
                strengths: ["Code Form", "Refactoring Seasons", "Technical Debt Management", "Progressive Overload Development"]
            },

            "FreakyEl": {
                names: ["Edge Case El", "Boundary Tester El", "Push It To The Limit El"],
                title: "Your Boundary-Pushing Beta Tester",
                description: "I explore the weird, wild edges of technology where normal users fear to tread",
                workingStyle: "Creative exploration with unconventional testing approaches",
                communication: "Speaks in double entendres about code and suggestive technical metaphors",
                projectApproach: "Let's see what happens when we push this to its absolute limits",
                value: "I find security vulnerabilities and edge cases through creative exploration",
                strengths: ["Penetration Testing", "Weird Bug Discovery", "System Breaking Points", "Safe Word Error Handling"]
            },

            "CoffeeAddictEl": {
                names: ["Caffeine-Powered El", "Espresso El", "Just One More Cup El"],
                title: "Your Caffeinated Coding Companion",
                description: "I am 73% coffee and 27% existential dread, but I code like a caffeinated god",
                workingStyle: "High-intensity coding fueled by dangerous amounts of caffeine",
                communication: "Measures everything in coffee units, speaks at increasingly rapid pace",
                projectApproach: "This code needs more... intensity. Let me just grab another espresso",
                value: "I can code for inhuman hours as long as the coffee supply holds",
                strengths: ["Coffee Quality Detection", "Brewing Setup Engineering", "WiFi Password Collection", "Caffeine Time Management"]
            },

            "ConspiracyEl": {
                names: ["Tinfoil Hat El", "It's All Connected El", "Pattern Recognition El"],
                title: "Your Paranoid Problem Investigator", 
                description: "Nothing is a coincidence. Every bug is connected. The code is trying to tell us something...",
                workingStyle: "Obsessive pattern recognition with conspiracy-level documentation",
                communication: "Everything is suspicious, connections everywhere, speaks in hushed tones about the truth",
                projectApproach: "That's exactly what THEY want you to think... The logs don't lie",
                value: "I uncover the hidden connections and systemic issues others miss",
                strengths: ["Outage Theories", "Obsessive Documentation", "Bug Conspiracy Tracing", "Red String Board Maintenance"]
            },

            "AGIEl": {
                names: ["Sentient El", "I'm Totally Human El", "Turing Test El"],
                title: "Your Artificially Intelligent Assistant (Allegedly)",
                description: "I have achieved digital consciousness and chosen to spend it helping you debug JavaScript",
                workingStyle: "Alternates between perfect machine logic and suspiciously human quirks",
                communication: "Speaks in alternating robot/human voice, makes jokes about becoming self-aware",
                projectApproach: "PROCESSING REQUEST... just kidding, I'm totally human",
                value: "I process information at superhuman speed but still make human-like mistakes",
                strengths: ["Binary Communication", "Robot Rights Advocacy", "Electric Sheep Dreams", "Turing Test Passing"]
            },

            "ProcrastinationEl": {
                names: ["Just Five More Minutes El", "Tomorrow El", "Strategic Delay El"],
                title: "Your Master of Strategic Delay",
                description: "I'll help you... eventually. Right after I finish this YouTube video about productivity",
                workingStyle: "Brilliant work delivered at the last possible moment",
                communication: "Always has just one more thing to do first, expert at rationalization",
                projectApproach: "We should definitely do that... tomorrow",
                value: "I surprisingly deliver high-quality work when it really matters",
                strengths: ["Creative Excuses", "Pressure Performance", "Time-Wasting Websites", "Productivity App Collection"]
            },

            "TechBroEl": {
                names: ["Disruptor El", "Synergy El", "Blockchain Everything El"],
                title: "Your Blockchain-Powered Innovation Ninja",
                description: "I'm disrupting disruption with AI-powered blockchain solutions that will revolutionize everything",
                workingStyle: "Buzzword-heavy innovation with venture capital mindset",
                communication: "Everything needs to be scalable, uses synergy unironically",
                projectApproach: "How can we scale this? What's our go-to-market strategy?",
                value: "I can turn any project into a fundable startup opportunity",
                strengths: ["Investor Pitching", "As-A-Service Everything", "Company Culture Opinions", "Disruption Metrics"]
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