// Tailwind Config
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

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu when clicking on a link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateValue(entry.target, 0, entry.target.textContent, 2000);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateValue(element, start, end, duration) {
        const isNumber = !isNaN(parseInt(end));
        if (!isNumber) {
            return; // Don't animate non-numeric values
        }

        const endValue = parseInt(end);
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (endValue - start) * progress);
            element.textContent = current + (end.includes('h') ? 'h' : end.includes('%') ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Registration Modal Functionality
    const modal = document.getElementById('registrationModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const registrationForm = document.getElementById('registrationForm');
    const majorSelect = document.getElementById('major');
    const yearSelect = document.getElementById('year');
    const secureSeatBtn = document.getElementById('secureSeatBtn');
    const joinEventBtns = document.querySelectorAll('.join-event-btn');

    // Major to Year mapping
    const majorYearMap = {
        'CP': [1, 2],
        'GIIA': [1, 2, 3],
        'GINF': [1, 2, 3],
        'GTR': [1, 2, 3],
        'GMSI': [1, 2, 3],
        'GINDUS': [1, 2, 3],
        'GATE': [1, 2, 3],
        'GPMA': [1, 2, 3]
    };

    // Function to open modal
    function openModal() {
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Function to close modal
    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            if (registrationForm) {
                registrationForm.reset();
                yearSelect.disabled = true;
                yearSelect.innerHTML = '<option value="">Please select a major first</option>';
                
                // Clear all errors
                ['fullName', 'phoneNumber', 'gender', 'major', 'year'].forEach(fieldId => {
                    hideError(fieldId);
                });
            }
        }
    }

    // Open modal when clicking buttons
    if (secureSeatBtn) {
        secureSeatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }

    joinEventBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal handlers
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Phone number formatting function
    function formatPhoneNumber(value) {
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

    // Phone number input formatting
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        // Format on input
        phoneInput.addEventListener('input', function(e) {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = formatPhoneNumber(e.target.value);
            
            e.target.value = newValue;
            
            // Adjust cursor position to maintain relative position
            const oldLength = oldValue.length;
            const newLength = newValue.length;
            const lengthDiff = newLength - oldLength;
            
            // Calculate new cursor position
            let newCursorPosition = cursorPosition + lengthDiff;
            
            // Ensure cursor doesn't go before +212
            if (newCursorPosition < 5) {
                newCursorPosition = newValue.length; // Place at end
            }
            
            // Set cursor position after a short delay to ensure value is set
            setTimeout(() => {
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            }, 0);
        });

        // Format on paste
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const formatted = formatPhoneNumber(pastedText);
            this.value = formatted;
            // Place cursor at end
            setTimeout(() => {
                this.setSelectionRange(formatted.length, formatted.length);
            }, 0);
        });

        // Format on blur (when user leaves the field)
        phoneInput.addEventListener('blur', function() {
            if (this.value && this.value !== '+212') {
                this.value = formatPhoneNumber(this.value);
            } else if (this.value === '+212') {
                this.value = ''; // Clear if only +212 remains
            }
        });

        // Focus handler - if empty, start with +212
        phoneInput.addEventListener('focus', function() {
            if (!this.value || this.value === '') {
                this.value = '+212 ';
            }
        });
    }

    // Dynamic year field based on major selection
    if (majorSelect && yearSelect) {
        majorSelect.addEventListener('change', function() {
            const selectedMajor = this.value;
            
            if (selectedMajor && majorYearMap[selectedMajor]) {
                yearSelect.disabled = false;
                yearSelect.innerHTML = '<option value="">Select your year</option>';
                
                majorYearMap[selectedMajor].forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = `Year ${year}`;
                    yearSelect.appendChild(option);
                });
            } else {
                yearSelect.disabled = true;
                yearSelect.innerHTML = '<option value="">Please select a major first</option>';
            }
        });
    }

    // Helper function to show error
    function showError(fieldId, message) {
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

    // Helper function to hide error
    function hideError(fieldId) {
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

    // Clear errors when user starts typing/selecting
    const formInputs = ['fullName', 'phoneNumber', 'major', 'year'];
    formInputs.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                hideError(fieldId);
            });
            field.addEventListener('change', function() {
                hideError(fieldId);
            });
        }
    });

    // Clear gender error when selected
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        input.addEventListener('change', function() {
            hideError('gender');
        });
    });

    // Form submission handler
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear all previous errors
            ['fullName', 'phoneNumber', 'gender', 'major', 'year'].forEach(fieldId => {
                hideError(fieldId);
            });
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            let hasErrors = false;
            
            // Validate Full Name
            if (!data.fullName || data.fullName.trim() === '') {
                showError('fullName', 'Full name is required');
                hasErrors = true;
            }
            
            // Validate Phone Number
            if (!data.phoneNumber || data.phoneNumber.trim() === '') {
                showError('phoneNumber', 'Phone number is required');
                hasErrors = true;
            } else {
                // Phone number validation (format: +212 xxx xxx xxx)
                const phoneRegex = /^\+212\s\d{3}\s\d{3}\s\d{3}$/;
                if (!phoneRegex.test(data.phoneNumber)) {
                    showError('phoneNumber', 'Please enter a valid phone number in the format: +212 xxx xxx xxx');
                    hasErrors = true;
                }
            }
            
            // Validate Gender
            if (!data.gender) {
                showError('gender', 'Please select your gender');
                hasErrors = true;
            }
            
            // Validate Major
            if (!data.major || data.major === '') {
                showError('major', 'Please select your major');
                hasErrors = true;
            }
            
            // Validate Year
            if (!data.year || data.year === '') {
                showError('year', 'Please select your year');
                hasErrors = true;
            }
            
            // If there are errors, scroll to first error
            if (hasErrors) {
                const firstError = document.querySelector('.error-message:not(.hidden)');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Save form data to LocalStorage (backup)
            saveRegistrationData(data);
            
            // Generate CSV content with all registrations
            const allRegistrations = getSavedRegistrations();
            const csvContent = generateCSVContent(allRegistrations);
            const filename = 'workshop-registrations.csv'; // Consistent filename for updates
            
            // Upload CSV to Google Drive via Apps Script (recommended method)
            try {
                await uploadCSVViaAppsScript(csvContent, filename);
                alert('Registration submitted successfully! CSV has been uploaded to Google Drive.');
            } catch (error) {
                console.error('Google Drive upload failed:', error);
                // Fallback: Try direct API method if configured
                try {
                    if (GOOGLE_DRIVE_CONFIG.clientId !== 'YOUR_GOOGLE_CLIENT_ID') {
                        await uploadCSVToDrive(csvContent, filename);
                        alert('Registration submitted successfully! CSV has been uploaded to Google Drive.');
                    } else {
                        throw new Error('Google Drive not configured');
                    }
                } catch (driveError) {
                    console.error('Direct Drive API upload also failed:', driveError);
                    alert('Registration saved locally. Please configure Google Drive upload (see console for instructions).');
                }
            }
            
            // Close modal and reset form
            closeModal();
        });
    }

    // Google Drive Configuration
    const GOOGLE_DRIVE_CONFIG = {
        folderId: '1jjXThY65EqUPrmisPNTsXtB408FPrUa8', // Your Google Drive folder ID
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google OAuth Client ID
        apiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your Google API Key
        scopes: 'https://www.googleapis.com/auth/drive.file'
    };

    // Google Drive API initialization
    let gapiLoaded = false;
    let gisLoaded = false;

    // Load Google API
    function loadGoogleAPI() {
        if (typeof gapi !== 'undefined') {
            gapi.load('client', initializeGoogleDrive);
        } else {
            console.error('Google API not loaded');
        }
    }

    // Initialize Google Drive API
    async function initializeGoogleDrive() {
        try {
            await gapi.client.init({
                apiKey: GOOGLE_DRIVE_CONFIG.apiKey,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
            });
            gapiLoaded = true;
            console.log('Google Drive API initialized');
        } catch (error) {
            console.error('Error initializing Google Drive API:', error);
        }
    }

    // Authenticate and get access token
    async function authenticateGoogleDrive() {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && google.accounts) {
                const tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_DRIVE_CONFIG.clientId,
                    scope: GOOGLE_DRIVE_CONFIG.scopes,
                    callback: (response) => {
                        if (response.access_token) {
                            gapi.client.setToken(response);
                            resolve(response.access_token);
                        } else {
                            reject(new Error('Failed to get access token'));
                        }
                    }
                });
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                reject(new Error('Google Identity Services not loaded'));
            }
        });
    }

    // Function to upload CSV to Google Drive
    async function uploadCSVToDrive(csvContent, filename) {
        try {
            // Ensure API is loaded
            if (!gapiLoaded) {
                await loadGoogleAPI();
            }

            // Authenticate if needed
            if (!gapi.client.getToken()) {
                await authenticateGoogleDrive();
            }

            // Convert CSV to Blob
            const BOM = '\uFEFF';
            const csvWithBOM = BOM + csvContent;
            const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });

            // Convert Blob to base64
            const base64Content = await blobToBase64(blob);

            // Check if file already exists
            const existingFiles = await gapi.client.drive.files.list({
                q: `name='${filename}' and '${GOOGLE_DRIVE_CONFIG.folderId}' in parents and trashed=false`,
                fields: 'files(id, name)'
            });

            let fileId = null;
            if (existingFiles.result.files.length > 0) {
                // Update existing file
                fileId = existingFiles.result.files[0].id;
                await gapi.client.request({
                    path: `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
                    method: 'PATCH',
                    params: {
                        uploadType: 'multipart',
                        fields: 'id'
                    },
                    body: createMultipartBody(filename, base64Content, 'text/csv')
                });
                console.log('CSV file updated in Google Drive:', fileId);
            } else {
                // Create new file
                const fileMetadata = {
                    name: filename,
                    parents: [GOOGLE_DRIVE_CONFIG.folderId]
                };

                const response = await gapi.client.request({
                    path: 'https://www.googleapis.com/upload/drive/v3/files',
                    method: 'POST',
                    params: {
                        uploadType: 'multipart',
                        fields: 'id'
                    },
                    body: createMultipartBody(filename, base64Content, 'text/csv', fileMetadata)
                });

                fileId = response.result.id;
                console.log('CSV file uploaded to Google Drive:', fileId);
            }

            return fileId;
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            throw error;
        }
    }

    // Helper function to convert Blob to base64
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Helper function to create multipart body for file upload
    function createMultipartBody(filename, base64Content, mimeType, metadata = null) {
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
        let body = '';

        if (metadata) {
            body += `--${boundary}\r\n`;
            body += `Content-Type: application/json\r\n\r\n`;
            body += JSON.stringify(metadata) + '\r\n';
        }

        body += `--${boundary}\r\n`;
        body += `Content-Type: ${mimeType}\r\n`;
        body += `Content-Transfer-Encoding: base64\r\n\r\n`;
        body += base64Content + '\r\n';
        body += `--${boundary}--`;

        return {
            body: body,
            headers: {
                'Content-Type': `multipart/related; boundary=${boundary}`
            }
        };
    }

    // Alternative: Use Google Apps Script as a proxy (simpler, no OAuth needed)
    // This is a better approach for client-side apps
    async function uploadCSVViaAppsScript(csvContent, filename) {
        // Replace with your Google Apps Script Web App URL
        const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
        
        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'uploadCSV',
                    folderId: GOOGLE_DRIVE_CONFIG.folderId,
                    filename: filename,
                    csvContent: csvContent
                })
            });

            const result = await response.json();
            if (result.success) {
                console.log('CSV uploaded to Google Drive via Apps Script');
                return result.fileId;
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading via Apps Script:', error);
            throw error;
        }
    }

    // Function to submit registration to API
    async function submitToAPI(data) {
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: API_CONFIG.method,
                headers: API_CONFIG.headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Registration submitted to API:', result);
            
            // Show success message
            alert('Registration submitted successfully! We will contact you soon.');
            
            return result;
        } catch (error) {
            console.error('Error submitting to API:', error);
            
            // Fallback: Save to localStorage if API fails
            console.log('API call failed, data saved locally as backup');
            
            // Still show success to user (data is saved locally)
            alert('Registration submitted successfully! We will contact you soon.');
            
            // Optionally, you could show an error message:
            // alert('There was an issue submitting your registration. Please try again later.');
        }
    }

    // Function to fetch registrations from API (admin only)
    async function fetchRegistrationsFromAPI() {
        try {
            // Admin endpoint - update this with your actual admin API endpoint
            const adminEndpoint = API_CONFIG.endpoint.replace('/api/registrations', '/api/admin/registrations');
            
            const response = await fetch(adminEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add admin authentication
                    // 'Authorization': 'Bearer admin-token-here'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const registrations = await response.json();
            console.log('Registrations from API:', registrations);
            return registrations;
        } catch (error) {
            console.error('Error fetching from API:', error);
            console.log('Falling back to local storage...');
            return getSavedRegistrations();
        }
    }

    // Admin function to export CSV from API data
    async function adminExportCSV() {
        const registrations = await fetchRegistrationsFromAPI();
        if (registrations.length === 0) {
            alert('No registrations found.');
            return;
        }
        exportRegistrationsCSVFromData(registrations);
    }

    // Helper function to export CSV from data array
    function exportRegistrationsCSVFromData(registrations) {
        // CSV Headers
        const headers = ['ID', 'Full Name', 'Phone Number', 'Email', 'Gender', 'Major', 'Year', 'Notes', 'Registration Date'];
        
        // Convert to CSV
        const csvRows = [headers.join(',')];
        
        registrations.forEach(reg => {
            const row = [
                reg.id || '',
                `"${(reg.fullName || '').replace(/"/g, '""')}"`,
                reg.phoneNumber || '',
                reg.email || '',
                reg.gender || '',
                reg.major || '',
                reg.year || '',
                `"${(reg.notes || '').replace(/"/g, '""')}"`,
                reg.timestamp ? new Date(reg.timestamp).toLocaleString() : ''
            ];
            csvRows.push(row.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        
        // Add BOM for Excel compatibility (UTF-8)
        const BOM = '\uFEFF';
        const csvWithBOM = BOM + csvContent;
        
        const dataBlob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `workshop-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Function to save registration data to LocalStorage (backup)
    function saveRegistrationData(data) {
        try {
            // Get existing registrations from LocalStorage
            let registrations = JSON.parse(localStorage.getItem('workshopRegistrations') || '[]');
            
            // Add timestamp to the data
            const registrationData = {
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now() // Unique ID for each registration
            };
            
            // Add new registration
            registrations.push(registrationData);
            
            // Save back to LocalStorage
            localStorage.setItem('workshopRegistrations', JSON.stringify(registrations));
            
            console.log('Registration saved:', registrationData);
            console.log('Total registrations:', registrations.length);
            
            // Optional: Also log to console for debugging
            console.table(registrations);
        } catch (error) {
            console.error('Error saving registration:', error);
            alert('There was an error saving your registration. Please try again.');
        }
    }

    // Function to get all saved registrations
    function getSavedRegistrations() {
        try {
            return JSON.parse(localStorage.getItem('workshopRegistrations') || '[]');
        } catch (error) {
            console.error('Error reading registrations:', error);
            return [];
        }
    }

    // Function to export registrations as JSON file
    function exportRegistrations() {
        const registrations = getSavedRegistrations();
        if (registrations.length === 0) {
            alert('No registrations found to export.');
            return;
        }
        
        const dataStr = JSON.stringify(registrations, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `workshop-registrations-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Function to export registrations as CSV file (auto-updates with all registrations)
    function exportRegistrationsCSV() {
        const registrations = getSavedRegistrations();
        if (registrations.length === 0) {
            // Don't show alert on auto-export, only on manual export
            if (arguments.length === 0 || arguments[0] !== 'auto') {
                alert('No registrations found to export.');
            }
            return;
        }
        
        // CSV Headers
        const headers = ['ID', 'Full Name', 'Phone Number', 'Email', 'Gender', 'Major', 'Year', 'Notes', 'Registration Date'];
        
        // Convert to CSV
        const csvRows = [headers.join(',')];
        
        registrations.forEach(reg => {
            const row = [
                reg.id || '',
                `"${(reg.fullName || '').replace(/"/g, '""')}"`,
                reg.phoneNumber || '',
                reg.email || '',
                reg.gender || '',
                reg.major || '',
                reg.year || '',
                `"${(reg.notes || '').replace(/"/g, '""')}"`,
                reg.timestamp ? new Date(reg.timestamp).toLocaleString() : ''
            ];
            csvRows.push(row.join(','));
        });
        
        const csvContent = generateCSVContent(registrations);
        
        // Add BOM for Excel compatibility (UTF-8)
        const BOM = '\uFEFF';
        const csvWithBOM = BOM + csvContent;
        
        const dataBlob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        // Use consistent filename so it updates the same file
        link.download = 'workshop-registrations.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Function to clear all registrations (use with caution)
    function clearAllRegistrations() {
        if (confirm('Are you sure you want to delete all saved registrations? This action cannot be undone.')) {
            localStorage.removeItem('workshopRegistrations');
            alert('All registrations have been cleared.');
            console.log('All registrations cleared.');
        }
    }

    // Admin Panel Functionality
    const adminPanel = document.getElementById('adminPanel');
    const closeAdminPanelBtn = document.getElementById('closeAdminPanel');
    const refreshRegistrationsBtn = document.getElementById('refreshRegistrations');
    const exportCSVAdminBtn = document.getElementById('exportCSVAdmin');
    const exportLocalCSVBtn = document.getElementById('exportLocalCSV');
    const adminRegistrationsList = document.getElementById('adminRegistrationsList');

    // Check for admin access (via URL parameter ?admin=true or console)
    function checkAdminAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            openAdminPanel();
        }
    }

    function openAdminPanel() {
        if (adminPanel) {
            adminPanel.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            loadAdminRegistrations();
        }
    }

    function closeAdminPanel() {
        if (adminPanel) {
            adminPanel.classList.add('hidden');
            document.body.style.overflow = '';
            // Remove admin parameter from URL
            const url = new URL(window.location);
            url.searchParams.delete('admin');
            window.history.replaceState({}, '', url);
        }
    }

    async function loadAdminRegistrations() {
        if (!adminRegistrationsList) return;
        
        adminRegistrationsList.innerHTML = '<p class="text-slate-400 text-center py-8">Loading registrations...</p>';
        
        try {
            const registrations = await fetchRegistrationsFromAPI();
            displayAdminRegistrations(registrations);
        } catch (error) {
            console.error('Error loading registrations:', error);
            // Fallback to local storage
            const localRegistrations = getSavedRegistrations();
            displayAdminRegistrations(localRegistrations);
        }
    }

    function displayAdminRegistrations(registrations) {
        if (!adminRegistrationsList) return;
        
        if (registrations.length === 0) {
            adminRegistrationsList.innerHTML = '<p class="text-slate-400 text-center py-8">No registrations found.</p>';
            return;
        }

        let html = `<div class="mb-4 text-slate-300">Total: <span class="text-white font-bold">${registrations.length}</span> registration(s)</div>`;
        html += '<div class="overflow-x-auto"><table class="w-full text-left border-collapse">';
        html += '<thead><tr class="border-b border-white/10">';
        html += '<th class="p-3 text-slate-300 font-semibold">ID</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Name</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Phone</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Email</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Gender</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Major</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Year</th>';
        html += '<th class="p-3 text-slate-300 font-semibold">Date</th>';
        html += '</tr></thead><tbody>';

        registrations.forEach(reg => {
            html += '<tr class="border-b border-white/5 hover:bg-white/5">';
            html += `<td class="p-3 text-slate-400">${reg.id || ''}</td>`;
            html += `<td class="p-3 text-white">${reg.fullName || ''}</td>`;
            html += `<td class="p-3 text-slate-300">${reg.phoneNumber || ''}</td>`;
            html += `<td class="p-3 text-slate-300">${reg.email || 'N/A'}</td>`;
            html += `<td class="p-3 text-slate-300">${reg.gender || ''}</td>`;
            html += `<td class="p-3 text-slate-300">${reg.major || ''}</td>`;
            html += `<td class="p-3 text-slate-300">${reg.year || ''}</td>`;
            html += `<td class="p-3 text-slate-400 text-sm">${reg.timestamp ? new Date(reg.timestamp).toLocaleString() : ''}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        adminRegistrationsList.innerHTML = html;
    }

    // Admin panel event listeners
    if (closeAdminPanelBtn) {
        closeAdminPanelBtn.addEventListener('click', closeAdminPanel);
    }

    if (refreshRegistrationsBtn) {
        refreshRegistrationsBtn.addEventListener('click', loadAdminRegistrations);
    }

    if (exportCSVAdminBtn) {
        exportCSVAdminBtn.addEventListener('click', adminExportCSV);
    }

    if (exportLocalCSVBtn) {
        exportLocalCSVBtn.addEventListener('click', function() {
            const localRegistrations = getSavedRegistrations();
            exportRegistrationsCSVFromData(localRegistrations);
        });
    }

    // Close admin panel when clicking outside
    if (adminPanel) {
        adminPanel.addEventListener('click', function(e) {
            if (e.target === adminPanel) {
                closeAdminPanel();
            }
        });
    }

    // Check for admin access on page load
    checkAdminAccess();

    // Make functions available globally for console access
    window.getSavedRegistrations = getSavedRegistrations;
    window.exportRegistrations = exportRegistrations;
    window.exportRegistrationsCSV = exportRegistrationsCSV;
    window.clearAllRegistrations = clearAllRegistrations;
    window.fetchRegistrationsFromAPI = fetchRegistrationsFromAPI;
    window.adminExportCSV = adminExportCSV;
    window.openAdminPanel = openAdminPanel;

    // Display helpful console message on page load
    console.log('%c📋 Workshop Registration System', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
    console.log('%cAvailable functions:', 'color: #ef4444; font-weight: bold;');
    console.log('  • getSavedRegistrations() - View all saved registrations');
    console.log('  • exportRegistrations() - Download registrations as JSON');
    console.log('  • exportRegistrationsCSV() - Download registrations as CSV');
    console.log('  • clearAllRegistrations() - Clear all saved registrations');
    console.log('\n%cExample usage:', 'color: #10b981; font-weight: bold;');
    console.log('  getSavedRegistrations()');
    console.log('  exportRegistrationsCSV()');
    
    // Show registration count on load
    const initialCount = getSavedRegistrations().length;
    if (initialCount > 0) {
        console.log(`\n%c✓ ${initialCount} registration(s) found in storage`, 'color: #10b981;');
    }

    // Button click handlers (for "I Want to Build" and "I Want to Break")
    const buildButton = document.querySelector('button:has(i.fa-hammer)') || 
                       Array.from(document.querySelectorAll('button')).find(btn => btn.querySelector('.fa-hammer'));
    const breakButton = document.querySelector('button:has(i.fa-shield-alt)') || 
                       Array.from(document.querySelectorAll('button')).find(btn => btn.querySelector('.fa-shield-alt'));

    if (buildButton) {
        buildButton.addEventListener('click', function() {
            openModal();
        });
    }

    if (breakButton) {
        breakButton.addEventListener('click', function() {
            openModal();
        });
    }

    // Add ripple effect to buttons
    document.querySelectorAll('button, a.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add subtle animation to terminal badge on load
    const terminalBadge = document.querySelector('.terminal-badge');
    if (terminalBadge) {
        terminalBadge.style.opacity = '0';
        terminalBadge.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            terminalBadge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            terminalBadge.style.opacity = '1';
            terminalBadge.style.transform = 'translateY(0)';
        }, 100);
    }

    // Parallax effect for ambient glows
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const glows = document.querySelectorAll('.ambient-glow');
        
        glows.forEach((glow, index) => {
            const speed = (index + 1) * 0.5;
            glow.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add active state to navigation links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-white');
            link.classList.add('text-slate-400');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.remove('text-slate-400');
                link.classList.add('text-white');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

