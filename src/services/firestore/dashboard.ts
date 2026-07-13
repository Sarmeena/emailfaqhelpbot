import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

export interface DashboardStats {
  totalRequests: number;
  totalFaqs: number;
  totalBroadcasts: number;
  openRequests: number;
  resolvedRequests: number;
  inProgressRequests: number;
  peakHour: string;
  topFaqs: Array<{ id: string; question: string; usage: number }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const requestsCount = await getCountFromServer(collection(db, "requests"));
  const faqsCount = await getCountFromServer(collection(db, "faqs"));
  const broadcastsCount = await getCountFromServer(collection(db, "broadcasts"));

  const openCount = await getCountFromServer(
    query(collection(db, "requests"), where("status", "==", "Open"))
  );
  const resolvedCount = await getCountFromServer(
    query(collection(db, "requests"), where("status", "==", "Resolved"))
  );
  const inProgressCount = await getCountFromServer(
    query(collection(db, "requests"), where("status", "==", "In Progress"))
  );

  // Compute Peak Hour in memory using requests timestamps
  const requestsSnapshot = await getDocs(collection(db, "requests"));
  const hourCounts = new Array(24).fill(0);
  
  requestsSnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    if (data.createdAt) {
      const date = typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt.seconds ? data.createdAt.seconds * 1000 : data.createdAt);
      const hour = date.getHours();
      hourCounts[hour]++;
    }
  });

  let maxHour = 0;
  let maxCount = -1;
  for (let i = 0; i < 24; i++) {
    if (hourCounts[i] > maxCount) {
      maxCount = hourCounts[i];
      maxHour = i;
    }
  }

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const peakHour = maxCount > 0 ? `${formatHour(maxHour)} (${maxCount} request${maxCount !== 1 ? "s" : ""})` : "No activity data";

  // Compute top 5 FAQs by usage in memory
  const faqsSnapshot = await getDocs(collection(db, "faqs"));
  const topFaqs = faqsSnapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        question: data.question || "",
        usage: data.usage || 0,
      };
    })
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  return {
    totalRequests: requestsCount.data().count,
    totalFaqs: faqsCount.data().count,
    totalBroadcasts: broadcastsCount.data().count,
    openRequests: openCount.data().count,
    resolvedRequests: resolvedCount.data().count,
    inProgressRequests: inProgressCount.data().count,
    peakHour,
    topFaqs,
  };
}