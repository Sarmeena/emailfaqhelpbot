import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  CustomProvider,
  getToken,
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

// Initialize App Check and export helpers
export let appCheckInstance: any = null;
let appCheckPromise: Promise<any> | null = null;

if (typeof window !== "undefined") {
  console.log(`[Firebase Client Init] Starting Firebase Initialization. Project ID: '${firebaseConfig.projectId}', App ID: '${firebaseConfig.appId}', Mode: '${process.env.NODE_ENV}'`);
  
  const globalWithAppCheck = globalThis as any;
  if (!globalWithAppCheck.firebaseAppCheckInitialized) {
    const rawSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    // Clean any quotes, whitespace, or newlines
    const siteKey = rawSiteKey.replace(/['"\r\n]/g, "").trim();
    const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
    
    if (debugToken || process.env.NODE_ENV === "development") {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken || true;
      console.log(`[Firebase Client Init] App Check Debug Mode enabled. Custom Token Present: ${!!debugToken}`);
    }

    if (siteKey) {
      try {
        console.log(`[Firebase Client Init] Initializing ReCaptchaEnterpriseProvider. Site Key Length: ${siteKey.length}`);
        const appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
        globalWithAppCheck.firebaseAppCheckInitialized = appCheck;
        globalWithAppCheck.firebaseAppCheckPromise = getToken(appCheck, false)
          .then((res) => {
            console.log("[Firebase Client Init] App Check Token fetched successfully. Length:", res.token.length);
            return res;
          })
          .catch((err) => {
            console.error("[Firebase Client Init] App Check Token fetch promise rejected:", err);
            throw err;
          });
      } catch (error) {
        console.warn("[Firebase Client Init] App Check initialization failed/already initialized:", error);
      }
    } else {
      console.warn("[Firebase Client Init] No reCAPTCHA site key found in environment variables (NEXT_PUBLIC_RECAPTCHA_SITE_KEY).");
    }
  }
  appCheckInstance = globalWithAppCheck.firebaseAppCheckInitialized;
  appCheckPromise = globalWithAppCheck.firebaseAppCheckPromise;
} else {
  // Server-side App Check initialization for local development
  const globalWithAppCheck = globalThis as any;
  if (!globalWithAppCheck.firebaseAppCheckInitialized) {
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN) {
      try {
        const appCheck = initializeAppCheck(app, {
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
        globalWithAppCheck.firebaseAppCheckInitialized = appCheck;
        console.log("[Server App Check] Initialized App Check on server with CustomProvider.");
      } catch (error) {
        console.error("[Server App Check] Failed to initialize App Check on server:", error);
      }
    }
  }
  appCheckInstance = globalWithAppCheck.firebaseAppCheckInitialized;
}

export async function waitUntilAppCheckResolved() {
  if (typeof window === "undefined") return;
  if (appCheckPromise) {
    try {
      await appCheckPromise;
    } catch (e) {
      console.warn("[App Check] Proceeding without verified App Check token due to error:", e);
    }
  }
}

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;