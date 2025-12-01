# Form Submission Flow - Complete Walkthrough

## Overview

This document explains the complete flow of what happens when a user submits the registration form, from button click to Google Drive upload.

## Step-by-Step Submission Process

### 1. User Interaction
**Location**: User clicks "Submit Registration" button in the modal

**File**: `js/controllers/form.controller.js`
- The form's submit event is intercepted by `FormController.handleSubmit()`
- Event is prevented from default browser submission

### 2. Form Data Collection
**File**: `js/controllers/form.controller.js` (line ~80)

```javascript
const formData = new FormData(this.form);
const data = Object.fromEntries(formData.entries());
```

**Data Collected**:
- `fullName` - User's full name
- `phoneNumber` - Formatted as +212 xxx xxx xxx
- `email` - Optional email address
- `gender` - Male or Female
- `major` - Selected major (CP, GIIA, etc.)
- `year` - Selected year (1, 2, or 3)
- `notes` - Optional additional notes

### 3. Validation
**File**: `js/services/validation.service.js`

**Process**:
1. All previous errors are cleared
2. Each field is validated:
   - **Full Name**: Must not be empty
   - **Phone Number**: Must match format +212 xxx xxx xxx
   - **Gender**: Must be selected
   - **Major**: Must be selected
   - **Year**: Must be selected

**If Validation Fails**:
- Errors are displayed under each invalid field (red text)
- Form scrolls to first error
- Submission stops
- User can fix errors and resubmit

**If Validation Passes**: Continue to step 4

### 4. Local Storage Save
**File**: `js/services/storage.service.js`

**Process**:
```javascript
StorageService.saveRegistration(data);
```

**What Happens**:
1. Gets all existing registrations from LocalStorage
2. Creates new registration object with:
   - All form data
   - Unique ID (timestamp-based)
   - ISO timestamp
3. Adds to registrations array
4. Saves back to LocalStorage

**Storage Key**: `workshopRegistrations`

### 5. CSV Generation
**File**: `js/services/csv.service.js`

**Process**:
```javascript
const allRegistrations = StorageService.getRegistrations();
const csvContent = CSVService.generateCSV(allRegistrations);
```

**What Happens**:
1. Retrieves ALL registrations (not just the new one)
2. Generates CSV with headers:
   - ID, Full Name, Phone Number, Email, Gender, Major, Year, Notes, Registration Date
3. Formats each registration as a CSV row
4. Escapes special characters (quotes, commas)
5. Adds UTF-8 BOM for Excel compatibility

**Result**: Complete CSV string with all registrations

### 6. Google Drive Upload
**File**: `js/services/drive.service.js`

**Process**:
```javascript
await DriveService.uploadRegistrations(allRegistrations);
```

**What Happens**:
1. Calls `uploadViaAppsScript()` method
2. Sends POST request to Google Apps Script URL with:
   - Action: 'uploadCSV'
   - Folder ID: Your Google Drive folder
   - Filename: 'workshop-registrations.csv'
   - CSV Content: Generated CSV string

**Google Apps Script Side** (on Google's servers):
1. Receives the request
2. Gets the folder by ID
3. Checks if file exists:
   - **If exists**: Updates the existing file
   - **If new**: Creates new file
4. Returns success response with file ID

**Result**: CSV file is now in your Google Drive folder

### 7. Success Handling
**File**: `js/controllers/form.controller.js` (line ~100)

**What Happens**:
1. Shows success alert: "Registration submitted successfully! CSV has been uploaded to Google Drive."
2. Closes the modal
3. Resets the form
4. Resets year dropdown

### 8. Error Handling
**If Google Drive Upload Fails**:
- Error is logged to console
- User sees: "Registration saved locally, but Google Drive upload failed. Please check console for details."
- Data is still saved in LocalStorage as backup

## File Updates

### The CSV File
- **Location**: Your Google Drive folder (ID: `1jjXThY65EqUPrmisPNTsXtB408FPrUa8`)
- **Filename**: `workshop-registrations.csv`
- **Content**: All registrations (updated with each submission)
- **Format**: CSV with UTF-8 BOM (Excel compatible)

### LocalStorage
- **Key**: `workshopRegistrations`
- **Format**: JSON array of registration objects
- **Purpose**: Backup if Google Drive fails

## Configuration Required

### Before First Submission

1. **Update Google Apps Script URL**
   - File: `js/config.js`
   - Line: `appsScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'`
   - Replace with your actual Apps Script Web App URL

2. **Create Google Apps Script** (if not done)
   - See `GOOGLE_DRIVE_SETUP.md` for detailed instructions
   - Deploy as Web App
   - Copy the deployment URL

## Testing the Flow

1. Open browser DevTools (F12)
2. Go to Console tab
3. Fill out and submit the form
4. Watch console logs:
   - "Registration saved: {...}"
   - "CSV uploaded to Google Drive: [fileId]"
5. Check Google Drive folder for updated CSV file

## Troubleshooting

### CSV Not Uploading
- Check `js/config.js` - Is `appsScriptUrl` set correctly?
- Check browser console for errors
- Verify Google Apps Script is deployed and accessible
- Check Apps Script execution logs

### Validation Errors
- Check that all required fields are filled
- Phone number must be in format: +212 xxx xxx xxx
- Major must be selected before Year

### LocalStorage Issues
- Check browser DevTools → Application → LocalStorage
- Look for key: `workshopRegistrations`
- Data should persist across page refreshes

## Data Flow Diagram

```
User Clicks Submit
    ↓
Form Controller Intercepts
    ↓
Validation Service Validates
    ↓ (if valid)
Storage Service Saves Locally
    ↓
CSV Service Generates CSV
    ↓
Drive Service Uploads to Google Drive
    ↓
Success Message Shown
    ↓
Modal Closes
```

## Key Files Reference

- **Form Handling**: `js/controllers/form.controller.js`
- **Validation**: `js/services/validation.service.js`
- **Storage**: `js/services/storage.service.js`
- **CSV Generation**: `js/services/csv.service.js`
- **Drive Upload**: `js/services/drive.service.js`
- **Configuration**: `js/config.js`

