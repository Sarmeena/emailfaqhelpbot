import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

import { Timestamp } from "firebase/firestore";

import { db } from "../../lib/firebase";
export interface Conversation {
  id?: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: string;
  lastMessage: string;
}

export interface Message {
  id?: string;
  conversationId: string;
  sender: string;
  message: string;
  createdAt?: Timestamp;
}

export async function getConversations() {
  const snapshot = await getDocs(
    collection(db, "conversations")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
}
export async function getMessages(
  conversationId: string
) {
  const q = query(
    collection(db, "messages"),
    where("conversationId", "==", conversationId),
    orderBy("createdAt")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Message[];
}
export async function sendMessage(
  conversationId: string,
  sender: string,
  message: string
) {
  // Add new message
  await addDoc(collection(db, "messages"), {
    conversationId,
    sender,
    message,
    createdAt: serverTimestamp(),
  });

  // Update conversation document details
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnapshot = await getDoc(conversationRef);
    let status = "Open";

    if (conversationSnapshot.exists()) {
      const data = conversationSnapshot.data();
      status = data.status || "Open";
    }

    // Auto-progress from Open/Pending to In Progress if agent responds
    if (sender === "agent" && (status === "Open" || status === "Pending")) {
      status = "In Progress";
    }

    await updateDoc(conversationRef, {
      lastMessage: message,
      updatedAt: serverTimestamp(),
      status,
    });

    // Also update requests collection in parallel
    const requestRef = doc(db, "requests", conversationId);
    await updateDoc(requestRef, {
      status,
    });
  } catch (err) {
    console.error("Error updating conversation/request status details:", err);
  }
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
) {
  const q = query(
    collection(db, "messages"),
    where("conversationId", "==", conversationId),
    orderBy("createdAt")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];

    callback(messages);
  });
}

export function subscribeMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
) {
  const q = query(
    collection(db, "messages"),
    where("conversationId", "==", conversationId),
    orderBy("createdAt")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];

    callback(messages);
  });
}