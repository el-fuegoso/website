// Main Website JavaScript - Performance monitoring and artifact management

// CONFIG object is defined in the inline script block in index.html

// Performance monitoring configuration
const PERFORMANCE_CONFIG = {
    battery: {
        lowThreshold: 0.2,
        criticalThreshold: 0.1
    },
    thermal: {
        throttleTemp: 45, // Celsius
        shutdownTemp: 55
    },
    network: {
        slowConnection: ['slow-2g', '2g'],
        fastConnection: ['4g', '5g']
    },
    performance: {
        targetFPS: 60,
        minFPS: 30
    }
};

// Mobile Performance Manager
class MobilePerformanceManager {
    constructor() {
        this.isLowPower = false;
        this.isCriticalMode = false;
        this.currentFPS = 60;
        this.frameCount = 0;
        this.lastFPSUpdate = Date.now();
        this.originalConfig = this.backupConfig();
        this.setupMonitoring();
    }
    
    backupConfig() {
        return JSON.parse(JSON.stringify(CONFIG.artifacts));
    }
    
    async setupMonitoring() {
        // Battery API monitoring
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                this.monitorBattery(battery);
            } catch (e) {
                console.log('Battery API not available');
            }
        }
        
        // Network connection monitoring
        if ('connection' in navigator) {
            this.monitorConnection();
        }
        
        // Frame rate monitoring
        this.startFPSMonitoring();
        
        // Visibility change optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseHeavyAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Device memory monitoring (if available)
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            this.enableLowMemoryMode();
        }
    }
    
    monitorBattery(battery) {
        const checkBattery = () => {
            const batteryInfo = {
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            };
            
            if (battery.level < PERFORMANCE_CONFIG.battery.criticalThreshold) {
                this.enableCriticalMode(batteryInfo);
            } else if (battery.level < PERFORMANCE_CONFIG.battery.lowThreshold) {
                this.enableLowPowerMode(batteryInfo);
            } else if (!battery.charging && this.isLowPower) {
                // Only disable low power if we're not charging and battery is good
                this.disableLowPowerMode();
            }
        };
        
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
        checkBattery();
    }
    
    monitorConnection() {
        const connection = navigator.connection;
        const checkConnection = () => {
            if (PERFORMANCE_CONFIG.network.slowConnection.includes(connection.effectiveType)) {
                this.enableLowBandwidthMode();
            } else if (PERFORMANCE_CONFIG.network.fastConnection.includes(connection.effectiveType)) {
                this.disableLowBandwidthMode();
            }
        };
        
        connection.addEventListener('change', checkConnection);
        checkConnection();
    }
    
    startFPSMonitoring() {
        const measureFPS = () => {
            this.frameCount++;
            const now = Date.now();
            
            if (now - this.lastFPSUpdate >= 1000) {
                this.currentFPS = this.frameCount;
                this.frameCount = 0;
                this.lastFPSUpdate = now;
                
                // Adjust performance based on FPS
                if (this.currentFPS < PERFORMANCE_CONFIG.performance.minFPS && !this.isLowPower) {
                    this.enablePerformanceMode();
                }
                
                this.updatePerformanceIndicator();
            }
            
            requestAnimationFrame(measureFPS);
        };
        measureFPS();
    }
    
    enableLowPowerMode(batteryInfo = null) {
        if (this.isLowPower) return;
        this.isLowPower = true;
        
        // Reduce particle counts by 75%
        CONFIG.artifacts.particles.count = Math.floor(this.originalConfig.particles.count * 0.25);
        CONFIG.artifacts.hankies.resolution = Math.floor(this.originalConfig.hankies.resolution * 0.5);
        CONFIG.artifacts.ascii.width = Math.floor(this.originalConfig.ascii.width * 0.7);
        CONFIG.artifacts.ascii.height = Math.floor(this.originalConfig.ascii.height * 0.7);
        CONFIG.artifacts.metamorphosis.numLines = Math.floor(this.originalConfig.metamorphosis.numLines * 0.5);
        CONFIG.artifacts.metamorphosis.lineSegments = Math.floor(this.originalConfig.metamorphosis.lineSegments * 0.5);
        CONFIG.artifacts.sineWaves.layers = Math.floor(this.originalConfig.sineWaves.layers * 0.5);
        CONFIG.artifacts.sineWaves.points = Math.floor(this.originalConfig.sineWaves.points * 0.5);
        
        // Reduce animation speeds
        CONFIG.artifacts.hankies.animationSpeed *= 0.5;
        
        // Show low power indicator
        const message = batteryInfo ? 
            `Low Power Mode: ${Math.round(batteryInfo.level * 100)}% battery` : 
            'Low Power Mode Active';
        this.showPowerModeIndicator(message, '#ff9500');
        
        // Restart current artifact with new settings
        this.restartCurrentArtifact();
        
        console.log('Low power mode enabled', batteryInfo);
    }
    
    enableCriticalMode(batteryInfo) {
        if (this.isCriticalMode) return;
        this.isCriticalMode = true;
        this.isLowPower = true;
        
        // Stop all animations except essential UI
        this.pauseAllArtifacts();
        this.showPowerModeIndicator(
            `Critical Battery: ${Math.round(batteryInfo.level * 100)}% - Animations Paused`, 
            '#ff3300'
        );
        
        console.log('Critical battery mode enabled', batteryInfo);
    }
    
    enablePerformanceMode() {
        if (this.isLowPower) return;
        
        // Reduce settings to improve performance
        CONFIG.artifacts.particles.count = Math.floor(this.originalConfig.particles.count * 0.6);
        CONFIG.artifacts.metamorphosis.numLines = Math.floor(this.originalConfig.metamorphosis.numLines * 0.7);
        CONFIG.artifacts.sineWaves.layers = Math.floor(this.originalConfig.sineWaves.layers * 0.7);
        
        this.showPowerModeIndicator('Performance Mode: Optimizing for smooth playback', '#ffa500');
        this.restartCurrentArtifact();
        
        console.log('Performance mode enabled due to low FPS');
    }
    
    enableLowMemoryMode() {
        CONFIG.artifacts.particles.count = Math.floor(this.originalConfig.particles.count * 0.4);
        CONFIG.artifacts.ascii.width = Math.floor(this.originalConfig.ascii.width * 0.8);
        CONFIG.artifacts.ascii.height = Math.floor(this.originalConfig.ascii.height * 0.8);
        
        this.showPowerModeIndicator('Low Memory Mode: Optimized for your device', '#00bcd4');
        
        console.log('Low memory mode enabled');
    }
    
    enableLowBandwidthMode() {
        // Reduce any network-dependent features
        this.showPowerModeIndicator('Slow Connection: Optimized experience', '#ff9800');
        console.log('Low bandwidth mode enabled');
    }
    
    disableLowPowerMode() {
        if (!this.isLowPower) return;
        this.isLowPower = false;
        this.isCriticalMode = false;
        
        // Restore original settings
        Object.assign(CONFIG.artifacts, this.originalConfig);
        
        this.hidePowerModeIndicator();
        this.restartCurrentArtifact();
        
        console.log('Low power mode disabled');
    }
    
    disableLowBandwidthMode() {
        this.hidePowerModeIndicator();
        console.log('Low bandwidth mode disabled');
    }
    
    pauseHeavyAnimations() {
        const artifactContainer = document.querySelector('.artifact-container');
        if (artifactContainer) {
            artifactContainer.style.animationPlayState = 'paused';
        }
    }
    
    resumeAnimations() {
        const artifactContainer = document.querySelector('.artifact-container');
        if (artifactContainer) {
            artifactContainer.style.animationPlayState = 'running';
        }
    }
    
    pauseAllArtifacts() {
        // Pause all running animations
        const allAnimatedElements = document.querySelectorAll('canvas, .ascii-container');
        allAnimatedElements.forEach(el => {
            if (el.style) el.style.display = 'none';
        });
    }
    
    restartCurrentArtifact() {
        // Logic to restart current artifact with new performance settings
        const event = new CustomEvent('performanceSettingsChanged', {
            detail: { config: CONFIG.artifacts }
        });
        document.dispatchEvent(event);
    }
    
    showPowerModeIndicator(message, color) {
        let indicator = document.getElementById('powerModeIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'powerModeIndicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 8px 16px;
                background: ${color};
                color: white;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1002;
                font-family: 'Roboto Mono', monospace;
                max-width: 200px;
                text-align: center;
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(indicator);
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        } else {
            indicator.style.background = color;
        }
        indicator.textContent = message;
    }
    
    hidePowerModeIndicator() {
        const indicator = document.getElementById('powerModeIndicator');
        if (indicator) {
            indicator.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    updatePerformanceIndicator() {
        const perfInfo = document.getElementById('performanceInfo');
        if (perfInfo) {
            let status = 'Optimized';
            let color = '#00ff00';
            
            if (this.isCriticalMode) {
                status = 'Critical Battery';
                color = '#ff3300';
            } else if (this.isLowPower) {
                status = 'Low Power';
                color = '#ff9500';
            } else if (this.currentFPS < PERFORMANCE_CONFIG.performance.minFPS) {
                status = `${this.currentFPS}fps`;
                color = '#ffa500';
            }
            
            perfInfo.textContent = `Performance: ${status}`;
            perfInfo.style.color = color;
        }
    }
}

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
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'nearest'
                });
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
                const activeElement = document.activeElement;
                if (activeElement.classList.contains('glitch-title') || 
                    activeElement.classList.contains('spark-magic')) {
                    e.preventDefault();
                    this.navigateArtifacts(e.key === 'ArrowRight' ? 1 : -1);
                }
            }
        });
    }
    
    setupScreenReaderSupport() {
        // Add ARIA labels for screen readers
        const title = document.querySelector('.glitch-title');
        if (title) {
            title.setAttribute('aria-label', 'Elliot Lee, Product Manager and Builder. Click to cycle through artifacts.');
            title.setAttribute('role', 'button');
            title.setAttribute('tabindex', '0');
        }
        
        // Add live region for dynamic content announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);
    }
    
    setupVoiceOverSupport() {
        // iOS VoiceOver specific optimizations
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            // Add rotor navigation landmarks
            const main = document.querySelector('main') || document.body;
            main.setAttribute('role', 'main');
            
            // Improve VoiceOver navigation for artifacts
            const artifactContainer = document.querySelector('.artifact-container');
            if (artifactContainer) {
                artifactContainer.setAttribute('aria-label', 'Interactive visual artifacts');
                artifactContainer.setAttribute('role', 'region');
            }
        }
    }
    
    setupTalkBackSupport() {
        // Android TalkBack specific optimizations
        if (/Android/.test(navigator.userAgent)) {
            // Add content descriptions for TalkBack
            document.querySelectorAll('.artifact').forEach((artifact, index) => {
                artifact.setAttribute('aria-label', `Visual artifact ${index + 1}. Swipe right to explore.`);
            });
            
            // Improve touch target sizes for TalkBack users
            const style = document.createElement('style');
            style.textContent = `
                @media (hover: none) and (pointer: coarse) {
                    .glitch-title, .spark-magic, .cta-button {
                        min-height: 48px !important;
                        min-width: 48px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addLiveRegions() {
        // Create announcement region for dynamic content
        const announceRegion = document.createElement('div');
        announceRegion.id = 'announcements';
        announceRegion.setAttribute('aria-live', 'assertive');
        announceRegion.setAttribute('aria-atomic', 'true');
        announceRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(announceRegion);
        
        // Create status region for subtle updates
        const statusRegion = document.createElement('div');
        statusRegion.id = 'status-updates';
        statusRegion.setAttribute('aria-live', 'polite');
        statusRegion.setAttribute('aria-atomic', 'false');
        statusRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(statusRegion);
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    announceStatus(message) {
        const statusRegion = document.getElementById('status-updates');
        if (statusRegion) {
            statusRegion.textContent = message;
        }
    }
    
    handleEscapeKey() {
        // Close any open modals or return to default state
        const modals = document.querySelectorAll('[role="dialog"], .modal, .overlay');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
                this.announceToScreenReader('Modal closed');
            }
        });
    }
    
    navigateArtifacts(direction) {
        // Implement artifact navigation for keyboard users
        const event = new CustomEvent('keyboardNavigation', {
            detail: { direction: direction }
        });
        document.dispatchEvent(event);
        
        this.announceStatus(`Navigating ${direction > 0 ? 'forward' : 'backward'} through artifacts`);
    }
}

// Enhanced Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.watchSystemTheme();
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('preferred-theme');
        } catch (e) {
            return null;
        }
    }
    
    storeTheme(theme) {
        try {
            localStorage.setItem('preferred-theme', theme);
        } catch (e) {
            console.log('localStorage not available');
        }
    }
    
    applyTheme(theme) {
        document.documentElement.className = theme === 'dark' ? 'dark' : '';
        this.currentTheme = theme;
        this.storeTheme(theme);
        
        // Announce theme change to screen readers
        const a11yManager = window.a11yManager;
        if (a11yManager) {
            a11yManager.announceStatus(`Switched to ${theme} theme`);
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    setupThemeToggle() {
        // Create theme toggle button if it doesn't exist
        let themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.id = 'theme-toggle';
            themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
            themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: transparent;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 1000;
                padding: 8px;
                border-radius: 4px;
                transition: transform 0.2s ease;
            `;
            
            themeToggle.addEventListener('click', () => this.toggleTheme());
            themeToggle.addEventListener('mouseenter', () => {
                themeToggle.style.transform = 'scale(1.1)';
            });
            themeToggle.addEventListener('mouseleave', () => {
                themeToggle.style.transform = 'scale(1)';
            });
            
            document.body.appendChild(themeToggle);
        }
        
        // Update toggle appearance when theme changes
        themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitoring
    window.performanceManager = new MobilePerformanceManager();
    
    // Initialize accessibility features
    window.a11yManager = new MobileAccessibilityManager();
    
    // Initialize theme management
    window.themeManager = new ThemeManager();
    
    // Add performance info display
    const perfInfo = document.createElement('div');
    perfInfo.id = 'performanceInfo';
    perfInfo.className = 'performance-info';
    perfInfo.textContent = 'Performance: Optimized';
    document.body.appendChild(perfInfo);
    
    console.log('🚀 Main application initialized');
});

// Export for global access
window.CONFIG = CONFIG;
window.PERFORMANCE_CONFIG = PERFORMANCE_CONFIG;