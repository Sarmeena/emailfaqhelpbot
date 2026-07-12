# Implementation Plan: Resolve Server-Side App Check Permissions Errors

This plan addresses the Next.js server-side API errors (`Failed to sign in system admin` and `API authorization check failed` with `Missing or insufficient permissions`) which occur because Next.js API routes run server-side and use the Firebase Client SDK to query Firestore. Since App Check is enforced at the project level, these server-side client calls fail because Node.js lacks App Check token verification.

To resolve this, we will use the registered App Check debug token on the server side using a `CustomProvider` that RESTfully exchanges the debug token for a valid App Check token.

---

## User Review Required

> [!IMPORTANT]
> - **Environment Variables**: We will define `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` in `.env.local` with the registered debug token (`c9d67396-82a9-466b-a59c-a59423ce86e6`).
> - **Shared Token**: By sharing this token between client and server, both the browser and the Next.js server-side API routes will be able to authenticate successfully against Firebase App Check.

---

## Open Questions

There are no open questions.

---

## Proposed Changes

### Component: Environment Variables

#### [MODIFY] [.env.local](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/.env.local)
- Add `NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN` to store the registered debug token.
```
NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=c9d67396-82a9-466b-a59c-a59423ce86e6
```

---

### Component: Firebase Configuration

#### [MODIFY] [firebase.ts](file:///c:/Users/Windows%2011/Documents/email-faq-help-bot/src/lib/firebase.ts)
- Update client App Check initialization to use the environment variable if present.
- Implement server-side App Check initialization using `CustomProvider` to RESTfully exchange the debug token.
```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  CustomProvider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize App Check
if (typeof window !== "undefined") {
  try {
    if (process.env.NODE_ENV === "development") {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn("App Check already initialized.");
  }
} else {
  // Server-side (Node.js) App Check initialization for local development
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN) {
    try {
      initializeAppCheck(app, {
        provider: new CustomProvider({
          getToken: async () => {
            const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
            const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID!;
            const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
            const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN!;

            const url = `https://firebaseappcheck.googleapis.com/v1/projects/${projectId}/apps/${appId}:exchangeDebugToken?key=${apiKey}`;
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ debugToken }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(`Failed to exchange debug token: ${JSON.stringify(data)}`);
            }
            return {
              token: data.token,
              expireTimeMillis: Date.now() + (data.ttl ? parseInt(data.ttl) * 1000 : 3600000),
            };
          },
        }),
        isTokenAutoRefreshEnabled: true,
      });
      console.log("[Server App Check] Initialized App Check on server with CustomProvider.");
    } catch (error) {
      console.error("[Server App Check] Failed to initialize App Check on server:", error);
    }
  }
}
```

---

## Verification Plan

### Automated Tests
- Run `npm run build` or let the Next.js HMR recompile.

### Manual Verification
1. Open the local web application at `http://localhost:3000`.
2. Inspect the terminal log for: `[Server App Check] Initialized App Check on server with CustomProvider.`
3. Verify that `/settings` and `/analytics` load properly without the server-side API auth errors.
