import { NextRequest, NextResponse } from "next/server";
import { getFAQs, getFAQById, addFAQ, updateFAQ, deleteFAQ } from "../../../services/firestore/faqs";
import { checkAuthAndRole, ensureServerAuth } from "../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  try {
    await ensureServerAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const faq = await getFAQById(id);
      return NextResponse.json({ success: true, faq });
    }

    const faqs = await getFAQs();
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("GET FAQs API error:", error);
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
    const { question, answer, category, source, fileName, fileSize, uploadedAt } = body;

    if (!question || !answer || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await addFAQ(question, answer, category, { source, fileName, fileSize, uploadedAt });
    return NextResponse.json({ success: true, message: "FAQ created successfully" });
  } catch (error) {
    console.error("POST FAQs API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    
    await ensureServerAuth();
    
    const body = await request.json();
    const { id, question, answer, category } = body;

    if (!id || !question || !answer || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await updateFAQ(id, { question, answer, category });
    return NextResponse.json({ success: true, message: "FAQ updated successfully" });
  } catch (error) {
    console.error("PUT FAQs API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    
    await ensureServerAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing FAQ ID" }, { status: 400 });
    }

    await deleteFAQ(id);
    return NextResponse.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("DELETE FAQs API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
