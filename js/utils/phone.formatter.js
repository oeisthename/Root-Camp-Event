/**
 * Phone Number Formatter
 * Handles phone number formatting to +212 xxx xxx xxx
 */

export class PhoneFormatter {
    /**
     * Format phone number to +212 xxx xxx xxx
     * @param {string} value - Phone number input
     * @returns {string} Formatted phone number
     */
    static format(value) {
        // Remove all non-digit characters
        let cleaned = value.replace(/\D/g, '');
        
        // Handle different input formats
        if (cleaned.startsWith('212')) {
            cleaned = cleaned.substring(3); // Remove country code 212
        } else if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1); // Remove leading 0
        }
        
        // Limit to 9 digits (Moroccan phone number format)
        cleaned = cleaned.substring(0, 9);
        
        // Format as +212 xxx xxx xxx
        if (cleaned.length === 0) {
            return '+212';
        }
        
        let formatted = '+212';
        if (cleaned.length > 0) {
            formatted += ' ' + cleaned.substring(0, 3);
        }
        if (cleaned.length > 3) {
            formatted += ' ' + cleaned.substring(3, 6);
        }
        if (cleaned.length > 6) {
            formatted += ' ' + cleaned.substring(6, 9);
        }
        
        return formatted;
    }

    /**
     * Setup phone input formatting
     * @param {HTMLElement} inputElement - Phone input element
     */
    static setupInput(inputElement) {
        if (!inputElement) return;

        // Format on input
        inputElement.addEventListener('input', function(e) {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = this.format(e.target.value);
            
            e.target.value = newValue;
            
            // Adjust cursor position
            const lengthDiff = newValue.length - oldValue.length;
            let newCursorPosition = cursorPosition + lengthDiff;
            
            if (newCursorPosition < 5) {
                newCursorPosition = newValue.length;
            }
            
            setTimeout(() => {
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            }, 0);
        }.bind(this));

        // Format on paste
        inputElement.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const formatted = this.format(pastedText);
            this.value = formatted;
            setTimeout(() => {
                this.setSelectionRange(formatted.length, formatted.length);
            }, 0);
        }.bind(this));

        // Format on blur
        inputElement.addEventListener('blur', function() {
            if (this.value && this.value !== '+212') {
                this.value = PhoneFormatter.format(this.value);
            } else if (this.value === '+212') {
                this.value = '';
            }
        });

        // Focus handler - start with +212
        inputElement.addEventListener('focus', function() {
            if (!this.value || this.value === '') {
                this.value = '+212 ';
            }
        });
    }
}

