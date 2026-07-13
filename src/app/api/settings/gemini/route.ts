import { NextRequest, NextResponse } from "next/server";
import { getGeminiConfig, saveGeminiConfig } from "../../../../services/firestore/geminiConfig";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const token = request.headers.get("authorization")?.split(" ")[1];
    const config = await getGeminiConfig(token);
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
    const token = request.headers.get("authorization")?.split(" ")[1];
    const body = await request.json();
    await saveGeminiConfig(body, token);
    return NextResponse.json({ success: true, message: "Gemini configuration saved successfully" });
  } catch (error) {
    console.error("POST Gemini config API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
