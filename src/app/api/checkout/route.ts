import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { total_bookings, arena_id, user_id, booking_slots } = await req.json();
  const per_hour_price = 1000;
  const total_price = total_bookings * per_hour_price;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Arena Booking",
          },
          unit_amount: total_price,
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: String(user_id),
      arena_id: String(arena_id),
      total_bookings: String(total_bookings),
      booking_slots: JSON.stringify(booking_slots), // Pass any JSON data
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/arenas/${arena_id}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/arenas/${arena_id}?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
