import { NextRequest, NextResponse } from "next/server";
import { searchFAQs } from "../../../../services/firestore/faqs";
import { generateReply } from "../../../../services/ai/generateReply";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent", "viewer"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
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
  } catch (error: any) {
    console.error("AI Suggestion API error:", error);
    const isQuota = error?.message?.includes("quota") || error?.message?.includes("429") || error?.status === 429 || error?.code === 429;
    const errorMsg = isQuota
      ? "Gemini API rate limit or daily free quota exceeded. Please try again later or configure a custom API key in Settings."
      : (error instanceof Error ? error.message : "Internal Server Error");
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: isQuota ? 429 : 550 }
    );
  }
}
