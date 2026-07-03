import { NextResponse } from "next/server";
import {
  searchFAQs,
} from "../../../services/firestore/faqSearch";

export async function GET() {
  try {
    const faqs = await searchFAQs(
  "My password reset link expired."
);

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load FAQs",
      },
      {
        status: 500,
      }
    );
  }
}