import { NextRequest, NextResponse } from "next/server";
import { getDoc, doc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
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

    let ticket = null;
    const requestsRef = collection(db, "requests");
    const q = query(
      requestsRef,
      where("threadId", "==", conversationId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docs = [...querySnapshot.docs];
      docs.sort((a: any, b: any) => {
        const aTime = a.data().createdAt?.seconds || a.data().createdAt?._seconds || 0;
        const bTime = b.data().createdAt?.seconds || b.data().createdAt?._seconds || 0;
        return bTime - aTime;
      });
      ticket = docs[0].data();
    } else {
      // Fallback: direct get (legacy)
      const requestDoc = await getDoc(doc(db, "requests", conversationId));
      if (requestDoc.exists()) {
        ticket = requestDoc.data();
      }
    }

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Conversation ticket not found" }, { status: 404 });
    }

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
      const isQuota = apiError?.message?.includes("quota") || apiError?.message?.includes("429") || apiError?.status === 429 || apiError?.code === 429;
      const errorMsg = isQuota
        ? "Gemini API rate limit or daily free quota exceeded. Please try again later or configure a custom API key in Settings."
        : (apiError instanceof Error ? apiError.message : "Gemini AI generation failed");
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: isQuota ? 429 : 500 }
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
