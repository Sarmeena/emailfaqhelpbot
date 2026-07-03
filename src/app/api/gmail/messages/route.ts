import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const config = await getGmailConfig();
    const isSimulated = !config || !config.connected || config.isSimulated;

    // Retrieve already imported Gmail messages
    const requestsSnapshot = await getDocs(
      query(collection(db, "requests"), where("source", "==", "Gmail"))
    );
    const importedIds = new Set<string>();
    requestsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.gmailMessageId) {
        importedIds.add(data.gmailMessageId);
      }
    });

    if (isSimulated) {
      const mockMessages = [
        {
          id: "msg_sim_001",
          from: "jane.doe@example.com",
          fromName: "Jane Doe",
          subject: "Urgent: Billing issue - charge on expired card",
          date: new Date(Date.now() - 5 * 60 * 1000).toLocaleString(),
          snippet: "I received a charge on my credit card that was supposed to be expired. I need a refund immediately.",
          body: "Hello Support Team,\n\nI was charged $49.00 today on my card ending in 4242. This card was deactivated and expired last month, and I updated my billing details. Please investigate this billing error and process a refund immediately.\n\nThanks,\nJane Doe",
          status: importedIds.has("msg_sim_001") ? "Imported" : "Unimported",
        },
        {
          id: "msg_sim_002",
          from: "david.beck@example.com",
          fromName: "David Beck",
          subject: "How do I reset my API secret?",
          date: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
          snippet: "I need to rotate my API keys but cannot find the secret settings in the console.",
          body: "Hi,\n\nCan you guide me on how to reset my API secret? I need to rotate it for security compliance by end of today.\n\nBest,\nDavid",
          status: importedIds.has("msg_sim_002") ? "Imported" : "Unimported",
        },
        {
          id: "msg_sim_003",
          from: "support-tester@random.com",
          fromName: "Robert Miller",
          subject: "Broken login link",
          date: new Date(Date.now() - 2 * 3600 * 1000).toLocaleString(),
          snippet: "Your login portal is throwing a server 500 error since this morning.",
          body: "Hello,\n\nEvery time I try to login, the screen hangs and throws a 500 internal server error. I have tried clearing my cache. Please escalate this.",
          status: importedIds.has("msg_sim_003") ? "Imported" : "Unimported",
        },
      ];

      return NextResponse.json({
        success: true,
        isSimulated: true,
        messages: mockMessages,
      });
    }

    let token = config.accessToken;
    if (Date.now() > config.expiryDate) {
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          refresh_token: config.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        token = refreshData.access_token;
        const newExpiry = Date.now() + refreshData.expires_in * 1000;
        await saveGmailConfig({
          accessToken: token,
          expiryDate: newExpiry,
        });
      } else {
        throw new Error("Failed to refresh Gmail OAuth token.");
      }
    }

    const listRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8&q=is:inbox",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!listRes.ok) {
      throw new Error(`Gmail fetch failed: ${await listRes.text()}`);
    }

    const listData = await listRes.json();
    const gmailMessages = listData.messages || [];
    const messages = [];

    for (const msg of gmailMessages) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (msgRes.ok) {
        const detail = await msgRes.json();
        const headers = detail.payload.headers;
        const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";

        const emailMatch = fromHeader.match(/<([^>]+)>/);
        const fromEmail = emailMatch ? emailMatch[1] : fromHeader;
        const fromName = fromHeader.replace(/<[^>]+>/, "").trim() || fromEmail;

        const dateHeader = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || "";
        const snippet = detail.snippet || "";

        let body = snippet;
        const payload = detail.payload;
        if (payload.parts) {
          const bodyPart = payload.parts.find((p: any) => p.mimeType === "text/plain") || payload.parts[0];
          const bodyData = bodyPart?.body?.data;
          if (bodyData) {
            body = Buffer.from(bodyData, "base64").toString("utf-8");
          }
        } else if (payload.body?.data) {
          body = Buffer.from(payload.body.data, "base64").toString("utf-8");
        }

        messages.push({
          id: msg.id,
          from: fromEmail,
          fromName,
          subject,
          date: new Date(dateHeader).toLocaleString(),
          snippet,
          body,
          status: importedIds.has(msg.id) ? "Imported" : "Unimported",
        });
      }
    }

    return NextResponse.json({
      success: true,
      isSimulated: false,
      messages,
    });
  } catch (error) {
    console.error("Gmail Messages Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
