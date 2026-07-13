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
    const token = await credential.user.getIdToken();
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error("Firebase Project ID not configured");
    }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${credential.user.uid}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 404) {
      console.log("[Server Auth] Admin user profile document missing. Creating one via REST...");
      const fields = {
        uid: { stringValue: credential.user.uid },
        email: { stringValue: email },
        role: { stringValue: "admin" }
      };
      const createRes = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      });
      if (!createRes.ok) {
        console.error("[Server Auth] Failed to create admin profile:", await createRes.text());
      }
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
        const token = await credential.user.getIdToken();
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        if (!projectId) {
          throw new Error("Firebase Project ID not configured");
        }

        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${credential.user.uid}`;
        const fields = {
          uid: { stringValue: credential.user.uid },
          email: { stringValue: email },
          role: { stringValue: "admin" }
        };
        const createRes = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields }),
        });
        if (!createRes.ok) {
          console.error("[Server Auth] Failed to create admin profile after registration:", await createRes.text());
        }
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
  const pathname = request.nextUrl.pathname;
  const authHeader = request.headers.get("authorization");

  console.log(`\n[API Auth Check] --- START CHECK FOR ${pathname} ---`);
  console.log(`[API Auth Check] Authorization Header Present: ${!!authHeader}`);
  if (authHeader) {
    console.log(`[API Auth Check] Authorization Header Value: ${authHeader.slice(0, 30)}...`);
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`[API Auth Check] Decision: UNAUTHORIZED (401) - Missing or invalid Bearer token`);
    return {
      user: null,
      errorResponse: { error: "Missing or invalid authorization token", status: 401 },
    };
  }

  const token = authHeader.split(" ")[1];
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  console.log(`[API Auth Check Diagnostics] Server-Side active projectId: '${projectId}'`);
  try {
    const { adminDb, adminAuth } = await import("../lib/firebaseAdmin");
    console.log(`[API Auth Check Diagnostics] Firebase Admin SDK status - adminDb available: ${!!adminDb}, adminAuth available: ${!!adminAuth}`);
  } catch (err) {
    console.warn("[API Auth Check Diagnostics] Failed to check firebaseAdmin availability:", err);
  }
  
  if (!projectId) {
    console.error("[API Auth Check] Firebase Project ID env variable is not configured");
    return {
      user: null,
      errorResponse: { error: "Firebase Project ID not configured", status: 550 },
    };
  }

  try {
    // 1. Verify token signature and get UID
    let uid = "";
    let email = "";
    try {
      // Try using Admin SDK first for token verification
      const { adminAuth } = await import("../lib/firebaseAdmin");
      if (!adminAuth) {
        throw new Error("Admin Auth is not initialized (module not installed)");
      }
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || "";
      console.log(`[API Auth Check] Token verified via Admin SDK. Decoded UID: ${uid}, Email: ${email}`);
    } catch (adminVerifyError) {
      console.warn("[API Auth Check] Admin SDK verification failed or not initialized, trying custom verifyFirebaseToken:", adminVerifyError);
      const decoded = await verifyFirebaseToken(token, projectId);
      uid = decoded.sub;
      email = decoded.email || "";
      console.log(`[API Auth Check] Token verified via custom verifyFirebaseToken. Decoded UID: ${uid}, Email: ${email}`);
    }

    // 2. Fetch user document and role from Firestore
    let role = "viewer";
    let docExists = false;
    let userData: any = null;
    let readError: any = null;

    try {
      const { adminDb } = await import("../lib/firebaseAdmin");
      if (!adminDb) {
        throw new Error("Admin Database is not initialized (module not installed)");
      }
      const docSnap = await adminDb.collection("users").doc(uid).get();
      docExists = docSnap.exists;
      if (docExists) {
        userData = docSnap.data();
        role = userData?.role || "viewer";
        console.log(`[API Auth Check] User doc found in Firestore via Admin SDK. Role: ${role}`);
      } else {
        console.log(`[API Auth Check] User doc not found in Firestore via Admin SDK.`);
      }
    } catch (adminDbError) {
      console.warn("[API Auth Check] Admin SDK Firestore read failed, falling back to REST API:", adminDbError);
      // Fallback to REST API using the client's verified token
      try {
        const userDoc = await getFirestoreDocREST("users", uid, token);
        if (userDoc) {
          docExists = true;
          userData = parseRESTFields(userDoc.fields);
          role = userData?.role || "viewer";
          console.log(`[API Auth Check] User doc found in Firestore via REST API fallback. Role: ${role}`);
        } else {
          docExists = false;
          console.log(`[API Auth Check] User doc not found in Firestore via REST API fallback.`);
        }
      } catch (restReadError) {
        console.error("[API Auth Check] REST API fallback read failed:", restReadError);
        docExists = false;
        readError = restReadError;
      }
    }

    if (readError) {
      throw new Error(`Failed to load user role from Firestore due to read errors: ${readError instanceof Error ? readError.message : String(readError)}`);
    }

    // If the document does not exist, we create a default viewer document
    if (!docExists) {
      console.log(`[API Auth Check] Creating default viewer profile for UID: ${uid}`);
      try {
        const defaultUserData = { uid, email, role: "viewer" };
        try {
          const { adminDb } = await import("../lib/firebaseAdmin");
          if (!adminDb) {
            throw new Error("Admin Database is not initialized (module not installed)");
          }
          await adminDb.collection("users").doc(uid).set(defaultUserData);
          console.log(`[API Auth Check] Created user document via Admin SDK.`);
        } catch (adminCreateError) {
          console.warn("[API Auth Check] Admin SDK user creation failed, trying REST API fallback:", adminCreateError);
          await setFirestoreDocREST("users", uid, defaultUserData, token);
          console.log(`[API Auth Check] Created user document via REST API fallback.`);
        }
        docExists = true;
      } catch (err) {
        console.error("[API Auth Check] Error creating user document during checkAuthAndRole:", err);
        throw new Error(`Failed to create default user profile in Firestore: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const isExcludedFromAutoPromote = email === "viewer@gmail.com" || email === "agent@gmail.com" || email?.includes("viewer") || email?.includes("agent");
    if (process.env.NODE_ENV === "development" && role !== "admin" && !isExcludedFromAutoPromote) {
      console.log(`[API Auth Check] Developer Environment: Auto-promoting UID ${uid} (${email}) to 'admin' role.`);
      role = "admin";
      const updatedUserData = { uid, email, role: "admin" };
      try {
        const { adminDb } = await import("../lib/firebaseAdmin");
        if (adminDb) {
          await adminDb.collection("users").doc(uid).set(updatedUserData, { merge: true });
          console.log(`[API Auth Check] Updated user role to 'admin' via Admin SDK.`);
        } else {
          throw new Error("Admin SDK not available");
        }
      } catch (err) {
        console.warn("[API Auth Check] Admin SDK promote failed, trying REST API:", err);
        try {
          await setFirestoreDocREST("users", uid, updatedUserData, token);
          console.log(`[API Auth Check] Updated user role to 'admin' via REST API fallback.`);
        } catch (restErr) {
          console.error("[API Auth Check] Failed to auto-promote user to admin:", restErr);
        }
      }
    }

    console.log(`[API Auth Check] Final Auth Details - UID: ${uid}, Email: ${email}, Role: ${role}, Allowed Roles: ${allowedRoles?.join(', ') || 'Any'}`);

    // 3. Check allowed roles
    if (allowedRoles && !allowedRoles.includes(role)) {
      console.warn(`[API Auth Check] Decision: FORBIDDEN (403) - User role '${role}' is not in allowed roles list [${allowedRoles.join(', ')}]`);
      return {
        user: null,
        errorResponse: { error: "Access Denied: Insufficient permissions", status: 403 },
      };
    }

    console.log(`[API Auth Check] Decision: AUTHORIZED`);
    return {
      user: { uid, email, role },
      errorResponse: null,
    };
  } catch (error: any) {
    console.error(`[API Auth Check] Decision: UNAUTHORIZED (401) - Auth check failed:`, error);
    return {
      user: null,
      errorResponse: {
        error: error instanceof Error ? error.message : "Authentication failed",
        status: 401
      },
    };
  }
}

// Helper to parse Firestore REST fields format to simple JS object
export function parseRESTFields(fields: any) {
  const data: any = {};
  if (!fields) return data;
  for (const [key, value] of Object.entries(fields)) {
    const valObj = value as any;
    if (valObj.hasOwnProperty("stringValue")) {
      data[key] = valObj.stringValue;
    } else if (valObj.hasOwnProperty("integerValue")) {
      data[key] = parseInt(valObj.integerValue, 10);
    } else if (valObj.hasOwnProperty("doubleValue")) {
      data[key] = parseFloat(valObj.doubleValue);
    } else if (valObj.hasOwnProperty("booleanValue")) {
      data[key] = valObj.booleanValue;
    } else if (valObj.hasOwnProperty("nullValue")) {
      data[key] = null;
    } else if (valObj.hasOwnProperty("arrayValue")) {
      const arr = valObj.arrayValue.values || [];
      data[key] = arr.map((item: any) => {
        if (item.hasOwnProperty("stringValue")) return item.stringValue;
        if (item.hasOwnProperty("integerValue")) return parseInt(item.integerValue, 10);
        if (item.hasOwnProperty("booleanValue")) return item.booleanValue;
        return item;
      });
    } else if (valObj.hasOwnProperty("mapValue")) {
      data[key] = parseRESTFields(valObj.mapValue.fields);
    } else {
      data[key] = valObj;
    }
  }
  return data;
}

// Helper to convert simple JS object/array to Firestore REST fields format
export function convertToRESTFields(data: any): any {
  const fields: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === "boolean") {
      fields[key] = { booleanValue: value };
    } else if (typeof value === "number") {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: String(value) };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (Array.isArray(value)) {
      const values = value.map(item => {
        if (item === null || item === undefined) return { nullValue: null };
        if (typeof item === "boolean") return { booleanValue: item };
        if (typeof item === "number") {
          return Number.isInteger(item) ? { integerValue: String(item) } : { doubleValue: item };
        }
        return { stringValue: String(item) };
      });
      fields[key] = { arrayValue: { values } };
    } else if (typeof value === "object") {
      fields[key] = { mapValue: { fields: convertToRESTFields(value) } };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return fields;
}

export async function getFirestoreDocREST(collectionName: string, docId: string, token?: string): Promise<any> {
  let activeToken = token;
  if (!activeToken) {
    await ensureServerAuth();
    if (!auth.currentUser) {
      throw new Error("Server not authenticated for REST API fallback");
    }
    activeToken = await auth.currentUser.getIdToken();
  }
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Firebase Project ID not configured");
  }
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${activeToken}`,
    },
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore REST read error: ${res.status} - ${errText}`);
  }

  const json = await res.json();
  return json;
}

export async function setFirestoreDocREST(collectionName: string, docId: string, data: any, token?: string): Promise<void> {
  let activeToken = token;
  if (!activeToken) {
    await ensureServerAuth();
    if (!auth.currentUser) {
      throw new Error("Server not authenticated for REST API fallback");
    }
    activeToken = await auth.currentUser.getIdToken();
  }
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Firebase Project ID not configured");
  }

  const fields = convertToRESTFields(data);
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}`;
  
  const res = await fetch(url, {
    method: "PATCH", // PATCH with no updateMask acts as set/overwrite
    headers: {
      Authorization: `Bearer ${activeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore REST write error: ${res.status} - ${errText}`);
  }
}
