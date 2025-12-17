import { getChatCompletion } from "@/lib/aiClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    const questions = await getChatCompletion(message);
    return NextResponse.json({ reply: questions });
  } catch (err) {
    console.error("Error in support chat:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
