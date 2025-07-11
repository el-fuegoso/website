/**
 * AvatarDisplay.js - Avatar results display and interaction interface
 * Handles avatar visualization, sharing, and next-action recommendations
 */

class AvatarDisplay {
    constructor() {
        this.isVisible = false;
        this.currentAvatar = null;
        this.container = null;
        this.dataCollector = new DataCollector();
        this.bindMethods();
    }

    bindMethods() {
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.handleContact = this.handleContact.bind(this);
        this.handlePortfolio = this.handlePortfolio.bind(this);
        this.handleRegenerateAvatar = this.handleRegenerateAvatar.bind(this);
    }

    show(avatarData, personalityData, onClose) {
        if (this.isVisible) return;

        this.currentAvatar = avatarData;
        this.personalityData = personalityData;
        this.onClose = onClose;
        this.createAvatarDisplay();
        this.isVisible = true;

        // Track avatar display
        this.dataCollector.trackEvent('avatar_displayed', {
            archetype: avatarData.metadata?.archetype || 'unknown',
            fallback: avatarData.metadata?.fallback || false
        });
    }

    createAvatarDisplay() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'avatar-display-overlay';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create avatar card
        const avatarCard = this.createAvatarCard();
        this.container.appendChild(avatarCard);

        document.body.appendChild(this.container);

        // Animate in
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 10);

        // Close on overlay click
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });

        // Close on Escape key
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    }

    createAvatarCard() {
        const card = document.createElement('div');
        card.className = 'avatar-card';
        card.style.cssText = `
            background: #1a1a1a;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            border-radius: 12px;
            padding: 0;
            max-width: 800px;
            max-height: 90vh;
            width: 90%;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 255, 0, 0.2);
            border: 2px solid #00ff00;
            position: relative;
        `;

        // Create header
        const header = this.createHeader();
        card.appendChild(header);

        // Create content
        const content = this.createContent();
        card.appendChild(content);

        // Create footer
        const footer = this.createFooter();
        card.appendChild(footer);

        return card;
    }

    createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2a2a2a;
            padding: 20px;
            border-bottom: 1px solid #00ff00;
            position: relative;
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: 1px solid #666;
            color: #ccc;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s ease;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.borderColor = '#ff0000';
            closeBtn.style.color = '#ff0000';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.borderColor = '#666';
            closeBtn.style.color = '#ccc';
        };
        closeBtn.onclick = this.hide;

        // Title
        const title = document.createElement('h2');
        title.textContent = this.currentAvatar.title;
        title.style.cssText = `
            margin: 0 30px 0 0;
            font-size: 24px;
            color: #00ff88;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        `;

        // Generation info
        if (this.currentAvatar.metadata) {
            const info = document.createElement('div');
            info.style.cssText = `
                font-size: 12px;
                color: #666;
                margin-top: 8px;
            `;
            
            const archetype = this.currentAvatar.metadata.archetype || 'Unknown';
            const confidence = Math.round((this.currentAvatar.metadata.confidence || 0) * 100);
            const generationTime = this.currentAvatar.metadata.generationTime || 0;
            
            info.innerHTML = `
                Archetype: ${archetype} • 
                Confidence: ${confidence}% • 
                Generated in ${(generationTime / 1000).toFixed(1)}s
                ${this.currentAvatar.metadata.fallback ? ' • <span style="color: #ffaa00;">Fallback Mode</span>' : ''}
            `;
            
            header.appendChild(info);
        }

        header.appendChild(closeBtn);
        header.appendChild(title);

        return header;
    }

    createContent() {
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            max-height: 60vh;
            overflow-y: auto;
            line-height: 1.6;
        `;

        // Summary
        const summary = document.createElement('div');
        summary.style.cssText = `
            background: #2a2a2a;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #00ff88;
        `;
        summary.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #00ff88; font-size: 16px;">Summary</h3>
            <p style="margin: 0; color: #ccc;">${this.currentAvatar.summary}</p>
        `;

        // Working Style
        const workingStyle = this.createInfoSection('Working Style', this.currentAvatar.workingStyle);

        // Strengths
        const strengths = document.createElement('div');
        strengths.style.cssText = `margin-bottom: 20px;`;
        strengths.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #00ff88; font-size: 16px;">Key Strengths</h3>
            <ul style="margin: 0; padding-left: 20px; color: #ccc;">
                ${this.currentAvatar.strengths.map(strength => `<li style="margin-bottom: 5px;">${strength}</li>`).join('')}
            </ul>
        `;

        // Communication Style
        const communication = this.createInfoSection('Communication Style', this.currentAvatar.communication);

        // Project Approach
        const projectApproach = this.createInfoSection('Project Approach', this.currentAvatar.projectApproach);

        // Unique Value
        const uniqueValue = this.createInfoSection('Unique Value', this.currentAvatar.uniqueValue);

        // Collaboration Dynamic
        const collaborationDynamic = this.createInfoSection('Collaboration Dynamic', this.currentAvatar.collaborationDynamic);

        // Personal Touches (if available)
        if (this.currentAvatar.personalTouches) {
            const personalTouches = this.createInfoSection('Personal Touches', this.currentAvatar.personalTouches);
            content.appendChild(personalTouches);
        }

        content.appendChild(summary);
        content.appendChild(workingStyle);
        content.appendChild(strengths);
        content.appendChild(communication);
        content.appendChild(projectApproach);
        content.appendChild(uniqueValue);
        content.appendChild(collaborationDynamic);

        return content;
    }

    createInfoSection(title, content) {
        const section = document.createElement('div');
        section.style.cssText = `margin-bottom: 20px;`;
        section.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #00ff88; font-size: 16px;">${title}</h3>
            <p style="margin: 0; color: #ccc; padding-left: 16px; border-left: 2px solid #444;">${content}</p>
        `;
        return section;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.style.cssText = `
            background: #2a2a2a;
            padding: 20px;
            border-top: 1px solid #00ff00;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
        `;

        // Action buttons
        const actions = [
            { text: 'Contact El', action: this.handleContact, color: '#00ff88' },
            { text: 'View Portfolio', action: this.handlePortfolio, color: '#4cc9f0' },
            { text: 'Share Avatar', action: this.handleShare, color: '#9d4edd' },
            { text: 'Regenerate', action: this.handleRegenerateAvatar, color: '#ffaa00' }
        ];

        actions.forEach(({ text, action, color }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                background: transparent;
                border: 2px solid ${color};
                color: ${color};
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                transition: all 0.2s ease;
                min-width: 120px;
            `;
            
            button.onmouseover = () => {
                button.style.background = color;
                button.style.color = '#1a1a1a';
            };
            
            button.onmouseout = () => {
                button.style.background = 'transparent';
                button.style.color = color;
            };
            
            button.onclick = action;
            footer.appendChild(button);
        });

        return footer;
    }

    handleContact() {
        // Track contact click
        this.dataCollector.trackEvent('avatar_action_contact', {
            archetype: this.currentAvatar.metadata?.archetype || 'unknown'
        });

        // Scroll to contact section or open email
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            this.hide();
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            // Fallback to email
            window.location.href = 'mailto:elliotjameslee8@gmail.com?subject=Collaboration Opportunity&body=Hi El! I just completed your personality assessment and got matched with ' + this.currentAvatar.title + '. I\'d love to discuss potential collaboration opportunities.';
        }
    }

    handlePortfolio() {
        // Track portfolio click
        this.dataCollector.trackEvent('avatar_action_portfolio', {
            archetype: this.currentAvatar.metadata?.archetype || 'unknown'
        });

        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            this.hide();
            setTimeout(() => {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }

    handleShare() {
        // Track share click
        this.dataCollector.trackEvent('avatar_action_share', {
            archetype: this.currentAvatar.metadata?.archetype || 'unknown'
        });

        const shareText = `I just discovered my personalized El avatar: "${this.currentAvatar.title}"! 

${this.currentAvatar.summary}

Check out Elliot Lee's portfolio to find your own personalized collaboration style: ${window.location.origin}`;

        if (navigator.share) {
            // Use native sharing if available
            navigator.share({
                title: this.currentAvatar.title,
                text: shareText,
                url: window.location.origin
            }).catch(console.error);
        } else if (navigator.clipboard) {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showShareSuccess('Avatar details copied to clipboard!');
            }).catch(() => {
                this.showShareFallback(shareText);
            });
        } else {
            this.showShareFallback(shareText);
        }
    }

    showShareSuccess(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00ff88;
            color: #1a1a1a;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showShareFallback(shareText) {
        // Create a text area for manual copying
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;

        const copyBox = document.createElement('div');
        copyBox.style.cssText = `
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
        `;

        copyBox.innerHTML = `
            <h3 style="color: #00ff88; margin: 0 0 15px 0;">Share Your Avatar</h3>
            <textarea readonly style="width: 100%; height: 150px; background: #1a1a1a; color: #ccc; border: 1px solid #666; padding: 10px; border-radius: 4px; font-family: inherit; resize: none;">${shareText}</textarea>
            <div style="margin-top: 15px; text-align: center;">
                <button style="background: #00ff88; color: #1a1a1a; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Copy Text</button>
                <button style="background: transparent; color: #ccc; border: 1px solid #666; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;

        const textarea = copyBox.querySelector('textarea');
        const copyBtn = copyBox.querySelector('button');
        const closeBtn = copyBox.querySelectorAll('button')[1];

        copyBtn.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => overlay.remove(), 1000);
        };

        closeBtn.onclick = () => overlay.remove();
        overlay.onclick = (e) => e.target === overlay && overlay.remove();

        overlay.appendChild(copyBox);
        document.body.appendChild(overlay);
    }

    handleRegenerateAvatar() {
        // Track regeneration request
        this.dataCollector.trackEvent('avatar_action_regenerate', {
            archetype: this.currentAvatar.metadata?.archetype || 'unknown'
        });

        if (this.onRegenerateCallback) {
            this.hide();
            this.onRegenerateCallback();
        } else {
            alert('Regeneration feature requires API configuration. Please complete the terminal experience again to generate a new avatar.');
        }
    }

    hide() {
        if (!this.isVisible || !this.container) return;

        // Track avatar close
        this.dataCollector.trackEvent('avatar_closed');

        this.container.style.opacity = '0';
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this.container = null;
            this.isVisible = false;
        }, 300);

        // Remove escape key listener
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }

        // Call close callback
        if (this.onClose) {
            this.onClose();
        }
    }

    // Method to set regeneration callback
    setRegenerationCallback(callback) {
        this.onRegenerateCallback = callback;
    }

    // Method to update avatar data (for regeneration)
    updateAvatar(newAvatarData) {
        this.currentAvatar = newAvatarData;
        if (this.isVisible && this.container) {
            // Rebuild the display with new data
            const card = this.container.querySelector('.avatar-card');
            if (card) {
                card.remove();
                const newCard = this.createAvatarCard();
                this.container.appendChild(newCard);
            }
        }
    }

    // Static method to check if display is currently active
    static isDisplayActive() {
        return document.querySelector('.avatar-display-overlay') !== null;
    }
}

// Export for global access
window.AvatarDisplay = AvatarDisplay;