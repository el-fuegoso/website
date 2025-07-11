/**
 * CharacterTerminal.js - Terminal-style character display window
 * Shows generated avatar information in a draggable terminal interface
 */

class CharacterTerminal {
    constructor() {
        this.container = null;
        this.isVisible = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentAvatar = null;
        this.position = { x: 50, y: 50 }; // Default position
    }

    show(avatarData) {
        this.currentAvatar = avatarData;
        
        if (!this.container) {
            this.createTerminal();
        }
        
        this.updateContent(avatarData);
        this.container.style.display = 'block';
        this.isVisible = true;
        
        // Add to DOM if not already there
        if (!document.body.contains(this.container)) {
            document.body.appendChild(this.container);
        }
        
        // Animate in
        setTimeout(() => {
            this.container.style.opacity = '1';
            this.container.style.transform = 'scale(1)';
        }, 10);
        
        console.log(`🖥️ Character terminal opened for ${avatarData.name}`);
    }

    hide() {
        if (this.container) {
            this.container.style.opacity = '0';
            this.container.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.container.style.display = 'none';
                this.isVisible = false;
            }, 200);
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else if (this.currentAvatar) {
            this.show(this.currentAvatar);
        }
    }

    createTerminal() {
        this.container = document.createElement('div');
        this.container.className = 'character-terminal';
        this.container.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-controls">
                    <div class="terminal-control close" title="Close"></div>
                    <div class="terminal-control minimize" title="Minimize"></div>
                    <div class="terminal-control maximize" title="Maximize"></div>
                </div>
                <div class="terminal-title">Character Profile</div>
                <div class="terminal-drag-handle"></div>
            </div>
            <div class="terminal-content">
                <div class="character-info">
                    <!-- Content will be populated by updateContent -->
                </div>
            </div>
        `;

        // Apply styles to match TerminalQuestionnaire exactly with mobile support
        const isMobile = window.innerWidth <= 768;
        Object.assign(this.container.style, {
            position: 'fixed',
            left: isMobile ? '5px' : `${this.position.x}px`,
            top: isMobile ? '5px' : `${this.position.y}px`,
            width: isMobile ? 'calc(100vw - 10px)' : '600px',
            maxWidth: isMobile ? 'none' : '90vw',
            height: isMobile ? 'calc(100vh - 10px)' : 'auto',
            maxHeight: isMobile ? 'none' : '70vh',
            background: '#1a1a1a',
            color: '#00ff00',
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? '16px' : '14px',
            borderRadius: isMobile ? '12px' : '8px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            zIndex: '10001',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            display: 'none',
            opacity: '0',
            transform: `translate(0, 0) scale(0.95)`
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        const header = this.container.querySelector('.terminal-header');
        const closeBtn = this.container.querySelector('.terminal-control.close');
        const minimizeBtn = this.container.querySelector('.terminal-control.minimize');

        // Only add dragging functionality on desktop
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            header.addEventListener('mousedown', this.startDrag.bind(this));
            document.addEventListener('mousemove', this.drag.bind(this));
            document.addEventListener('mouseup', this.stopDrag.bind(this));
            header.addEventListener('selectstart', (e) => e.preventDefault());
        }

        // Close button
        closeBtn.addEventListener('click', () => this.hide());
        
        // Minimize button (same as close for now)
        minimizeBtn.addEventListener('click', () => this.hide());
    }

    startDrag(e) {
        if (e.target.closest('.terminal-control')) return;
        
        this.isDragging = true;
        const rect = this.container.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        this.container.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        this.position = {
            x: e.clientX - this.dragOffset.x,
            y: e.clientY - this.dragOffset.y
        };
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - this.container.offsetWidth;
        const maxY = window.innerHeight - this.container.offsetHeight;
        
        this.position.x = Math.max(0, Math.min(this.position.x, maxX));
        this.position.y = Math.max(0, Math.min(this.position.y, maxY));
        
        this.container.style.left = `${this.position.x}px`;
        this.container.style.top = `${this.position.y}px`;
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.container.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }

    updateContent(avatarData) {
        const contentDiv = this.container.querySelector('.character-info');
        const archetype = avatarData.metadata?.archetype || 'Unknown';
        const emoji = this.getArchetypeEmoji(archetype);
        
        contentDiv.innerHTML = `
            <div class="character-header">
                <div class="character-avatar">${emoji}</div>
                <div class="character-title">
                    <h2>${avatarData.name}</h2>
                    <p class="character-subtitle">${avatarData.title}</p>
                </div>
            </div>
            
            <div class="character-section">
                <h3>▶ Personality</h3>
                <p>${avatarData.summary}</p>
            </div>
            
            <div class="character-section">
                <h3>▶ Working Style</h3>
                <p>${avatarData.workingStyle}</p>
            </div>
            
            <div class="character-section">
                <h3>▶ Communication</h3>
                <p>${avatarData.communication}</p>
            </div>
            
            <div class="character-section">
                <h3>▶ Project Approach</h3>
                <p>${avatarData.projectApproach}</p>
            </div>
            
            <div class="character-section">
                <h3>▶ Core Strengths</h3>
                <div class="strengths-list">
                    ${avatarData.strengths ? avatarData.strengths.map(s => `<span class="strength-tag">${s}</span>`).join('') : 'Adaptable, Reliable'}
                </div>
            </div>
            
            <div class="character-section">
                <h3>▶ Collaboration Style</h3>
                <p>${avatarData.collaboration}</p>
            </div>
            
            <div class="character-section">
                <h3>▶ Preferred Tools</h3>
                <div class="tools-list">
                    ${avatarData.tools ? avatarData.tools.map(t => `<span class="tool-tag">${t}</span>`).join('') : 'Documentation, Planning'}
                </div>
            </div>
            
            <div class="character-section motto">
                <h3>▶ Motto</h3>
                <p class="motto-text">"${avatarData.motto}"</p>
            </div>
            
            <div class="character-footer">
                <p class="archetype-info">Archetype: ${archetype} | Confidence: ${Math.round((avatarData.metadata?.confidence || 0.8) * 100)}%</p>
                <p class="generation-info">Generated: ${avatarData.metadata?.generationMethod || 'template-based'} | ${new Date().toLocaleTimeString()}</p>
            </div>
        `;
    }

    getArchetypeEmoji(archetype) {
        const emojiMap = {
            'TheStrategist': '🎯',
            'TheBuilder': '🔨',
            'TheBridge': '🌉',
            'TheInnovator': '💡',
            'TheExplorer': '🧭',
            'TheDetective': '🔍',
            'TheMaster': '🏆',
            'TheVeteran': '⚔️',
            'TheSkeptic': '🤔',
            'TheDisruptor': '⚡',
            'TheHustler': '🚀'
        };
        return emojiMap[archetype] || '🤖';
    }

    // Add CSS styles dynamically
    static addStyles() {
        if (document.getElementById('character-terminal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'character-terminal-styles';
        style.textContent = `
            .character-terminal {
                color: #00ff00;
                line-height: 1.4;
            }
            
            .terminal-header {
                background: #2a2a2a;
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #444;
                cursor: grab;
                user-select: none;
            }
            
            .terminal-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .terminal-control {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                cursor: pointer;
                transition: opacity 0.2s;
                border: none;
                outline: none;
            }
            
            .terminal-control:hover {
                opacity: 0.8;
            }
            
            .terminal-control.close {
                background: #ff5f56;
            }
            
            .terminal-control.minimize {
                background: #ffbd2e;
            }
            
            .terminal-control.maximize {
                background: #27ca3f;
            }
            
            .terminal-title {
                color: #ffffff;
                font-weight: bold;
                flex: 1;
                text-align: center;
                font-size: 12px;
            }
            
            .terminal-content {
                padding: 16px;
                max-height: calc(70vh - 60px);
                overflow-y: auto;
                background: #1a1a1a;
                color: #00ff00;
                -webkit-overflow-scrolling: touch;
            }
            
            @media (max-width: 768px) {
                .terminal-content {
                    padding: 12px;
                    max-height: calc(100vh - 80px);
                    font-size: 16px;
                }
                
                .terminal-control {
                    width: 16px !important;
                    height: 16px !important;
                    touch-action: manipulation;
                }
                
                .terminal-header {
                    padding: 16px 20px !important;
                    cursor: default !important;
                }
                
                .character-avatar {
                    font-size: 2.5rem !important;
                }
                
                .character-title h2 {
                    font-size: 1.2rem !important;
                }
                
                .character-subtitle {
                    font-size: 0.8rem !important;
                }
                
                .strength-tag, .tool-tag {
                    padding: 4px 8px !important;
                    font-size: 0.9rem !important;
                }
            }
            
            .character-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 1px solid #333;
            }
            
            .character-avatar {
                font-size: 3rem;
                line-height: 1;
            }
            
            .character-title h2 {
                margin: 0;
                color: #00ff00;
                font-size: 1.4rem;
                font-weight: bold;
            }
            
            .character-subtitle {
                margin: 4px 0 0 0;
                color: #888;
                font-size: 0.9rem;
            }
            
            .character-section {
                margin-bottom: 16px;
            }
            
            .character-section h3 {
                margin: 0 0 8px 0;
                color: #00ccff;
                font-size: 0.9rem;
                font-weight: bold;
            }
            
            .character-section p {
                margin: 0;
                color: #cccccc;
                line-height: 1.5;
            }
            
            .strengths-list, .tools-list {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 4px;
            }
            
            .strength-tag, .tool-tag {
                background: #1a4a1a;
                color: #00ff00;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                border: 1px solid #2a5a2a;
            }
            
            .tool-tag {
                background: #1a1a4a;
                color: #00ccff;
                border-color: #2a2a5a;
            }
            
            .motto {
                background: #1a1a1a;
                padding: 12px;
                border-radius: 4px;
                border-left: 3px solid #00ff00;
            }
            
            .motto-text {
                font-style: italic;
                color: #00ff00 !important;
                font-weight: bold;
            }
            
            .character-footer {
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid #333;
            }
            
            .archetype-info, .generation-info {
                margin: 0;
                color: #666;
                font-size: 0.8rem;
            }
            
            .generation-info {
                margin-top: 4px;
            }
            
            /* Scrollbar styling */
            .terminal-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .terminal-content::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            
            .terminal-content::-webkit-scrollbar-thumb {
                background: #333;
                border-radius: 4px;
            }
            
            .terminal-content::-webkit-scrollbar-thumb:hover {
                background: #444;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Add styles when class is loaded
CharacterTerminal.addStyles();

// Export for global access
window.CharacterTerminal = CharacterTerminal;