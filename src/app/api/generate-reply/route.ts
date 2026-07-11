import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "../../../services/ai/generateReply";
import { searchFAQs } from "../../../services/firestore/faqs";
import { checkAuthAndRole } from "../../../utils/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent", "viewer"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const { message } = await request.json();

    // Find matching FAQs
    const matchingFAQs = await searchFAQs(message);

    console.log("Customer Message:", message);
    console.log("Matching FAQs:", matchingFAQs);

    // Generate AI reply using only matching FAQs
    const reply = await generateReply(
      message,
      matchingFAQs
    );

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("AI Generate Reply API error:", error);
    const isQuota = error?.message?.includes("quota") || error?.message?.includes("429") || error?.status === 429 || error?.code === 429;
    const errorMsg = isQuota
      ? "Gemini API rate limit or daily free quota exceeded. Please try again later or configure a custom API key in Settings."
      : (error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: isQuota ? 429 : 500 }
    );
  }
}