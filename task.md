# Tasks: Resolve Shared Authorization Problem with Firebase Admin SDK

- `[x]` Install `firebase-admin` dependency (added to package.json)
- `[x]` Create Firebase Admin SDK initializer at `src/lib/firebaseAdmin.ts`
- `[x]` Update shared auth middleware `checkAuthAndRole` in `src/utils/apiAuth.ts`
  - `[x]` Integrate Admin SDK token verification and document reads
  - `[x]` Add detailed logging of authorization decisions
  - `[x]` Implement local development fallback to custom verify/REST API
  - `[x]` Refactor REST API fallback to use client token instead of server email/pass login
- `[x]` Update `src/services/firestore/geminiConfig.ts` to use Admin SDK on the server with client token REST fallback
- `[x]` Update `src/services/firestore/gmailConfig.ts` to use Admin SDK on the server with client token REST fallback
- `[x]` Verify and compile changes in next dev environment
