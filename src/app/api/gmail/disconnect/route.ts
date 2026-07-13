import { NextRequest, NextResponse } from "next/server";
import { disconnectGmail } from "../../../../services/firestore/gmailConfig";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }

    const token = request.headers.get("authorization")?.split(" ")[1];
    await disconnectGmail(token);
    return NextResponse.json({ success: true, message: "Gmail disconnected successfully" });
  } catch (error) {
    console.error("Disconnect API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
