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
      console.log(`[AuthContext] Auth state changed. firebaseUser UID: ${firebaseUser ? firebaseUser.uid : "null"}, Email: ${firebaseUser ? firebaseUser.email : "null"}`);

      if (firebaseUser) {
        try {
          // Log active Firebase configurations to detect mismatch
          const dbProjectId = db.app.options.projectId;
          const authProjectId = auth.app.options.projectId;
          console.log(`[AuthContext Diagnostics] Client Active Project ID: '${dbProjectId}' (Auth Project ID: '${authProjectId}'). Match: ${dbProjectId === authProjectId}`);

          // Await App Check token verification / initialization
          console.log("[AuthContext Diagnostics] Waiting for App Check token resolution...");
          await waitUntilAppCheckResolved();

          // Log App Check Token Status
          if (appCheckInstance) {
            try {
              const appCheckTokenRes = await getToken(appCheckInstance, false);
              console.log("[AuthContext App Check Status] Token exists. Length:", appCheckTokenRes.token.length);
            } catch (tokenErr) {
              console.error("[AuthContext App Check Status] Failed to get App Check token:", tokenErr);
            }
          } else {
            console.log("[AuthContext App Check Status] App Check instance is not initialized.");
          }

          console.log(`[AuthContext Diagnostics] Querying Firestore for user doc: 'users/${firebaseUser.uid}'`);
          const userDocRef = doc(db, "users", firebaseUser.uid);
          let userDocSnapshot = await getDoc(userDocRef);
          
          let userRole = "viewer";
          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            userRole = data.role || "viewer";
            console.log(`[AuthContext Diagnostics] User doc found. UID: '${firebaseUser.uid}', Role: '${userRole}'`);
          } else {
            console.log(`[AuthContext Diagnostics] User doc does not exist. Creating default 'viewer' for UID: '${firebaseUser.uid}'`);
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "viewer",
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserData);
            console.log(`[AuthContext Diagnostics] Default doc created. Re-fetching...`);
            
            userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
              const data = userDocSnapshot.data();
              userRole = data.role || "viewer";
            }
            console.log(`[AuthContext Diagnostics] User doc re-fetch complete. UID: '${firebaseUser.uid}', Final Role: '${userRole}'`);
          }
          
          setRole(userRole);
          setUser(firebaseUser);
        } catch (error: any) {
          console.error(`[AuthContext Diagnostics] Fatal error during user registration/role lookup for UID: ${firebaseUser.uid}:`, error);
          if (error.code === "permission-denied" || error.message?.includes("permission")) {
            console.error(`[Firestore Permission Failure] Read/Write access denied on 'users/${firebaseUser.uid}'. User is authenticated as UID: ${firebaseUser.uid}.`);
            console.error("[Firestore Permission Failure] Troubleshooting tip: Ensure Firestore security rules allow 'read' on users/{userId} and check if App Check is block-enforcing unverified client requests.");
          }
          console.log("[AuthContext Diagnostics] Setting user role to 'error' due to load failure.");
          setRole("error");
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