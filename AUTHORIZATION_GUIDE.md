# Google Apps Script Authorization Guide

## Understanding the Warning

When you deploy a Google Apps Script that accesses Google Drive, you'll see this warning:

> **"Google hasn't verified this app"**

### Why This Happens

1. **Google's Security Policy**: Any app that accesses "sensitive scopes" (like Google Drive) must be verified by Google
2. **Verification Process**: 
   - Costs $15,000+ USD
   - Takes 6-12 months
   - Requires business registration
   - Only needed for public apps with many users
3. **Personal Use**: For personal/internal apps, this verification is NOT required

### Is It Safe?

**YES, it's completely safe** because:
- ✅ You are the developer of the script
- ✅ You are authorizing YOUR OWN script
- ✅ The script only accesses YOUR Google Drive folder
- ✅ No third-party has access
- ✅ The code is visible to you in Apps Script

## How to Proceed

### Step-by-Step Authorization

1. **Click "Deploy"** in Apps Script editor
2. **Select "New deployment"**
3. **Choose "Web app"**
4. **Set permissions**:
   - Execute as: **"Me"**
   - Who has access: **"Anyone"**
5. **Click "Deploy"**
6. **You'll see the warning** - This is normal!
7. **Click "Advanced"** (at the bottom)
8. **Click "Go to [Your App Name] (unsafe)"**
   - The word "unsafe" is misleading - it just means "unverified"
   - It's safe because YOU created it
9. **Click "Allow"**
10. **Copy the Web App URL**

### Visual Guide

```
[Deploy Button] 
    ↓
[New deployment]
    ↓
[Web app]
    ↓
[Settings: Execute as "Me", Access "Anyone"]
    ↓
[Deploy]
    ↓
⚠️ "Google hasn't verified this app"
    ↓
[Advanced] ← Click this
    ↓
[Go to [Your App] (unsafe)] ← Click this
    ↓
[Allow] ← Click this
    ↓
✅ Authorized! Copy the URL
```

## After Authorization

- ✅ The warning **won't appear again** for you
- ✅ The script will work automatically
- ✅ Your website can now upload CSV files
- ✅ No user interaction needed after first setup

## Alternative: Accept the Warning (Simpler)

If you're comfortable with it, you can also:
1. Just click **"Continue"** or **"Allow"** directly
2. The warning is just Google being cautious
3. For personal use, it's perfectly fine

## Security Notes

### What the Script Can Do
- ✅ Create/update CSV files in YOUR specified folder
- ✅ Only the folder you specify in the code
- ✅ Nothing else

### What the Script CANNOT Do
- ❌ Access other folders
- ❌ Delete files
- ❌ Access your email
- ❌ Access other Google services
- ❌ Share files with others

### Best Practices
1. **Review the code** before deploying (you can see it in Apps Script)
2. **Use a dedicated folder** (which you're already doing)
3. **Don't share the script URL** publicly if you want to keep it private
4. **Monitor the folder** occasionally to ensure only expected files are there

## If You're Still Concerned

### Option 1: Review the Code
The Apps Script code is simple and only:
- Receives CSV data
- Saves it to your specified folder
- Returns success/error

You can see and modify all the code yourself.

### Option 2: Test First
1. Deploy the script
2. Test with one submission
3. Check your Drive folder
4. Verify only the expected file was created/updated

### Option 3: Use a Test Folder
1. Create a test folder in Google Drive
2. Use that folder ID first
3. Test thoroughly
4. Switch to production folder when confident

## Common Questions

**Q: Will others see this warning?**
A: No, only you (the developer) see it during setup. Users of your website won't see anything.

**Q: Do I need to verify the app?**
A: No, verification is only for public apps with many users. Personal/internal use doesn't require it.

**Q: Is my data safe?**
A: Yes, the script only accesses the folder you specify, and you control all the code.

**Q: Can I revoke access later?**
A: Yes, go to [Google Account Security](https://myaccount.google.com/permissions) and remove the app.

**Q: Will this cost money?**
A: No, Google Apps Script is free for personal use.

## Next Steps

After authorization:
1. Copy the Web App URL
2. Update `js/config.js`:
   ```javascript
   appsScriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
   ```
3. Test the form submission
4. Check your Google Drive folder for the CSV file

That's it! The warning is just Google being cautious, but it's completely safe for your use case.

