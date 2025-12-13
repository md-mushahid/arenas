import { useState } from "react";

const useArenaBooking = () => {
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
  const handleBooking = (booking: { start: Date; end: Date }[]) => {
    const formattedBooking = formatBookingData(booking);
    setEvents([...events,...formattedBooking]);
    setSelectedSlots([])
    console.log("Formatted Booking:", formattedBooking);
  };
  return { handleBooking, events, setEvents, selectedSlots, setSelectedSlots };
};

export default useArenaBooking;
