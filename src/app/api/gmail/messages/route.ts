import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";
import { collection, getDocs, query, where, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { generateRequestId, deriveThreadId } from "../../../../services/firestore/requests";
import { searchFAQs } from "../../../../services/firestore/faqs";
import { generateReply } from "../../../../services/ai/generateReply";
import { checkAuthAndRole, ensureServerAuth } from "../../../../utils/apiAuth";

async function importEmailMessage(
  msgId: string, 
  fromEmail: string, 
  fromName: string, 
  subject: string, 
  body: string, 
  token: string | null,
  threadIdParam?: string,
  messageIdHeader?: string,
  firebaseToken?: string
) {
  const requestId = generateRequestId();
  const threadId = deriveThreadId(fromEmail);

  // Retrieve FAQs matching the body content (wrapped to prevent crash on read permission errors)
  let matchingFAQs: any[] = [];
  try {
    matchingFAQs = await searchFAQs(body);
  } catch (faqErr) {
    console.warn("[AUTO-IMPORT] searchFAQs failed, using empty matches:", faqErr);
  }

  // Always generate reply using Gemini AI
  let reply = "";
  try {
    reply = await generateReply(body, matchingFAQs);
  } catch (e) {
    console.error("Gemini API Error in Message sync, using fallback reply:", e);
    reply = `Thank you for contacting us. We have received your message regarding this issue. A customer support agent has been notified and will assist you directly in this thread shortly.`;
  }

  const conversationId = threadId;
  const containsSensitive = /refund|billing|charge|credit card|expired|locked|hacked|fraud|security|error 500/i.test(body + " " + subject);
  const hasNoFAQMatch = matchingFAQs.length === 0;
  const escalated = containsSensitive || hasNoFAQMatch;

  const priority = escalated ? "High" : "Medium";
  const status = escalated ? "Open" : "In Progress";

  const requestData = {
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
    createdAt: new Date().toISOString(),
  };

  const conversationData = {
    customerName: fromName || fromEmail,
    customerEmail: fromEmail,
    subject,
    status,
    lastMessage: reply.slice(0, 100) + "...",
    updatedAt: new Date().toISOString(),
    threadId,
  };

  const msg1Data = {
    conversationId: conversationId,
    sender: fromName || fromEmail,
    message: body,
    createdAt: new Date().toISOString(),
  };

  const msg2Data = {
    conversationId: conversationId,
    sender: "AI Assistant",
    message: reply,
    createdAt: new Date().toISOString(),
  };

  try {
    const { adminDb } = await import("../../../../lib/firebaseAdmin");
    if (adminDb) {
      // Create request with auto ID
      const reqRef = adminDb.collection("requests").doc();
      await reqRef.set(requestData);
      
      // Create parallel conversation
      await adminDb.collection("conversations").doc(conversationId).set(conversationData, { merge: true });
      
      // Add messages
      await adminDb.collection("messages").add(msg1Data);
      await adminDb.collection("messages").add(msg2Data);
      console.log(`[AUTO-IMPORT] Imported message ${msgId} and created records via Admin SDK.`);
    } else {
      throw new Error("Admin SDK not initialized");
    }
  } catch (adminErr) {
    console.warn("[AUTO-IMPORT] Admin SDK write failed, trying REST API fallback:", adminErr);
    if (!firebaseToken) {
      throw new Error("No firebaseToken provided for REST fallback in importEmailMessage");
    }
    const { setFirestoreDocREST } = await import("../../../../utils/apiAuth");
    
    // Generate a random doc ID for requests and messages
    const randomReqId = Math.random().toString(36).substring(2, 15);
    const randomMsg1Id = Math.random().toString(36).substring(2, 15);
    const randomMsg2Id = Math.random().toString(36).substring(2, 15);

    await setFirestoreDocREST("requests", randomReqId, requestData, firebaseToken);
    await setFirestoreDocREST("conversations", conversationId, conversationData, firebaseToken);
    await setFirestoreDocREST("messages", randomMsg1Id, msg1Data, firebaseToken);
    await setFirestoreDocREST("messages", randomMsg2Id, msg2Data, firebaseToken);
    console.log(`[AUTO-IMPORT] Imported message ${msgId} and created records via REST API.`);
  }

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
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent", "viewer"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    
    await ensureServerAuth();
    
    const firebaseToken = request.headers.get("authorization")?.split(" ")[1];
    const config = await getGmailConfig(firebaseToken);
    let isSimulated = !config || !config.connected || config.isSimulated;

    // Retrieve already imported Gmail messages securely via Admin SDK or REST API
    const importedIds = new Set<string>();
    try {
      const { adminDb } = await import("../../../../lib/firebaseAdmin");
      if (adminDb) {
        const snapshot = await adminDb.collection("requests").where("source", "==", "Gmail").get();
        snapshot.forEach((doc: any) => {
          const data = doc.data();
          if (data.gmailMessageId) {
            importedIds.add(data.gmailMessageId);
          }
        });
      } else {
        throw new Error("Admin SDK not initialized");
      }
    } catch (err) {
      console.warn("[Gmail Messages GET] Admin SDK requests read failed, trying REST API fallback:", err);
      if (firebaseToken) {
        try {
          const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
          const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
          const res = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              structuredQuery: {
                from: [{ collectionId: "requests" }],
                where: {
                  fieldFilter: {
                    field: { fieldPath: "source" },
                    op: "EQUAL",
                    value: { stringValue: "Gmail" }
                  }
                }
              }
            }),
          });
          if (res.ok) {
            const queryRes = await res.json();
            for (const item of queryRes) {
              if (item.document) {
                const { parseRESTFields } = await import("../../../../utils/apiAuth");
                const fields = parseRESTFields(item.document.fields);
                if (fields.gmailMessageId) {
                  importedIds.add(fields.gmailMessageId);
                }
              }
            }
          }
        } catch (restErr) {
          console.error("[Gmail Messages GET] REST fallback failed:", restErr);
        }
      }
    }

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

    if (!isSimulated) {
      try {
        let token = config!.accessToken;
        if (Date.now() > config!.expiryDate) {
          const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: config!.clientId,
              client_secret: config!.clientSecret,
              refresh_token: config!.refreshToken,
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
            }, firebaseToken);
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
                messageIdHeader,
                firebaseToken
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
      } catch (realApiError) {
        console.warn("[Gmail Messages GET] Live connection failed, falling back to simulation:", realApiError);
        isSimulated = true;
      }
    }

    // Auto-import any unimported mock messages
    for (const mock of mockMessages) {
      const idToCheck = mock.id;
      if (!importedIds.has(idToCheck)) {
        await importEmailMessage(idToCheck, mock.from, mock.fromName, mock.subject, mock.body, null, undefined, undefined, firebaseToken);
      }
    }

    return NextResponse.json({
      success: true,
      isSimulated: true,
      messages: mockMessages,
    });
  } catch (error) {
    console.error("Gmail Messages Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
