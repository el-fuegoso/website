class RobotConstruction {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = 650;
        this.y = 400;
        this.width = 80;
        this.height = 100;
        this.scale = 1.5;
        
        // Construction state
        this.currentPhase = 0;
        this.targetPhase = 0;
        this.transitionProgress = 0;
        this.transitionSpeed = 2; // Progress per second
        this.isTransitioning = false;
        
        // Construction platform
        this.platform = {
            x: this.x,
            y: this.y + 40,
            width: 120,
            height: 20
        };
        
        // Robot parts that get constructed
        this.parts = {
            blueprint: {
                opacity: 0,
                color: '#4A90E2',
                strokeWidth: 2,
                dashed: true
            },
            framework: {
                opacity: 0,
                color: '#888888',
                strokeWidth: 3,
                dashed: false
            },
            personality: {
                opacity: 0,
                color: '#004225',
                fillColor: '#FFFFFF',
                strokeWidth: 2
            },
            final: {
                opacity: 0,
                color: '#004225',
                fillColor: '#F0EEE6',
                strokeWidth: 2,
                accessories: []
            }
        };
        
        // Personality-based customization
        this.personalityColors = {
            high: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            medium: ['#96CEB4', '#FECA57', '#48CAE4'],
            low: ['#74B9FF', '#A29BFE', '#6C5CE7']
        };
        
        this.sparkles = [];
        this.lastSparkleTime = 0;
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.platform.x = x;
        this.platform.y = y + 40;
    }
    
    setPhase(phase) {
        if (phase !== this.targetPhase) {
            this.targetPhase = Math.max(0, Math.min(4, phase));
            this.isTransitioning = true;
        }
    }
    
    update(deltaTime) {
        // Update phase transition
        if (this.isTransitioning) {
            const deltaSeconds = deltaTime / 1000;
            
            if (this.currentPhase < this.targetPhase) {
                this.transitionProgress += this.transitionSpeed * deltaSeconds;
                
                if (this.transitionProgress >= 1) {
                    this.transitionProgress = 0;
                    this.currentPhase++;
                    this.onPhaseComplete(this.currentPhase);
                }
            } else {
                this.isTransitioning = false;
            }
        }
        
        // Update sparkles
        this.updateSparkles(deltaTime);
        
        // Add construction sparkles during transition
        if (this.isTransitioning && Date.now() - this.lastSparkleTime > 100) {
            this.addConstructionSparkle();
            this.lastSparkleTime = Date.now();
        }
    }
    
    onPhaseComplete(phase) {
        // Trigger celebration effects
        this.addCelebrationSparkles();
        
        // Update part opacities
        switch (phase) {
            case 1:
                this.parts.blueprint.opacity = 1;
                break;
            case 2:
                this.parts.framework.opacity = 1;
                break;
            case 3:
                this.parts.personality.opacity = 1;
                break;
            case 4:
                this.parts.final.opacity = 1;
                break;
        }
        
        if (phase === this.targetPhase) {
            this.isTransitioning = false;
        }
    }
    
    render() {
        // Draw construction platform
        this.drawPlatform();
        
        // Draw robot based on current phase
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw each phase with appropriate opacity
        if (this.currentPhase >= 1) {
            this.drawBlueprint();
        }
        
        if (this.currentPhase >= 2) {
            this.drawFramework();
        }
        
        if (this.currentPhase >= 3) {
            this.drawPersonalityCore();
        }
        
        if (this.currentPhase >= 4) {
            this.drawFinalForm();
        }
        
        this.ctx.restore();
        
        // Draw sparkles
        this.renderSparkles();
        
        // Draw phase label
        this.drawPhaseLabel();
    }
    
    drawPlatform() {
        const p = this.platform;
        
        // Platform base
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(p.x - p.width/2, p.y, p.width, p.height);
        
        // Platform grid
        this.ctx.strokeStyle = '#888888';
        this.ctx.lineWidth = 1;
        
        for (let x = p.x - p.width/2; x <= p.x + p.width/2; x += 10) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, p.y);
            this.ctx.lineTo(x, p.y + p.height);
            this.ctx.stroke();
        }
        
        for (let y = p.y; y <= p.y + p.height; y += 5) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x - p.width/2, y);
            this.ctx.lineTo(p.x + p.width/2, y);
            this.ctx.stroke();
        }
        
        // Platform supports
        this.ctx.fillStyle = '#555555';
        this.ctx.fillRect(p.x - p.width/2 - 5, p.y + p.height, 10, 10);
        this.ctx.fillRect(p.x + p.width/2 - 5, p.y + p.height, 10, 10);
    }
    
    drawBlueprint() {
        const part = this.parts.blueprint;
        
        this.ctx.save();
        this.ctx.globalAlpha = part.opacity;
        this.ctx.strokeStyle = part.color;
        this.ctx.lineWidth = part.strokeWidth;
        
        if (part.dashed) {
            this.ctx.setLineDash([5, 5]);
        }
        
        // Robot outline
        // Head
        this.ctx.strokeRect(-15, -40, 30, 25);
        
        // Body
        this.ctx.strokeRect(-20, -15, 40, 35);
        
        // Arms
        this.ctx.strokeRect(-35, -10, 12, 20);
        this.ctx.strokeRect(23, -10, 12, 20);
        
        // Legs
        this.ctx.strokeRect(-15, 20, 12, 25);
        this.ctx.strokeRect(3, 20, 12, 25);
        
        // Connection points
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-2, -2, 4, 4); // Center
        this.ctx.fillRect(-15, -25, 4, 4); // Head connection
        this.ctx.fillRect(11, -25, 4, 4);
        
        this.ctx.restore();
    }
    
    drawFramework() {
        const part = this.parts.framework;
        
        this.ctx.save();
        this.ctx.globalAlpha = part.opacity;
        this.ctx.strokeStyle = part.color;
        this.ctx.lineWidth = part.strokeWidth;
        
        // Head frame
        this.ctx.strokeRect(-15, -40, 30, 25);
        this.ctx.strokeRect(-12, -37, 24, 19);
        
        // Body frame
        this.ctx.strokeRect(-20, -15, 40, 35);
        this.ctx.strokeRect(-17, -12, 34, 29);
        
        // Arm frames
        this.ctx.strokeRect(-35, -10, 12, 20);
        this.ctx.strokeRect(23, -10, 12, 20);
        
        // Leg frames
        this.ctx.strokeRect(-15, 20, 12, 25);
        this.ctx.strokeRect(3, 20, 12, 25);
        
        // Internal structure
        this.ctx.beginPath();
        this.ctx.moveTo(-15, -27);
        this.ctx.lineTo(15, -27);
        this.ctx.moveTo(0, -40);
        this.ctx.lineTo(0, -15);
        this.ctx.moveTo(-20, 0);
        this.ctx.lineTo(20, 0);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawPersonalityCore() {
        const part = this.parts.personality;
        
        this.ctx.save();
        this.ctx.globalAlpha = part.opacity;
        
        // Fill robot with personality color
        this.ctx.fillStyle = part.fillColor;
        this.ctx.strokeStyle = part.color;
        this.ctx.lineWidth = part.strokeWidth;
        
        // Head
        this.ctx.fillRect(-15, -40, 30, 25);
        this.ctx.strokeRect(-15, -40, 30, 25);
        
        // Body
        this.ctx.fillRect(-20, -15, 40, 35);
        this.ctx.strokeRect(-20, -15, 40, 35);
        
        // Arms
        this.ctx.fillRect(-35, -10, 12, 20);
        this.ctx.strokeRect(-35, -10, 12, 20);
        this.ctx.fillRect(23, -10, 12, 20);
        this.ctx.strokeRect(23, -10, 12, 20);
        
        // Legs
        this.ctx.fillRect(-15, 20, 12, 25);
        this.ctx.strokeRect(-15, 20, 12, 25);
        this.ctx.fillRect(3, 20, 12, 25);
        this.ctx.strokeRect(3, 20, 12, 25);
        
        // Personality core (glowing center)
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-3, -3, 6, 6);
        
        // Core glow
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-8, -8, 16, 16);
        this.ctx.restore();
        
        this.ctx.restore();
    }
    
    drawFinalForm() {
        const part = this.parts.final;
        
        this.ctx.save();
        this.ctx.globalAlpha = part.opacity;
        
        // Robot body with full details
        this.ctx.fillStyle = part.fillColor;
        this.ctx.strokeStyle = part.color;
        this.ctx.lineWidth = part.strokeWidth;
        
        // Head
        this.ctx.fillRect(-15, -40, 30, 25);
        this.ctx.strokeRect(-15, -40, 30, 25);
        
        // Eyes
        this.ctx.fillStyle = '#4A90E2';
        this.ctx.fillRect(-10, -35, 6, 6);
        this.ctx.fillRect(4, -35, 6, 6);
        
        // Eye glow
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillRect(-12, -37, 10, 10);
        this.ctx.fillRect(2, -37, 10, 10);
        this.ctx.restore();
        
        // Mouth
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-8, -20, 16, 2);
        
        // Body
        this.ctx.fillStyle = part.fillColor;
        this.ctx.fillRect(-20, -15, 40, 35);
        this.ctx.strokeRect(-20, -15, 40, 35);
        
        // Chest panel
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-15, -10, 30, 20);
        this.ctx.fillStyle = part.fillColor;
        this.ctx.fillRect(-12, -7, 24, 14);
        
        // Arms
        this.ctx.fillStyle = part.fillColor;
        this.ctx.fillRect(-35, -10, 12, 20);
        this.ctx.strokeRect(-35, -10, 12, 20);
        this.ctx.fillRect(23, -10, 12, 20);
        this.ctx.strokeRect(23, -10, 12, 20);
        
        // Hands
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-33, 10, 8, 8);
        this.ctx.fillRect(25, 10, 8, 8);
        
        // Legs
        this.ctx.fillStyle = part.fillColor;
        this.ctx.fillRect(-15, 20, 12, 25);
        this.ctx.strokeRect(-15, 20, 12, 25);
        this.ctx.fillRect(3, 20, 12, 25);
        this.ctx.strokeRect(3, 20, 12, 25);
        
        // Feet
        this.ctx.fillStyle = part.color;
        this.ctx.fillRect(-17, 45, 16, 6);
        this.ctx.fillRect(1, 45, 16, 6);
        
        // Antenna
        this.ctx.strokeStyle = part.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -40);
        this.ctx.lineTo(0, -50);
        this.ctx.stroke();
        
        // Antenna light
        this.ctx.fillStyle = '#FF4444';
        this.ctx.fillRect(-2, -52, 4, 4);
        
        this.ctx.restore();
    }
    
    addConstructionSparkle() {
        const sparkle = {
            x: this.x + (Math.random() - 0.5) * 100,
            y: this.y + (Math.random() - 0.5) * 80,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            life: 1,
            maxLife: 1,
            color: '#004225',
            size: Math.random() * 3 + 1
        };
        
        this.sparkles.push(sparkle);
    }
    
    addCelebrationSparkles() {
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const speed = 60 + Math.random() * 40;
            
            const sparkle = {
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.5,
                maxLife: 1.5,
                color: this.personalityColors.high[i % 3],
                size: Math.random() * 4 + 2
            };
            
            this.sparkles.push(sparkle);
        }
    }
    
    updateSparkles(deltaTime) {
        const deltaSeconds = deltaTime / 1000;
        
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const sparkle = this.sparkles[i];
            
            sparkle.x += sparkle.vx * deltaSeconds;
            sparkle.y += sparkle.vy * deltaSeconds;
            sparkle.life -= deltaSeconds;
            
            // Apply gravity
            sparkle.vy += 100 * deltaSeconds;
            
            // Apply drag
            sparkle.vx *= 0.98;
            sparkle.vy *= 0.98;
            
            if (sparkle.life <= 0) {
                this.sparkles.splice(i, 1);
            }
        }
    }
    
    renderSparkles() {
        this.ctx.save();
        
        for (const sparkle of this.sparkles) {
            const alpha = sparkle.life / sparkle.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = sparkle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add sparkle effect
            this.ctx.strokeStyle = sparkle.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(sparkle.x - sparkle.size, sparkle.y);
            this.ctx.lineTo(sparkle.x + sparkle.size, sparkle.y);
            this.ctx.moveTo(sparkle.x, sparkle.y - sparkle.size);
            this.ctx.lineTo(sparkle.x, sparkle.y + sparkle.size);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawPhaseLabel() {
        const phaseNames = ['', 'BLUEPRINT', 'FRAMEWORK', 'PERSONALITY', 'COMPLETE'];
        const phaseName = phaseNames[this.currentPhase] || 'STARTING';
        
        this.ctx.save();
        
        const labelX = this.x;
        const labelY = this.y + 80;
        
        // Label background
        this.ctx.fillStyle = 'rgba(0, 66, 37, 0.9)';
        this.ctx.fillRect(labelX - 45, labelY - 15, 90, 25);
        
        // Label border
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(labelX - 45, labelY - 15, 90, 25);
        
        // Label text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px Roboto Mono';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(phaseName, labelX, labelY);
        
        this.ctx.restore();
    }
    
    applyPersonalityTraits(personalityProfile) {
        if (!personalityProfile) return;
        
        // Update colors based on personality
        const colors = this.personalityColors[personalityProfile.enthusiasmLevel] || this.personalityColors.medium;
        
        this.parts.personality.color = colors[0];
        this.parts.final.color = colors[0];
        
        // Add personality-specific accessories
        this.parts.final.accessories = this.generateAccessories(personalityProfile);
    }
    
    generateAccessories(profile) {
        const accessories = [];
        
        // Add accessories based on personality traits
        if (profile.interests && profile.interests.includes('technology')) {
            accessories.push('tech_visor');
        }
        
        if (profile.interests && profile.interests.includes('arts')) {
            accessories.push('creative_brush');
        }
        
        if (profile.enthusiasmLevel === 'high') {
            accessories.push('energy_aura');
        }
        
        return accessories;
    }
    
    getBounds() {
        return {
            x: this.x - (this.width * this.scale) / 2,
            y: this.y - (this.height * this.scale) / 2,
            width: this.width * this.scale,
            height: this.height * this.scale
        };
    }
}

window.RobotConstruction = RobotConstruction;