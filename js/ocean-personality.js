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

        // Create canvas for helix animation
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 250;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        imageContainer.innerHTML = '';
        imageContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Animation variables
        let time = 0;
        const particles = [];
        let helixPoints = [];
        const numParticles = 30; // Fewer particles for performance
        const TWO_PI = Math.PI * 2;

        // Helper functions
        const random = (min, max) => {
            if (max === undefined) {
                max = min;
                min = 0;
            }
            return Math.random() * (max - min) + min;
        };

        const map = (value, start1, stop1, start2, stop2) => {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        };

        const dist = (x1, y1, z1, x2, y2, z2) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dz = z2 - z1;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };

        // HelixParticle class
        class HelixParticle {
            constructor(initialPhase) {
                this.phase = initialPhase || random(TWO_PI);
                this.radius = random(45, 55); // Scaled for smaller canvas
                this.yOffset = random(-150, 150);
                this.ySpeed = random(0.3, 0.6) * (random() > 0.5 ? 1 : -1);
                this.rotationSpeed = random(0.005, 0.0075);
                this.size = random(2, 4);
                this.opacity = random(120, 180);
                this.strength = random(0.8, 1);
            }

            update() {
                this.phase += this.rotationSpeed * this.strength;
                this.yOffset += this.ySpeed;

                if (this.yOffset > 175) this.yOffset = -175;
                if (this.yOffset < -175) this.yOffset = 175;

                const x = width / 2 + Math.cos(this.phase) * this.radius;
                const y = height / 2 + this.yOffset;
                const z = Math.sin(this.phase) * this.radius;

                return { x, y, z, strength: this.strength, size: this.size, opacity: this.opacity };
            }
        }

        // Create helix particles
        for (let i = 0; i < numParticles; i++) {
            const initialPhase = (i / numParticles) * TWO_PI * 3;
            particles.push(new HelixParticle(initialPhase));
        }

        // Animation loop
        const animate = () => {
            if (!this.helixAnimation) return;

            // Clear background
            ctx.fillStyle = '#ddd';
            ctx.fillRect(0, 0, width, height);

            time += 0.02;

            // Update helix points
            helixPoints = particles.map(particle => particle.update());
            helixPoints.sort((a, b) => a.z - b.z);

            // Draw connections
            ctx.lineWidth = 1;
            for (let i = 0; i < helixPoints.length; i++) {
                const hp1 = helixPoints[i];
                for (let j = 0; j < helixPoints.length; j++) {
                    if (i !== j) {
                        const hp2 = helixPoints[j];
                        const d = dist(hp1.x, hp1.y, hp1.z, hp2.x, hp2.y, hp2.z);

                        if (d < 60) {
                            const opacity = map(d, 0, 60, 40, 10) * 
                                          map(Math.min(hp1.z, hp2.z), -55, 55, 0.3, 1);

                            ctx.strokeStyle = `rgba(184, 134, 11, ${opacity / 255})`;
                            ctx.beginPath();
                            ctx.moveTo(hp1.x, hp1.y);
                            ctx.lineTo(hp2.x, hp2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Draw helix points
            for (let i = 0; i < helixPoints.length; i++) {
                const hp = helixPoints[i];
                const sizeMultiplier = map(hp.z, -55, 55, 0.6, 1.3);
                const adjustedOpacity = map(hp.z, -55, 55, hp.opacity * 0.4, hp.opacity);

                ctx.fillStyle = `rgba(184, 134, 11, ${adjustedOpacity / 255})`;
                ctx.beginPath();
                ctx.arc(hp.x, hp.y, (hp.size * sizeMultiplier) / 2, 0, TWO_PI);
                ctx.fill();
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
        
        // Update soundbars to be responsive to trait selection
        this.updateSoundbars();
        
        // Update radar charts
        this.updateRadarCharts();
    }

    updateSoundbars() {
        const soundbars = document.querySelectorAll('.soundbar');
        
        soundbars.forEach((bar) => {
            const trait = bar.dataset.trait;
            const harmony = bar.dataset.harmony;
            if (!trait) return;
            
            // Check if this trait is selected
            const isSelected = this.selectedTraits.has(trait);
            
            // Calculate height based on selection and relationships
            let height = 8; // Base height - always start from bottom
            const relatedTraits = this.getTraitResonance(trait);
            const resonanceCount = relatedTraits.filter(t => this.selectedTraits.has(t)).length;
            
            if (isSelected) {
                height = 45; // Primary trait height - no randomness
                bar.classList.add('active');
                this.applyTraitColor(bar, harmony, 'primary');
                
                // Trigger resonance effects
                this.triggerResonance(trait);
            } else if (resonanceCount > 0) {
                height = 20 + (resonanceCount * 5); // Resonance height - clean calculation
                bar.classList.add('resonance');
                bar.classList.remove('active');
                this.applyTraitColor(bar, harmony, 'resonance');
            } else {
                height = 8; // Base height - consistent
                bar.classList.remove('active', 'resonance');
                this.applyTraitColor(bar, harmony, 'neutral');
            }
            
            // Apply height with smooth transition
            bar.style.height = `${Math.min(height, 65)}px`;
            bar.style.transition = 'all 0.3s ease';
            
            // Add click handler for interactive soundbars
            if (!bar.hasClickHandler) {
                bar.addEventListener('click', () => this.toggleTraitFromSoundbar(trait));
                bar.style.cursor = 'pointer';
                bar.hasClickHandler = true;
            }
        });
    }

    getTraitResonance(trait) {
        // Define trait relationship matrix for resonance effects
        const resonanceMatrix = {
            // Creative cluster
            'brush': ['fire', 'lightning', 'diamond', 'cycle'],
            'fire': ['brush', 'lightning', 'crown', 'hammer'],
            'lightning': ['fire', 'brush', 'crown', 'wrench'],
            
            // Technical cluster  
            'wrench': ['sword', 'hammer', 'pencil', 'lightning'],
            'sword': ['wrench', 'magnify', 'eyes', 'shield'],
            'hammer': ['wrench', 'fire', 'crown', 'plant'],
            'pencil': ['wrench', 'sword', 'magnify', 'diamond'],
            
            // Social cluster
            'heart': ['smile', 'link', 'plant', 'shield'],
            'smile': ['heart', 'link', 'crown', 'fire'],
            'link': ['heart', 'smile', 'cycle', 'plant'],
            
            // Leadership cluster
            'crown': ['fire', 'lightning', 'smile', 'hammer'],
            'shield': ['sword', 'heart', 'eyes', 'warning'],
            
            // Analytical cluster
            'magnify': ['sword', 'eyes', 'pencil', 'cycle'],
            'eyes': ['magnify', 'sword', 'warning', 'shield'],
            'warning': ['eyes', 'shield', 'sword', 'cycle'],
            
            // Growth cluster
            'plant': ['heart', 'link', 'hammer', 'cycle'],
            'cycle': ['plant', 'brush', 'magnify', 'warning'],
            'diamond': ['brush', 'pencil', 'crown', 'lightning']
        };
        
        return resonanceMatrix[trait] || [];
    }

    applyTraitColor(bar, harmony, state) {
        // Simple brand orange color system with subtle variations
        const colors = {
            primary: '#B8860B',    // Brand amber/gold
            resonance: 'rgba(184, 134, 11, 0.6)',  // Lighter orange for resonance
            neutral: '#ddd'        // Default neutral gray
        };
        
        bar.style.backgroundColor = colors[state];
    }

    triggerResonance(clickedTrait) {
        const relatedTraits = this.getTraitResonance(clickedTrait);
        
        relatedTraits.forEach((relatedTrait, index) => {
            const relatedBar = document.querySelector(`.soundbar[data-trait="${relatedTrait}"]`);
            if (relatedBar && !this.selectedTraits.has(relatedTrait)) {
                // Simple, subtle pulse - no staggering
                setTimeout(() => {
                    relatedBar.classList.add('pulse');
                    setTimeout(() => relatedBar.classList.remove('pulse'), 400);
                }, index * 50); // Shorter delay
            }
        });
    }

    getRelatedTraits(dimension) {
        const traitMappings = {
            openness: ['innovation', 'brush', 'fire', 'lightning', 'cycle'],
            conscientiousness: ['intense-focus', 'wrench', 'sword', 'hammer', 'pencil'],
            extraversion: ['high-energy', 'crown', 'smile', 'fire', 'lightning'],
            agreeableness: ['cooperative', 'heart', 'link', 'plant', 'smile'],
            neuroticism: ['warning', 'eyes', 'shield']
        };
        return traitMappings[dimension] || [];
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

    toggleTraitFromSoundbar(trait) {
        // Find the corresponding trait option in the emoji grid
        const traitOption = document.querySelector(`.trait-option[data-trait="${trait}"]`);
        if (traitOption) {
            // Toggle the trait selection
            const isSelected = this.selectedTraits.has(trait);
            if (isSelected) {
                this.selectedTraits.delete(trait);
                traitOption.classList.remove('selected');
            } else {
                this.selectedTraits.add(trait);
                traitOption.classList.add('selected');
            }
            
            // Update personality scores and UI
            this.calculatePersonalityScores();
            this.updateTraitCounter();
            this.updateSoundbars();
            this.updateRadarCharts();
            
            // Add visual feedback for the clicked soundbar
            const clickedBar = document.querySelector(`.soundbar[data-trait="${trait}"]`);
            if (clickedBar) {
                clickedBar.classList.add('pulse');
                setTimeout(() => clickedBar.classList.remove('pulse'), 600);
            }
        }
    }

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
        
        // Update dynamic character traits
        const traitsElement = document.querySelector('#personaTraits');
        if (traitsElement && match.character.traits) {
            const traitsList = match.character.traits.join(', ');
            const traitsText = `${traitsList}.<br>An expert in pattern recognition, system thinking, uncovering hidden issues.`;
            traitsElement.innerHTML = traitsText;
            traitsElement.style.display = 'block'; // Show the traits when character is generated
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