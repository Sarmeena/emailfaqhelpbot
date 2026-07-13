# TODO: Audit and Resolve Post-Deployment Auth, App Check, and RBAC Issues on Vercel

- `[x]` Update client-side Firebase initialization in `src/lib/firebase.ts` to support debug tokens in production and add initialization logs.
- `[x]` Add detailed logging to `src/context/AuthContext.tsx` during auth state changes, App Check status verification, and Firestore user role fetching/creation.
- `[x]` Add logging to `src/utils/apiAuth.ts` server middleware.
- `[x]` Verify build status and confirm all changes compile.
