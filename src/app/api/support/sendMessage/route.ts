import { getChatCompletion } from "@/lib/aiClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    
    // ✅ Pass conversation history to AI
    const reply = await getChatCompletion(message, history || []);
    
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Error in support chat:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}