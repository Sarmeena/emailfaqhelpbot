import { NextResponse } from "next/server";
import { generateReply } from "../../../services/ai/generateReply";

export async function GET() {
  const reply = await generateReply(
    "I forgot my password and the reset link expired."
  );

  return NextResponse.json({
    success: true,
    reply,
  });
}