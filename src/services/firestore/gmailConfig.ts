import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface GmailConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  connected: boolean;
  emailAddress: string;
  isSimulated: boolean;
  pubSubTopic?: string;
  watchExpiration?: number;
  redirectUri?: string;
  scopes?: string[];
}

const CONFIG_DOC_PATH = ["settings", "gmail"] as const;

/** Retrieve Gmail configuration details */
export async function getGmailConfig(token?: string): Promise<GmailConfig | null> {
  try {
    let data: any = null;
    if (typeof window === "undefined") {
      try {
        const { adminDb } = await import("../../lib/firebaseAdmin");
        if (!adminDb) {
          throw new Error("Admin Database is not initialized (module not installed)");
        }
        const docSnap = await adminDb.collection(CONFIG_DOC_PATH[0]).doc(CONFIG_DOC_PATH[1]).get();
        if (docSnap.exists) {
          data = docSnap.data();
        }
      } catch (adminError) {
        console.warn("[gmailConfig] Admin SDK get failed, falling back to REST API:", adminError);
        const { getFirestoreDocREST, parseRESTFields } = await import("../../utils/apiAuth");
        const docData = await getFirestoreDocREST(CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1], token);
        if (docData) {
          data = parseRESTFields(docData.fields);
        }
      }
    } else {
      const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        data = snapshot.data();
      }
    }

    if (data) {
      let updated = false;

      // Env fallbacks
      const envClientId = process.env.GOOGLE_CLIENT_ID || "";
      const envClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
      const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";
      const envRedirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/gmail/callback";

      const defaults: Partial<GmailConfig> = {
        clientId: envClientId,
        clientSecret: envClientSecret,
        accessToken: "",
        refreshToken: envRefreshToken,
        expiryDate: 0,
        connected: !!envRefreshToken,
        emailAddress: "emailfaqhelpbot@gmail.com",
        isSimulated: false,
        pubSubTopic: "",
        watchExpiration: 0,
        redirectUri: envRedirectUri,
        scopes: [
          "https://www.googleapis.com/auth/gmail.readonly",
          "https://www.googleapis.com/auth/gmail.send"
        ]
      };

      const merged = { ...data };
      for (const key of Object.keys(defaults)) {
        if (merged[key] === undefined || merged[key] === "") {
          merged[key] = (defaults as any)[key];
          updated = true;
        }
      }

      // Server-side auto-healing: overwrite database credentials if they don't match env variables
      if (typeof window === "undefined" && envRefreshToken && merged.refreshToken !== envRefreshToken) {
        console.log("[gmailConfig] Overwriting database refresh token with env GOOGLE_REFRESH_TOKEN");
        merged.refreshToken = envRefreshToken;
        merged.clientId = envClientId;
        merged.clientSecret = envClientSecret;
        merged.connected = true;
        merged.isSimulated = false;
        updated = true;
      }

      // Server-side auto-healing: refresh access token if expired or missing
      if (typeof window === "undefined" && merged.refreshToken && (Date.now() > merged.expiryDate || !merged.accessToken)) {
        console.log("[gmailConfig] Access token expired or missing. Refreshing...");
        try {
          const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: merged.clientId,
              client_secret: merged.clientSecret,
              refresh_token: merged.refreshToken,
              grant_type: "refresh_token",
            }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            merged.accessToken = refreshData.access_token;
            merged.expiryDate = Date.now() + refreshData.expires_in * 1000;
            merged.connected = true;
            updated = true;
            console.log("[gmailConfig] Successfully refreshed and updated access token.");
          } else {
            const errorText = await refreshResponse.text();
            console.error("[gmailConfig] Failed to refresh token:", errorText);
            if (errorText.includes("invalid_grant") || errorText.includes("revoked")) {
              console.log("[gmailConfig] Token is revoked or invalid. Marking as disconnected.");
              merged.connected = false;
              merged.accessToken = "";
              merged.refreshToken = "";
              updated = true;
            }
          }
        } catch (err) {
          console.error("[gmailConfig] Error refreshing access token:", err);
        }
      }

      if (updated) {
        console.log("[gmailConfig] Saving updated configuration back to Firestore settings/gmail");
        if (typeof window === "undefined") {
          try {
            const { adminDb } = await import("../../lib/firebaseAdmin");
            if (!adminDb) {
              throw new Error("Admin Database is not initialized (module not installed)");
            }
            await adminDb.collection(CONFIG_DOC_PATH[0]).doc(CONFIG_DOC_PATH[1]).set(merged);
          } catch (adminError) {
            console.warn("[gmailConfig] Admin SDK set failed in auto-healing, falling back to REST API:", adminError);
            const { setFirestoreDocREST } = await import("../../utils/apiAuth");
            await setFirestoreDocREST(CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1], merged, token);
          }
        } else {
          const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
          await setDoc(docRef, merged);
        }
      }

      return merged as GmailConfig;
    }
  } catch (error) {
    console.error("Error fetching Gmail config:", error);
  }
  return null;
}

/** Save/Update Gmail config details */
export async function saveGmailConfig(config: Partial<GmailConfig>, token?: string): Promise<void> {
  try {
    const current = await getGmailConfig(token);
    const newData = {
      clientId: "",
      clientSecret: "",
      accessToken: "",
      refreshToken: "",
      expiryDate: 0,
      connected: false,
      emailAddress: "",
      isSimulated: false,
      pubSubTopic: "",
      watchExpiration: 0,
      redirectUri: "http://localhost:3000/api/gmail/callback",
      scopes: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send"
      ],
      ...current,
      ...config,
    };

    if (typeof window === "undefined") {
      try {
        const { adminDb } = await import("../../lib/firebaseAdmin");
        if (!adminDb) {
          throw new Error("Admin Database is not initialized (module not installed)");
        }
        await adminDb.collection(CONFIG_DOC_PATH[0]).doc(CONFIG_DOC_PATH[1]).set(newData);
      } catch (adminError) {
        console.warn("[gmailConfig] Admin SDK set failed in save, falling back to REST API:", adminError);
        const { setFirestoreDocREST } = await import("../../utils/apiAuth");
        await setFirestoreDocREST(CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1], newData, token);
      }
    } else {
      const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
      await setDoc(docRef, newData);
    }
  } catch (error) {
    console.error("Error saving Gmail config:", error);
    throw error;
  }
}

/** Disconnect Gmail account, wiping access credentials */
export async function disconnectGmail(token?: string): Promise<void> {
  try {
    const newData = {
      clientId: "",
      clientSecret: "",
      accessToken: "",
      refreshToken: "",
      expiryDate: 0,
      connected: false,
      emailAddress: "",
      isSimulated: false,
      pubSubTopic: "",
      watchExpiration: 0,
      redirectUri: "http://localhost:3000/api/gmail/callback",
      scopes: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send"
      ],
    };

    if (typeof window === "undefined") {
      try {
        const { adminDb } = await import("../../lib/firebaseAdmin");
        if (!adminDb) {
          throw new Error("Admin Database is not initialized (module not installed)");
        }
        await adminDb.collection(CONFIG_DOC_PATH[0]).doc(CONFIG_DOC_PATH[1]).set(newData);
      } catch (adminError) {
        console.warn("[gmailConfig] Admin SDK set failed in disconnect, falling back to REST API:", adminError);
        const { setFirestoreDocREST } = await import("../../utils/apiAuth");
        await setFirestoreDocREST(CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1], newData, token);
      }
    } else {
      const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
      await setDoc(docRef, newData);
    }
  } catch (error) {
    console.error("Error disconnecting Gmail:", error);
    throw error;
  }
}
