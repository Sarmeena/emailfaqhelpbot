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
}

const CONFIG_DOC_PATH = ["settings", "gmail"] as const;

/** Retrieve Gmail configuration details */
export async function getGmailConfig(): Promise<GmailConfig | null> {
  try {
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as GmailConfig;
    }
  } catch (error) {
    console.error("Error fetching Gmail config:", error);
  }
  return null;
}

/** Save/Update Gmail config details */
export async function saveGmailConfig(config: Partial<GmailConfig>): Promise<void> {
  try {
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    const current = await getGmailConfig();
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
      ...current,
      ...config,
    };
    await setDoc(docRef, newData);
  } catch (error) {
    console.error("Error saving Gmail config:", error);
    throw error;
  }
}

/** Disconnect Gmail account, wiping access credentials */
export async function disconnectGmail(): Promise<void> {
  try {
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    await setDoc(docRef, {
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
    });
  } catch (error) {
    console.error("Error disconnecting Gmail:", error);
    throw error;
  }
}
