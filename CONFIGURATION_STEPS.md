# Step-by-Step Configuration Guide

Follow these steps to configure your Google Drive upload functionality.

## Step 1: Create Google Apps Script

1. **Go to Google Apps Script**
   - Open: https://script.google.com/
   - Sign in with your Google account (elmqiddemothmane@gmail.com)

2. **Create New Project**
   - Click the "+" button or "New project"
   - You'll see a blank script editor

3. **Replace the Default Code**
   - Delete the default `function myFunction() {}` code
   - Copy and paste this code:

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

4. **Save the Project**
   - Click "Save" (or Ctrl+S / Cmd+S)
   - Give it a name like "CSV Upload Service"

## Step 2: Deploy as Web App

1. **Click "Deploy" Button**
   - Located in the top right corner
   - Click the dropdown arrow next to "Deploy"
   - Select "New deployment"

2. **Select Web App**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose "Web app" from the dropdown

3. **Configure Settings**
   - **Description**: "CSV Upload Service" (or any name you want)
   - **Execute as**: Select **"Me"** (your email)
   - **Who has access**: Select **"Anyone"**
     - This allows your website to call the script
     - Don't worry, only you have the URL

4. **Click "Deploy"**
   - A popup will appear asking for authorization

## Step 3: Authorize the Script

1. **You'll See a Warning**
   - "Google hasn't verified this app"
   - This is **NORMAL and SAFE** for personal use

2. **Click "Advanced"**
   - Located at the bottom of the warning screen

3. **Click "Go to [Your App Name] (unsafe)"**
   - The word "unsafe" is misleading
   - It just means "unverified by Google"
   - It's safe because YOU created it

4. **Click "Allow"**
   - This authorizes the script to access your Google Drive
   - You'll only see this once

## Step 4: Copy the Web App URL

1. **After Authorization**
   - You'll see a deployment window
   - Look for "Web app URL" or "Deployment URL"
   - It will look like:
     ```
     https://script.google.com/macros/s/AKfycby.../exec
     ```

2. **Copy the Entire URL**
   - Click the copy icon or select and copy
   - Make sure you get the complete URL ending in `/exec`

## Step 5: Update Your Config File

1. **Open `js/config.js`**
   - In your project folder
   - Open the file in your code editor

2. **Find This Line** (around line 10):
   ```javascript
   appsScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
   ```

3. **Replace the Placeholder**
   - Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` 
   - With your actual URL (keep the quotes)
   - Example:
   ```javascript
   appsScriptUrl: 'https://script.google.com/macros/s/AKfycby.../exec',
   ```

4. **Save the File**
   - Save `js/config.js`

## Step 6: Verify Your Configuration

Your `js/config.js` should now look like this:

```javascript
export const CONFIG = {
    // Google Drive Configuration
    GOOGLE_DRIVE: {
        folderId: '1jjXThY65EqUPrmisPNTsXtB408FPrUa8', // ✅ Already set
        appsScriptUrl: 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec', // ✅ Update this
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // ⚠️ Leave as is (not needed)
        apiKey: 'YOUR_GOOGLE_API_KEY', // ⚠️ Leave as is (not needed)
        scopes: 'https://www.googleapis.com/auth/drive.file'
    },
    // ... rest of config
};
```

## Step 7: Test the Configuration

1. **Open Your Website**
   - Open `index.html` in a browser
   - Or serve it via a local server

2. **Open Browser Console**
   - Press F12 or Right-click → Inspect
   - Go to "Console" tab

3. **Submit a Test Registration**
   - Fill out the form
   - Click "Submit Registration"
   - Watch the console for messages

4. **Check for Success**
   - Console should show: "CSV uploaded to Google Drive: [fileId]"
   - Check your Google Drive folder for `workshop-registrations.csv`

## Troubleshooting

### "appsScriptUrl not configured" Error
- Make sure you updated line 10 in `js/config.js`
- Check that the URL is in quotes
- Verify the URL ends with `/exec`

### "Access Denied" Error
- Make sure you clicked "Allow" during authorization
- Check that "Who has access" is set to "Anyone"
- Try redeploying the script

### CSV Not Appearing in Drive
- Check browser console for errors
- Verify the folder ID is correct: `1jjXThY65EqUPrmisPNTsXtB408FPrUa8`
- Make sure the folder exists and you have access

### Still Seeing Authorization Warning
- This is normal the first time
- Click "Advanced" → "Go to [App] (unsafe)" → "Allow"
- It won't appear again after first authorization

## Quick Checklist

- [ ] Created Google Apps Script project
- [ ] Pasted the `doPost` function code
- [ ] Saved the project
- [ ] Deployed as Web App
- [ ] Set "Execute as" to "Me"
- [ ] Set "Who has access" to "Anyone"
- [ ] Authorized the script (clicked "Allow")
- [ ] Copied the Web App URL
- [ ] Updated `js/config.js` line 10 with the URL
- [ ] Tested form submission
- [ ] Verified CSV appears in Google Drive folder

## What You Should Have

After configuration, you should have:
1. ✅ A Google Apps Script project deployed
2. ✅ A Web App URL (looks like: `https://script.google.com/macros/s/.../exec`)
3. ✅ Updated `js/config.js` with your URL
4. ✅ A working form that uploads CSV to Google Drive

That's it! You're all set. 🎉

