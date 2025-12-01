/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

export const CONFIG = {
    // Google Drive Configuration
    GOOGLE_DRIVE: {
        folderId: '1jjXThY65EqUPrmisPNTsXtB408FPrUa8',
        appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxpjf1jL1YXa4xc33CzSFL0jK0MV0gm_v-V8WMT97de2rTJ_VdDFTHnQ9J0ndnGxoDF/exec', // Replace with your Apps Script URL
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Optional: For direct API access
        apiKey: 'YOUR_GOOGLE_API_KEY', // Optional: For direct API access
        scopes: 'https://www.googleapis.com/auth/drive.file'
    },

    // API Configuration (if using backend API)
    API: {
        endpoint: 'https://your-api-endpoint.com/api/registrations',
        adminEndpoint: 'https://your-api-endpoint.com/api/admin/registrations',
        headers: {
            'Content-Type': 'application/json'
        }
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        registrations: 'workshopRegistrations'
    },

    // Major to Year Mapping
    MAJOR_YEAR_MAP: {
        'CP': [1, 2],
        'GIIA': [1, 2, 3],
        'GINF': [1, 2, 3],
        'GTR': [1, 2, 3],
        'GMSI': [1, 2, 3],
        'GINDUS': [1, 2, 3],
        'GATE': [1, 2, 3],
        'GPMA': [1, 2, 3]
    },

    // CSV Configuration
    CSV: {
        filename: 'workshop-registrations.csv',
        headers: ['ID', 'Full Name', 'Phone Number', 'Email', 'Gender', 'Major', 'Year', 'Notes', 'Registration Date']
    },

    // Phone Number Format
    PHONE: {
        format: '+212 xxx xxx xxx',
        regex: /^\+212\s\d{3}\s\d{3}\s\d{3}$/
    }
};

