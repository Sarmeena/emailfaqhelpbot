import { NextRequest } from "next/server";
import crypto from "crypto";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

let cachedCerts: { [key: string]: string } = {};
let certsExpiry = 0;

let isServerAuthStarted = false;
let isServerAuthenticated = false;

export async function ensureServerAuth() {
  if (typeof window !== "undefined") return; // Browser does not run server-side system auth
  if (isServerAuthenticated) return;
  if (isServerAuthStarted) {
    while (isServerAuthStarted && !isServerAuthenticated) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return;
  }

  isServerAuthStarted = true;
  const email = "system-backend@emailfaqhelpbot.com";
  const password = "systemBackendPassSecure123!";

  try {
    console.log("[Server Auth] Authenticating server-side Firebase instance...");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", credential.user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      console.log("[Server Auth] Admin user profile document missing. Creating one...");
      await setDoc(userDocRef, {
        uid: credential.user.uid,
        email: email,
        role: "admin",
        createdAt: serverTimestamp(),
      });
    }
    isServerAuthenticated = true;
    console.log("[Server Auth] Server-side Firebase authenticated successfully.");
  } catch (error: any) {
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-email" ||
      error.message?.includes("credential") ||
      error.message?.includes("user-not-found")
    ) {
      console.log("[Server Auth] System admin account not found. Creating a new one...");
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(db, "users", credential.user.uid);
        await setDoc(userDocRef, {
          uid: credential.user.uid,
          email: email,
          role: "admin",
          createdAt: serverTimestamp(),
        });
        isServerAuthenticated = true;
        console.log("[Server Auth] System admin account created and authenticated.");
      } catch (createErr) {
        console.error("[Server Auth] Failed to create system admin account:", createErr);
      }
    } else {
      console.error("[Server Auth] Failed to sign in system admin:", error);
    }
  } finally {
    isServerAuthStarted = false;
  }
}

// Fetch Google secure token public certificates
async function getGooglePublicCerts() {
  if (Date.now() < certsExpiry && Object.keys(cachedCerts).length > 0) {
    return cachedCerts;
  }
  const res = await fetch(
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
  );
  const data = await res.json();
  const cacheControl = res.headers.get("cache-control");
  const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;
  cachedCerts = data;
  certsExpiry = Date.now() + maxAge * 1000;
  return cachedCerts;
}

// Verify Firebase ID Token signature and claims
export async function verifyFirebaseToken(token: string, projectId: string) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }
  const [headerB64, payloadB64, signatureB64] = parts;
  
  const header = JSON.parse(Buffer.from(headerB64, "base64").toString("utf-8"));
  const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf-8"));

  if (header.alg !== "RS256") {
    throw new Error("Invalid token algorithm");
  }
  const certs = await getGooglePublicCerts();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error("Public key not found for token kid");
  }

  // Convert base64url to base64 for node crypto verification
  const base64Signature = signatureB64
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(`${headerB64}.${payloadB64}`);
  
  const isValid = verify.verify(cert, base64Signature, "base64");
  if (!isValid) {
    throw new Error("Token signature verification failed");
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error("Invalid token issuer");
  }
  if (payload.aud !== projectId) {
    throw new Error("Invalid token audience");
  }
  if (payload.exp < now) {
    throw new Error("Token is expired");
  }

  return payload;
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: string;
}

// Verify auth header and load user role from Firestore
export async function checkAuthAndRole(
  request: NextRequest,
  allowedRoles?: string[]
): Promise<{ user: AuthenticatedUser | null; errorResponse: { error: string; status: number } | null }> {
  try {
    await ensureServerAuth();
    const authHeader = request.headers.get("authorization");
    console.log(`[API Auth Check] URL: ${request.nextUrl.pathname}, Auth Header Present: ${!!authHeader}`);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log(`[API Auth Check] Missing or invalid Authorization header on: ${request.nextUrl.pathname}`);
      return {
        user: null,
        errorResponse: { error: "Missing or invalid authorization token", status: 401 },
      };
    }

    const token = authHeader.split(" ")[1];
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.error("[API Auth Check] Firebase Project ID env variable is not configured");
      return {
        user: null,
        errorResponse: { error: "Firebase Project ID not configured", status: 550 },
      };
    }

    const decoded = await verifyFirebaseToken(token, projectId);
    const uid = decoded.sub;
    const email = decoded.email || "";

    // Fetch user details and role from Firestore
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    let role = "viewer";
    if (userDocSnapshot.exists()) {
      role = userDocSnapshot.data().role || "viewer";
    } else {
      console.log(`[API Auth Check] User doc not found. Creating default viewer profile for UID: ${uid}`);
      // Create user document if it does not exist
      try {
        await setDoc(userDocRef, {
          uid,
          email,
          role: "viewer",
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error creating user document during API auth:", err);
      }
    }

    console.log(`[API Auth Check] Decoded UID: ${uid}, Email: ${email}, Role: ${role}, Allowed Roles: ${allowedRoles?.join(', ') || 'Any'}`);

    // Verify role if required
    if (allowedRoles && !allowedRoles.includes(role)) {
      console.warn(`[API Auth Check] Forbidden: User role '${role}' is not in allowed roles list [${allowedRoles.join(', ')}]`);
      return {
        user: null,
        errorResponse: { error: "Access Denied: Insufficient permissions", status: 403 },
      };
    }

    return {
      user: { uid, email, role },
      errorResponse: null,
    };
  } catch (error) {
    console.error("API authorization check failed:", error);
    return {
      user: null,
      errorResponse: { 
        error: error instanceof Error ? error.message : "Authentication failed", 
        status: 401 
      },
    };
  }
}
