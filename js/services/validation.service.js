/**
 * Validation Service
 * Handles form validation and error management
 */

import { CONFIG } from '../config.js';

export class ValidationService {
    /**
     * Validate full name
     * @param {string} name - Full name to validate
     * @returns {Object} Validation result
     */
    static validateFullName(name) {
        if (!name || name.trim() === '') {
            return { valid: false, message: 'Full name is required' };
        }
        return { valid: true };
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {Object} Validation result
     */
    static validatePhone(phone) {
        if (!phone || phone.trim() === '') {
            return { valid: false, message: 'Phone number is required' };
        }
        
        if (!CONFIG.PHONE.regex.test(phone)) {
            return { valid: false, message: 'Please enter a valid phone number in the format: +212 xxx xxx xxx' };
        }
        
        return { valid: true };
    }

    /**
     * Validate gender selection
     * @param {string} gender - Selected gender
     * @returns {Object} Validation result
     */
    static validateGender(gender) {
        if (!gender) {
            return { valid: false, message: 'Please select your gender' };
        }
        return { valid: true };
    }

    /**
     * Validate major selection
     * @param {string} major - Selected major
     * @returns {Object} Validation result
     */
    static validateMajor(major) {
        if (!major || major === '') {
            return { valid: false, message: 'Please select your major' };
        }
        return { valid: true };
    }

    /**
     * Validate year selection
     * @param {string} year - Selected year
     * @returns {Object} Validation result
     */
    static validateYear(year) {
        if (!year || year === '') {
            return { valid: false, message: 'Please select your year' };
        }
        return { valid: true };
    }

    /**
     * Validate entire form data
     * @param {Object} formData - Form data object
     * @returns {Object} Validation result with errors
     */
    static validateForm(formData) {
        const errors = {};
        let isValid = true;

        // Validate each field
        const nameValidation = this.validateFullName(formData.fullName);
        if (!nameValidation.valid) {
            errors.fullName = nameValidation.message;
            isValid = false;
        }

        const phoneValidation = this.validatePhone(formData.phoneNumber);
        if (!phoneValidation.valid) {
            errors.phoneNumber = phoneValidation.message;
            isValid = false;
        }

        const genderValidation = this.validateGender(formData.gender);
        if (!genderValidation.valid) {
            errors.gender = genderValidation.message;
            isValid = false;
        }

        const majorValidation = this.validateMajor(formData.major);
        if (!majorValidation.valid) {
            errors.major = majorValidation.message;
            isValid = false;
        }

        const yearValidation = this.validateYear(formData.year);
        if (!yearValidation.valid) {
            errors.year = yearValidation.message;
            isValid = false;
        }

        return {
            isValid,
            errors
        };
    }
}

