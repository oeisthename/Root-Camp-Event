# Troubleshooting Google Drive Upload

## Common Errors and Solutions

### Error: "Registration saved locally, but Google Drive upload failed"

This means the form submission worked, but the Google Drive upload failed. Follow these steps:

## Step 1: Check Browser Console

1. Open your website
2. Press **F12** (or Right-click → Inspect)
3. Go to **Console** tab
4. Submit the form again
5. Look for error messages (they'll be in red)

## Step 2: Common Issues and Fixes

### Issue 1: "Google Apps Script URL not configured"

**Error Message:**
```
Google Apps Script URL not configured. Please set CONFIG.GOOGLE_DRIVE.appsScriptUrl
```

**Solution:**
1. Open `js/config.js`
2. Make sure line 10 has your actual Apps Script URL
3. It should look like:
   ```javascript
   appsScriptUrl: 'https://script.google.com/macros/s/YOUR_ID/exec',
   ```
4. Make sure the URL is in quotes and ends with `/exec`

### Issue 2: "Failed to fetch" or "NetworkError"

**Error Message:**
```
Network error: Could not reach Google Apps Script
```

**Possible Causes:**
- Internet connection issue
- Wrong Apps Script URL
- Apps Script not deployed

**Solution:**
1. Check your internet connection
2. Verify the Apps Script URL is correct
3. Make sure the script is deployed:
   - Go to Apps Script editor
   - Click "Deploy" → "Manage deployments"
   - Make sure there's an active deployment

### Issue 3: "CORS error"

**Error Message:**
```
CORS error: Make sure your Apps Script is deployed with "Who has access" set to "Anyone"
```

**Solution:**
1. Go to Apps Script editor
2. Click "Deploy" → "Manage deployments"
3. Click the pencil icon (edit) next to your deployment
4. Make sure **"Who has access"** is set to **"Anyone"**
5. Click "Deploy" to update
6. Try submitting the form again

### Issue 4: "Apps Script not found" (404)

**Error Message:**
```
Apps Script not found: Check that your URL is correct
```

**Solution:**
1. Go to Apps Script editor
2. Click "Deploy" → "Manage deployments"
3. Copy the **Web app URL** again (it might have changed)
4. Update `js/config.js` line 10 with the new URL
5. Make sure the URL ends with `/exec`

### Issue 5: "Access denied" (403)

**Error Message:**
```
Access denied: Make sure you authorized the script
```

**Solution:**
1. Make sure you clicked "Allow" during authorization
2. Try redeploying the script:
   - Go to Apps Script
   - Click "Deploy" → "Manage deployments"
   - Delete the old deployment
   - Create a new deployment
   - Authorize again

### Issue 6: Apps Script Error

**Error Message:**
```
Apps Script returned error: [some error message]
```

**Solution:**
1. Go to Apps Script editor
2. Click "Executions" (clock icon) in the left sidebar
3. Check for failed executions
4. Click on a failed execution to see the error
5. Common errors:
   - **"Folder not found"**: Check the folder ID in `js/config.js` line 9
   - **"Permission denied"**: Make sure the script has access to the folder
   - **"Invalid action"**: The Apps Script code might be wrong

## Step 3: Verify Apps Script Code

Make sure your Apps Script has the correct code:

1. Go to Apps Script editor
2. Check that the code matches this:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'uploadCSV') {
      const folderId = data.folderId;
      const filename = data.filename;
      const csvContent = data.csvContent;
      
      const folder = DriveApp.getFolderById(folderId);
      const files = folder.getFilesByName(filename);
      let file;
      
      if (files.hasNext()) {
        file = files.next();
        file.setContent(csvContent);
      } else {
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

## Step 4: Test Apps Script Directly

You can test if your Apps Script works by running it manually:

1. Go to Apps Script editor
2. Click the function dropdown → select `doPost`
3. Click "Run" (play button)
4. It will ask for test data - click "Cancel" (this is normal)
5. Go to "Executions" to see if there are any errors

## Step 5: Check Folder Permissions

1. Go to your Google Drive folder
2. Make sure the folder exists
3. Check the folder ID matches `1jjXThY65EqUPrmisPNTsXtB408FPrUa8`
4. The folder should be accessible by your Google account

## Step 6: Debug Checklist

- [ ] Apps Script URL is set in `js/config.js` (line 10)
- [ ] URL ends with `/exec`
- [ ] URL is in quotes
- [ ] Apps Script is deployed
- [ ] "Who has access" is set to "Anyone"
- [ ] Script is authorized (you clicked "Allow")
- [ ] Apps Script code is correct
- [ ] Folder ID is correct (`1jjXThY65EqUPrmisPNTsXtB408FPrUa8`)
- [ ] Browser console shows detailed error messages
- [ ] Internet connection is working

## Getting More Details

The updated code now logs detailed information to the console. After submitting the form, check the console for:

- ✅ "Attempting to upload CSV to Google Drive..."
- ✅ "URL: [your URL]"
- ✅ "Folder ID: [folder ID]"
- ✅ "Sending request to Apps Script..."
- ✅ "Response status: [status code]"
- ✅ "Apps Script response: [response]"

If you see errors, they'll be clearly marked with ❌ and include helpful messages.

## Still Having Issues?

1. **Copy the exact error message** from the console
2. **Check Apps Script executions** for errors
3. **Verify all configuration** matches the guide
4. **Try redeploying** the Apps Script

Share the console error messages and I can help you fix the specific issue!

