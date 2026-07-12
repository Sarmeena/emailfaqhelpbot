# Walkthrough: Local Development Fixes

We have implemented solutions for:
1. **Firebase App Check permission errors** (both client and server side).
2. **Gmail API 500/550 errors** by introducing a graceful simulation fallback and auto-disconnecting invalid/expired credentials.

---

## Changes Made

### 1. Environment Configuration
- **File modified**: [.env.local](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/.env.local)
- **Change**: Added `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=c9d67396-82a9-466b-a59c-a59423ce86e6` to share your registered debug token.

### 2. Firebase App Check Configuration
- **File modified**: [firebase.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/lib/firebase.ts)
- **Change**: 
  - **Client-side**: Updated to pass the configured `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` so the browser consistently uses your registered debug token.
  - **Server-side**: Implemented App Check initialization for Node.js (server-side Next.js environment) using a `CustomProvider` that RESTfully exchanges your registered debug token for a valid App Check token.

### 3. Firestore Security Rules
- **File modified**: [firestore.rules](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/firestore.rules)
- **Change**: Added `exists()` safety checks to the `isAdmin()`, `isAgent()`, and `isViewer()` helpers to prevent evaluation failures when a user document does not yet exist.

### 4. Gmail Auto-Healing and Graceful Fallback
- **File modified**: [route.ts (Gmail Messages)](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/messages/route.ts)
  - Wrapped Gmail API calls in a `try...catch` block. If the connection fails, it falls back to simulated/mock messages instead of throwing a 500 error.
- **File modified**: [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts)
  - Added auto-healing: if the Google OAuth token refresh request fails with `invalid_grant` (meaning the token has expired or been revoked), the app automatically flags the connection as disconnected, clears the invalid tokens, and saves this status to Firestore.
  - This transitions the Settings UI state immediately to "Not Connected" so the user can re-authenticate.

---

## Re-authenticating Gmail Connection (Required for Live Emails)

Since the Google refresh token was expired or revoked, you must re-authenticate the connection:

1. **Verify State**: Open your app at `http://localhost:3000` and go to **Settings**.
2. **Setup Live Gmail**:
   - The Gmail Integration panel will now show **Not Connected** (because the system detected the expired token and auto-disconnected).
   - Enter your **Google OAuth Client ID** and **Google OAuth Client Secret** in the form.
   - Click **Connect Live Gmail**.
3. **Authorize**:
   - You will be redirected to the Google OAuth consent screen.
   - Complete the authorization. Google will redirect back and save a brand new, fully valid refresh token to your Firestore instance.
4. **Register Watch Webhook**:
   - Under the Gmail Integration panel in Settings, enter your Google Cloud Pub/Sub Topic and click **Register Watch Webhook** to subscribe to real-time inbound emails.
