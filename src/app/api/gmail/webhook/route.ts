import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";
import { addDoc, collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { generateRequestId, deriveThreadId } from "../../../../services/firestore/requests";
import { searchFAQs } from "../../../../services/firestore/faqs";
import { generateReply } from "../../../../services/ai/generateReply";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log("Gmail Webhook Received Pub/Sub Event:", JSON.stringify(payload));

    const config = await getGmailConfig();
    if (!config || !config.connected || config.isSimulated) {
      return NextResponse.json({ success: true, message: "Webhook ignored (sandbox/not connected)" });
    }

    // Refresh credentials if expired
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
        throw new Error("Failed to refresh Gmail OAuth token during Webhook execution.");
      }
    }

    // Fetch the single latest unread email from Gmail Inbox
    const listRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=1&q=is:unread",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!listRes.ok) {
      throw new Error(`Gmail API list in Webhook failed: ${await listRes.text()}`);
    }

    const listData = await listRes.json();
    const gmailMessages = listData.messages || [];
    if (gmailMessages.length === 0) {
      return NextResponse.json({ success: true, message: "No unread messages found to process." });
    }

    const msgId = gmailMessages[0].id;

    // Check if we have already imported this message ID to avoid duplicates
    const checkSnapshot = await getDocs(
      query(collection(db, "requests"), where("gmailMessageId", "==", msgId))
    );
    if (!checkSnapshot.empty) {
      return NextResponse.json({ success: true, message: "Message already imported." });
    }

    // Retrieve message details
    const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!msgRes.ok) {
      throw new Error(`Gmail API get in Webhook failed: ${await msgRes.text()}`);
    }

    const detail = await msgRes.json();
    const headers = detail.payload.headers;
    const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
    const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "";

    const emailMatch = fromHeader.match(/<([^>]+)>/);
    const fromEmail = emailMatch ? emailMatch[1] : fromHeader;
    const fromName = fromHeader.replace(/<[^>]+>/, "").trim() || fromEmail;

    const snippet = detail.snippet || "";

    let body = snippet;
    const payloadParts = detail.payload;
    if (payloadParts.parts) {
      const bodyPart = payloadParts.parts.find((p: any) => p.mimeType === "text/plain") || payloadParts.parts[0];
      const bodyData = bodyPart?.body?.data;
      if (bodyData) {
        body = Buffer.from(bodyData, "base64").toString("utf-8");
      }
    } else if (payloadParts.body?.data) {
      body = Buffer.from(payloadParts.body.data, "base64").toString("utf-8");
    }

    // Process Ticket Auto-creation and AI Reply
    const requestId = generateRequestId();
    const threadId = deriveThreadId(fromEmail);
    const matchingFAQs = await searchFAQs(body);

    const containsSensitive = /refund|billing|charge|credit card|expired|locked|hacked|fraud|security|error 500/i.test(body + " " + subject);
    const hasNoFAQMatch = matchingFAQs.length === 0;
    const escalated = containsSensitive || hasNoFAQMatch;

    const priority = escalated ? "High" : "Medium";
    const status = escalated ? "Open" : "In Progress";

    let reply = "";
    if (escalated) {
      reply = `Thank you for contacting us (Ref: ${requestId}).\n\nYour message regarding "${subject}" has been received. Because this query is sensitive, complex, or requires account-level details, I have escalated this issue to a human support agent. A team member will reply to you directly in this thread shortly.`;
    } else {
      reply = await generateReply(body, matchingFAQs);
    }

    // Save parallel details in Firestore
    const requestDocRef = doc(collection(db, "requests"));
    const docId = requestDocRef.id;

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
      gmailThreadId: detail.threadId || msgId,
      escalated,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "conversations", docId), {
      customerName: fromName || fromEmail,
      customerEmail: fromEmail,
      subject,
      status,
      lastMessage: reply.slice(0, 100) + "...",
      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "messages"), {
      conversationId: docId,
      sender: fromName || fromEmail,
      message: body,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "messages"), {
      conversationId: docId,
      sender: "AI Assistant",
      message: reply,
      createdAt: serverTimestamp(),
    });

    // Extract original Message-ID from headers to reply correctly
    const messageIdHeader = headers.find((h: any) => h.name.toLowerCase() === "message-id")?.value || msgId;

    // Send the auto reply email back via Gmail API (In-Thread)
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

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        raw: base64Encoded,
        threadId: detail.threadId || msgId
      }),
    });

    if (!sendRes.ok) {
      const errorText = await sendRes.text();
      console.error("[REALTIME BOT RESPONSE FAILED] Gmail API send failed:", errorText);
      throw new Error(`Gmail API send failed: ${errorText}`);
    }

    // Mark message as read in Gmail (remove UNREAD label)
    await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        removeLabelIds: ["UNREAD"],
      }),
    });

    console.log(`[REALTIME BOT RESPONSE SENT] Auto-responded to message ${msgId} and marked as read.`);
    return NextResponse.json({ success: true, message: "Webhook processed and reply sent." });
  } catch (error) {
    console.error("Gmail Webhook Processing Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Webhook Error" },
      { status: 500 }
    );
  }
}
