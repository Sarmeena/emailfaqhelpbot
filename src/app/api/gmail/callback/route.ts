import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";
import { ensureServerAuth } from "../../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  await ensureServerAuth();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    console.error("OAuth error returned from Google:", error);
    return NextResponse.redirect("http://localhost:3000/settings?gmail_error=" + encodeURIComponent(error));
  }

  if (!code) {
    return NextResponse.redirect("http://localhost:3000/settings?gmail_error=no_code_provided");
  }

  try {
    let clientId = "";
    let clientSecret = "";

    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
        clientId = decodedState.clientId;
        clientSecret = decodedState.clientSecret;
      } catch (e) {
        console.error("Failed to decode state:", e);
      }
    }

    const config = await getGmailConfig();
    const finalClientId = clientId || config?.clientId;
    const finalClientSecret = clientSecret || config?.clientSecret;

    if (!finalClientId || !finalClientSecret) {
      throw new Error("Client credentials not configured or missing in database.");
    }

    const redirectUri = "http://localhost:3000/api/gmail/callback";

    // Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: finalClientId,
        client_secret: finalClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Fetch user profile from Gmail API to get email address
    const profileResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    let emailAddress = "support@company.com";
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      emailAddress = profileData.emailAddress || emailAddress;
    }

    await saveGmailConfig({
      clientId: finalClientId,
      clientSecret: finalClientSecret,
      accessToken: access_token,
      refreshToken: refresh_token || config?.refreshToken || "",
      expiryDate: Date.now() + expires_in * 1000,
      emailAddress,
      connected: true,
      isSimulated: false,
    });

    return NextResponse.redirect("http://localhost:3000/settings?gmail_success=true");
  } catch (err) {
    console.error("OAuth callback error:", err);
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.redirect(`http://localhost:3000/settings?gmail_error=${encodeURIComponent(msg)}`);
  }
}
