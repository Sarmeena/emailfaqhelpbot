# Tasks: Resolve App Check and Gmail API Errors

- `[x]` Add `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` to `.env.local`
- `[x]` Update `src/lib/firebase.ts` with CustomProvider App Check on the server
- `[x]` Guard role checks with `exists()` in `firestore.rules`
- `[x]` Implement graceful fallback to simulated messages in `src/app/api/gmail/messages/route.ts`
- `[x]` Implement invalid/expired token auto-healing in `src/services/firestore/gmailConfig.ts`
- `[x]` Verify local execution and check for server-side App Check logs
