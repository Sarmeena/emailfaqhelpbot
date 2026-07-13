let admin: any = null;

if (typeof window === "undefined") {
  try {
    // Use dynamic require with a variable to prevent Webpack/Turbopack from compiling it statically
    const moduleName = "firebase-admin";
    admin = require(moduleName);
  } catch (e) {
    console.warn("[Firebase Admin] firebase-admin module is not installed. Falling back to REST API operations.");
  }
}

if (admin && !admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "email-faq-help-bot-f56a0";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
      console.log("[Firebase Admin] Initialized with Service Account cert credentials.");
    } else {
      admin.initializeApp({
        projectId,
      });
      console.log("[Firebase Admin] Initialized with default project config fallback.");
    }
  } catch (error) {
    console.error("[Firebase Admin] Initialization failed:", error);
  }
}

export const adminDb = admin ? admin.firestore() : null;
export const adminAuth = admin ? admin.auth() : null;
