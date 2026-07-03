import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig, saveGmailConfig } from "../../../../services/firestore/gmailConfig";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("OAuth error returned from Google:", error);
    return NextResponse.redirect("http://localhost:3000/settings?gmail_error=" + encodeURIComponent(error));
  }

  if (!code) {
    return NextResponse.redirect("http://localhost:3000/settings?gmail_error=no_code_provided");
  }

  try {
    const config = await getGmailConfig();
    if (!config || !config.clientId || !config.clientSecret) {
      throw new Error("Client credentials not configured or missing in database.");
    }

    const redirectUri = "http://localhost:3000/api/gmail/callback";

    // Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
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
      accessToken: access_token,
      refreshToken: refresh_token || config.refreshToken,
      expiryDate: Date.now() + expires_in * 1000,
      emailAddress,
      connected: true,
    });

    return NextResponse.redirect("http://localhost:3000/settings?gmail_success=true");
  } catch (err) {
    console.error("OAuth callback error:", err);
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.redirect(`http://localhost:3000/settings?gmail_error=${encodeURIComponent(msg)}`);
  }
}
