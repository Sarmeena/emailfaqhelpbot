import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";
import { collection, getDocs, query, where, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { generateRequestId, deriveThreadId } from "../../../../services/firestore/requests";
import { searchFAQs } from "../../../../services/firestore/faqs";
import { generateReply } from "../../../../services/ai/generateReply";

async function importEmailMessage(
  msgId: string, 
  fromEmail: string, 
  fromName: string, 
  subject: string, 
  body: string, 
  token: string | null,
  threadIdParam?: string,
  messageIdHeader?: string
) {
  const requestId = generateRequestId();
  const threadId = deriveThreadId(fromEmail);

  // Retrieve FAQs matching the body content
  const matchingFAQs = await searchFAQs(body);

  // Always generate reply using Gemini AI
  const reply = await generateReply(body, matchingFAQs);

  // Allocate unified ID to link Requests and Conversations
  const requestDocRef = doc(collection(db, "requests"));
  const docId = requestDocRef.id;

  const containsSensitive = /refund|billing|charge|credit card|expired|locked|hacked|fraud|security|error 500/i.test(body + " " + subject);
  const hasNoFAQMatch = matchingFAQs.length === 0;
  const escalated = containsSensitive || hasNoFAQMatch;

  const priority = escalated ? "High" : "Medium";
  const status = escalated ? "Open" : "In Progress";

  // Create request
  await setDoc(requestDocRef, {
    requestId,
    threadId,
    customerName: fromName || fromEmail,
    customerEmail: fromEmail,
    subject,
    message: body,
    status,
    priority,
    source: "Gmail",
    gmailMessageId: msgId,
    gmailThreadId: threadIdParam || msgId,
    escalated,
    createdAt: serverTimestamp(),
  });

  // Create parallel conversation
  await setDoc(doc(db, "conversations", docId), {
    customerName: fromName || fromEmail,
    customerEmail: fromEmail,
    subject,
    status,
    lastMessage: reply.slice(0, 100) + "...",
    updatedAt: serverTimestamp(),
  });

  // Add inbound message
  await addDoc(collection(db, "messages"), {
    conversationId: docId,
    sender: fromName || fromEmail,
    message: body,
    createdAt: serverTimestamp(),
  });

  // Add automated reply message
  await addDoc(collection(db, "messages"), {
    conversationId: docId,
    sender: "AI Assistant",
    message: reply,
    createdAt: serverTimestamp(),
  });

  // Send the email reply back to Gmail (in-thread) if real connection token exists
  if (token && messageIdHeader) {
    try {
      const emailSubject = subject.toLowerCase().startsWith("re:") ? subject : `Re: ${subject}`;
      const emailRaw = [
        `To: ${fromEmail}`,
        `Subject: ${emailSubject}`,
        `Content-Type: text/plain; charset=UTF-8`,
        `MIME-Version: 1.0`,
        `In-Reply-To: ${messageIdHeader}`,
        `References: ${messageIdHeader}`,
        "",
        reply,
      ].join("\r\n");

      const base64Encoded = Buffer.from(emailRaw)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          raw: base64Encoded,
          threadId: threadIdParam || msgId
        }),
      });
      console.log(`[AUTO-IMPORT] Auto-replied to Gmail message ${msgId}`);
    } catch (e) {
      console.error("[AUTO-IMPORT] Failed to send email auto-reply:", e);
    }
  }
}

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
          status: "Imported",
        },
        {
          id: "msg_sim_002",
          from: "david.beck@example.com",
          fromName: "David Beck",
          subject: "How do I reset my API secret?",
          date: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
          snippet: "I need to rotate my API keys but cannot find the secret settings in the console.",
          body: "Hi,\n\nCan you guide me on how to reset my API secret? I need to rotate it for security compliance by end of today.\n\nBest,\nDavid",
          status: "Imported",
        },
        {
          id: "msg_sim_003",
          from: "support-tester@random.com",
          fromName: "Robert Miller",
          subject: "Broken login link",
          date: new Date(Date.now() - 2 * 3600 * 1000).toLocaleString(),
          snippet: "Your login portal is throwing a server 500 error since this morning.",
          body: "Hello,\n\nEvery time I try to login, the screen hangs and throws a 500 internal server error. I have tried clearing my cache. Please escalate this.",
          status: "Imported",
        },
      ];

      // Auto-import any unimported mock messages
      for (const mock of mockMessages) {
        const idToCheck = mock.id;
        if (!importedIds.has(idToCheck)) {
          await importEmailMessage(idToCheck, mock.from, mock.fromName, mock.subject, mock.body, null);
        }
      }

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

        const isAlreadyImported = importedIds.has(msg.id);
        if (!isAlreadyImported) {
          const messageIdHeader = headers.find((h: any) => h.name.toLowerCase() === "message-id")?.value || msg.id;
          await importEmailMessage(
            msg.id,
            fromEmail,
            fromName,
            subject,
            body,
            token,
            detail.threadId,
            messageIdHeader
          );
        }

        messages.push({
          id: msg.id,
          from: fromEmail,
          fromName,
          subject,
          date: new Date(dateHeader).toLocaleString(),
          snippet,
          body,
          status: "Imported",
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
