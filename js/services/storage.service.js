/**
 * Storage Service
 * Handles all LocalStorage operations
 */

import { CONFIG } from '../config.js';

export class StorageService {
    /**
     * Get all saved registrations
     * @returns {Array} Array of registration objects
     */
    static getRegistrations() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.registrations);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from storage:', error);
            return [];
        }
    }

    /**
     * Save a new registration
     * @param {Object} registrationData - Registration data to save
     * @returns {Object} Saved registration with ID and timestamp
     */
    static saveRegistration(registrationData) {
        try {
            const registrations = this.getRegistrations();
            
            // --- NEW CODE: DUPLICATE CHECK ---
            // Check if phone number already exists
            const exists = registrations.some(reg => 
                reg.phoneNumber.replace(/\s/g, '') === registrationData.phoneNumber.replace(/\s/g, '')
            );

            if (exists) {
                throw new Error('DUPLICATE_ENTRY');
            }
            // ----------------------------------

            const registration = {
                ...registrationData,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };

            registrations.push(registration);
            localStorage.setItem(CONFIG.STORAGE_KEYS.registrations, JSON.stringify(registrations));

            console.log('Registration saved:', registration);
            return registration;
        } catch (error) {
            // Pass the specific duplicate error up
            if (error.message === 'DUPLICATE_ENTRY') {
                throw error; 
            }
            console.error('Error saving registration:', error);
            throw new Error('Failed to save registration');
        }
    }

    /**
     * Clear all registrations
     * @returns {boolean} Success status
     */
    static clearAll() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.registrations);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Get registration count
     * @returns {number} Number of registrations
     */
    static getCount() {
        return this.getRegistrations().length;
    }
}

