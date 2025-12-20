import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminAuth, adminDb } from "@/lib/firbaseAdminConfig";
import admin from "firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const { total_booking_hours, arena_id, start_time, end_time } = await req.json();

    if (!total_booking_hours || !arena_id || !total_booking_hours) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const arenaDoc = await adminDb.collection("arenas").doc(arena_id).get();
    if (!arenaDoc.exists) {
      return NextResponse.json(
        { error: "Arena not found" },
        { status: 404 }
      );
    }

    const arenaData = arenaDoc.data();
    const per_hour_price = arenaData?.price_per_hour || 0;

    if (per_hour_price <= 0) {
      return NextResponse.json(
        { error: "Invalid arena pricing" },
        { status: 400 }
      );
    }

    const total_price = total_booking_hours * per_hour_price * 100;

    const pendingOrderData = {
      user_id: uid,
      arena_id: arena_id,
      total_booking_hours: total_booking_hours,
      start_time: start_time,
      end_time: end_time,
      amount: total_price,
      currency: "USD",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const pendingOrderRef = await adminDb
      .collection("orders")
      .add(pendingOrderData);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${arenaData?.name || 'Arena'} Booking`,
              description: `${total_booking_hours} hour(s) @ $${per_hour_price}/hour`,
            },
            unit_amount: total_price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: uid,
        arena_id: arena_id,
        order_id: pendingOrderRef.id,
      },
      customer_email: decodedToken.email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/arenas/${arena_id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/arenas/${arena_id}?success=false`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });
    await adminDb
      .collection("orders")
      .doc(pendingOrderRef.id)
      .update({
        stripe_session_id: session.id,
        sessionExpiresAt: new Date(session.expires_at * 1000).toISOString(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      pendingOrderId: pendingOrderRef.id,
    });
  } catch (error: any) {
    console.error("❌ Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: error.message },
      { status: 500 }
    );
  }
}