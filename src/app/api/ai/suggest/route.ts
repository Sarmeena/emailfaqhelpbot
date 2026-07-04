import { NextRequest, NextResponse } from "next/server";
import { searchFAQs } from "../../../../services/firestore/faqs";
import { generateReply } from "../../../../services/ai/generateReply";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "Missing message text" }, { status: 400 });
    }

    const matchingFAQs = await searchFAQs(message);
    const suggestedReply = await generateReply(message, matchingFAQs);

    // Calculate simulated confidence
    const confidence = matchingFAQs.length > 0 ? 94 : 45;

    return NextResponse.json({
      success: true,
      suggestion: suggestedReply,
      confidence,
      sourceFAQs: matchingFAQs
    });
  } catch (error) {
    console.error("AI Suggestion API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
