# Alternative: Google Apps Script Setup (No Authorization Warning)

If you want to avoid the authorization warning, you can use a simpler approach that runs the script as you (the owner) without requiring user authorization.

## Method 1: Simple Web App (Recommended for Personal Use)

### Step 1: Create the Script

Go to [Google Apps Script](https://script.google.com/) and create a new project with this code:

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

### Step 2: Deploy Settings

1. Click "Deploy" → "New deployment"
2. Select "Web app"
3. **Important Settings**:
   - **Execute as**: "Me" (your email)
   - **Who has access**: "Anyone" (this allows your website to call it)
4. Click "Deploy"
5. **First Time Authorization**:
   - You'll see the warning: "Google hasn't verified this app"
   - Click **"Advanced"**
   - Click **"Go to [Your App Name] (unsafe)"**
   - Click **"Allow"**
   - This is safe because YOU are the developer and YOU are authorizing YOUR OWN script

### Step 3: Why This Warning Appears

- Google shows this for any app that accesses "sensitive scopes" (like Google Drive)
- Apps need to go through Google's verification process (costs $15,000+ and takes months)
- For personal/internal use, you can safely ignore this
- The warning only appears the FIRST time you authorize
- After that, it works automatically

### Step 4: Copy the URL

After authorization, copy the Web App URL and update `js/config.js`:

```javascript
appsScriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

## Method 2: Using Service Account (Advanced - No User Interaction)

If you want to completely avoid user authorization, you can use a service account. This is more complex but doesn't require any user interaction.

### Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google Drive API"
4. Go to "Credentials" → "Create Credentials" → "Service Account"
5. Create service account and download JSON key

### Step 2: Share Drive Folder with Service Account

1. Open the JSON key file
2. Copy the service account email (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Go to your Google Drive folder
4. Share the folder with the service account email (give "Editor" permission)

### Step 3: Update Apps Script

Use a library that supports service accounts (like `OAuth2` library in Apps Script)

**Note**: This method is more complex and usually not necessary for personal use.

## Recommendation

**Use Method 1** - It's the simplest and the warning is harmless for personal use. You only see it once, and then it works automatically.

## Troubleshooting

### "Access Denied" Error
- Make sure you clicked "Allow" during authorization
- Check that "Who has access" is set to "Anyone"
- Try redeploying the script

### "Script not found" Error
- Make sure you copied the correct URL
- The URL should end with `/exec`
- Try redeploying and getting a new URL

### Still Getting Warnings
- This is normal for unverified apps
- Click "Advanced" → "Go to [App Name] (unsafe)" → "Allow"
- The warning won't appear again after first authorization

