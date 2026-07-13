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
import { deriveThreadId } from "./requests";
export interface Conversation {
  id?: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: string;
  lastMessage: string;
  updatedAt?: any;
  priority?: string;
  requestId?: string;
}

export interface Message {
  id?: string;
  conversationId: string;
  sender: string;
  message: string;
  createdAt?: Timestamp;
}

export async function getConversations() {
  const [convSnapshot, reqSnapshot] = await Promise.all([
    getDocs(collection(db, "conversations")),
    getDocs(collection(db, "requests")),
  ]);

  const requestsMapById = new Map();
  const requestsMapByThread = new Map();

  reqSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    requestsMapById.set(doc.id, data);
    const tid = data.threadId || (data.customerEmail ? deriveThreadId(data.customerEmail) : "");
    if (tid) {
      requestsMapByThread.set(tid, data);
    }
  });

  const grouped = new Map<string, any>();

  convSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const tid = doc.id.startsWith("THREAD-")
      ? doc.id
      : (data.threadId || (data.customerEmail ? deriveThreadId(data.customerEmail) : ""));
    
    if (!tid) return;

    const reqData = requestsMapByThread.get(tid) || requestsMapById.get(doc.id) || {};
    const chatItem: any = {
      id: doc.id,
      ...data,
      priority: reqData.priority || "Medium",
      requestId: reqData.requestId || "",
    };

    const existing = grouped.get(tid);
    if (!existing) {
      grouped.set(tid, chatItem);
    } else {
      const existingTime = (existing as any).updatedAt?.seconds || (existing as any).updatedAt?._seconds || 0;
      const newTime = (chatItem as any).updatedAt?.seconds || (chatItem as any).updatedAt?._seconds || 0;
      if (newTime > existingTime) {
        grouped.set(tid, chatItem);
      }
    }
  });

  return Array.from(grouped.values()).map((item) => {
    const tid = item.id.startsWith("THREAD-")
      ? item.id
      : (item.threadId || (item.customerEmail ? deriveThreadId(item.customerEmail) : ""));
    return {
      ...item,
      id: tid,
    };
  }) as Conversation[];
}
export async function getMessages(
  conversationId: string
) {
  let ids = [conversationId];
  if (conversationId.startsWith("THREAD-")) {
    try {
      const reqQuery = query(
        collection(db, "requests"),
        where("threadId", "==", conversationId)
      );
      const reqSnapshot = await getDocs(reqQuery);
      reqSnapshot.docs.forEach((doc) => {
        ids.push(doc.id);
      });
    } catch (e) {
      console.error(e);
    }
  }

  const msgQuery = query(
    collection(db, "messages"),
    where("conversationId", "in", ids),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(msgQuery);

  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Message[];

  return messages;
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
    const q = query(
      collection(db, "requests"),
      where("threadId", "==", conversationId)
    );
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map((d) =>
      updateDoc(doc(db, "requests", d.id), { status })
    );
    await Promise.all(updatePromises);

    // Fallback direct update (legacy)
    try {
      const requestRef = doc(db, "requests", conversationId);
      await updateDoc(requestRef, {
        status,
      });
    } catch (err) {}
  } catch (err) {
    console.error("Error updating conversation/request status details:", err);
  }
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
) {
  if (conversationId.startsWith("THREAD-")) {
    const reqQuery = query(
      collection(db, "requests"),
      where("threadId", "==", conversationId)
    );
    
    let unsubscribeReqs = () => {};
    let unsubscribeMsgs = () => {};
    
    unsubscribeReqs = onSnapshot(reqQuery, (reqSnapshot) => {
      const ids = [conversationId];
      reqSnapshot.docs.forEach((doc) => {
        ids.push(doc.id);
      });
      
      unsubscribeMsgs();
      
      const msgQuery = query(
        collection(db, "messages"),
        where("conversationId", "in", ids),
        orderBy("createdAt", "asc")
      );
      
      unsubscribeMsgs = onSnapshot(msgQuery, (msgSnapshot) => {
        const messages = msgSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        
        callback(messages);
      }, (err) => {
        console.error("[Firestore Permission Failure] subscribeToMessages inner messages listener failed for THREAD:", err);
      });
    }, (err) => {
      console.error("Error in subscribeToMessages requests listener:", err);
    });
    
    return () => {
      unsubscribeReqs();
      unsubscribeMsgs();
    };
  }

  const q = query(
    collection(db, "messages"),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];

    callback(messages);
  }, (err) => {
    console.error("[Firestore Permission Failure] subscribeToMessages fallback messages listener failed:", err);
  });
}

export function subscribeMessages(
  conversationId: string,
  callback: (messages: Message[]) => void
) {
  return subscribeToMessages(conversationId, callback);
}