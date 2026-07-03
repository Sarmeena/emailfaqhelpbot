import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateReply(
  customerMessage: string,
  faqs: {
    question: string;
    answer: string;
  }[]
) {
  // No matching FAQ → don't call Gemini
  if (faqs.length === 0) {
    return `Thank you for contacting us.

We couldn't find an answer for your request in our knowledge base.

Your request has been forwarded to our support team, who will assist you shortly.`;
  }

  const faqContext = faqs
    .map(
      (faq) =>
        `Question: ${faq.question}\nAnswer: ${faq.answer}`
    )
    .join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a professional customer support assistant.

Use ONLY the FAQ below.

${faqContext}

Customer:
${customerMessage}

Write a polite professional reply.

Do not add any information that is not in the FAQ.
`,
  });

  return (
    response.text ??
    "Sorry, I couldn't generate a reply."
  );
}