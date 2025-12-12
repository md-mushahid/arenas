import { sendBookingConfirmation } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendBookingConfirmation(email, {
      name,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  } finally {
    alert("Email sent successfully!");
  }
}
