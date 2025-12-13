import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, name, mail_type } = await req.json();

    if (!email || !mail_type) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const result = await sendMail(email, name, mail_type);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}
