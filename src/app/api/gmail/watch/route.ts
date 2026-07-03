import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";

export async function POST(request: NextRequest) {
  try {
    const config = await getGmailConfig();
    if (!config || !config.connected || config.isSimulated) {
      return NextResponse.json(
        { success: false, error: "Gmail is not connected in live mode. Webhook watches are only supported for live Gmail accounts." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { topicName } = body; // e.g. projects/your-project-id/topics/your-topic-name

    if (!topicName) {
      return NextResponse.json(
        { success: false, error: "Google Cloud Pub/Sub Topic Name is required." },
        { status: 450 }
      );
    }

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

    // Call Gmail API Watch endpoint to register mailbox webhook
    const watchRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/watch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicName,
        labelIds: ["INBOX"],
      }),
    });

    if (!watchRes.ok) {
      throw new Error(`Gmail Watch failed: ${await watchRes.text()}`);
    }

    const watchData = await watchRes.json();
    return NextResponse.json({
      success: true,
      message: "Gmail Watch subscription registered successfully.",
      watchData,
    });
  } catch (error) {
    console.error("Gmail Watch Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
