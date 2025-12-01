/**
 * CSV Service
 * Handles CSV generation and formatting
 */

import { CONFIG } from '../config.js';

export class CSVService {
    /**
     * Generate CSV content from registrations array
     * @param {Array} registrations - Array of registration objects
     * @returns {string} CSV content as string
     */
    static generateCSV(registrations) {
        if (!registrations || registrations.length === 0) {
            return '';
        }

        // Create header row
        const headers = CONFIG.CSV.headers;
        const csvRows = [headers.join(',')];

        // Create data rows
        registrations.forEach(reg => {
            const row = [
                reg.id || '',
                this.escapeCSV(reg.fullName || ''),
                reg.phoneNumber || '',
                reg.email || '',
                reg.gender || '',
                reg.major || '',
                reg.year || '',
                this.escapeCSV(reg.notes || ''),
                reg.timestamp ? new Date(reg.timestamp).toLocaleString() : ''
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    /**
     * Escape CSV field (handles quotes and commas)
     * @param {string} field - Field value to escape
     * @returns {string} Escaped field value
     */
    static escapeCSV(field) {
        if (!field) return '';
        // Escape quotes by doubling them and wrap in quotes
        return `"${String(field).replace(/"/g, '""')}"`;
    }

    /**
     * Add UTF-8 BOM for Excel compatibility
     * @param {string} csvContent - CSV content
     * @returns {string} CSV content with BOM
     */
    static addBOM(csvContent) {
        const BOM = '\uFEFF';
        return BOM + csvContent;
    }

    /**
     * Convert CSV to Blob for download
     * @param {string} csvContent - CSV content
     * @returns {Blob} CSV Blob
     */
    static createBlob(csvContent) {
        const csvWithBOM = this.addBOM(csvContent);
        return new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    }

    /**
     * Download CSV file
     * @param {string} csvContent - CSV content
     * @param {string} filename - Filename for download
     */
    static downloadCSV(csvContent, filename = CONFIG.CSV.filename) {
        const blob = this.createBlob(csvContent);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

