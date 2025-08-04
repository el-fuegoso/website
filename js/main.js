// Main Website JavaScript - Performance monitoring and artifact management

// Debug: Verify script is loading

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
    console.log('🔧 DEBUG: ensureChatInitialized() called');
    
    try {
        // Check if chat system components are available
        console.log('🔍 DEBUG: Checking chat system classes availability:');
        console.log('  - window.ChatUI:', typeof window.ChatUI);
        console.log('  - window.ConversationManager:', typeof window.ConversationManager);
        console.log('  - window.chatUI instance exists:', !!window.chatUI);
        console.log('  - window.conversationManager instance exists:', !!window.conversationManager);
        
        if (typeof window.ChatUI === 'undefined' || typeof window.ConversationManager === 'undefined') {
            console.error('❌ DEBUG: Chat system classes not loaded!');
            console.error('💡 DEBUG: Missing classes - ChatUI:', typeof window.ChatUI, 'ConversationManager:', typeof window.ConversationManager);
            console.error('💡 DEBUG: Make sure all chat dependencies are included in HTML');
            console.log('🔍 DEBUG: Available window objects with Chat/Conversation:', Object.keys(window).filter(key => key.includes('Chat') || key.includes('Conversation')));
            return null;
        }
        
        // Initialize chat UI if not already done
        if (!window.chatUI) {
            console.log('🔧 DEBUG: Creating new ChatUI instance...');
            try {
                window.chatUI = new window.ChatUI();
                console.log('✅ DEBUG: ChatUI initialized successfully in ensureChatInitialized');
                console.log('🔍 DEBUG: ChatUI instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.chatUI)));
            } catch (error) {
                console.error('❌ DEBUG: Failed to create ChatUI instance:', error);
                console.error('❌ DEBUG: ChatUI constructor error stack:', error.stack);
                return null;
            }
        } else {
            console.log('✅ DEBUG: Existing ChatUI instance found');
        }
        
        // Initialize conversation manager if not already done
        if (!window.conversationManager) {
            console.log('🔧 DEBUG: Creating new ConversationManager instance...');
            try {
                window.conversationManager = new window.ConversationManager();
                console.log('✅ DEBUG: ConversationManager initialized successfully');
            } catch (error) {
                console.error('❌ DEBUG: Failed to create ConversationManager:', error);
                console.error('❌ DEBUG: ConversationManager error stack:', error.stack);
                return null;
            }
        } else {
            console.log('✅ DEBUG: Existing ConversationManager instance found');
        }
        
        const result = {
            chatUI: window.chatUI,
            conversationManager: window.conversationManager
        };
        
        console.log('✅ DEBUG: ensureChatInitialized completed successfully:', {
            hasChatUI: !!result.chatUI,
            hasConversationManager: !!result.conversationManager
        });
        
        return result;
        
    } catch (error) {
        console.error('❌ DEBUG: Unexpected error in ensureChatInitialized:', error);
        console.error('❌ DEBUG: Error stack:', error.stack);
        return null;
    }
}

function setupChatButton() {
    console.log('🔧 DEBUG: setupChatButton() called');
    
    const chatBtn = document.getElementById('chatNowBtn');
    console.log('🔍 DEBUG: Chat button element:', chatBtn);
    console.log('🔍 DEBUG: Button exists:', !!chatBtn);
    
    if (!chatBtn) {
        console.error('❌ DEBUG: Chat button not found - checking DOM state');
        console.log('🔍 DEBUG: All buttons in DOM:', document.querySelectorAll('button'));
        console.log('🔍 DEBUG: Elements with chatNowBtn ID:', document.querySelectorAll('#chatNowBtn'));
        return;
    }
    
    // Log button current state
    console.log('🔍 DEBUG: Button disabled:', chatBtn.disabled);
    console.log('🔍 DEBUG: Button style.display:', chatBtn.style.display);
    console.log('🔍 DEBUG: Button style.opacity:', chatBtn.style.opacity);
    console.log('🔍 DEBUG: Button onclick before setup:', chatBtn.onclick);
    
    chatBtn.onclick = () => {
        console.log('🎯 DEBUG: Main chat button clicked - starting diagnostic flow');
        
        // Log current window state
        console.log('🔍 DEBUG: window.avatarGenerator exists:', !!window.avatarGenerator);
        console.log('🔍 DEBUG: avatarGenerator methods:', window.avatarGenerator ? Object.getOwnPropertyNames(Object.getPrototypeOf(window.avatarGenerator)) : 'N/A');
        
        // Initialize chat system if needed
        console.log('🔧 DEBUG: Calling ensureChatInitialized()');
        const chatComponents = ensureChatInitialized();
        console.log('🔍 DEBUG: ensureChatInitialized result:', chatComponents);
        
        if (!chatComponents) {
            console.error('❌ DEBUG: Chat system not available - initialization failed');
            alert('Chat system is initializing. Please try again in a moment.');
            return;
        }
        
        // Start chat with current persona or default character
        const personaElement = document.getElementById('personaName');
        console.log('🔍 DEBUG: personaName element:', personaElement);
        const currentPersona = personaElement?.textContent || 'ConspiracyEl';
        console.log('🔍 DEBUG: Current persona for chat:', currentPersona);
        
        if (window.avatarGenerator && typeof window.avatarGenerator.startChatWithCharacter === 'function') {
            try {
                console.log('🚀 DEBUG: Calling startChatWithCharacter with:', currentPersona);
                window.avatarGenerator.startChatWithCharacter(currentPersona);
                console.log('✅ DEBUG: startChatWithCharacter call completed');
            } catch (error) {
                console.error('❌ DEBUG: Error starting character chat:', error);
                console.error('❌ DEBUG: Error stack:', error.stack);
                alert('Failed to start chat. Please try again.');
            }
        } else {
            console.error('❌ DEBUG: Avatar generator conditions failed:');
            console.error('  - avatarGenerator exists:', !!window.avatarGenerator);
            console.error('  - startChatWithCharacter method exists:', window.avatarGenerator ? typeof window.avatarGenerator.startChatWithCharacter : 'N/A');
            console.error('  - startChatWithCharacter is function:', window.avatarGenerator ? typeof window.avatarGenerator.startChatWithCharacter === 'function' : 'N/A');
            alert('Chat system is not properly initialized. Please refresh the page.');
        }
    };
    
    console.log('✅ DEBUG: Chat button onclick handler attached');
    console.log('🔍 DEBUG: Button onclick after setup:', chatBtn.onclick);
}

// Debug function to check chat system state - can be called from console
window.debugChatSystem = function() {
    console.log('🔍 === CHAT SYSTEM DEBUG REPORT ===');
    
    // Check button existence and state
    const chatBtn = document.getElementById('chatNowBtn');
    console.log('🔘 Chat Button Status:');
    console.log('  - exists:', !!chatBtn);
    if (chatBtn) {
        console.log('  - disabled:', chatBtn.disabled);
        console.log('  - style.display:', chatBtn.style.display);
        console.log('  - style.opacity:', chatBtn.style.opacity);
        console.log('  - style.visibility:', chatBtn.style.visibility);
        console.log('  - has onclick:', !!chatBtn.onclick);
        console.log('  - text content:', chatBtn.textContent?.trim());
    }
    
    // Check classes availability
    console.log('🏗️ Class Availability:');
    console.log('  - window.ChatUI:', typeof window.ChatUI);
    console.log('  - window.ConversationManager:', typeof window.ConversationManager);
    console.log('  - window.AvatarGenerator:', typeof window.AvatarGenerator);
    
    // Check instances
    console.log('🎭 Instance Availability:');
    console.log('  - window.chatUI:', !!window.chatUI);
    console.log('  - window.conversationManager:', !!window.conversationManager);
    console.log('  - window.avatarGenerator:', !!window.avatarGenerator);
    
    // Check character context
    const personaElement = document.getElementById('personaName');
    console.log('👤 Character Context:');
    console.log('  - personaName element exists:', !!personaElement);
    console.log('  - current persona:', personaElement?.textContent || 'Not set');
    
    // Test ensureChatInitialized
    console.log('🔧 Testing ensureChatInitialized...');
    const chatComponents = ensureChatInitialized();
    console.log('  - result:', !!chatComponents);
    
    console.log('🔍 === END DEBUG REPORT ===');
    return {
        buttonExists: !!chatBtn,
        chatSystemReady: !!chatComponents,
        avatarGeneratorReady: !!window.avatarGenerator
    };
};

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DEBUG: DOMContentLoaded event fired');
    
    // Initialize performance monitoring (optional)
    try {
        if (typeof window.MobilePerformanceManager === 'function') {
            window.performanceManager = new window.MobilePerformanceManager();
            console.log('✅ DEBUG: Performance manager initialized');
        } else {
            console.log('ℹ️ DEBUG: MobilePerformanceManager not available - skipping');
        }
    } catch (error) {
        console.warn('⚠️ DEBUG: Failed to initialize performance manager:', error.message);
    }
    
    // Initialize accessibility features (mobile only)
    try {
        if (typeof MobileAccessibilityManager === 'function' && 
            (window.innerWidth <= 768 || 'ontouchstart' in window)) {
            window.a11yManager = new MobileAccessibilityManager();
            console.log('✅ DEBUG: Mobile accessibility manager initialized');
        } else {
            console.log('ℹ️ DEBUG: MobileAccessibilityManager skipped - desktop or not available');
        }
    } catch (error) {
        console.warn('⚠️ DEBUG: Failed to initialize accessibility manager:', error.message);
    }
    
    // Initialize theme management (optional)
    try {
        if (typeof ThemeManager === 'function') {
            window.themeManager = new ThemeManager();
            console.log('✅ DEBUG: Theme manager initialized');
        } else {
            console.log('ℹ️ DEBUG: ThemeManager not available - skipping');
        }
    } catch (error) {
        console.warn('⚠️ DEBUG: Failed to initialize theme manager:', error.message);
    }
    
    // Setup chat button (CRITICAL - always run this)
    try {
        setupChatButton();
        console.log('✅ DEBUG: Chat button setup completed');
    } catch (error) {
        console.error('❌ DEBUG: CRITICAL - Failed to setup chat button:', error);
        console.error('❌ DEBUG: Chat button error stack:', error.stack);
    }
    
    console.log('✅ DEBUG: DOMContentLoaded initialization completed');
    console.log('💡 DEBUG: Use window.debugChatSystem() in console for full chat system diagnosis');
});