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

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const orderDoc = await adminDb.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const orderData = orderDoc.data();
    
    if (orderData?.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: This is not your booking" },
        { status: 403 }
      );
    }

    const startTime = new Date(orderData.start_time);
    const now = new Date();
    const hoursDifference = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return NextResponse.json(
        { 
          error: "Cannot cancel booking less than 24 hours before start time",
          hoursRemaining: hoursDifference.toFixed(1)
        },
        { status: 400 }
      );
    }

    await adminDb.collection("orders").doc(orderId).delete();

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err: any) {
    console.error("Cancel user booking error:", err);
    return NextResponse.json(
      { error: "Failed to cancel booking", details: err.message },
      { status: 500 }
    );
  }
}
