import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "../../../services/ai/generateReply";
import { searchFAQs } from "../../../services/firestore/faqs";

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}