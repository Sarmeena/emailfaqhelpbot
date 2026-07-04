import { NextRequest, NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { GoogleGenAI } from "@google/genai";
import { getGeminiConfig } from "../../../../services/firestore/geminiConfig";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "Missing conversation ID" }, { status: 400 });
    }

    const requestDoc = await getDoc(doc(db, "requests", conversationId));
    if (!requestDoc.exists()) {
      return NextResponse.json({ success: false, error: "Conversation ticket not found" }, { status: 404 });
    }

    const ticket = requestDoc.data();
    const customerText = ticket.message || "";
    const subject = ticket.subject || "";

    const config = await getGeminiConfig();
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    const model = config?.model || "gemini-2.5-flash";

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

  } catch (error) {
    console.error("AI FAQ Generation API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 550 }
    );
  }
}
