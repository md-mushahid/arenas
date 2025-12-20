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

    const userIdParam = req.nextUrl.searchParams.get("userId");
    
    if (userIdParam !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Can only view your own bookings" },
        { status: 403 }
      );
    }

    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("user_id", "==", userId)
      .where("status", "==", "paid")
      .get();

    // Get unique arena IDs
    const arenaIds = Array.from(
      new Set(ordersSnapshot.docs.map((doc) => doc.data().arena_id))
    );

    // Fetch arena names
    let arenaMap: Record<string, string> = {};
    if (arenaIds.length > 0) {
      for (const arenaId of arenaIds) {
        try {
          const arenaDoc = await adminDb.collection("arenas").doc(arenaId).get();
          if (arenaDoc.exists) {
            arenaMap[arenaId] = arenaDoc.data()?.name || "Unknown Arena";
          }
        } catch (error) {
          console.error(`Error fetching arena ${arenaId}:`, error);
          arenaMap[arenaId] = "Unknown Arena";
        }
      }
    }

    const bookings = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        arena_id: data.arena_id,
        arena_name: arenaMap[data.arena_id] || "Unknown Arena",
        start_time: data.start_time,
        end_time: data.end_time,
        amount: data.amount,
        total_booking_hours: data.total_booking_hours,
        status: data.status,
        paidAt: data.paidAt?.toDate().toISOString() || null,
        payment_intent: data.payment_intent,
      };
    });

    return NextResponse.json({ bookings });
  } catch (err: any) {
    console.error("GET user bookings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: err.message },
      { status: 500 }
    );
  }
}
