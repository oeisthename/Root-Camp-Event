# Google Drive Upload Setup Guide

This guide will help you set up automatic CSV uploads to your Google Drive folder.

## Option 1: Google Apps Script (Recommended - Easier)

### Step 1: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the code with this:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'uploadCSV') {
      const folderId = data.folderId;
      const filename = data.filename;
      const csvContent = data.csvContent;
      
      // Get the folder
      const folder = DriveApp.getFolderById(folderId);
      
      // Check if file exists
      const files = folder.getFilesByName(filename);
      let file;
      
      if (files.hasNext()) {
        // Update existing file
        file = files.next();
        file.setContent(csvContent);
      } else {
        // Create new file
        file = folder.createFile(filename, csvContent, MimeType.CSV);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        message: 'CSV uploaded successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon ⚙️ next to "Select type" → "Web app"
3. Set:
   - Description: "CSV Upload Service"
   - Execute as: "Me"
   - Who has access: "Anyone" (or "Anyone with Google account" for more security)
4. Click "Deploy"
5. **IMPORTANT - Authorization Warning**:
   - You will see: "Google hasn't verified this app"
   - This is **NORMAL and SAFE** for personal use
   - Click "Advanced" → "Go to [Your App Name] (unsafe)"
   - Click "Allow" to authorize
   - This warning appears because the app isn't verified by Google (which costs money for developers)
   - For personal/internal use, it's completely safe
6. Copy the Web App URL

### Step 3: Update Your Code

In `script.js`, find this line:
```javascript
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```

Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with the URL you copied.

## Option 2: Direct Google Drive API (More Complex)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google Drive API"

### Step 2: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Add authorized JavaScript origins: Your website URL
5. Copy the Client ID

### Step 3: Update Your Code

In `script.js`, update:
```javascript
const GOOGLE_DRIVE_CONFIG = {
    folderId: '1jjXThY65EqUPrmisPNTsXtB408FPrUa8', // Already set
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Client ID
    apiKey: 'YOUR_GOOGLE_API_KEY', // Replace with your API Key
    scopes: 'https://www.googleapis.com/auth/drive.file'
};
```

## Testing

After setup, test by submitting a registration form. The CSV should automatically upload to your Google Drive folder.

## Troubleshooting

- Check browser console for error messages
- Ensure the Google Drive folder ID is correct
- Verify the Apps Script is deployed and accessible
- Make sure the folder has proper permissions

