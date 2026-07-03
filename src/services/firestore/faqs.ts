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

export interface FAQ {
  id?: string;
  faqid?: string; // unique faqid like FAQ-XXXXXX
  question: string;
  answer: string;
  category: string;
  status?: "Published" | "Draft";
  usage?: number;
  updated?: string;
  source?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
}

export function generateFaqId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FAQ-${result}`;
}

// Get all FAQs
export async function getFAQs() {
  const snapshot = await getDocs(collection(db, "faqs"));

  const list = snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data();
    let faqid = data.faqid;
    if (!faqid) {
      faqid = generateFaqId();
      // Backfill asynchronously
      const docRef = doc(db, "faqs", docSnapshot.id);
      updateDoc(docRef, { faqid }).catch((err) =>
        console.error("Failed to backfill faqid:", err)
      );
    }

    return {
      id: docSnapshot.id,
      faqid,
      question: data.question,
      answer: data.answer,
      category: data.category,
      status: data.status ?? "Published",
      usage: data.usage ?? 0,
      updated: data.updated ?? "-",
      source: data.source ?? "Manual Entry",
      fileName: data.fileName ?? "",
      fileSize: data.fileSize ?? "",
      uploadedAt: data.uploadedAt ?? "",
    };
  }) as FAQ[];

  return list;
}

// Add FAQ
export async function addFAQ(
  question: string,
  answer: string,
  category: string,
  metadata?: {
    source?: string;
    fileName?: string;
    fileSize?: string;
    uploadedAt?: string;
  }
) {
  const faqid = generateFaqId();
  await addDoc(collection(db, "faqs"), {
    question,
    answer,
    category,
    faqid,
    status: "Published",
    usage: 0,
    updated: new Date().toLocaleDateString(),
    createdAt: serverTimestamp(),
    source: metadata?.source ?? "Manual Entry",
    fileName: metadata?.fileName ?? "",
    fileSize: metadata?.fileSize ?? "",
    uploadedAt: metadata?.uploadedAt ?? "",
  });
}

// Delete FAQ
export async function deleteFAQ(id: string) {
  const docRef = doc(db, "faqs", id);
  await deleteDoc(docRef);
}

// Search FAQs (used by AI)
export async function searchFAQs(
  customerMessage: string
) {
  const faqs = await getFAQs();

  const messageWords = customerMessage
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  return faqs.filter((faq) => {
    const questionWords = faq.question
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const matches = questionWords.filter((word) =>
      messageWords.includes(word)
    );

    return matches.length >= 2;
  });
}

export async function getFAQById(id: string) {
  const docRef = doc(db, "faqs", id);

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("FAQ not found");
  }

  const data = snapshot.data();
  let faqid = data.faqid;
  if (!faqid) {
    faqid = generateFaqId();
    updateDoc(docRef, { faqid }).catch((err) =>
      console.error("Failed to backfill faqid:", err)
    );
  }

  return {
    id: snapshot.id,
    faqid,
    ...data,
  } as FAQ;
}

export async function updateFAQ(
  id: string,
  data: {
    question: string;
    answer: string;
    category: string;
  }
) {
  const docRef = doc(db, "faqs", id);

  await updateDoc(docRef, {
    ...data,
    updated: new Date().toLocaleDateString(),
  });
}