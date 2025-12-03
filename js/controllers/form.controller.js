/**
 * Form Controller
 * Handles form submission and validation
 */

import { ValidationService } from '../services/validation.service.js';
import { StorageService } from '../services/storage.service.js';
import { DriveService } from '../services/drive.service.js';
import { ErrorHandler } from '../utils/error.handler.js';

export class FormController {
    constructor(modalController) {
        this.modalController = modalController;
        this.form = document.getElementById('registrationForm');
        this.majorSelect = document.getElementById('major');
        this.yearSelect = document.getElementById('year');
        this.statusMessageEl = document.getElementById('formStatusMessage');
        
        this.init();
    }

    /**
     * Initialize form controller
     */
    init() {
        if (!this.form) return;

        // Setup major/year dependency
        this.setupMajorYearDependency();
        
        // Setup form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Setup real-time error clearing
        this.setupErrorClearing();
    }

    /**
     * Setup major/year field dependency
     */
    setupMajorYearDependency() {
        if (!this.majorSelect || !this.yearSelect) return;

        this.majorSelect.addEventListener('change', () => {
            const selectedMajor = this.majorSelect.value;
            const yearMap = {
                'CP': [1, 2],
                'GIIA': [1, 2, 3],
                'GINF': [1, 2, 3],
                'GTR': [1, 2, 3],
                'GMSI': [1, 2, 3],
                'GINDUS': [1, 2, 3],
                'GATE': [1, 2, 3],
                'GPMA': [1, 2, 3]
            };

            if (selectedMajor && yearMap[selectedMajor]) {
                this.yearSelect.disabled = false;
                this.yearSelect.innerHTML = '<option value="">Select your year</option>';
                
                yearMap[selectedMajor].forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = `Year ${year}`;
                    this.yearSelect.appendChild(option);
                });
            } else {
                this.yearSelect.disabled = true;
                this.yearSelect.innerHTML = '<option value="">Please select a major first</option>';
            }
        });
    }

    /**
     * Setup real-time error clearing
     */
    setupErrorClearing() {
        const fields = ['fullName', 'phoneNumber', 'major', 'year'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    ErrorHandler.hideError(fieldId);
                    this.hideStatusMessage();
                });
                field.addEventListener('change', () => {
                    ErrorHandler.hideError(fieldId);
                    this.hideStatusMessage();
                });
            }
        });

        // Gender radio buttons
        document.querySelectorAll('input[name="gender"]').forEach(input => {
            input.addEventListener('change', () => {
                ErrorHandler.hideError('gender');
                this.hideStatusMessage();
            });
        });
    }

    /**
     * Show a message at the bottom of the form
     */
    showStatusMessage(message, isError = true) {
        if (!this.statusMessageEl) return;
        
        this.statusMessageEl.textContent = message;
        this.statusMessageEl.classList.remove('hidden');
        
        if (isError) {
            this.statusMessageEl.className = 'mt-4 p-3 rounded-lg text-center text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20';
        } else {
            this.statusMessageEl.className = 'mt-4 p-3 rounded-lg text-center text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20';
        }

        // NEW: Automatically scroll to the message
        this.statusMessageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Hide the message
     */
    hideStatusMessage() {
        if (this.statusMessageEl) {
            this.statusMessageEl.classList.add('hidden');
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Clear previous errors
        ErrorHandler.clearAllErrors();
        this.hideStatusMessage();

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Validate form
        const validation = ValidationService.validateForm(data);
        
        if (!validation.isValid) {
            // Show errors
            Object.keys(validation.errors).forEach(fieldId => {
                ErrorHandler.showError(fieldId, validation.errors[fieldId]);
            });

            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(.hidden)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Save to local storage (Checks for duplicates internally)
            StorageService.saveRegistration(data);

            // Get all registrations for CSV
            const allRegistrations = StorageService.getRegistrations();

            // Upload CSV to Google Drive
            await DriveService.uploadRegistrations(allRegistrations);

            // --- NEW CODE START ---
            
            // 1. Show success message (false sets it to green/success style)
            this.showStatusMessage('Submission Complete!', false);

            // 2. Hide the submit button temporarily
            const submitBtn = this.form.querySelector('button[type="submit"]');
            if(submitBtn) submitBtn.style.display = 'none';

            // 3. Wait 2 seconds (2000ms), then close and reset
            setTimeout(() => {
                if (this.modalController) {
                    this.modalController.close();
                }

                // Reset form
                this.form.reset();
                if (this.yearSelect) {
                    this.yearSelect.disabled = true;
                    this.yearSelect.innerHTML = '<option value="">Please select a major first</option>';
                }
                
                // Cleanup: Hide message and show button again for next time
                this.hideStatusMessage();
                if(submitBtn) submitBtn.style.display = 'block';
            }, 2000);

            // --- NEW CODE END ---

        } catch (error) {
            // HANDLE DUPLICATE ENTRY - SHOW AS LABEL
            if (error.message === 'DUPLICATE_ENTRY') {
                this.showStatusMessage('⚠️ You are already registered!', true);
            } 
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Set loading state on submit button
     * @param {boolean} isLoading - Loading state
     */
    setLoadingState(isLoading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = isLoading;
            submitButton.textContent = isLoading ? 'Submitting...' : 'Submit Registration';
        }
    }
}