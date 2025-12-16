import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { adminDb } from "@/lib/firbaseAdminConfig";
import admin from "firebase-admin";

async function updateArenaBookedSlots(arenaId: string, newSlots: any[]) {
  try {
    const arenaRef = adminDb.collection("arenas").doc(arenaId);
    const arenaSnap = await arenaRef.get();

    if (arenaSnap.exists) {
      const currentData = arenaSnap.data();
      const currentBookedSlots = currentData?.bookedSlots || [];
      const updatedSlots = [...currentBookedSlots, ...newSlots];

      await arenaRef.update({
        bookedSlots: updatedSlots,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("✅ Arena booked slots updated");
    }
  } catch (error) {
    console.error("❌ Error updating arena slots:", error);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      console.log("✅ Payment successful! Session ID:", session.id);

      const { user_id, arena_id, total_bookings, booking_slots } = session.metadata || {};

      if (!user_id || !arena_id || !booking_slots) {
        console.error("❌ Missing metadata in session");
        return NextResponse.json({ error: "Missing required metadata" }, { status: 400 });
      }

      try {
        const parsedSlots = JSON.parse(booking_slots);

        // Idempotency check: see if booking already exists
        const existingBookingsSnap = await adminDb
          .collection("bookings")
          .where("stripeSessionId", "==", session.id)
          .get();

        if (!existingBookingsSnap.empty) {
          console.log("✅ Booking already exists, skipping...");
          return NextResponse.json({ received: true, status: "duplicate" });
        }

        // Create booking
        const bookingData = {
          userId: user_id,
          arenaId: arena_id,
          totalBookings: Number(total_bookings),
          bookingSlots: parsedSlots,
          paymentIntentId: session.payment_intent,
          amountPaid: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_details?.email || null,
          status: "confirmed",
          stripeSessionId: session.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await adminDb.collection("bookings").add(bookingData);
        console.log("✅ Booking created with ID:", docRef.id);

        // Update arena booked slots
        await updateArenaBookedSlots(arena_id, parsedSlots);

        // Optional: send confirmation email here

      } catch (error) {
        console.error("❌ Error creating booking:", error);
      }
      break;

    case "checkout.session.async_payment_succeeded":
      console.log("✅ Async payment succeeded");
      break;

    case "checkout.session.async_payment_failed":
      console.log("❌ Async payment failed");
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
