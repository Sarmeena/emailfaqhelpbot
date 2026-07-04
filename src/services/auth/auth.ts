"use client";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  updatePassword,
  User,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

/**
 * Login with email and password
 */
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  await setPersistence(
    auth,
    rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence
  );

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

/**
 * Logout current user
 */
export const logout = async () => {
  await signOut(auth);
};

/**
 * Listen for authentication state changes
 */
export const subscribeToAuth = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (newPassword: string) => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  } else {
    throw new Error("No authenticated user session found.");
  }
};

