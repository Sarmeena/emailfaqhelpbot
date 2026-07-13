import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig } from "../../../../services/firestore/gmailConfig";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent", "viewer"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }

    const token = request.headers.get("authorization")?.split(" ")[1];
    const config = await getGmailConfig(token);
    return NextResponse.json({
      success: true,
      connected: config?.connected || false,
      emailAddress: config?.emailAddress || "Not Connected",
      isSimulated: config?.isSimulated || false,
    });
  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
