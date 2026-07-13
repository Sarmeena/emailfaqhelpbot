const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

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
  console.log("Firebase Admin initialized");
} else {
  console.error("Missing credentials in env");
  process.exit(1);
}

const db = admin.firestore();
db.collection("settings").doc("gemini").get()
  .then(docSnap => {
    if (docSnap.exists) {
      console.log("Gemini Config Document Data:", docSnap.data());
    } else {
      console.log("No settings/gemini document found in Firestore.");
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Error reading Firestore:", err);
    process.exit(1);
  });
