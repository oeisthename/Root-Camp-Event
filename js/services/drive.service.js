/**
 * Google Drive Service
 * Handles uploading CSV files to Google Drive
 */

import { CONFIG } from '../config.js';
import { CSVService } from './csv.service.js';

export class DriveService {
    /**
     * Upload CSV to Google Drive via Apps Script
     * @param {string} csvContent - CSV content to upload
     * @param {string} filename - Filename for the CSV
     * @returns {Promise<Object>} Upload result
     */
    static async uploadViaAppsScript(csvContent, filename = CONFIG.CSV.filename) {
        // Check if URL is configured
        if (CONFIG.GOOGLE_DRIVE.appsScriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL' || 
            !CONFIG.GOOGLE_DRIVE.appsScriptUrl || 
            CONFIG.GOOGLE_DRIVE.appsScriptUrl.includes('YOUR_GOOGLE')) {
            const error = 'Google Apps Script URL not configured. Please set CONFIG.GOOGLE_DRIVE.appsScriptUrl in js/config.js';
            console.error(error);
            throw new Error(error);
        }

        // Validate inputs
        if (!csvContent || csvContent.trim() === '') {
            throw new Error('CSV content is empty');
        }

        if (!CONFIG.GOOGLE_DRIVE.folderId) {
            throw new Error('Google Drive folder ID not configured');
        }

        console.log('Attempting to upload CSV to Google Drive...');
        console.log('URL:', CONFIG.GOOGLE_DRIVE.appsScriptUrl);
        console.log('Folder ID:', CONFIG.GOOGLE_DRIVE.folderId);
        console.log('Filename:', filename);
        console.log('CSV Content Length:', csvContent.length, 'characters');

        try {
            const requestBody = {
                action: 'uploadCSV',
                folderId: CONFIG.GOOGLE_DRIVE.folderId,
                filename: filename,
                csvContent: csvContent
            };

            console.log('Sending request to Apps Script...');
            
            const response = await fetch(CONFIG.GOOGLE_DRIVE.appsScriptUrl, {
                method: 'POST',
                headers: {
                    // We use text/plain to avoid CORS preflight checks
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response statusText:', response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log('Apps Script response:', result);
            
            if (result.success) {
                console.log('✅ CSV uploaded to Google Drive successfully!');
                console.log('File ID:', result.fileId);
                return {
                    success: true,
                    fileId: result.fileId,
                    message: 'CSV uploaded successfully'
                };
            } else {
                const errorMsg = result.error || 'Upload failed';
                console.error('Apps Script returned error:', errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('❌ Error uploading via Apps Script:');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Full error:', error);
            
            // Provide helpful error messages
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('Network error: Could not reach Google Apps Script. Check your internet connection and Apps Script URL.');
            } else if (error.message.includes('CORS')) {
                throw new Error('CORS error: Make sure your Apps Script is deployed with "Who has access" set to "Anyone"');
            } else if (error.message.includes('404')) {
                throw new Error('Apps Script not found: Check that your URL is correct and the script is deployed');
            } else if (error.message.includes('403')) {
                throw new Error('Access denied: Make sure you authorized the script and set "Who has access" to "Anyone"');
            }
            
            throw error;
        }
    }

    /**
     * Upload CSV to Google Drive (main method)
     * @param {Array} registrations - Array of registrations
     * @param {string} filename - Optional filename
     * @returns {Promise<Object>} Upload result
     */
    static async uploadRegistrations(registrations, filename = CONFIG.CSV.filename) {
        const csvContent = CSVService.generateCSV(registrations);
        return await this.uploadViaAppsScript(csvContent, filename);
    }
}

