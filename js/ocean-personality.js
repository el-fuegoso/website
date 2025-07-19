/**
 * OCEAN Personality System
 * Maps trait selections to Big Five personality dimensions and matches characters
 */

class OceanPersonalitySystem {
    constructor() {
        this.userScores = {
            openness: 0,
            conscientiousness: 0,
            extraversion: 0,
            agreeableness: 0,
            neuroticism: 0
        };
        
        this.selectedTraits = new Set();
        this.isGenerating = false;
        
        this.init();
    }

    init() {
        this.setupTraitSelectors();
        this.setupActionButtons();
        this.updateDisplay();
    }

    // Trait to OCEAN mapping weights
    getTraitWeights() {
        return {
            // Toggles (checkboxes)
            'high-energy': { extraversion: 0.8, openness: 0.4 },
            'intense-focus': { conscientiousness: 0.7, neuroticism: -0.3 },
            'innovation': { openness: 0.9, conscientiousness: 0.3 },
            'cooperative': { agreeableness: 0.8, extraversion: 0.4 },
            'calm-pressure': { neuroticism: -0.8, conscientiousness: 0.5 },

            // Grid traits (emojis)
            'sword': { conscientiousness: 0.6, openness: 0.4 },
            'link': { agreeableness: 0.7, extraversion: 0.5 },
            'warning': { neuroticism: 0.6, conscientiousness: 0.4 },
            'wrench': { conscientiousness: 0.8, openness: 0.6 },
            'shield': { conscientiousness: 0.7, agreeableness: 0.3 },
            'brush': { openness: 0.9, extraversion: 0.4 },
            'magnify': { openness: 0.6, conscientiousness: 0.5 },
            'fire': { extraversion: 0.8, openness: 0.7 },
            'eyes': { neuroticism: 0.5, openness: 0.6 },
            'cycle': { openness: 0.7, conscientiousness: 0.4 },
            'pencil': { conscientiousness: 0.6, openness: 0.5 },
            'crown': { extraversion: 0.8, conscientiousness: 0.6 },
            'smile': { extraversion: 0.7, agreeableness: 0.8 },
            'heart': { agreeableness: 0.9, extraversion: 0.5 },
            'diamond': { openness: 0.6, conscientiousness: 0.7 },
            'lightning': { extraversion: 0.8, openness: 0.6 },
            'plant': { agreeableness: 0.6, openness: 0.5 },
            'hammer': { conscientiousness: 0.8, extraversion: 0.4 }
        };
    }

    // Character database with OCEAN profiles
    getCharacterDatabase() {
        return {
            'CONSPIRACYEL': {
                name: 'CONSPIRACYEL',
                title: 'Paranoid Problem Investigator',
                description: 'Nothing is a coincidence. Every bug is connected. The code is trying to tell us something...',
                ocean: { openness: 0.9, conscientiousness: 0.7, extraversion: 0.3, agreeableness: 0.4, neuroticism: 0.8 },
                traits: ['paranoid', 'pattern-seeking', 'suspicious', 'deep-thinking']
            },
            'THEBUILDER': {
                name: 'THEBUILDER',
                title: 'Chaos Engineering Specialist',
                description: 'A digital MacGyver who builds things with engineering precision and creative chaos',
                ocean: { openness: 0.8, conscientiousness: 0.6, extraversion: 0.7, agreeableness: 0.6, neuroticism: 0.4 },
                traits: ['energetic', 'creative', 'pragmatic', 'resourceful']
            },
            'THEDETECTIVE': {
                name: 'THEDETECTIVE', 
                title: 'Digital Sherlock Holmes',
                description: 'Solves mysteries that would make Agatha Christie jealous, debugging one clue at a time',
                ocean: { openness: 0.7, conscientiousness: 0.9, extraversion: 0.4, agreeableness: 0.5, neuroticism: 0.3 },
                traits: ['analytical', 'methodical', 'detail-oriented', 'logical']
            },
            'GYMBRO': {
                name: 'GYMBRO',
                title: 'Buff Code Buddy',
                description: 'Applies gym logic to programming - no pain, no gain, everything is about getting gains',
                ocean: { openness: 0.5, conscientiousness: 0.8, extraversion: 0.8, agreeableness: 0.7, neuroticism: 0.2 },
                traits: ['disciplined', 'goal-oriented', 'motivational', 'energetic']
            },
            'PIRATEEIL': {
                name: 'PIRATEEIL',
                title: 'Swashbuckling Software Sailor', 
                description: 'Sails digital seas in search of treasure (working code) and adventure (interesting bugs)',
                ocean: { openness: 0.9, conscientiousness: 0.5, extraversion: 0.8, agreeableness: 0.6, neuroticism: 0.4 },
                traits: ['adventurous', 'adaptable', 'leadership-oriented', 'risk-taking']
            },
            'COFFEEADDICT': {
                name: 'COFFEEADDICT',
                title: 'Caffeinated Coding Companion',
                description: '73% coffee and 27% existential dread, but codes like a caffeinated god',
                ocean: { openness: 0.6, conscientiousness: 0.7, extraversion: 0.6, agreeableness: 0.5, neuroticism: 0.7 },
                traits: ['high-energy', 'intense', 'deadline-driven', 'focused']
            }
        };
    }

    setupTraitSelectors() {
        // Setup toggle switches (checkboxes)
        const toggles = document.querySelectorAll('.toggle-switch');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const traitName = e.target.getAttribute('data-trait');
                this.toggleTrait(traitName, e.target);
            });
        });

        // Setup trait grid buttons
        const traitOptions = document.querySelectorAll('.trait-option');
        traitOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const traitName = e.target.getAttribute('data-trait');
                this.toggleTrait(traitName, e.target);
            });
        });
    }

    setupActionButtons() {
        const randomBtn = document.querySelector('.random-btn');
        const resetBtn = document.querySelector('.reset-btn');
        const saveBtn = document.querySelector('.save-btn');
        const generateBtn = document.querySelector('.generate-btn');

        if (randomBtn) randomBtn.addEventListener('click', () => this.randomizeTraits());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetTraits());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveProfile());
        if (generateBtn) generateBtn.addEventListener('click', () => this.generateCharacter());
    }

    toggleTrait(traitName, element) {
        if (!traitName) return;

        if (this.selectedTraits.has(traitName)) {
            this.selectedTraits.delete(traitName);
            element.classList.remove('active', 'selected');
        } else {
            this.selectedTraits.add(traitName);
            element.classList.add('active', 'selected');
        }

        this.calculateOceanScores();
        this.updateDisplay();
    }

    calculateOceanScores() {
        // Reset scores
        this.userScores = {
            openness: 0,
            conscientiousness: 0,
            extraversion: 0,
            agreeableness: 0,
            neuroticism: 0
        };

        const weights = this.getTraitWeights();

        // Calculate weighted scores
        this.selectedTraits.forEach(trait => {
            const traitWeights = weights[trait];
            if (traitWeights) {
                Object.keys(traitWeights).forEach(dimension => {
                    this.userScores[dimension] += traitWeights[dimension];
                });
            }
        });

        // Normalize scores to 0-1 range
        Object.keys(this.userScores).forEach(dimension => {
            this.userScores[dimension] = Math.max(0, Math.min(1, this.userScores[dimension]));
        });
    }

    updateDisplay() {
        // Update trait counter
        const counter = document.getElementById('traitCounter');
        const displayCounter = document.getElementById('displayTraitCounter');
        
        if (counter) counter.textContent = `${this.selectedTraits.size}/18`;
        if (displayCounter) displayCounter.textContent = `${this.selectedTraits.size}/18`;
    }

    findBestCharacterMatch() {
        const characters = this.getCharacterDatabase();
        let bestMatch = null;
        let bestScore = -1;

        Object.values(characters).forEach(character => {
            const similarity = this.calculateSimilarity(this.userScores, character.ocean);
            if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = character;
            }
        });

        return { character: bestMatch, similarity: bestScore };
    }

    calculateSimilarity(userScores, characterScores) {
        const dimensions = Object.keys(userScores);
        let totalDifference = 0;

        dimensions.forEach(dimension => {
            const diff = Math.abs(userScores[dimension] - characterScores[dimension]);
            totalDifference += diff;
        });

        // Convert to similarity score (0-1, where 1 is perfect match)
        return 1 - (totalDifference / dimensions.length);
    }

    async generateCharacter() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        const generateBtn = document.querySelector('.generate-btn');
        
        if (generateBtn) {
            generateBtn.textContent = 'GENERATING...';
            generateBtn.disabled = true;
        }

        try {
            // Start ASCII waterfall animation
            this.startWaterfallAnimation();
            
            // Simulate generation time
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Find best character match
            const match = this.findBestCharacterMatch();
            
            // Display character with text scrambling
            await this.displayCharacterWithScrambling(match);
            
        } finally {
            this.isGenerating = false;
            if (generateBtn) {
                generateBtn.textContent = 'GENERATE';
                generateBtn.disabled = false;
            }
        }
    }

    startWaterfallAnimation() {
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;

        imageContainer.innerHTML = '<div id="asciiWaterfall"></div>';
        
        // Simple ASCII waterfall effect
        const waterfall = document.getElementById('asciiWaterfall');
        const chars = '01234567890ABCDEF!@#$%^&*';
        let frame = 0;
        
        const animate = () => {
            if (this.isGenerating) {
                let content = '';
                for (let i = 0; i < 200; i++) {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    content += char;
                    if ((i + 1) % 20 === 0) content += '\n';
                }
                waterfall.textContent = content;
                waterfall.style.fontFamily = 'Roboto Mono, monospace';
                waterfall.style.fontSize = '8px';
                waterfall.style.color = '#00ff00';
                waterfall.style.lineHeight = '1';
                waterfall.style.overflow = 'hidden';
                
                frame++;
                setTimeout(animate, 100);
            }
        };
        
        animate();
    }

    async displayCharacterWithScrambling(match) {
        const imageContainer = document.querySelector('.image-container');
        const titleElement = document.querySelector('.artwork-title');
        const subtitleElement = document.querySelector('.artwork-subtitle');
        const detailsElement = document.querySelector('.artwork-details');
        
        if (!match.character) return;

        // Stop waterfall and show character name
        if (imageContainer) {
            imageContainer.innerHTML = `<div style="color: white; font-size: 14px; font-weight: 600; text-align: center;">${match.character.name} PORTRAIT</div>`;
        }

        // Scramble and reveal text
        if (titleElement) {
            await this.scrambleText(titleElement, match.character.name);
        }
        
        if (subtitleElement) {
            await this.scrambleText(subtitleElement, match.character.title);
        }
        
        if (detailsElement) {
            const details = `${match.character.description}\n\nMatch Score: ${Math.round(match.similarity * 100)}%`;
            await this.scrambleText(detailsElement, details);
        }
    }

    async scrambleText(element, finalText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        const duration = 1000; // 1 second
        const steps = 20;
        
        for (let step = 0; step < steps; step++) {
            let scrambled = '';
            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ' || finalText[i] === '\n') {
                    scrambled += finalText[i];
                } else if (Math.random() < step / steps) {
                    scrambled += finalText[i];
                } else {
                    scrambled += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            element.textContent = scrambled;
            await new Promise(resolve => setTimeout(resolve, duration / steps));
        }
        
        element.textContent = finalText;
    }

    randomizeTraits() {
        this.resetTraits();
        
        const allTraits = Object.keys(this.getTraitWeights());
        const numToSelect = Math.floor(Math.random() * 8) + 3; // 3-10 traits
        
        for (let i = 0; i < numToSelect; i++) {
            const randomTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
            if (!this.selectedTraits.has(randomTrait)) {
                const element = document.querySelector(`[data-trait="${randomTrait}"]`);
                if (element) {
                    this.toggleTrait(randomTrait, element);
                }
            }
        }
    }

    resetTraits() {
        this.selectedTraits.clear();
        
        // Remove all active classes
        document.querySelectorAll('.toggle-switch, .trait-option').forEach(el => {
            el.classList.remove('active', 'selected');
        });
        
        this.calculateOceanScores();
        this.updateDisplay();
    }

    saveProfile() {
        const profile = {
            selectedTraits: Array.from(this.selectedTraits),
            oceanScores: this.userScores,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('oceanProfile', JSON.stringify(profile));
        console.log('Profile saved:', profile);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.oceanSystem = new OceanPersonalitySystem();
});