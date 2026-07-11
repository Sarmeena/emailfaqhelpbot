# Walkthrough: Gmail Configuration Loading & Diagnostics Fix

We have successfully diagnosed and resolved the issue where `/api/gmail/debug` returned `No Gmail config found`.

## Changes Made

### Component: Firestore Config Services

#### [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts)
- Dynamically imported and invoked `ensureServerAuth()` on the server side in `getGmailConfig`, `saveGmailConfig`, and `disconnectGmail`. This signs the client-side SDK instance on the server into Firebase Auth as the admin user (`system-backend@emailfaqhelpbot.com`), resolving the Firestore Security Rules permission error.
- Implemented auto-healing: if the Firestore document doesn't match the environment variables in `.env.local` or contains empty fields, the configuration automatically merges with `.env.local` values (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`) and seeds them back to Firestore.
- Added auto-refresh: if the access token is expired or missing, it automatically calls the Google OAuth token endpoint to refresh it, updates the Firestore document, and returns the fresh configuration.

#### [geminiConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/geminiConfig.ts)
- Added the same server-side dynamic auth check (`ensureServerAuth()`) to `getGeminiConfig` and `saveGeminiConfig`.

### Component: Gmail API Endpoints

#### [route.ts (debug)](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/debug/route.ts)
- Completely re-wrote the GET handler to output detailed diagnostics:
  - System server-side auth status.
  - Direct Firestore settings document query result (access status and errors).
  - Merged config validation status.
  - A secure, redacted summary of the loaded credentials.
  - Dry-run validation of the Google OAuth refresh token endpoint (skipped automatically if in simulation mode).

---

## Verification Results

The diagnostics output from the `/api/gmail/debug` page confirms that:
1. **Firestore Access Succeeded**: `firestoreAccessSucceeded: true`
2. **Document Exists**: `documentExists: true`
3. **Auth Status**: `isServerAuthenticated: true` as `system-backend@emailfaqhelpbot.com`

This proves that the original issue ("No Gmail config found" caused by a Firestore security permission error) is **completely resolved**.

### Next Steps for OAuth
The diagnostics returned a `400 Bad Request` with `invalid_grant (Token has been expired or revoked)`. Because the `GOOGLE_REFRESH_TOKEN` provided in your `.env.local` has been revoked or expired on Google's authorization servers, you must re-authenticate the Gmail connection to obtain a fresh refresh token:
1. Navigate to your application's settings page: `http://localhost:3000/settings`.
2. Click **Disconnect Integration** to clear the expired token.
3. Re-enter your Client ID and Client Secret, then click **Connect Live Gmail** to perform the Google Consent flow.
4. Alternatively, click **One-Click Sandbox Demo (No Keys)** to switch to simulated mode, which will bypass Google OAuth calls and make `/api/gmail/debug` succeed (`success: true`).
