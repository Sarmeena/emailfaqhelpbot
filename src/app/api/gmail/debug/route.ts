import { NextRequest, NextResponse } from "next/server";
import { getGmailConfig } from "../../../../services/firestore/gmailConfig";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../../lib/firebase";
import { ensureServerAuth } from "../../../../utils/apiAuth";

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: Date.now(),
    serverTime: new Date().toISOString(),
    firestoreAccessSucceeded: false,
    firestoreError: null,
    documentExists: false,
    authStatus: {
      isServerAuthenticated: false,
      currentUserUid: null,
      currentUserEmail: null,
      error: null,
    },
    missingFields: [],
    invalidFields: [],
    documentDataSummary: null,
    oauthTest: null,
  };

  try {
    // 1. Attempt Server-side Auth
    try {
      await ensureServerAuth();
      diagnostics.authStatus.isServerAuthenticated = true;
      if (auth.currentUser) {
        diagnostics.authStatus.currentUserUid = auth.currentUser.uid;
        diagnostics.authStatus.currentUserEmail = auth.currentUser.email;
      }
    } catch (authError: any) {
      diagnostics.authStatus.isServerAuthenticated = false;
      diagnostics.authStatus.error = authError.message || String(authError);
    }

    // 2. Fetch the document directly to diagnose Firestore state
    const docRef = doc(db, "settings", "gmail");
    let snapshot = null;
    try {
      snapshot = await getDoc(docRef);
      diagnostics.firestoreAccessSucceeded = true;
    } catch (fsError: any) {
      diagnostics.firestoreAccessSucceeded = false;
      diagnostics.firestoreError = {
        code: fsError.code,
        message: fsError.message || String(fsError),
      };
    }

    if (diagnostics.firestoreAccessSucceeded && snapshot) {
      if (snapshot.exists()) {
        diagnostics.documentExists = true;
        const data = snapshot.data();
        
        // Summarize the document data securely
        diagnostics.documentDataSummary = {
          clientIdPresent: !!data.clientId,
          clientIdLength: data.clientId?.length || 0,
          clientSecretPresent: !!data.clientSecret,
          clientSecretLength: data.clientSecret?.length || 0,
          accessTokenPresent: !!data.accessToken,
          accessTokenLength: data.accessToken?.length || 0,
          refreshTokenPresent: !!data.refreshToken,
          refreshTokenLength: data.refreshToken?.length || 0,
          expiryDate: data.expiryDate,
          connected: data.connected,
          emailAddress: data.emailAddress,
          isSimulated: data.isSimulated,
          pubSubTopic: data.pubSubTopic,
          watchExpiration: data.watchExpiration,
          redirectUri: data.redirectUri,
          scopes: data.scopes,
        };

        // 3. Check for missing/invalid fields
        const expectedFields = [
          "clientId",
          "clientSecret",
          "accessToken",
          "refreshToken",
          "expiryDate",
          "connected",
          "emailAddress",
          "isSimulated"
        ];
        
        for (const field of expectedFields) {
          if (data[field] === undefined) {
            diagnostics.missingFields.push(field);
          } else if (data[field] === null || data[field] === "") {
            if (field !== "accessToken" && field !== "refreshToken" && field !== "emailAddress") {
              diagnostics.invalidFields.push(`${field} is empty`);
            }
          }
        }

        // 4. Test OAuth Token Refresh if credentials exist
        const config = await getGmailConfig();
        if (config && config.isSimulated) {
          diagnostics.oauthTest = {
            success: true,
            status: "skipped",
            responseText: "Skipped: Running in simulated sandbox mode."
          };
        } else if (config && config.clientId && config.clientSecret && config.refreshToken) {
          try {
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

            const status = refreshResponse.status;
            const text = await refreshResponse.text();
            
            diagnostics.oauthTest = {
              success: refreshResponse.ok,
              status,
              responseText: text,
            };
          } catch (oauthErr: any) {
            diagnostics.oauthTest = {
              success: false,
              error: oauthErr.message || String(oauthErr),
            };
          }
        } else {
          diagnostics.oauthTest = {
            success: false,
            error: "Cannot test OAuth refresh: missing client credentials or refresh token",
          };
        }
      } else {
        diagnostics.documentExists = false;
        diagnostics.missingFields = ["Entire settings/gmail document is missing in Firestore"];
      }
    }

    const overallSuccess = diagnostics.firestoreAccessSucceeded && diagnostics.documentExists && (!diagnostics.oauthTest || diagnostics.oauthTest.success);

    return NextResponse.json({
      success: overallSuccess,
      diagnostics
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || String(error),
      diagnostics
    });
  }
}
