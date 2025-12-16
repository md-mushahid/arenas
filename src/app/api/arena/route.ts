import { adminAuth, adminDb } from "@/lib/firbaseAdminConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const body = await request.json();
    const {
      name,
      address,
      city,
      country,
      contact_email,
      contact_number,
      cover_image_url,
    } = body;

    if (!name || !address || !city || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const arenaData = {
      name,
      address,
      city,
      country,
      full: 1,
      seven: 0,
      rooms: 0,
      access: "public",
      rating: 5,
      contact_email: contact_email || null,
      contact_number: contact_number || null,
      cover_image_url: cover_image_url || "/images/image-1.jpg",
      created_by: uid,
      created_at: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("arenas").add(arenaData);

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        data: arenaData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating arena:", error);
    
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }
    
    if (error.code === "auth/argument-error") {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create arena", details: error.message },
      { status: 500 }
    );
  }
}