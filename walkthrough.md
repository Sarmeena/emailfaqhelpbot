# Walkthrough: Audit & Diagnostic Logging for Deployed Vercel RBAC & App Check Issues

We have audited the authentication, App Check, and role-based access control (RBAC) flow to identify why users default to the `"viewer"` role in production and why the dashboard fails to load data. Detailed diagnostic logs have been added throughout the lifecycle to aid in debugging Vercel configuration discrepancies.

Furthermore, we replaced all silent `"viewer"` fallback behaviors with secure, explicit error states so database read/write failures cannot lead to default dashboard access.

---

## 1. Identified Issues & Solutions

### A. App Check reCAPTCHA Failure Blocking Firestore
- **Symptom**: Console logs show `AppCheck: ReCAPTCHA error (appCheck/recaptcha-error)`. Client-side calls to read from or write to Firestore fail with `permission-denied`.
- **Cause**: In production on Vercel (`NODE_ENV === "production"`), the app initializes `ReCaptchaEnterpriseProvider` using the configured site key. If the site key is invalid, or if the Vercel deployment domains (e.g. `*.vercel.app`) have not been whitelisted under the reCAPTCHA Enterprise key in the Google Cloud Console, App Check validation fails. This blocks all Firestore operations from the client-side SDK.
- **Solution**: Enabled App Check debug mode support in production. If `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` is explicitly set in Vercel's environment variables, the client SDK will configure and use the debug provider. Additionally, Vercel deployment domains must be whitelisted in the reCAPTCHA console.

### B. Removed Silent Fallback to Viewer Role
- **Symptom**: Previously, when client-side Firestore reads failed (such as due to App Check blocks), the `catch` block caught the error and silently fell back to `setRole("viewer")`. This allowed access to the Viewer dashboard, but the dashboard rendered no data because subsequent Firestore operations were blocked.
- **Solution**: 
  - **Client-side**: Modified [AuthContext.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/context/AuthContext.tsx) to set the role to `"error"` instead of silently defaulting.
  - **Server-side middleware**: Modified [apiAuth.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/utils/apiAuth.ts) to check for read/write errors and throw descriptive authorization exceptions rather than proceeding with a default `"viewer"` status.

### C. Added Route Guard Protection for Failed Loadings
- **Symptom**: If the user's role profile fails to load, we should not grant dashboard access.
- **Solution**: Modified [ProtectedRoute.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/auth/ProtectedRoute.tsx) to immediately redirect the user to `/unauthorized` if the role is missing or set to `"error"`.

### D. Clear User Feedback on Unauthorized Page
- **Symptom**: User redirected to `/unauthorized` is confused.
- **Solution**: Updated [unauthorized/page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/unauthorized/page.tsx) to check if the role is missing or `"error"`. It will display a clear description indicating that a Firestore read error or App Check block occurred, rather than saying "registered as a viewer".

### E. Build-Time Environment Variable Pitfalls
- **Symptom**: Configuration values appear blank or mismatch.
- **Cause**: Next.js client-side variables (`NEXT_PUBLIC_`) are statically embedded at **build time**. If the environment variables were not registered in Vercel settings prior to building, they will compile as empty/undefined in production.
- **Solution**: Log configuration metadata (such as the active project ID and app ID) during initialization.

---

## 2. Changes Made

### 1. Updated Firebase Initialization
- **File**: [firebase.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/lib/firebase.ts)
- Configured client-side App Check to support `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` in production if present in environment variables.
- Added logs to output the initialized Firebase config's `projectId`, `appId`, and active execution mode.

### 2. Added Verbose Client Auth Diagnostics
- **File**: [AuthContext.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/context/AuthContext.tsx)
- Logs client-side Firestore vs. Auth project ID variables: `db.app.options.projectId` vs. `auth.app.options.projectId`.
- Logs state transitions, App Check resolution, and Firestore request steps for `users/{uid}`.
- Sets role to `"error"` on database loading failure rather than silently defaulting to `"viewer"`.

### 3. Added Guarding and Redirection on Falsy Role
- **File**: [ProtectedRoute.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/components/auth/ProtectedRoute.tsx)
- Replaces generic checks. If `!role` or `role === "error"`, it blocks child component mounting and redirects to `/unauthorized`.

### 4. Detailed Explanations on Access Denied Page
- **File**: [unauthorized/page.tsx](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/app/unauthorized/page.tsx)
- Checks if role is missing or set to `"error"` and displays a helpful database/App Check diagnostic instruction.

### 5. Added Server API Auth Diagnostics
- **File**: [apiAuth.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/utils/apiAuth.ts)
- Logs server-side active `projectId`.
- Logs availability check for dynamic import of `firebase-admin` helpers (`adminDb` and `adminAuth`).
- Throws descriptive exceptions instead of silently fallback to `"viewer"` if database document reads or writes fail.

---

## 3. Recommended Verifications & Setup on Vercel

1. **Verify Vercel Environment Variables**:
   Ensure the following variables are configured in Vercel project settings **before triggering a new deployment build**:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (Verify it matches the production Firebase project!)
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `FIREBASE_CLIENT_EMAIL` (For server-side Admin SDK verification)
   - `FIREBASE_PRIVATE_KEY` (For server-side Admin SDK verification)

2. **Add Authorized Domains in reCAPTCHA Enterprise**:
   - Go to Google Cloud Console -> reCAPTCHA Enterprise.
   - Edit your Site Key.
   - Add your Vercel deployment domain (e.g., `*.vercel.app` and any custom domains) to the **Authorized Domains** list.

3. **Verify via Debug Token (Optional)**:
   - For troubleshooting, generate an App Check debug token in the Firebase console.
   - Set it as `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` in Vercel settings and trigger a build. This will bypass reCAPTCHA and allow verified Firestore reads.
