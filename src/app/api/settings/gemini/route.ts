import { NextRequest, NextResponse } from "next/server";
import { getGeminiConfig, saveGeminiConfig } from "../../../../services/firestore/geminiConfig";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const config = await getGeminiConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("GET Gemini config API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const body = await request.json();
    await saveGeminiConfig(body);
    return NextResponse.json({ success: true, message: "Gemini configuration saved successfully" });
  } catch (error) {
    console.error("POST Gemini config API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
