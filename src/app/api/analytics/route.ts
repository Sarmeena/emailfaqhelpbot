import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "../../../services/firestore/dashboard";
import { collection, getDocs, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getGmailConfig } from "../../../services/firestore/gmailConfig";
import { checkAuthAndRole } from "../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }

    // 1. Fetch dashboard stats using existing service
    const baseStats = await getDashboardStats();

    // 2. Fetch Priority Breakdown
    const highPriorityQuery = query(collection(db, "requests"), where("priority", "==", "High"));
    const mediumPriorityQuery = query(collection(db, "requests"), where("priority", "==", "Medium"));
    const lowPriorityQuery = query(collection(db, "requests"), where("priority", "==", "Low"));

    const [highCount, mediumCount, lowCount] = await Promise.all([
      getCountFromServer(highPriorityQuery),
      getCountFromServer(mediumPriorityQuery),
      getCountFromServer(lowPriorityQuery)
    ]);

    // 3. Fetch Source Breakdown
    const gmailSourceQuery = query(collection(db, "requests"), where("source", "==", "Gmail"));
    const manualSourceQuery = query(collection(db, "requests"), where("source", "==", "Manual"));

    const [gmailCount, manualCount] = await Promise.all([
      getCountFromServer(gmailSourceQuery),
      getCountFromServer(manualSourceQuery)
    ]);

    // 4. Fetch Gmail Connection Status
    const gmailConfig = await getGmailConfig();
    const gmailStatus = {
      connected: gmailConfig?.connected || false,
      isSimulated: gmailConfig?.isSimulated || false,
      watchExpiration: gmailConfig?.watchExpiration || null,
      email: gmailConfig?.emailAddress || "Not Connected"
    };

    // 5. Generate recent activity timeline (last 5 requests created)
    const requestsSnapshot = await getDocs(collection(db, "requests"));
    const requestsData = requestsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.customerName || "Unknown Customer",
        customerEmail: data.customerEmail || "",
        subject: data.subject || "No Subject",
        status: data.status || "Open",
        priority: data.priority || "Medium",
        source: data.source || "Manual",
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });

    // Sort by createdAt descending and take 5
    const recentActivity = [...requestsData]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Compute daily creation metrics for charting (last 7 days counts)
    const dailyCounts: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyCounts[dateString] = 0;
    }

    requestsData.forEach((req) => {
      const reqDate = new Date(req.createdAt);
      const dateString = reqDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dateString in dailyCounts) {
        dailyCounts[dateString]++;
      }
    });

    const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count
    }));

    return NextResponse.json({
      success: true,
      stats: {
        ...baseStats,
        priorityBreakdown: {
          high: highCount.data().count,
          medium: mediumCount.data().count,
          low: lowCount.data().count
        },
        sourceBreakdown: {
          gmail: gmailCount.data().count,
          manual: manualCount.data().count
        },
        gmailStatus,
        recentActivity,
        chartData
      }
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load analytics" },
      { status: 500 }
    );
  }
}
