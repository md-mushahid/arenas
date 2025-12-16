import { NextRequest, NextResponse } from "next/server";
import { AppUser } from "@/types/arenasType";
import { adminAuth, adminDb } from "@/lib/firbaseAdminConfig";
import { sendMail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["player", "coach"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Create user in Firebase Admin
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const newUser: AppUser = {
      user_id: userRecord.uid,
      full_name: name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(newUser);

    // Send welcome email from backend
    await sendMail(email, name, "welcome");

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
