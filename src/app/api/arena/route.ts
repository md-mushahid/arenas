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
      latitude,
      longitude,
      price_per_hour,
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
      latitude: latitude || 0,
      longitude: longitude || 0,
      price_per_hour: price_per_hour || 0,
      full: 1,
      seven: 0,
      rooms: 0,
      access: "public",
      rating: 5,
      contact_email: contact_email || null,
      contact_number: contact_number || null,
      cover_image_url: cover_image_url || null,
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
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    if (error.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create arena", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const arenaId = req.nextUrl.searchParams.get("arenaId");
    if (!arenaId) {
      return NextResponse.json({ error: "arenaId required" }, { status: 400 });
    }

    const snapshot = await adminDb
      .collection("orders")
      .where("arena_id", "==", arenaId)
      .where("status", "==", "paid")
      .get();

    // Get unique user IDs (like a SQL DISTINCT)
    const userIds = Array.from(
      new Set(snapshot.docs.map((doc) => doc.data().user_id))
    );

    // Fetch user names (client-side join)
    let userMap: Record<string, string> = {};
    if (userIds.length > 0) {
      // Firestore 'in' query supports max 10 items, so we batch
      const chunks = [];
      for (let i = 0; i < userIds.length; i += 10) {
        chunks.push(userIds.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const usersSnapshot = await adminDb
          .collection("users")
          .where("user_id", "in", chunk)
          .get();

        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          userMap[data.user_id] = data.full_name || data.name || "Unknown User";
        });
      }
    }

    // Map bookings with user names (like a SQL JOIN result)
    const bookings = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        arena_id: data.arena_id,
        start_time: data.start_time,
        end_time: data.end_time,
        user_id: data.user_id,
        user_name: userMap[data.user_id] || "Unknown User", // Joined data
      };
    });

    return NextResponse.json({ bookings });
  } catch (err: any) {
    console.error("GET arena bookings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}
