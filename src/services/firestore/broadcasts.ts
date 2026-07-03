import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";


import { db } from "../../lib/firebase";

export interface Broadcast {
  id?: string;

  subject: string;

  content: string;

  category: string;

  recipients: string;

  status: "Draft" | "Scheduled" | "Sent";

  openRate?: number;

  replyRate?: number;

  createdAt?: string;
  scheduleDate?: string;
scheduleTime?: string;
  deliveryHistory?: Array<{
    name: string;
    email: string;
    status: "Delivered" | "Failed";
    timestamp: string;
  }>;
}

export async function getBroadcasts() {
  const snapshot = await getDocs(collection(db, "broadcasts"));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,

      subject: data.subject,

      content: data.content,

      category: data.category,

      recipients: data.recipients,

      status: data.status,

      openRate: data.openRate ?? 0,

      replyRate: data.replyRate ?? 0,
      scheduleDate: data.scheduleDate ?? "",
scheduleTime: data.scheduleTime ?? "",
      deliveryHistory: data.deliveryHistory ?? [],

      createdAt: data.createdAt
  ? data.createdAt.toDate().toLocaleDateString()
  : "-",
    };
  }) as Broadcast[];
}

export async function getBroadcastById(id: string) {
  const snapshot = await getDoc(doc(db, "broadcasts", id));

  if (!snapshot.exists()) {
    throw new Error("Broadcast not found");
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    subject: data.subject,
    content: data.content,
    category: data.category,
    recipients: data.recipients,
    status: data.status,
    openRate: data.openRate ?? 0,
    replyRate: data.replyRate ?? 0,
    deliveryHistory: data.deliveryHistory ?? [],
    createdAt: data.createdAt
      ? data.createdAt.toDate().toLocaleDateString()
      : "-",
  } as Broadcast;
}

export async function createBroadcast(data: Broadcast) {
  await addDoc(collection(db, "broadcasts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateBroadcast(
  id: string,
  data: Partial<Broadcast>
) {
  await updateDoc(doc(db, "broadcasts", id), data);
}

export async function deleteBroadcast(id: string) {
  await deleteDoc(doc(db, "broadcasts", id));
}