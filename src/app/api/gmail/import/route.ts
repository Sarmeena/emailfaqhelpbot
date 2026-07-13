import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { generateRequestId, deriveThreadId } from "../../../../services/firestore/requests";
import { searchFAQs } from "../../../../services/firestore/faqs";
import { generateReply } from "../../../../services/ai/generateReply";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const email = await request.json();
    const { id, from, fromName, subject, body } = email;

    if (!id || !from || !body) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const requestId = generateRequestId();
    const threadId = deriveThreadId(from);

    // Retrieve FAQs matching the body content
    const matchingFAQs = await searchFAQs(body);

    // Check for escalation flags (sensitive content or unsupported issue)
    const containsSensitive = /refund|billing|charge|credit card|expired|locked|hacked|fraud|security|error 500/i.test(body + " " + subject);
    const hasNoFAQMatch = matchingFAQs.length === 0;
    const escalated = containsSensitive || hasNoFAQMatch;

    const priority = escalated ? "High" : "Medium";
    const status = escalated ? "Open" : "In Progress";

    // Auto draft replies based on escalation status
    let reply = "";
    if (escalated) {
      reply = `Thank you for contacting us (Ref: ${requestId}).\n\nYour message regarding "${subject}" has been received. Because this query is sensitive, complex, or requires account-level details, I have escalated this issue to a human support agent. A team member will reply to you directly in this thread shortly.`;
    } else {
      try {
        reply = await generateReply(body, matchingFAQs);
      } catch (e) {
        console.error("Gemini API Error in Import, using fallback reply:", e);
        reply = `Thank you for contacting us. We have received your message regarding this issue. A customer support agent has been notified and will assist you directly in this thread shortly.`;
      }
    }

    // Allocate unified ID to link Requests and Conversations
    const conversationId = threadId;

    const requestData = {
      requestId,
      threadId,
      customerName: fromName || from,
      customerEmail: from,
      subject,
      message: body,
      status,
      priority,
      source: "Gmail",
      gmailMessageId: id,
      gmailThreadId: id,
      escalated,
      createdAt: new Date().toISOString(),
    };

    const conversationData = {
      customerName: fromName || from,
      customerEmail: from,
      subject,
      status,
      lastMessage: reply.slice(0, 100) + "...",
      updatedAt: new Date().toISOString(),
      threadId,
    };

    const msg1Data = {
      conversationId: conversationId,
      sender: fromName || from,
      message: body,
      createdAt: new Date().toISOString(),
    };

    const msg2Data = {
      conversationId: conversationId,
      sender: "AI Assistant",
      message: reply,
      createdAt: new Date().toISOString(),
    };

    const firebaseToken = request.headers.get("authorization")?.split(" ")[1];

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
        console.log(`[IMPORT] Imported email ${id} via Admin SDK.`);
      } else {
        throw new Error("Admin SDK not initialized");
      }
    } catch (adminErr) {
      console.warn("[IMPORT] Admin SDK write failed, trying REST API fallback:", adminErr);
      if (!firebaseToken) {
        throw new Error("No firebaseToken provided for REST fallback in import route");
      }
      const { setFirestoreDocREST } = await import("../../../../utils/apiAuth");
      
      const randomReqId = Math.random().toString(36).substring(2, 15);
      const randomMsg1Id = Math.random().toString(36).substring(2, 15);
      const randomMsg2Id = Math.random().toString(36).substring(2, 15);

      await setFirestoreDocREST("requests", randomReqId, requestData, firebaseToken);
      await setFirestoreDocREST("conversations", conversationId, conversationData, firebaseToken);
      await setFirestoreDocREST("messages", randomMsg1Id, msg1Data, firebaseToken);
      await setFirestoreDocREST("messages", randomMsg2Id, msg2Data, firebaseToken);
      console.log(`[IMPORT] Imported email ${id} via REST API.`);
    }

    return NextResponse.json({
      success: true,
      requestId,
      threadId,
      escalated,
      autoReply: reply,
    });
  } catch (error) {
    console.error("Gmail Import Route Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
