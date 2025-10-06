# Firebase Setup Guide for Finance Tracker

## Fixing "auth/unauthorized-domain" Error

If you're seeing the error "Firebase: Error (auth/unauthorized-domain)", it means you need to authorize your development domain in your Firebase project settings.

### Quick Fix Steps:

1. **Open Firebase Console**
   - Go to: [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account
   - Select your project: "finance-tracker-2bd73"

2. **Navigate to Authentication Settings**
   - In the left sidebar, click on **"Authentication"**
   - Go to the **"Sign-in method"** tab
   - Scroll down to the **"Authorized domains"** section

3. **Add Development Domains**
   Click "Add domain" and add these domains one by one:
   - `localhost:3000`
   - `127.0.0.1:3000`

4. **Add Production Domains (when deploying)**
   When you deploy your app, you'll also need to add:
   - Your deployed domain (e.g., `yourapp.vercel.app`)
   - Custom domain (e.g., `yourapp.com`)

### Detailed Instructions:

#### Step 1: Access Firebase Console
```
URL: https://console.firebase.google.com/
Project: finance-tracker-2bd73
```

#### Step 2: Find Authentication Settings
1. Click on "Authentication" in the left sidebar
2. Select the "Sign-in method" tab
3. Scroll down to find "Authorized domains"

#### Step 3: Add Localhost Domains
Click the "Add domain" button and add:
- `localhost:3000`
- `127.0.0.1:3000`

Your authorized domains should look like:
```
✓ localhost:3000
✓ 127.0.0.1:3000
✓ finance-tracker-2bd73.firebaseapp.com (default)
```

#### Step 4: Test the Application
After adding the domains:
1. Refresh your browser at `http://localhost:3000`
2. Try signing in with Google or email/password
3. The authentication should now work properly

### Alternative Solutions:

#### Option A: Authentication Required (Current Implementation)
The app now requires explicit authentication - no anonymous access is available. Users must:
- Sign in with Google account, OR
- Create an account with email/password

This ensures better data persistence and security for user financial data.

#### Option B: Use Firebase Emulator (Advanced)
For local development without internet:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

### Common Issues and Solutions:

#### Issue: "Domain already exists"
- This means the domain is already authorized
- Your issue might be elsewhere (check browser console for other errors)

#### Issue: "Invalid domain format"
- Make sure you're entering the domain correctly
- Format: `localhost:3000` (not `http://localhost:3000`)

#### Issue: Still getting the error after adding domains
- Clear your browser cache and cookies
- Try using an incognito/private window
- Check that you're adding domains to the correct Firebase project

### Production Deployment:

When you're ready to deploy your application, you'll need to add your production domains:

#### For Vercel:
- Add your Vercel URL (e.g., `yourapp.vercel.app`)
- Add any custom domains

#### For Netlify:
- Add your Netlify URL (e.g., `yourapp.netlify.app`)
- Add any custom domains

#### For Custom Domains:
- Add your custom domain (e.g., `yourapp.com`)
- Add both `http` and `https` versions if applicable

### Firebase Project Configuration:

Your Firebase project is configured with:
- **Project ID**: `finance-tracker-2bd73`
- **Auth Domain**: `finance-tracker-2bd73.firebaseapp.com`
- **API Key**: `AIzaSyC2bhlAdfiBHoB0OB9zUH-1kJGorN5LO0s`

### Security Best Practices:

1. **Keep API Keys Secure**: Your API key is already in the code, which is fine for web apps as it has domain restrictions
2. **Use Environment Variables**: For production, consider using environment variables
3. **Regular Domain Review**: Periodically review and clean up authorized domains
4. **Monitor Usage**: Check Firebase console for unusual authentication activity

### Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify you're editing the correct Firebase project
3. Make sure your Firebase project is not in a disabled state
4. Contact Firebase support if problems persist

---

**Note**: This is a one-time setup. Once you've added the domains, you won't need to do this again unless you deploy to new domains.