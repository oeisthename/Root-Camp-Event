/**
 * Error Handler
 * Manages form error display and clearing
 */

export class ErrorHandler {
    /**
     * Show error for a field
     * @param {string} fieldId - Field ID
     * @param {string} message - Error message
     */
    static showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }

        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    /**
     * Hide error for a field
     * @param {string} fieldId - Field ID
     */
    static hideError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }

        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    /**
     * Clear all errors
     */
    static clearAllErrors() {
        const errorFields = ['fullName', 'phoneNumber', 'gender', 'major', 'year'];
        errorFields.forEach(fieldId => this.hideError(fieldId));
    }
}

