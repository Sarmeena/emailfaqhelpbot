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
export async function getGeminiConfig(): Promise<GeminiConfig | null> {
  try {
    if (typeof window === "undefined") {
      const { ensureServerAuth } = await import("../../utils/apiAuth");
      await ensureServerAuth();
    }
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as GeminiConfig;
    }
  } catch (error) {
    console.error("Error fetching Gemini config:", error);
  }
  return null;
}

/** Save/Update Gemini config details */
export async function saveGeminiConfig(config: Partial<GeminiConfig>): Promise<void> {
  try {
    if (typeof window === "undefined") {
      const { ensureServerAuth } = await import("../../utils/apiAuth");
      await ensureServerAuth();
    }
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    const current = await getGeminiConfig();
    const newData = {
      apiKey: "",
      model: "gemini-2.5-flash",
      temperature: 0.7,
      autoReplyEnabled: true,
      autoFaqEnabled: true,
      ...current,
      ...config,
    };
    await setDoc(docRef, newData);
  } catch (error) {
    console.error("Error saving Gemini config:", error);
    throw error;
  }
}
