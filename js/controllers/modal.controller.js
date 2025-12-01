/**
 * Modal Controller
 * Handles modal open/close and management
 */

export class ModalController {
    constructor() {
        this.modal = document.getElementById('registrationModal');
        this.closeBtn = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        this.init();
    }

    /**
     * Initialize modal controller
     */
    init() {
        if (!this.modal) return;

        // Close button handlers
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.close());
        }

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.close();
            }
        });
    }

    /**
     * Open modal
     */
    open() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     */
    close() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Clear form errors
            const form = document.getElementById('registrationForm');
            if (form) {
                form.reset();
                const yearSelect = document.getElementById('year');
                if (yearSelect) {
                    yearSelect.disabled = true;
                    yearSelect.innerHTML = '<option value="">Please select a major first</option>';
                }
            }
        }
    }
}

