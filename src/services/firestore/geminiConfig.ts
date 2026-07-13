import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  autoReplyEnabled: boolean;
  autoFaqEnabled: boolean;
}

const CONFIG_DOC_PATH = ["settings", "gemini"] as const;

/** Retrieve Gemini configuration details */
export async function getGeminiConfig(token?: string): Promise<GeminiConfig | null> {
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
        console.warn("[geminiConfig] Admin SDK get failed, falling back to REST API:", adminError);
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
      return data as GeminiConfig;
    }
  } catch (error) {
    console.error("Error fetching Gemini config:", error);
  }
  return null;
}

/** Save/Update Gemini config details */
export async function saveGeminiConfig(config: Partial<GeminiConfig>, token?: string): Promise<void> {
  try {
    const current = await getGeminiConfig(token);
    const newData = {
      apiKey: "",
      model: "gemini-2.5-flash",
      temperature: 0.7,
      autoReplyEnabled: true,
      autoFaqEnabled: true,
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
        console.warn("[geminiConfig] Admin SDK set failed, falling back to REST API:", adminError);
        const { setFirestoreDocREST } = await import("../../utils/apiAuth");
        await setFirestoreDocREST(CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1], newData, token);
      }
    } else {
      const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
      await setDoc(docRef, newData);
    }
  } catch (error) {
    console.error("Error saving Gemini config:", error);
    throw error;
  }
}
