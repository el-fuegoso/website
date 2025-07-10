class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
        this.maxParticles = 100;
        
        // Particle effects
        this.effects = {
            sparkles: {
                color: '#004225',
                size: 2,
                life: 1,
                gravity: 50,
                drag: 0.95
            },
            confetti: {
                colors: ['#004225', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FECA57'],
                size: 4,
                life: 3,
                gravity: 100,
                drag: 0.98
            },
            construction: {
                color: '#FFD700',
                size: 1.5,
                life: 0.8,
                gravity: 30,
                drag: 0.92
            }
        };
    }
    
    burst(x, y, type = 'sparkles', count = 15) {
        const effect = this.effects[type];
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 80 + Math.random() * 60;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: effect.life + Math.random() * 0.5,
                maxLife: effect.life + Math.random() * 0.5,
                color: Array.isArray(effect.colors) ? 
                    effect.colors[Math.floor(Math.random() * effect.colors.length)] : 
                    effect.color,
                size: effect.size + Math.random() * 2,
                gravity: effect.gravity,
                drag: effect.drag,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 10,
                type: type
            };
            
            this.particles.push(particle);
        }
        
        this.limitParticles();
    }
    
    celebrate(x = 400, y = 300) {
        // Big confetti explosion
        this.burst(x, y, 'confetti', 30);
        
        // Add some sparkles
        setTimeout(() => {
            this.burst(x - 50, y - 50, 'sparkles', 15);
            this.burst(x + 50, y - 50, 'sparkles', 15);
        }, 200);
        
        // More confetti waves
        setTimeout(() => {
            this.burst(x - 100, y, 'confetti', 20);
            this.burst(x + 100, y, 'confetti', 20);
        }, 400);
    }
    
    constructionEffect(x, y) {
        this.burst(x, y, 'construction', 8);
    }
    
    continuousSparkles(x, y, intensity = 1) {
        if (Math.random() < intensity * 0.1) {
            const particle = {
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 0.5) * 30,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                color: '#FFD700',
                size: Math.random() * 2 + 1,
                gravity: 20,
                drag: 0.95,
                rotation: 0,
                rotationSpeed: 0,
                type: 'sparkles'
            };
            
            this.particles.push(particle);
        }
    }
    
    update(deltaTime) {
        const deltaSeconds = deltaTime / 1000;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx * deltaSeconds;
            particle.y += particle.vy * deltaSeconds;
            
            // Apply gravity
            particle.vy += particle.gravity * deltaSeconds;
            
            // Apply drag
            particle.vx *= particle.drag;
            particle.vy *= particle.drag;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * deltaSeconds;
            
            // Update life
            particle.life -= deltaSeconds;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render() {
        this.ctx.save();
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            if (particle.type === 'confetti') {
                this.renderConfetti(particle);
            } else if (particle.type === 'sparkles') {
                this.renderSparkle(particle);
            } else if (particle.type === 'construction') {
                this.renderConstruction(particle);
            }
            
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }
    
    renderConfetti(particle) {
        // Draw confetti piece as a rectangle
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 2);
        
        // Add slight border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 2);
    }
    
    renderSparkle(particle) {
        // Draw sparkle as a star
        this.ctx.fillStyle = particle.color;
        
        // Main circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sparkle rays
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        // Horizontal ray
        this.ctx.moveTo(-particle.size * 1.5, 0);
        this.ctx.lineTo(particle.size * 1.5, 0);
        
        // Vertical ray
        this.ctx.moveTo(0, -particle.size * 1.5);
        this.ctx.lineTo(0, particle.size * 1.5);
        
        // Diagonal rays
        this.ctx.moveTo(-particle.size, -particle.size);
        this.ctx.lineTo(particle.size, particle.size);
        
        this.ctx.moveTo(-particle.size, particle.size);
        this.ctx.lineTo(particle.size, -particle.size);
        
        this.ctx.stroke();
    }
    
    renderConstruction(particle) {
        // Draw construction particle as a small gear/cog
        this.ctx.fillStyle = particle.color;
        
        // Main circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Gear teeth
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * particle.size * 1.3;
            const y = Math.sin(angle) * particle.size * 1.3;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }
    
    limitParticles() {
        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(-this.maxParticles);
        }
    }
    
    clear() {
        this.particles = [];
    }
    
    getParticleCount() {
        return this.particles.length;
    }
}

window.ParticleSystem = ParticleSystem;