import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "../../../../lib/firebase";
import { GoogleGenAI } from "@google/genai";
import { getGeminiConfig } from "../../../../services/firestore/geminiConfig";
import { checkAuthAndRole } from "../../../../utils/apiAuth";

export async function POST(request: NextRequest) {
  try {
    const { errorResponse } = await checkAuthAndRole(request, ["admin", "agent"]);
    if (errorResponse) {
      return NextResponse.json({ success: false, error: errorResponse.error }, { status: errorResponse.status });
    }
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "Missing conversation ID" }, { status: 400 });
    }

    let ticket = null;

    // Structured query via Firestore REST API to find request with threadId
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
    
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (token) {
      const queryPayload = {
        structuredQuery: {
          from: [{ collectionId: "requests" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "threadId" },
              op: "EQUAL",
              value: { stringValue: conversationId }
            }
          },
          limit: 1
        }
      };

      const qRes = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(queryPayload)
      });

      if (qRes.ok) {
        const results = await qRes.json();
        if (results && results.length > 0 && results[0].document) {
          const { parseRESTFields } = await import("../../../../utils/apiAuth");
          ticket = parseRESTFields(results[0].document.fields);
        }
      }
    }

    if (!ticket) {
      // Fallback: direct document get via REST using the client token
      const { getFirestoreDocREST, parseRESTFields } = await import("../../../../utils/apiAuth");
      const docData = await getFirestoreDocREST("requests", conversationId, token || undefined);
      if (docData) {
        ticket = parseRESTFields(docData.fields);
      }
    }

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Conversation ticket not found" }, { status: 404 });
    }

    const customerText = ticket.message || "";
    const subject = ticket.subject || "";

    const config = await getGeminiConfig(token || undefined);
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    const model = config?.model || "gemini-3.5-flash";

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key is not configured in settings." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Based on the following support ticket subject and message content, generate a clean, general-purpose FAQ entry.
The entry must consist of:
1. A concise, generic Question (e.g., "How do I reset my password?" instead of "I can't log in with user alex123").
2. A helpful, clear Answer based on the message content (or a general template if no specific steps are mentioned).
3. A single-word Category matching one of: Technical, Support, Billing, General.

Subject: ${subject}
Message Content: ${customerText}

Respond ONLY in JSON format matching this schema:
{
  "question": "string",
  "answer": "string",
  "category": "string"
}
`;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      const result = JSON.parse(text.trim());

      return NextResponse.json({
        success: true,
        faq: {
          question: result.question || `How to resolve: ${subject}?`,
          answer: result.answer || customerText,
          category: result.category || "Support"
        }
      });
    } catch (apiError: any) {
      console.error("Gemini API Error in generate-faq:", apiError);
      
      const errorMessage = apiError?.message || "";
      const isInvalidKey = errorMessage.includes("API key not valid") || 
                           errorMessage.includes("API_KEY_INVALID") || 
                           apiError?.status === 400 || 
                           apiError?.code === 400;
                           
      const isQuota = errorMessage.includes("quota") || 
                      errorMessage.includes("429") || 
                      apiError?.status === 429 || 
                      apiError?.code === 429;

      let errorMsg = "Gemini AI generation failed.";
      let statusCode = 500;

      if (isInvalidKey) {
        errorMsg = "Invalid Gemini API key. Please check and configure a valid Gemini API key in Settings.";
        statusCode = 400;
      } else if (isQuota) {
        errorMsg = "Gemini API rate limit or daily free quota exceeded. Please configure a custom API key in Settings or try again later.";
        statusCode = 429;
      } else if (apiError instanceof Error) {
        errorMsg = apiError.message;
      }

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: statusCode }
      );
    }

  } catch (error) {
    console.error("AI FAQ Generation API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
