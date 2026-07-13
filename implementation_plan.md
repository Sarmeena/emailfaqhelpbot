# Audit and Implementation Plan: Post-Deployment Auth, App Check, and RBAC Issues on Vercel

Provide a thorough audit of the project to identify the root cause of role and data access issues in production on Vercel. After deployment, authentication succeeds, but all users (Admin/Agent/Viewer) are treated as Viewers and the dashboard contains no data, accompanied by App Check reCAPTCHA errors. This plan outlines proposed logging and code changes to diagnose and resolve these issues.

## User Review Required

> [!IMPORTANT]
> **Vercel Build-Time vs. Runtime Environment Variables**: Next.js client-side variables prefixed with `NEXT_PUBLIC_` are statically embedded into client bundles at **build time**. If these variables (such as `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` or `NEXT_PUBLIC_FIREBASE_PROJECT_ID`) were not defined in Vercel settings *before* running the Vercel build, the client code will default to empty values, breaking App Check, Authentication, and Firestore connectivity in production.

> [!WARNING]
> **reCAPTCHA Enterprise Domain Registration**: For App Check/reCAPTCHA to pass in production, the Vercel deployment domains (e.g. `*.vercel.app` and any custom domains) must be explicitly added to the authorized domains list under your reCAPTCHA Enterprise key in the Google Cloud Console.

> [!NOTE]
> **Firebase Admin SDK on Vercel**: Vercel runs in a serverless environment outside Google Cloud Platform. Consequently, the Firebase Admin SDK on Vercel must be initialized using service account credentials (`FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`). If these variables are missing or incorrectly configured on Vercel, server-side API requests querying Firestore will fail.

## Proposed Changes

### Client Firebase Initialization

Allows the client to leverage the App Check debug token in production/Vercel deployments if `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` is explicitly set in Vercel. This enables verification and debugging on Vercel without a fully configured reCAPTCHA key.

#### [MODIFY] [firebase.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/lib/firebase.ts)
- Modify client-side App Check initialization to set `self.FIREBASE_APPCHECK_DEBUG_TOKEN` if `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` is defined (regardless of `NODE_ENV`).
- Add log statements printing the active Firebase project ID, App ID, and environment mode at initialization to verify configuration.

---

### Authentication Context

Provides verbose logging at every phase of the Auth state subscription, UID document loading, and default role fallbacks to pin down exact failures.

#### [MODIFY] [AuthContext.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/context/AuthContext.tsx)
- Log Firebase project IDs: verify that `db.app.options.projectId` matches `auth.app.options.projectId` on the client side.
- Log details of incoming `firebaseUser` (UID, Email) inside the `subscribeToAuth` callback.
- Log step-by-step resolution of `waitUntilAppCheckResolved()` and client App Check token retrieve attempts.
- Log Firestore read request details on `users/{uid}` and log whether the document exists.
- In the `catch` block for user document fetch, explicitly log the error code, message, and details (identifying if it's due to `permission-denied` or an App Check failure).

---

### Server API Authentication Middleware

Logs specific server-side project configuration details to confirm Admin SDK connection health.

#### [MODIFY] [apiAuth.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/utils/apiAuth.ts)
- Add logging inside `checkAuthAndRole()` to print whether Firebase Admin SDK (`adminDb`, `adminAuth`) is active or if it's using the REST API fallback.
- Log the server-side environment `process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID`.

## Verification Plan

### Manual Verification
1. Review console output on Vercel deployment logs and browser developer console.
2. Verify that `[Firebase Init] Config Project ID` matches the correct Firebase project name.
3. Observe the browser console logs during login:
   - Verify `[AuthContext] Active Firebase Project ID: ...` and `[AuthContext App Check Status] ...`.
   - Look for `[Firestore Permission Failure]` warnings or `[AuthContext] Error fetching or creating user document for UID: ...`.
4. If App Check is blocking Firestore reads, register Vercel domains in Google Cloud Console or temporarily set `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` on Vercel to bypass reCAPTCHA Enterprise verification for testing.
5. Manually log in with Admin, Agent, and Viewer accounts and check if their correct roles are loaded and stats render properly.
