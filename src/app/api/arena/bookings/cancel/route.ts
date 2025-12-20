import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firbaseAdminConfig";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { orderId, arenaId } = await req.json();

    if (!orderId || !arenaId) {
      return NextResponse.json(
        { error: "orderId and arenaId are required" },
        { status: 400 }
      );
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

    const orderDoc = await adminDb.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data();
    if (orderData?.arena_id !== arenaId) {
      return NextResponse.json(
        { error: "Order does not belong to this arena" },
        { status: 400 }
      );
    }

    await adminDb.collection("orders").doc(orderId).delete();

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err: any) {
    console.error("Cancel booking error:", err);
    return NextResponse.json(
      { error: "Failed to cancel booking", details: err.message },
      { status: 500 }
    );
  }
}
