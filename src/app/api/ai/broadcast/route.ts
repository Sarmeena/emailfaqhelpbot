import { NextRequest, NextResponse } from "next/server";
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
    const { prompt, tone, subject } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ success: false, error: "Missing prompt input text" }, { status: 400 });
    }

    const config = await getGeminiConfig();
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
    const model = config?.model || "gemini-2.5-flash";
    const temperature = config?.temperature !== undefined ? config.temperature : 0.7;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key is not configured." }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const fullPrompt = `
You are an expert copywriter and marketing assistant. 
Draft a professional, compelling, and engaging broadcast email based on the following instruction:
"${prompt}"

Tone: ${tone || "Professional"}
Subject line reference: ${subject || "(No Subject)"}

Please output ONLY the formatted body text of the email. Do not include subject fields, markdown wrappers like \`\`\`html or greeting placeholders, just the text content of the email body itself.
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        temperature: temperature
      }
    });

    const resultText = response.text || "Failed to generate content.";

    return NextResponse.json({
      success: true,
      content: resultText.trim(),
    });
  } catch (error) {
    console.error("AI Broadcast draft API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
