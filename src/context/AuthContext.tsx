"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { subscribeToAuth } from "../services/auth/auth";
import { db, auth } from "../lib/firebase";

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
    // Intercept client-side fetch calls to automatically attach Firebase ID token
    if (typeof window !== "undefined") {
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
              init = init || {};
              init.headers = init.headers || {};

              if (init.headers instanceof Headers) {
                init.headers.set("Authorization", `Bearer ${token}`);
                console.log(`[Fetch Interceptor] Token attached to Headers object for: ${url}`);
              } else if (Array.isArray(init.headers)) {
                const hasAuth = init.headers.some(([key]) => key.toLowerCase() === "authorization");
                if (!hasAuth) {
                  init.headers.push(["Authorization", `Bearer ${token}`]);
                  console.log(`[Fetch Interceptor] Token attached to Headers array for: ${url}`);
                }
              } else {
                const headersObj = init.headers as Record<string, string>;
                const hasAuth = Object.keys(headersObj).some(
                  (key) => key.toLowerCase() === "authorization"
                );
                if (!hasAuth) {
                  headersObj["Authorization"] = `Bearer ${token}`;
                  console.log(`[Fetch Interceptor] Token attached to Headers record for: ${url}`);
                }
              }
            } catch (err) {
              console.error("[Fetch Interceptor] Error attaching auth token:", err);
            }
          }
        }
        return originalFetch(input, init);
      };
    }

    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const data = userDocSnapshot.data();
            setRole(data.role || "viewer");
          } else {
            // Firestore document does not exist, automatically create one
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "viewer",
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserData);
            setRole("viewer");
          }
          setUser(firebaseUser);
        } catch (error) {
          console.error("Error fetching or creating user document in AuthProvider:", error);
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