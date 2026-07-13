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
db.collection("users").get()
  .then(snapshot => {
    console.log(`Total users in Firestore: ${snapshot.size}`);
    snapshot.forEach(doc => {
      console.log(`- Document ID (UID): ${doc.id}`);
      console.log(`  Data:`, doc.data());
    });
    process.exit(0);
  })
  .catch(err => {
    console.error("Error reading users from Firestore:", err);
    process.exit(1);
  });
