import { NextRequest, NextResponse } from "next/server";
import { saveGmailConfig } from "../../../../services/firestore/gmailConfig";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, clientId, clientSecret } = body;
    console.log("CLIENT ID =", clientId);
    console.log("CLIENT SECRET =", clientSecret);

    if (action === "simulate") {
      await saveGmailConfig({
        clientId: "simulated_client_id",
        clientSecret: "simulated_client_secret",
        accessToken: "simulated_access_token",
        refreshToken: "simulated_refresh_token",
        expiryDate: Date.now() + 3600 * 1000,
        connected: true,
        emailAddress: "support-sandbox@company.com",
        isSimulated: true,
      });

      return NextResponse.json({
        success: true,
        message: "Simulated sandbox connection enabled.",
      });
    }

    if (action === "connect") {
      if (!clientId || !clientSecret) {
        return NextResponse.json(
          { success: false, error: "Client ID and Client Secret are required." },
          { status: 400 }
        );
      }

      // Save credentials first
      try {
        await saveGmailConfig({
          clientId,
          clientSecret,
          connected: false,
          isSimulated: false,
        });
        console.log("saveGmailConfig in auth/route completed successfully");
      } catch (err) {
        console.error("saveGmailConfig in auth/route failed:", err);
        return NextResponse.json(
          { success: false, error: `Firestore write failed: ${err instanceof Error ? err.message : String(err)}` },
          { status: 550 }
        );
      }

      // Construct Google OAuth URL
      const redirectUri = "http://localhost:3000/api/gmail/callback";
      const scopes = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
      ].join(" ");

      const stateObj = { clientId, clientSecret };
      const state = Buffer.from(JSON.stringify(stateObj)).toString("base64");

      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${encodeURIComponent(
        scopes
      )}&access_type=offline&prompt=consent&state=${state}`;

      return NextResponse.json({
        success: true,
        url: oauthUrl,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
