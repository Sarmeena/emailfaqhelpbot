# Implementation Plan: Resolve Shared Authorization Problem using Firebase Admin SDK

This plan addresses the shared authorization issue where `POST /api/settings/gemini` and `POST /api/gmail/auth` return `401 Unauthorized` due to `FirebaseError: Missing or insufficient permissions`. We will replace the server-side client/REST API reads with the Firebase Admin SDK and implement detailed logging.

---

## User Review Required

> [!IMPORTANT]
> - **Environment Variables**: For production/Vercel, verify that the environment variables `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` are configured.
> - **Local Development Fallback**: On localhost, if the Firebase Admin service account credentials are not configured, the logic will automatically fall back to the existing client/REST API authentication mechanism to avoid blocking developer workflows.

---

## Open Questions

There are no open questions.

---

## Proposed Changes

### Component: Firebase Admin SDK Setup

#### [NEW] [firebaseAdmin.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/lib/firebaseAdmin.ts)
- Initialize the Firebase Admin SDK as a singleton.
- Look for `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` environment variables. If present, initialize using the certificate.
- Otherwise, fall back to initialization with the default project ID configuration.
- Export `adminDb` and `adminAuth` helpers.

---

### Component: Shared Authorization Helper

#### [MODIFY] [apiAuth.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/utils/apiAuth.ts)
- Add imports for `adminDb` and `adminAuth` from `../lib/firebaseAdmin` inside functions or check if they are initialized.
- Refactor `checkAuthAndRole()`:
  - Add detailed logging of:
    - Incoming request pathname.
    - Presence and value of the `Authorization` header.
    - Verification state of the Firebase ID token.
    - Decoded UID and email.
    - User document existence in Firestore.
    - User's role value from Firestore.
    - Final authorization decision (Authorized, 401 Unauthorized, 403 Forbidden).
  - Attempt to verify the token via the Firebase Admin SDK (`adminAuth.verifyIdToken(token)`).
  - If verification succeeds, retrieve the user document `/users/{uid}` via the Firebase Admin SDK (`adminDb`).
  - If Admin SDK calls fail (e.g. missing credentials on localhost), fall back to the custom signature verification (`verifyFirebaseToken`) and the Firestore REST API (`getFirestoreDocREST`).
  - Verify that the target user document exists and check if the role matches the required role (e.g. `"admin"`).
  - Return `401 Unauthorized` only when the user is truly unauthenticated or validation fails.

---

### Component: Firestore Config Services

#### [MODIFY] [geminiConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/geminiConfig.ts)
- Refactor `getGeminiConfig()` and `saveGeminiConfig()`:
  - When running on the server (`typeof window === "undefined"`), attempt to read/write `settings/gemini` using the Firebase Admin SDK (`adminDb`).
  - Fall back to the Firestore REST API (`getFirestoreDocREST` / `setFirestoreDocREST`) if the Admin SDK call fails or credentials are not configured.

#### [MODIFY] [gmailConfig.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/services/firestore/gmailConfig.ts)
- Refactor `getGmailConfig()`, `saveGmailConfig()`, and `disconnectGmail()`:
  - When running on the server (`typeof window === "undefined"`), attempt to read/write `settings/gmail` using the Firebase Admin SDK (`adminDb`).
  - Fall back to the Firestore REST API (`getFirestoreDocREST` / `setFirestoreDocREST`) if the Admin SDK call fails or credentials are not configured.

---

### Component: Dependencies

#### [MODIFY] [package.json](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/package.json)
- Add `firebase-admin` dependency.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify types and correct Next.js compilation.

### Manual Verification
1. Run `npm run dev` locally.
2. Log in as an admin user on the frontend.
3. Access Gemini and Gmail configuration pages and modify settings.
4. Verify that requests to `POST /api/settings/gemini` and `POST /api/gmail/auth` complete with `200 OK`.
5. Check terminal/server logs to verify detailed logs for `[API Auth Check]` outputs, showing the decrypted UID, document status, role, and authorization decision.
