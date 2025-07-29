// Main Website JavaScript - Performance monitoring and artifact management

// Debug: Verify script is loading
console.log('⚡ main.js script loaded');

// CONFIG object is defined in the inline script block in index.html

// Performance monitoring configuration (defined in index.html inline script)
// MobilePerformanceManager class is defined in index.html inline script to avoid duplication

// Note: MobilePerformanceManager is available globally from the inline script

// Enhanced Mobile Accessibility Manager
class MobileAccessibilityManager {
    constructor() {
        this.setupMobileA11y();
        this.setupScreenReaderSupport();
        this.setupVoiceOverSupport();
        this.setupTalkBackSupport();
        this.addLiveRegions();
    }
    
    setupMobileA11y() {
        // Enhanced focus management for mobile
        document.addEventListener('focusin', (e) => {
            const target = e.target;
            
            // Ensure focused element is visible on mobile
            if (target.classList.contains('glitch-title') || 
                target.classList.contains('spark-magic') ||
                target.classList.contains('chat-control-btn')) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Add focus announcement for screen readers
            if (target.hasAttribute('aria-label')) {
                this.announceToScreenReader(`Focused: ${target.getAttribute('aria-label')}`);
            }
        });
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Handle escape key to close modals
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Handle arrow keys for artifact navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.handleArtifactNavigation(e);
            }
        });
    }
    
    setupScreenReaderSupport() {
        // Add live region for dynamic content announcements
        if (!document.getElementById('sr-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'sr-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
    }
    
    setupVoiceOverSupport() {
        // Enhanced VoiceOver support for iOS
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            document.addEventListener('focus', (e) => {
                if (e.target.classList.contains('interactive-element')) {
                    e.target.setAttribute('aria-describedby', 'vo-hint');
                }
            });
        }
    }
    
    setupTalkBackSupport() {
        // Enhanced TalkBack support for Android
        if (navigator.userAgent.match(/Android/i)) {
            document.addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('touch-interactive')) {
                    e.target.setAttribute('role', 'button');
                }
            });
        }
    }
    
    addLiveRegions() {
        // Add aria-live regions for dynamic content
        const dynamicSections = document.querySelectorAll('.trait-output, .generation-result');
        dynamicSections.forEach(section => {
            section.setAttribute('aria-live', 'polite');
            section.setAttribute('aria-atomic', 'true');
        });
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('sr-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 100);
        }
    }
    
    handleEscapeKey() {
        // Close any open modals or overlays
        const modals = document.querySelectorAll('.modal, .overlay, .popup');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
        });
    }
    
    handleArtifactNavigation(e) {
        const artifacts = document.querySelectorAll('.artifact');
        const currentActive = document.querySelector('.artifact.active');
        
        if (currentActive && artifacts.length > 1) {
            const currentIndex = Array.from(artifacts).indexOf(currentActive);
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : artifacts.length - 1;
            } else {
                newIndex = currentIndex < artifacts.length - 1 ? currentIndex + 1 : 0;
            }
            
            // Switch artifacts
            if (typeof switchArtifact === 'function') {
                switchArtifact(newIndex + 1);
            }
        }
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.setupThemeToggle();
    }
    
    setupThemeToggle() {
        // Theme management functionality
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('preferred-theme', this.currentTheme);
    }
}

function ensureChatInitialized() {
    try {
        // Check if chat system components are available
        if (typeof window.ChatUI === 'undefined' || typeof window.ConversationManager === 'undefined') {
            console.error('❌ Chat system classes not loaded!');
            console.error('💡 Make sure all chat dependencies are included in HTML');
            return null;
        }
        
        // Initialize chat UI if not already done
        if (!window.chatUI) {
            try {
                window.chatUI = new window.ChatUI();
                console.log('✅ ChatUI initialized in ensureChatInitialized');
            } catch (error) {
                console.error('❌ Failed to create ChatUI:', error);
                return null;
            }
        }
        
        // Initialize conversation manager if not already done
        if (!window.conversationManager) {
            window.conversationManager = new window.ConversationManager();
        }
        
        return {
            chatUI: window.chatUI,
            conversationManager: window.conversationManager
        };
        
    } catch (error) {
        console.error('❌ Failed to initialize chat system:', error);
        return null;
    }
}

function setupChatButton() {
    const chatBtn = document.getElementById('chatNowBtn');
    if (!chatBtn) {
        return;
    }
    
    chatBtn.onclick = () => {
        console.log('🎯 Main chat button clicked');
        
        // Initialize chat system if needed
        const chatComponents = ensureChatInitialized();
        if (!chatComponents) {
            console.error('❌ Chat system not available');
            alert('Chat system is initializing. Please try again in a moment.');
            return;
        }
        
        // Start chat with current persona or default character
        const currentPersona = document.getElementById('personaName')?.textContent || 'ConspiracyEl';
        
        if (window.avatarGenerator && typeof window.avatarGenerator.startChatWithCharacter === 'function') {
            try {
                window.avatarGenerator.startChatWithCharacter(currentPersona);
            } catch (error) {
                console.error('❌ Error starting character chat:', error);
                alert('Failed to start chat. Please try again.');
            }
        } else {
            console.error('❌ Avatar generator or startChatWithCharacter method not available');
            alert('Chat system is not properly initialized. Please refresh the page.');
        }
    };
}

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitoring
    window.performanceManager = new window.MobilePerformanceManager();
    
    // Initialize accessibility features
    window.a11yManager = new MobileAccessibilityManager();
    
    // Initialize theme management
    window.themeManager = new ThemeManager();
    
    // Setup chat button
    setupChatButton();
    
    console.log('✅ Main application managers initialized');
});