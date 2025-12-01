/**
 * Main Application
 * Initializes and coordinates all controllers and services
 */

import { CONFIG } from './config.js';
import { FormController } from './controllers/form.controller.js';
import { ModalController } from './controllers/modal.controller.js';
import { NavController } from './controllers/nav.controller.js';
import { PhoneFormatter } from './utils/phone.formatter.js';
import { StorageService } from './services/storage.service.js';
import { AdminController } from './controllers/admin.controller.js';
/**
 * Main Application Class
 */
class App {
    constructor() {
        this.modalController = null;
        this.formController = null;
        this.navController = null;
    }

    /**
     * Initialize the application
     */
    init() {
        // Initialize Tailwind config
        this.initTailwind();

        // Initialize controllers
        this.modalController = new ModalController();
        this.formController = new FormController(this.modalController);
        this.navController = new NavController();
        this.adminController = new AdminController();
        // Setup phone formatting
        this.setupPhoneFormatting();

        // Setup registration buttons
        this.setupRegistrationButtons();

        // Setup animations
        this.setupAnimations();

        // Log initialization
        this.logInit();
    }

    /**
     * Initialize Tailwind configuration
     */
    initTailwind() {
        if (typeof tailwind !== 'undefined') {
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ['Inter', 'sans-serif'],
                            mono: ['JetBrains Mono', 'monospace'],
                        },
                        colors: {
                            bg: {
                                DEFAULT: '#020617',
                                card: '#0f172a',
                                lighter: '#1e293b'
                            },
                            eniac: {
                                blue: '#3b82f6',
                                glow: 'rgba(59, 130, 246, 0.5)'
                            },
                            zeroday: {
                                red: '#ef4444',
                                glow: 'rgba(239, 68, 68, 0.5)'
                            }
                        },
                        animation: {
                            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            'float': 'float 6s ease-in-out infinite',
                        },
                        keyframes: {
                            float: {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-20px)' },
                            }
                        }
                    }
                }
            };
        }
    }

    /**
     * Setup phone number formatting
     */
    setupPhoneFormatting() {
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            PhoneFormatter.setupInput(phoneInput);
        }
    }

    /**
     * Setup registration button handlers
     */
    setupRegistrationButtons() {
        // Secure Seat button
        const secureSeatBtn = document.getElementById('secureSeatBtn');
        if (secureSeatBtn) {
            secureSeatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.modalController) {
                    this.modalController.open();
                }
            });
        }

        // Join Event buttons
        const joinEventBtns = document.querySelectorAll('.join-event-btn');
        joinEventBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.modalController) {
                    this.modalController.open();
                }
            });
        });

        // Build and Break buttons
        const buildButton = document.querySelector('button:has(i.fa-hammer)') || 
                           Array.from(document.querySelectorAll('button')).find(btn => btn.querySelector('.fa-hammer'));
        const breakButton = document.querySelector('button:has(i.fa-shield-alt)') || 
                           Array.from(document.querySelectorAll('button')).find(btn => btn.querySelector('.fa-shield-alt'));

        if (buildButton) {
            buildButton.addEventListener('click', () => {
                if (this.modalController) {
                    this.modalController.open();
                }
            });
        }

        if (breakButton) {
            breakButton.addEventListener('click', () => {
                if (this.modalController) {
                    this.modalController.open();
                }
            });
        }
    }

    /**
     * Setup scroll animations
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe fade-in elements
        document.querySelectorAll('.fade-in, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Log initialization info
     */
    logInit() {
        console.log('%c📋 Workshop Registration System', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
        console.log('%cSystem Initialized', 'color: #10b981; font-weight: bold;');
        
        const registrationCount = StorageService.getCount();
        if (registrationCount > 0) {
            console.log(`%c✓ ${registrationCount} registration(s) found in storage`, 'color: #10b981;');
        }

        // Check Google Drive configuration
        if (CONFIG.GOOGLE_DRIVE.appsScriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            console.warn('%c⚠ Google Drive not configured. Update CONFIG.GOOGLE_DRIVE.appsScriptUrl', 'color: #f59e0b;');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    
    // Make app available globally for debugging
    window.app = app;
});

