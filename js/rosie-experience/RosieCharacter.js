class RosieCharacter {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = 150;
        this.y = 400;
        this.width = 64;
        this.height = 64;
        this.scale = 2.5; // Make Rosie bigger
        
        // Animation state
        this.currentAnimation = 'idle';
        this.currentFrame = 0;
        this.frameTime = 0;
        this.animationSpeed = 200; // ms per frame
        this.animationComplete = false;
        
        // Animation definitions
        this.animations = {
            idle: {
                frames: 4,
                loop: true,
                speed: 800,
                onComplete: null
            },
            tailWag: {
                frames: 6,
                loop: false,
                speed: 150,
                onComplete: () => this.playAnimation('idle')
            },
            headTilt: {
                frames: 4,
                loop: false,
                speed: 300,
                onComplete: () => this.playAnimation('idle')
            },
            excitement: {
                frames: 8,
                loop: false,
                speed: 120,
                onComplete: () => this.playAnimation('idle')
            }
        };
        
        this.sprites = {};
        this.isLoaded = false;
        this.generateSprites();
    }
    
    generateSprites() {
        // Since we can't load external images easily, we'll create pixel art programmatically
        // This creates a simple dalmatian representation based on Rosie's photos
        
        this.sprites.idle = this.createIdleSprites();
        this.sprites.tailWag = this.createTailWagSprites();
        this.sprites.headTilt = this.createHeadTiltSprites();
        this.sprites.excitement = this.createExcitementSprites();
        
        this.isLoaded = true;
    }
    
    createIdleSprites() {
        const sprites = [];
        
        for (let i = 0; i < 4; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            this.drawRosieBase(ctx);
            
            // Add subtle breathing animation
            const breatheOffset = Math.sin(i * Math.PI / 2) * 0.5;
            this.drawRosieDetails(ctx, 0, breatheOffset);
            
            sprites.push(canvas);
        }
        
        return sprites;
    }
    
    createTailWagSprites() {
        const sprites = [];
        
        for (let i = 0; i < 6; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            this.drawRosieBase(ctx);
            
            // Tail wag animation
            const wagAngle = Math.sin(i * Math.PI / 2) * 0.3;
            this.drawRosieDetails(ctx, wagAngle, 0);
            
            sprites.push(canvas);
        }
        
        return sprites;
    }
    
    createHeadTiltSprites() {
        const sprites = [];
        
        for (let i = 0; i < 4; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            this.drawRosieBase(ctx);
            
            // Head tilt animation
            const tiltAngle = (i < 2) ? i * 0.1 : (4 - i) * 0.1;
            this.drawRosieDetails(ctx, 0, 0, tiltAngle);
            
            sprites.push(canvas);
        }
        
        return sprites;
    }
    
    createExcitementSprites() {
        const sprites = [];
        
        for (let i = 0; i < 8; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            this.drawRosieBase(ctx);
            
            // Excitement animation - bouncing
            const bounceOffset = Math.abs(Math.sin(i * Math.PI / 4)) * 2;
            const wagAngle = Math.sin(i * Math.PI / 2) * 0.5;
            this.drawRosieDetails(ctx, wagAngle, -bounceOffset);
            
            sprites.push(canvas);
        }
        
        return sprites;
    }
    
    drawRosieBase(ctx) {
        ctx.imageSmoothingEnabled = false;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw Rosie's body (sitting position)
        // Body
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(20, 35, 24, 25); // Main body
        
        // Chest
        ctx.fillRect(18, 30, 28, 15);
        
        // Head
        ctx.fillRect(22, 12, 20, 20);
        
        // Ears
        ctx.fillStyle = '#000000';
        ctx.fillRect(20, 10, 6, 8); // Left ear
        ctx.fillRect(38, 10, 6, 8); // Right ear
        
        // Add white inside ears
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(21, 12, 4, 5);
        ctx.fillRect(39, 12, 4, 5);
        
        // Front legs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(20, 50, 6, 12);
        ctx.fillRect(38, 50, 6, 12);
        
        // Back legs (sitting)
        ctx.fillRect(26, 55, 8, 7);
        ctx.fillRect(30, 55, 8, 7);
    }
    
    drawRosieDetails(ctx, tailWag = 0, bounce = 0, headTilt = 0) {
        ctx.save();
        
        // Apply bounce offset
        ctx.translate(0, bounce);
        
        // Draw spots (based on Rosie's actual pattern)
        ctx.fillStyle = '#000000';
        
        // Face spots
        ctx.fillRect(24, 14, 3, 3); // Left eye area
        ctx.fillRect(37, 14, 3, 3); // Right eye area
        ctx.fillRect(26, 24, 4, 3); // Nose area
        ctx.fillRect(34, 26, 2, 2); // Cheek spot
        
        // Body spots
        ctx.fillRect(22, 32, 3, 4); // Shoulder spot
        ctx.fillRect(36, 35, 4, 3); // Back spot
        ctx.fillRect(19, 42, 2, 3); // Side spot
        ctx.fillRect(28, 38, 3, 4); // Center spot
        ctx.fillRect(40, 45, 3, 2); // Hip spot
        
        // Leg spots
        ctx.fillRect(21, 52, 2, 2);
        ctx.fillRect(40, 54, 2, 2);
        
        // Eyes
        ctx.fillStyle = '#8B4513'; // Brown eyes like in the photo
        ctx.fillRect(26, 16, 2, 2);
        ctx.fillRect(36, 16, 2, 2);
        
        // Eye highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(26, 16, 1, 1);
        ctx.fillRect(36, 16, 1, 1);
        
        // Nose
        ctx.fillStyle = '#000000';
        ctx.fillRect(31, 22, 2, 2);
        
        // Mouth
        ctx.fillRect(30, 25, 4, 1);
        
        // Tongue (sometimes visible)
        if (this.currentAnimation === 'excitement' || this.currentAnimation === 'tailWag') {
            ctx.fillStyle = '#FFB6C1';
            ctx.fillRect(31, 26, 2, 1);
        }
        
        // Tail with wag animation
        ctx.save();
        ctx.translate(44, 40);
        ctx.rotate(tailWag);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 8, 3);
        ctx.fillRect(6, -2, 6, 3);
        
        // Tail spots
        ctx.fillStyle = '#000000';
        ctx.fillRect(1, 1, 2, 1);
        ctx.fillRect(7, 0, 2, 1);
        
        ctx.restore();
        
        // Red collar (like in the photo)
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(24, 30, 16, 3);
        
        // Collar buckle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(30, 30, 4, 3);
        ctx.fillStyle = '#000000';
        ctx.fillRect(31, 31, 2, 1);
        
        ctx.restore();
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    playAnimation(animationName) {
        if (this.animations[animationName]) {
            this.currentAnimation = animationName;
            this.currentFrame = 0;
            this.frameTime = 0;
            this.animationComplete = false;
        }
    }
    
    update(deltaTime) {
        if (!this.isLoaded) return;
        
        const animation = this.animations[this.currentAnimation];
        if (!animation) return;
        
        this.frameTime += deltaTime;
        
        if (this.frameTime >= animation.speed) {
            this.frameTime = 0;
            this.currentFrame++;
            
            if (this.currentFrame >= animation.frames) {
                if (animation.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = animation.frames - 1;
                    if (!this.animationComplete) {
                        this.animationComplete = true;
                        if (animation.onComplete) {
                            animation.onComplete();
                        }
                    }
                }
            }
        }
    }
    
    render() {
        if (!this.isLoaded) return;
        
        const sprites = this.sprites[this.currentAnimation];
        if (!sprites || !sprites[this.currentFrame]) return;
        
        const sprite = sprites[this.currentFrame];
        
        // Draw sprite scaled up
        this.ctx.save();
        this.ctx.imageSmoothingEnabled = false;
        
        this.ctx.drawImage(
            sprite,
            this.x - (this.width * this.scale) / 2,
            this.y - (this.height * this.scale) / 2,
            this.width * this.scale,
            this.height * this.scale
        );
        
        this.ctx.restore();
        
        // Draw name label
        this.drawNameLabel();
    }
    
    drawNameLabel() {
        this.ctx.save();
        
        const labelX = this.x;
        const labelY = this.y + (this.height * this.scale) / 2 + 25;
        
        // Label background
        this.ctx.fillStyle = 'rgba(0, 66, 37, 0.9)';
        this.ctx.fillRect(labelX - 30, labelY - 15, 60, 25);
        
        // Label border
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(labelX - 30, labelY - 15, 60, 25);
        
        // Label text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Roboto Mono';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ROSIE', labelX, labelY);
        
        this.ctx.restore();
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

window.RosieCharacter = RosieCharacter;