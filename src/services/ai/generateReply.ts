import { GoogleGenAI } from "@google/genai";
import { getGeminiConfig } from "../firestore/geminiConfig";

export async function generateReply(
  customerMessage: string,
  faqs: {
    question: string;
    answer: string;
  }[]
) {
  const config = await getGeminiConfig();
  const apiKey = config?.apiKey || process.env.GEMINI_API_KEY;
  const model = config?.model || "gemini-3.5-flash";
  const temperature = config?.temperature !== undefined ? config.temperature : 0.7;

  if (!apiKey) {
    console.error("Gemini API key is not configured.");
    return `Thank you for contacting us. We couldn't find an automatic answer. A customer support agent has been notified and will assist you shortly.`;
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const hasFAQs = faqs && faqs.length > 0;
  const faqContext = hasFAQs
    ? faqs.map((faq) => `Question: ${faq.question}\nAnswer: ${faq.answer}`).join("\n\n")
    : "No relevant FAQ articles available.";

  const prompt = hasFAQs
    ? `
You are a professional customer support assistant.

Use ONLY the FAQ below.

${faqContext}

Customer:
${customerMessage}

Write a polite professional reply.

Do not add any information that is not in the FAQ.
`
    : `
You are a professional customer support assistant.
We received the following inquiry, but we do not have specific FAQ answers matching it.

Customer inquiry:
${customerMessage}

Write a polite, professional support acknowledgment email letting the customer know we have received their message and our support team will help them shortly. Do not state specific solutions since we don't have FAQs for it, just write a helpful, reassuring acknowledgment.
`;

  let maxRetries = 3;
  let delay = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: temperature
        }
      });
      return response.text ?? "Sorry, I couldn't generate a reply.";
    } catch (apiError: any) {
      const isRateLimit = apiError?.message?.includes("quota") || 
                          apiError?.message?.includes("429") || 
                          apiError?.status === 429 || 
                          apiError?.code === 429;
      
      if (isRateLimit && attempt < maxRetries) {
        let waitTime = delay;
        const match = apiError?.message?.match(/Please retry in ([\d\.]+)s/i);
        if (match) {
          waitTime = (parseFloat(match[1]) + 0.5) * 1000;
        }
        console.warn(`[generateReply] Gemini rate limit exceeded (429). Retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        delay *= 2.5;
      } else {
        throw apiError;
      }
    }
  }

  throw new Error("Failed to generate reply after max retries due to Gemini rate limits.");
}