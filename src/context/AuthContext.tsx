"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getToken } from "firebase/app-check";

import { subscribeToAuth } from "../services/auth/auth";
import { db, auth, waitUntilAppCheckResolved, appCheckInstance } from "../lib/firebase";

if (typeof window !== "undefined" && !(window as any).__fetchIntercepted__) {
  (window as any).__fetchIntercepted__ = true;
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let url = "";
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof URL) {
      url = input.href;
    } else if (input && typeof input === "object" && "url" in input) {
      url = (input as any).url;
    }

    const isApiUrl = url.startsWith("/api/") || url.startsWith(`${window.location.origin}/api/`);
    const isWebhook = url.includes("/api/gmail/webhook");

    if (isApiUrl && !isWebhook) {
      const currentUser = auth.currentUser;
      console.log(`[Fetch Interceptor] API call detected: ${url}. Current user exists: ${!!currentUser}`);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          
          // Re-create headers object using standard Headers class to support all formats
          const headers = new Headers(init?.headers || {});
          headers.set("Authorization", `Bearer ${token}`);
          
          init = {
            ...init,
            headers,
          };
          console.log(`[Fetch Interceptor] Token attached successfully for: ${url}`);
        } catch (err) {
          console.error("[Fetch Interceptor] Error attaching auth token:", err);
        }
      }
    }
    return originalFetch(input, init);
  };
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      // Force loading to true during transition / auth change
      setLoading(true);
      console.log(`[AuthContext] Auth state changed. firebaseUser UID: ${firebaseUser ? firebaseUser.uid : "null"}`);

      if (firebaseUser) {
        try {
          // Await App Check token verification / initialization
          await waitUntilAppCheckResolved();

          // Log App Check Token Status
          if (appCheckInstance) {
            try {
              const appCheckTokenRes = await getToken(appCheckInstance, false);
              console.log("[AuthContext App Check Status] Token exists and is valid. Length:", appCheckTokenRes.token.length);
            } catch (tokenErr) {
              console.error("[AuthContext App Check Status] Failed to get App Check token:", tokenErr);
            }
          } else {
            console.log("[AuthContext App Check Status] App Check instance is not initialized.");
          }

          const userDocRef = doc(db, "users", firebaseUser.uid);
          let userDocSnapshot = await getDoc(userDocRef);
          
          let userRole = "viewer";
          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            userRole = data.role || "viewer";
            console.log(`[AuthContext] Loaded existing user role: '${userRole}' for UID: ${firebaseUser.uid}`);
          } else {
            console.log(`[AuthContext] User role document does not exist for UID: ${firebaseUser.uid}. Creating default 'viewer' role.`);
            // Firestore document does not exist, automatically create one
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "viewer",
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserData);
            
            // Re-fetch to ensure propagation and verify it exists
            userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const data = userDocSnapshot.data();
              userRole = data.role || "viewer";
            }
            console.log(`[AuthContext] Automatically created default viewer document for UID: ${firebaseUser.uid}`);
          }
          
          setRole(userRole);
          setUser(firebaseUser);
        } catch (error: any) {
          console.error(`[AuthContext] Error fetching or creating user document for UID: ${firebaseUser.uid}. Error:`, error);
          if (error.code === "permission-denied" || error.message?.includes("permission")) {
            console.error(`[Firestore Permission Failure] Read or Write denied on users/${firebaseUser.uid}. Authenticated UID: ${firebaseUser.uid}`);
          }
          setRole("viewer");
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}