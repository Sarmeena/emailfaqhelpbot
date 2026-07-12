import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

export interface Request {
  id?: string;
  requestId?: string;   // e.g. REQ-20260703-A7K9Q2
  threadId?: string;    // e.g. THREAD-<email-hash>
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt?: Timestamp;
  source?: "Manual" | "Gmail";
  gmailMessageId?: string;
  gmailThreadId?: string;
  escalated?: boolean;
}

/** Generates a unique Request ID like REQ-20260703-A7K9Q2 */
export function generateRequestId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `REQ-${dateStr}-${randomStr}`;
}

/**
 * Derives a stable thread ID from a customer email.
 * All requests/conversations from same email share a thread.
 */
export function deriveThreadId(email: string): string {
  const normalized = email.trim().toLowerCase();
  // Simple stable hash of email chars
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) & 0xfffffff;
  }
  return `THREAD-${hash.toString(16).toUpperCase().padStart(7, "0")}`;
}

/* Get All Requests */
export async function getRequests() {
  const snapshot = await getDocs(collection(db, "requests"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Request[];
}

/* Add Request */
export async function addRequest(request: Omit<Request, "threadId"> & { requestId?: string }) {
  const requestId = request.requestId || generateRequestId();
  const threadId = deriveThreadId(request.customerEmail);

  const docData = {
    source: "Manual",
    escalated: false,
    ...request,
    requestId,
    threadId,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "requests"), docData);

  return { requestId, threadId };
}

/* Update Request */
export async function updateRequest(
  id: string,
  data: Partial<Request>
) {
  await updateDoc(doc(db, "requests", id), data);
}

/* Delete Request */
export async function deleteRequest(id: string) {
  await deleteDoc(doc(db, "requests", id));
}

import { getDoc } from "firebase/firestore";
export async function getRequest(id: string) {
  const snapshot = await getDoc(doc(db, "requests", id));

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Request;
}

export async function getRecentRequests(limitCount: number = 3) {
  const q = query(
    collection(db, "requests"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Request[];
}