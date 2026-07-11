import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const body = await request.json();
    const { recipient, subject, message, messageId, threadId } = body;

    if (!recipient || !subject || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const config = await getGmailConfig();
    const isSimulated = !config || !config.connected || config.isSimulated;

    if (isSimulated) {
      console.log(`[SIMULATED EMAIL SENT]
To: ${recipient}
Subject: ${subject}
In-Reply-To: ${messageId || "N/A"}
References: ${messageId || "N/A"}
Message:
${message}
------------------------------------`);
      return NextResponse.json({
        success: true,
        message: "Email sent successfully (Simulated Sandbox).",
      });
    }

    // Live connection send flow
    let token = config.accessToken;
    if (Date.now() > config.expiryDate) {
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          refresh_token: config.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        token = refreshData.access_token;
        const newExpiry = Date.now() + refreshData.expires_in * 1000;
        await saveGmailConfig({
          accessToken: token,
          expiryDate: newExpiry,
        });
      } else {
        throw new Error("Failed to refresh Gmail OAuth token.");
      }
    }

    // Construct raw MIME email matching standard email formats
    const headers = [
      `To: ${recipient}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=UTF-8`,
      `MIME-Version: 1.0`,
    ];

    if (messageId) {
      headers.push(`In-Reply-To: ${messageId}`);
      headers.push(`References: ${messageId}`);
    }

    const emailRaw = [
      ...headers,
      "",
      message,
    ].join("\r\n");

    const base64Encoded = Buffer.from(emailRaw)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: base64Encoded,
        threadId: threadId || undefined,
      }),
    });

    if (!sendRes.ok) {
      throw new Error(`Gmail API send failed: ${await sendRes.text()}`);
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Gmail Send Email Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
