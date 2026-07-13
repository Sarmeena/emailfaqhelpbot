import { NextRequest, NextResponse } from "next/server";
import { getConversations, getMessages, sendMessage } from "../../../services/firestore/conversations";
import { checkAuthAndRole, ensureServerAuth } from "../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent", "viewer"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }

    await ensureServerAuth();

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const messages = await getMessages(conversationId);
      return NextResponse.json({ success: true, messages });
    }

    const conversations = await getConversations();
    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error("GET conversations API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }

    await ensureServerAuth();

    const body = await request.json();
    const { conversationId, sender, message } = body;

    if (!conversationId || !sender || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await sendMessage(conversationId, sender, message);
    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("POST conversations API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
