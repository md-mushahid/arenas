import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firbaseAdminConfig";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const arenaId = req.nextUrl.searchParams.get("arenaId");
    if (!arenaId) {
      return NextResponse.json({ error: "arenaId required" }, { status: 400 });
    }

    const arenaDoc = await adminDb.collection("arenas").doc(arenaId).get();
    if (!arenaDoc.exists) {
      return NextResponse.json({ error: "Arena not found" }, { status: 404 });
    }

    const arenaData = arenaDoc.data();
    if (arenaData?.created_by !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: You are not the owner of this arena" },
        { status: 403 }
      );
    }

    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("arena_id", "==", arenaId)
      .where("status", "==", "paid")
      .get();

    const userIds = Array.from(
      new Set(ordersSnapshot.docs.map((doc) => doc.data().user_id))
    );

    let userMap: Record<string, any> = {};
    if (userIds.length > 0) {
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
          userMap[data.user_id] = {
            name: data.full_name || data.name || "Unknown User",
            email: data.email,
          };
        });
      }
    }

    const bookings = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        user_id: data.user_id,
        user_name: userMap[data.user_id]?.name || "Unknown User",
        user_email: userMap[data.user_id]?.email || "",
        start_time: data.start_time,
        end_time: data.end_time,
        amount: data.amount,
        total_booking_hours: data.total_booking_hours,
        status: data.status,
        paidAt: data.paidAt?.toDate().toISOString() || null,
        payment_intent: data.payment_intent,
      };
    });

    const totalEarnings = bookings.reduce((sum, booking) => sum + booking.amount, 0);

    return NextResponse.json({
      bookings,
      totalEarnings,
      totalBookings: bookings.length,
      arena: {
        id: arenaDoc.id,
        name: arenaData?.name,
      },
    });
  } catch (err: any) {
    console.error("GET arena bookings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}
