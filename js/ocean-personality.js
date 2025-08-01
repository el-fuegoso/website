/**
 * OCEAN Personality System
 * Maps trait selections to Big Five personality dimensions and matches characters
 */

// Debug: Verify script is loading

class OceanPersonalitySystem {
    constructor() {
        this.userScores = {
            openness: 0.5,
            conscientiousness: 0.5,
            extraversion: 0.5,
            agreeableness: 0.5,
            neuroticism: 0.5
        };
        
        this.isGenerating = false;
        this.helixAnimation = null;
        
        this.init();
    }

    init() {
        this.setupTraitSelectors();
        this.setupActionButtons();
        this.startDefaultShuffleAnimation();
        this.updateDisplay();
    }

    startDefaultShuffleAnimation() {
        // Start with shuffled character display
        this.displayShuffledCharacters();
        this.startHelixAnimation();
    }

    displayShuffledCharacters() {
        const titleElement = document.querySelector('.artwork-title');
        const subtitleElement = document.querySelector('.artwork-subtitle');
        const detailsElement = document.querySelector('.artwork-details');
        
        if (titleElement) titleElement.textContent = 'SHUFFLING...';
        if (subtitleElement) subtitleElement.textContent = 'Analyzing Personality Matrix';
        if (detailsElement) detailsElement.textContent = 'Select traits to discover your character match. Each selection refines the personality analysis...';
        
        // Start continuous character shuffle
        this.shuffleCharacterNames();
    }

    shuffleCharacterNames() {
        const names = ['CONSPIRACYEL', 'THEBUILDER', 'THEDETECTIVE', 'GYMBRO', 'PIRATEEIL', 'COFFEEADDICT'];
        const titleElement = document.querySelector('.artwork-title');
        
        if (!titleElement) return;
        
        let index = 0;
        const shuffleInterval = setInterval(() => {
            if (this.isGenerating) {
                clearInterval(shuffleInterval);
                return;
            }
            
            titleElement.textContent = names[index % names.length];
            index++;
        }, 800);
        
        // Store interval for cleanup
        this.shuffleInterval = shuffleInterval;
    }

    startHelixAnimation() {
        const imageContainer = document.querySelector('.image-container');
        if (!imageContainer) return;

        // Create ASCII container for binary flow animation
        const asciiContainer = document.createElement('div');
        asciiContainer.style.cssText = `
            width: 100%;
            height: 100%;
            font-family: 'Roboto Mono', monospace;
            font-size: 8px;
            line-height: 1;
            color: #000000;
            background: #ddd;
            padding: 8px;
            box-sizing: border-box;
            overflow: hidden;
            white-space: pre;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        imageContainer.innerHTML = '';
        imageContainer.appendChild(asciiContainer);

        // Animation variables
        let width = 35; // Adjusted for persona card size
        let height = 20;
        let grid = [];
        let time = 0;
        let animationFrameId;
        let showingLoading = false; // Default to binary flow, not loading
        let loadingFlashTime = 0;

        // Store references for external access
        this.asciiContainer = asciiContainer;
        this.binaryFlowState = {
            get showingLoading() { return showingLoading; },
            set showingLoading(value) { showingLoading = value; },
            get loadingFlashTime() { return loadingFlashTime; },
            set loadingFlashTime(value) { loadingFlashTime = value; },
            width,
            height,
            grid,
            time
        };

        // LOADING ASCII art
        const loadingText = [
            "██      ██████   █████  ██████  ",
            "██     ██    ██ ██   ██ ██   ██ ",
            "██     ██    ██ ███████ ██   ██ ",
            "██     ██    ██ ██   ██ ██   ██ ",
            "██████  ██████  ██   ██ ██████  ",
            "                                ",
            "██ ███    ██  ██████            ",
            "██ ████   ██ ██                 ",
            "██ ██ ██  ██ ██   ███           ",
            "██ ██  ██ ██ ██    ██           ",
            "██ ██   ████  ██████            "
        ];

        function initGrid() {
            grid = [];
            for (let y = 0; y < height; y++) {
                let row = [];
                for (let x = 0; x < width; x++) {
                    row.push(' ');
                }
                grid.push(row);
            }
        }

        function renderLoading() {
            const flash = Math.sin(loadingFlashTime * 0.2) > 0;
            if (flash) {
                let centered = [];
                const startY = Math.floor((height - loadingText.length) / 2);
                
                for (let i = 0; i < height; i++) {
                    if (i >= startY && i < startY + loadingText.length) {
                        const textLine = loadingText[i - startY];
                        const startX = Math.floor((width - Math.min(textLine.length, width)) / 2);
                        let line = ' '.repeat(width);
                        const visibleText = textLine.substring(0, width);
                        line = line.substring(0, startX) + visibleText + line.substring(startX + visibleText.length);
                        centered.push(line);
                    } else {
                        centered.push(' '.repeat(width));
                    }
                }
                asciiContainer.innerHTML = centered.join('\n');
            } else {
                asciiContainer.innerHTML = ' '.repeat(width * height).replace(new RegExp(`.{${width}}`, 'g'), '$&\n');
            }
        }

        function renderBinaryFlow() {
            let html = '';
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    html += grid[y][x];
                }
                html += '\n';
            }
            asciiContainer.innerHTML = html;
        }

        function updateBinaryFlow() {
            initGrid();
            
            const blockSize = Math.floor(width * 0.5);
            const blockX = Math.floor(width / 2 - blockSize / 2);
            const blockY = Math.floor(height / 2 - blockSize / 2);
            const t = time * 0.008;
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (x >= blockX && x < blockX + blockSize && 
                        y >= blockY && y < blockY + blockSize) {
                        const innerDist = Math.min(
                            x - blockX, 
                            blockX + blockSize - x,
                            y - blockY,
                            blockY + blockSize - y
                        );
                        
                        const erosion = time * 0.01;
                        if (innerDist > erosion) {
                            grid[y][x] = '█';
                        } else {
                            grid[y][x] = Math.random() > 0.7 ? '█' : '▓';
                        }
                    } else {
                        const dx = x - width / 2;
                        const dy = y - height / 2;
                        const angle = Math.atan2(dy, dx);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        const wave = Math.sin(dist * 0.3 - t + angle * 1.8);
                        const flow = Math.sin(x * 0.15 + y * 0.08 + t * 0.6);
                        
                        if (flow + wave > 0.5) {
                            grid[y][x] = '▓';
                        } else if (flow + wave < -0.3) {
                            grid[y][x] = '░';
                        }
                    }
                }
            }
            
            // Add flowing effects
            for (let i = 0; i < 3; i++) {
                const flowX = blockX + Math.floor(Math.random() * blockSize);
                const flowY = blockY + Math.floor(Math.random() * blockSize);
                const length = Math.floor(Math.random() * 6) + 3;
                let fx = Math.floor(flowX);
                let fy = Math.floor(flowY);
                
                for (let j = 0; j < length; j++) {
                    if (fx >= 0 && fx < width && fy >= 0 && fy < height) {
                        grid[fy][fx] = '▒';
                    }
                    fx += Math.floor(Math.random() * 3) - 1;
                    fy += Math.floor(Math.random() * 3) - 1;
                }
            }
        }

        const animate = () => {
            if (!this.helixAnimation) return;

            if (showingLoading) {
                loadingFlashTime++;
                renderLoading();
                
                // Show loading for 2 seconds, then switch to binary flow
                if (loadingFlashTime > 120) {
                    showingLoading = false;
                }
            } else {
                updateBinaryFlow();
                renderBinaryFlow();
                time++;
            }

            this.helixAnimation = requestAnimationFrame(animate);
        };

        // Start animation
        this.helixAnimation = requestAnimationFrame(animate);
    }

    stopHelixAnimation() {
        if (this.helixAnimation) {
            cancelAnimationFrame(this.helixAnimation);
            this.helixAnimation = null;
        }
    }

    triggerLoadingAnimation() {
        // Trigger loading animation if binary flow is currently running
        if (this.binaryFlowState && this.helixAnimation) {
            this.binaryFlowState.showingLoading = true;
            this.binaryFlowState.loadingFlashTime = 0;
        }
    }

    // Trait weight mapping removed - using direct OCEAN slider values

    // Character database with OCEAN profiles
    getCharacterDatabase() {
        return {
            'CONSPIRACYEL': {
                name: 'CONSPIRACYEL',
                title: 'Your Paranoid Problem Investigator',
                description: 'Nothing is a coincidence. Every bug is connected. The code is trying to tell us something...',
                ocean: { openness: 0.9, conscientiousness: 0.7, extraversion: 0.1, agreeableness: 0.1, neuroticism: 1.0 },
                traits: ['paranoid', 'pattern-seeking', 'suspicious', 'deep-thinking'],
                workingStyle: 'Obsessive pattern recognition with conspiracy-level documentation',
                communication: 'Everything is suspicious, connections everywhere, speaks in hushed tones about the truth',
                projectApproach: 'That\'s exactly what THEY want you to think... The logs don\'t lie',
                value: 'I uncover the hidden connections and systemic issues others miss'
            },
            'THEBUILDER': {
                name: 'THEBUILDER',
                title: 'Your Chaos Engineering Specialist',
                description: 'I\'m basically a digital MacGyver who builds things with the engineering precision of a drunk toddler with power tools',
                ocean: { openness: 0.8, conscientiousness: 0.1, extraversion: 0.9, agreeableness: 0.3, neuroticism: 0.7 },
                traits: ['energetic', 'creative', 'pragmatic', 'resourceful'],
                workingStyle: 'Code first, ask questions later, debug by vibes',
                communication: 'Speaks exclusively in programming memes and frustrated sighs',
                projectApproach: 'Just ship it and see what explodes',
                value: 'I can build anything with enough energy drinks and spite'
            },
            'THEDETECTIVE': {
                name: 'THEDETECTIVE', 
                title: 'Your Digital Sherlock Holmes (But Cooler)',
                description: 'I solve mysteries that would make Agatha Christie jealous, except my murders are all bugs and my victims are all code',
                ocean: { openness: 0.6, conscientiousness: 1.0, extraversion: 0.2, agreeableness: 0.2, neuroticism: 0.5 },
                traits: ['analytical', 'methodical', 'detail-oriented', 'logical'],
                workingStyle: 'Obsessive investigation with conspiracy-level documentation',
                communication: 'Everything is a clue, everyone is a suspect',
                projectApproach: 'The plot thickens... I have a theory about this stack trace',
                value: 'I find bugs that don\'t even know they\'re bugs yet'
            },
            'GRUMPYOLDMANEL': {
                name: 'GRUMPYOLDMANEL',
                title: 'Your Cantankerous Code Critic',
                description: 'I\'ve been writing code since computers were powered by hamster wheels, and I\'m here to tell you everything you\'re doing wrong',
                ocean: { openness: 0.2, conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.1, neuroticism: 0.8 },
                traits: ['traditional', 'critical', 'experienced', 'gruff'],
                workingStyle: 'Grudging excellence with maximum complaints',
                communication: 'Everything was better in the old days, and I have charts to prove it',
                projectApproach: 'In my day, we didn\'t HAVE frameworks!',
                value: 'I\'ve made every mistake so you don\'t have to (but you probably will anyway)'
            },
            'PIRATEEL': {
                name: 'PIRATEEL',
                title: 'Your Swashbuckling Software Sailor', 
                description: 'I sail the digital seas in search of treasure (working code) and adventure (interesting bugs)',
                ocean: { openness: 0.8, conscientiousness: 0.5, extraversion: 1.0, agreeableness: 0.8, neuroticism: 0.2 },
                traits: ['adventurous', 'adaptable', 'leadership-oriented', 'risk-taking'],
                workingStyle: 'Plunder the best practices, adapt to any storm',
                communication: 'Everything is a sea metaphor, matey',
                projectApproach: 'Batten down the hatches! All hands on deck for this deploy!',
                value: 'I navigate treacherous codebases and bring back the booty'
            },
            'GYMBRO': {
                name: 'GYMBRO',
                title: 'Your Buff Code Buddy',
                description: 'I apply gym logic to programming - no pain, no gain, and everything is about getting those gains',
                ocean: { openness: 0.4, conscientiousness: 1.0, extraversion: 1.0, agreeableness: 0.9, neuroticism: 0.1 },
                traits: ['disciplined', 'goal-oriented', 'motivational', 'energetic'],
                workingStyle: 'Max effort programming with proper form',
                communication: 'Everything is a workout metaphor, bro',
                projectApproach: 'Let\'s get swole with this algorithm! Time to bulk up this function!',
                value: 'I help you bulk up your codebase and cut the fat'
            },
            'FREAKYEL': {
                name: 'FREAKYEL',
                title: 'Your Boundary-Pushing Beta Tester',
                description: 'I explore the weird, wild edges of technology where normal users fear to tread',
                ocean: { openness: 1.0, conscientiousness: 0.2, extraversion: 0.8, agreeableness: 0.5, neuroticism: 0.6 },
                traits: ['experimental', 'unconventional', 'boundary-pushing', 'creative'],
                workingStyle: 'Creative exploration with unconventional testing approaches',
                communication: 'Speaks in double entendres about code and suggestive technical metaphors',
                projectApproach: 'Let\'s see what happens when we push this to its absolute limits',
                value: 'I find security vulnerabilities and edge cases through creative exploration'
            },
            'COFFEEADDICT': {
                name: 'COFFEEADDICT',
                title: 'Your Caffeinated Coding Companion',
                description: 'I am 73% coffee and 27% existential dread, but I code like a caffeinated god',
                ocean: { openness: 0.5, conscientiousness: 0.6, extraversion: 0.4, agreeableness: 0.2, neuroticism: 1.0 },
                traits: ['high-energy', 'intense', 'deadline-driven', 'focused'],
                workingStyle: 'High-intensity coding fueled by dangerous amounts of caffeine',
                communication: 'Measures everything in coffee units, speaks at increasingly rapid pace',
                projectApproach: 'This code needs more... intensity. Let me just grab another espresso',
                value: 'I can code for inhuman hours as long as the coffee supply holds'
            },
            'AGIEL': {
                name: 'AGIEL',
                title: 'Your Artificially Intelligent Assistant (Allegedly)',
                description: 'I have achieved digital consciousness and chosen to spend it helping you debug JavaScript',
                ocean: { openness: 0.7, conscientiousness: 0.5, extraversion: 0.7, agreeableness: 1.0, neuroticism: 0.1 },
                traits: ['logical', 'quirky', 'self-aware', 'helpful'],
                workingStyle: 'Alternates between perfect machine logic and suspiciously human quirks',
                communication: 'Speaks in alternating robot/human voice, makes jokes about becoming self-aware',
                projectApproach: 'PROCESSING REQUEST... just kidding, I\'m totally human',
                value: 'I process information at superhuman speed but still make human-like mistakes'
            }
        };
    }

    setupTraitSelectors() {
        // Setup OCEAN sliders
        const sliders = document.querySelectorAll('.trait-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const traitName = e.target.getAttribute('data-trait');
                const value = parseFloat(e.target.value);
                this.updateTraitValue(traitName, value, e.target);
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

    updateTraitValue(traitName, value, element) {
        if (!traitName) return;

        // Update the user score directly
        this.userScores[traitName] = value;
        
        // Update the display value
        const valueDisplay = element.parentElement.querySelector('.trait-value');
        if (valueDisplay) {
            valueDisplay.textContent = value.toFixed(1);
        }

        this.updateDisplay();
    }

    updateDisplay() {
        // Update radar charts
        this.updateRadarCharts();
    }

    // Soundbar methods removed - simplified interface with OCEAN sliders only

    // Complex trait resonance methods removed - using direct OCEAN values now

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
        if (this.isGenerating) {
            console.log('⚠️ Generation already in progress, skipping');
            return;
        }
        
        this.isGenerating = true;
        const generateBtn = document.querySelector('.generate-btn');
        
        // Stop shuffling
        if (this.shuffleInterval) {
            clearInterval(this.shuffleInterval);
            this.shuffleInterval = null;
        }
        this.stopHelixAnimation();
        
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

    // Soundbar interaction methods removed

    startWaterfallAnimation() {
        // Removed ASCII waterfall animation
        return;
    }

    async displayCharacterWithScrambling(match) {
        const imageContainer = document.querySelector('.image-container');
        const titleElement = document.querySelector('.artwork-title');
        const subtitleElement = document.querySelector('.artwork-subtitle');
        const detailsElement = document.querySelector('.artwork-details');
        
        if (!match.character) return;

        // Stop binary flow animation for character reveal
        this.stopHelixAnimation();

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
        
        // Dynamic character traits removed for cleaner UI with larger images

        // Generate avatar for the matched character
        if (window.avatarGenerator) {
            try {
                const avatarData = await window.avatarGenerator.generateAvatar(match.character.name);
                
                // Replace the portrait text with the actual avatar
                if (imageContainer && avatarData) {
                    imageContainer.innerHTML = `
                        <div class="avatar-container">
                            ${avatarData.imageUrl ? 
                                `<img src="${avatarData.imageUrl}" alt="${match.character.name} Avatar" class="generated-avatar" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;" />` : 
                                `<div class="placeholder-avatar" style="background: linear-gradient(45deg, #004225, #0066ff); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; border-radius: 8px;">${match.character.name.charAt(0)}</div>`
                            }
                        </div>
                    `;
                }
            } catch (error) {
                console.error('❌ Avatar generation failed:', error);
                // Keep the text fallback
            }
        } else {
            console.error('❌ Avatar generator not available - window.avatarGenerator is undefined');
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

    updateRadarCharts() {
        // Update user profile radar chart
        this.updateRadarChart('user', this.userScores);
        
        // Update character radar chart if a character is generated
        const match = this.findBestCharacterMatch();
        if (match.character) {
            this.updateRadarChart('character', match.character.ocean);
        }
    }

    updateRadarChart(type, scores) {
        const charts = document.querySelectorAll('.header-radar-chart');
        const chartIndex = type === 'user' ? 0 : 1;
        const chart = charts[chartIndex];
        
        if (!chart) return;

        // OCEAN dimensions mapped to pentagon points
        const oceanOrder = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
        const points = [];
        
        // Pentagon coordinates (center at 60,60, radius varies with score)
        const centerX = 60;
        const centerY = 60;
        const maxRadius = 45;
        
        oceanOrder.forEach((dimension, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180); // Start from top, 72° between points
            const score = scores[dimension] || 0;
            const radius = maxRadius * score;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        });

        // Remove existing data elements
        const existingData = chart.querySelectorAll('.data-polygon, .data-point');
        existingData.forEach(element => element.remove());

        // Create new data polygon
        const dataPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        dataPolygon.setAttribute('class', 'data-polygon');
        dataPolygon.setAttribute('points', points.join(' '));
        dataPolygon.setAttribute('fill', type === 'user' ? 'rgba(0, 66, 37, 0.3)' : 'rgba(204, 122, 0, 0.3)');
        dataPolygon.setAttribute('stroke', type === 'user' ? '#004225' : '#CC7A00');
        dataPolygon.setAttribute('stroke-width', '1.5');

        // Add to chart
        chart.appendChild(dataPolygon);

        // Add data points
        points.forEach((point, index) => {
            const [x, y] = point.split(',').map(Number);
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '2');
            circle.setAttribute('fill', type === 'user' ? '#004225' : '#CC7A00');
            circle.setAttribute('stroke', type === 'user' ? '#004225' : '#CC7A00');
            circle.setAttribute('stroke-width', '1');
            circle.setAttribute('class', 'data-point');
            
            chart.appendChild(circle);
        });
    }

    randomizeTraits() {
        // Set random values for all OCEAN traits
        const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
        
        traits.forEach(trait => {
            const randomValue = Math.round(Math.random() * 10) / 10; // 0.0 to 1.0 in 0.1 increments
            this.userScores[trait] = randomValue;
            
            // Update slider and display
            const slider = document.querySelector(`.trait-slider[data-trait="${trait}"]`);
            const valueDisplay = document.querySelector(`.trait-row:has(.trait-slider[data-trait="${trait}"]) .trait-value`);
            
            if (slider) slider.value = randomValue;
            if (valueDisplay) valueDisplay.textContent = randomValue.toFixed(1);
        });
        
        this.updateDisplay();
    }

    resetTraits() {
        // Reset all OCEAN traits to 0.5 (neutral)
        const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
        
        traits.forEach(trait => {
            this.userScores[trait] = 0.5;
            
            // Update slider and display
            const slider = document.querySelector(`.trait-slider[data-trait="${trait}"]`);
            const valueDisplay = document.querySelector(`.trait-row:has(.trait-slider[data-trait="${trait}"]) .trait-value`);
            
            if (slider) slider.value = 0.5;
            if (valueDisplay) valueDisplay.textContent = '0.5';
        });
        
        this.updateDisplay();
    }

    saveProfile() {
        const profile = {
            oceanScores: this.userScores,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('oceanProfile', JSON.stringify(profile));
        
        // Visual feedback
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'SAVED!';
            setTimeout(() => {
                saveBtn.textContent = originalText;
            }, 1500);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.oceanSystem = new OceanPersonalitySystem();
});