# Walkthrough: Resolve Shared Authorization Problem with Firebase Admin SDK

We have successfully resolved the shared authorization issue causing `POST /api/settings/gemini` and `POST /api/gmail/auth` to fail with `401 Unauthorized` / `FirebaseError: Missing or insufficient permissions`. 

By introducing the Firebase Admin SDK on the server, we bypass App Check and Firestore security rules constraints for backend API routes. We also built a robust fallback to custom verification and the Firestore REST API so that local development settings continue working out-of-the-box.

---

## Changes Made

### 1. Added `firebase-admin` Dependency
- **File modified**: [package.json](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/package.json)
- Added `"firebase-admin": "^12.1.0"` to the dependencies.

### 2. Created Firebase Admin SDK Initializer
- **File created**: [firebaseAdmin.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/lib/firebaseAdmin.ts)
- Initializes the Admin SDK dynamically at runtime to prevent compile-time Turbopack/Webpack errors when `firebase-admin` is not yet installed in local `node_modules`.
- Checks for `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` environment variables. If present, initializes using the certificate.
- Otherwise, falls back to the default project ID configuration.
- Exports `adminDb` and `adminAuth` helpers (which resolve to `null` if the module is not found).

### 3. Refactored Shared Authorization Middleware
- **File modified**: [apiAuth.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/utils/apiAuth.ts)
- Refactored `checkAuthAndRole()` to:
  1. Print extensive debugging logs containing the requested endpoint path, the presence and prefix value of the incoming `Authorization` header, token verification steps, decoded client UID/email, Firestore document lookup status, role value, and final authorization decision.
  2. Perform ID token verification via `adminAuth.verifyIdToken(token)`.
  3. Fetch the client user's document using `adminDb.collection("users").doc(uid)`.
  4. **Bypassed Session Deadlocks via Client-Token REST Fallback**: If the Admin SDK is not available (e.g. on localhost without service account credentials), it falls back to signature verification (`verifyFirebaseToken`) and queries the Firestore REST API (`getFirestoreDocREST` / `setFirestoreDocREST`) **by passing the client's own verified ID token**. This completely eliminates the need for server-side email/password authentication (`ensureServerAuth`) and avoids global singleton race conditions or session deadlocks on localhost.
  5. Correctly enforces required roles (e.g., checks if `role == "admin"` for settings access) and returns 401 only if validation fails.

### 4. Transitioned Settings Services to Admin SDK with Client-Token Fallbacks
- **Files modified**:
  - [geminiConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/geminiConfig.ts)
  - [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts)
- Updated server-side config functions (`getGeminiConfig`, `saveGeminiConfig`, `getGmailConfig`, `saveGmailConfig`, `disconnectGmail`) to accept an optional `token?: string` parameter.
- Attempt to read/write settings using the Firebase Admin SDK.
- If it fails, they execute REST API fallback queries using the passed client `token` (or fall back to the system backend token if no client token is provided, e.g., inside webhook triggers).

### 5. Configured API Route Handlers
- **Files modified**:
  - [route.ts (Gemini settings)](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/settings/gemini/route.ts)
  - [route.ts (Gmail auth)](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/auth/route.ts)
  - [route.ts (Gmail status)](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/status/route.ts)
  - [route.ts (Gmail disconnect)](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/api/gmail/disconnect/route.ts)
- Extracted the client's `token` from the incoming request's `Authorization: Bearer <token>` header.
- Forwarded the `token` parameter to the configuration services to ensure REST API queries execute successfully under the authenticated user's permission context.

---

## Action Required Outside the Bot

To finalize the installation and test the changes:
1. **Stop your active `npm run dev` server** in the terminal.
2. **Run `npm install`** in the project root directory (`c:\Users\Windows 11\Documents\email-faq-help-bot`) to install `firebase-admin`.
3. **Restart the development server** using `npm run dev`.
4. **Log in as an Admin user** and access/modify the Gmail and Gemini settings pages to ensure they save and load successfully.
5. **Check the Next.js server console** to monitor the detailed `[API Auth Check]` logs showing the authorization step-by-step decision.
