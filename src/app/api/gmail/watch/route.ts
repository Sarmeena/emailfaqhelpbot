import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";

async function performWatchRegistration(topicName: string) {
  const config = await getGmailConfig();
  if (!config || !config.connected || config.isSimulated) {
    throw new Error("Gmail is not connected in live mode. Webhook watches are only supported for live Gmail accounts.");
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
    throw new Error(`Gmail Watch API request failed: ${await watchRes.text()}`);
  }

  const watchData = await watchRes.json();

  // Save the watch registration details
  const expirationMs = watchData.expiration ? Number(watchData.expiration) : Date.now() + 7 * 24 * 3600 * 1000;
  await saveGmailConfig({
    pubSubTopic: topicName,
    watchExpiration: expirationMs,
  });

  return watchData;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicName = searchParams.get("topicName");

    if (!topicName) {
      return NextResponse.json(
        {
          success: false,
          error: "Google Cloud Pub/Sub Topic Name is required. Provide it as a query parameter: ?topicName=projects/YOUR_PROJECT_ID/topics/YOUR_TOPIC_NAME",
        },
        { status: 400 }
      );
    }

    const watchData = await performWatchRegistration(topicName);
    return NextResponse.json({
      success: true,
      message: "Gmail Watch subscription registered successfully via GET query.",
      watchData,
    });
  } catch (error) {
    console.error("Gmail Watch GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { topicName } = body;
    if (!topicName) {
      return NextResponse.json({ success: false, error: "Google Cloud Pub/Sub Topic Name is required in the POST body." }, { status: 400 });
    }

    const watchData = await performWatchRegistration(topicName);
    return NextResponse.json({
      success: true,
      message: "Gmail Watch subscription registered successfully.",
      watchData,
    });
  } catch (error) {
    console.error("Gmail Watch POST Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
