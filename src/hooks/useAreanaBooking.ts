import { useState } from "react";
import { useAuthState } from "./useAuthState";

const useArenaBooking = () => {
  const { user } = useAuthState();
  const [events, setEvents] = useState([
    {
      title: "Booked",
      start: new Date("2025-12-25T10:00:00.000Z"),
      end: new Date("2025-12-25T12:00:00.000Z"),
      description: "Booked by Team A",
    },
    {
      title: "Team Meeting",
      start: new Date("2025-12-25T13:00:00.000Z"),
      end: new Date("2025-12-25T14:00:00.000Z"),
      description: "Coach briefing",
    },
  ]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const formatBookingData = (booking: { start: Date; end: Date }[]) => {
    const formattedBooking = booking.map((slot, idx) => {
      const data = {
        title: "Booked",
        start: slot.start,
        end: slot.end,
        description: `Booked slot ${idx + 1}`,
      };
      return data;
    });
    return formattedBooking;
  };

  const handlePay = async (payload: any, arenaId: any) => {
  const formattedBooking = formatBookingData(payload);
  setEvents([...events, ...formattedBooking]);
  setSelectedSlots([]);

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      total_bookings: formattedBooking.length,
      arena_id: arenaId,
      user_id: user?.uid,
    }),
  });
  const data = await res.json();
  console.log("Payment response:", data);

  // Redirect to Stripe checkout
  if (data.url) {
    window.location.href = data.url;
  } else {
    console.error("Stripe checkout URL not returned");
  }
};

  return { events, setEvents, selectedSlots, setSelectedSlots, handlePay };
};

export default useArenaBooking;
