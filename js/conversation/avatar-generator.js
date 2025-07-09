class AvatarGenerator {
    constructor() {
        this.avatarCache = new Map();
    }

    generateAvatar(name) {
        if (this.avatarCache.has(name)) {
            return this.avatarCache.get(name);
        }

        const avatar = this.createSVGAvatar(name);
        this.avatarCache.set(name, avatar);
        return avatar;
    }

    createSVGAvatar(name) {
        const initials = this.getInitials(name);
        const colors = this.getColorForName(name);
        
        const svg = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient-${this.hashCode(name)}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#gradient-${this.hashCode(name)})" />
                <text x="16" y="21" text-anchor="middle" fill="white" font-family="Roboto Mono, monospace" font-size="12" font-weight="600">
                    ${initials}
                </text>
            </svg>
        `;
        
        return svg;
    }

    getInitials(name) {
        if (!name) return '?';
        
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        } else {
            return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
        }
    }

    getColorForName(name) {
        const hash = this.hashCode(name);
        const hue = Math.abs(hash) % 360;
        
        const colorSchemes = [
            { primary: `hsl(${hue}, 70%, 50%)`, secondary: `hsl(${hue + 30}, 70%, 60%)` },
            { primary: `hsl(${hue}, 60%, 45%)`, secondary: `hsl(${hue + 45}, 60%, 55%)` },
            { primary: `hsl(${hue}, 80%, 40%)`, secondary: `hsl(${hue + 60}, 80%, 50%)` },
        ];
        
        return colorSchemes[Math.abs(hash) % colorSchemes.length];
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    generateClaudeAvatar() {
        return `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="claude-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#f7931e;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#claude-gradient)" />
                <text x="16" y="21" text-anchor="middle" fill="white" font-family="Roboto Mono, monospace" font-size="12" font-weight="600">
                    C
                </text>
            </svg>
        `;
    }

    generateUserAvatar() {
        return `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="user-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#004225;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#006b3a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#user-gradient)" />
                <text x="16" y="21" text-anchor="middle" fill="white" font-family="Roboto Mono, monospace" font-size="12" font-weight="600">
                    U
                </text>
            </svg>
        `;
    }

    clearCache() {
        this.avatarCache.clear();
    }
}

window.AvatarGenerator = AvatarGenerator;