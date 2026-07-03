import { NextResponse } from "next/server";
import { generateReply } from "../../../services/ai/generateReply";

export async function GET() {
  const reply = await generateReply(
    "I forgot my password and the reset link expired.",
    [
      {
        question: "How do I reset my password?",
        answer:
          "Click the 'Forgot Password' link on the login page. A password reset link will be sent to your registered email.",
      },
    ]
  );

  return NextResponse.json({
    success: true,
    reply,
  });
}