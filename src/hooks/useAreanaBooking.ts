import { useState } from "react";
import { useAuthState } from "./useAuthState";
import { message } from "antd";
import { useEffect } from "react";

const useArenaBooking = (arena: any) => {
  const { user, loading: authLoading } = useAuthState();
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  console.log('events', events)
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getConfirmedBookings = async () => {
    if (!arena?.id) return;
    setLoading(true);

    try {
      // Fetch bookings without authentication - everyone can view
      const res = await fetch(`/api/arena?arenaId=${arena.id}`);
      
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to fetch bookings:", err);
        return;
      }
      const data = await res.json();
      setBookings(data.bookings);

      // Fetch user info for bookings
      const userIds = Array.from(new Set(data.bookings.map((b: any) => b.user_id)));
      let userMap: Record<string, string> = {};

      if (userIds.length > 0) {
        try {
          const { collection, query, where, getDocs } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebaseConfig");
          
          const uniqueIds = userIds as string[];
          const chunks = [];
          for (let i = 0; i < uniqueIds.length; i += 10) {
            chunks.push(uniqueIds.slice(i, i + 10));
          }

          for (const chunk of chunks) {
              const q = query(collection(db, "users"), where("uid", "in", chunk));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                  userMap[doc.data().uid] = doc.data().name || "Unknown User";
              });
          }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
      }
      console.log('data', data)
      const calendarEvents = data.bookings.map((b: any) => ({
        title: b.user_name ? `Booked by ${b.user_name}` : "Booked",
        start: new Date(b.start_time),
        end: new Date(b.end_time),
        description: `Booked by ${b.user_name || "User"}`,
        resource: b
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading){
      getConfirmedBookings();
    }
  }, [arena, authLoading]);

  const handlePay = async (slots: any[]) => {
    if (!user) {
      message.error("Please log in to book a slot");
      return;
    }

    if (!slots.length) {
      message.error("Please select at least one time slot");
      return;
    }

    // Check if any selected slot is in the past
    const now = new Date();
    const hasPastSlots = slots.some(slot => new Date(slot.start) < now);
    if (hasPastSlots) {
      message.error("Cannot book slots in the past");
      return;
    }

    setLoading(true);
    try {
      // Sort selected slots to ensure correct start and end times
      const sortedSlots = [...slots].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

      const startTime = sortedSlots[0].start;
      const endTime = sortedSlots[sortedSlots.length - 1].end;
      const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      const token = await user.getIdToken();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          arena_id: arena.id,
          total_booking_hours: totalHours,
          start_time: startTime,
          end_time: endTime,
        }),
      });
   
      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        message.error("Stripe checkout URL not returned");
      }
    } catch (err) {
      message.error("Payment failed. Please try again.");
    }
  };

  return {
    events,
    selectedSlots,
    setSelectedSlots,
    handlePay,
    loading,
    bookings,
  };
};

export default useArenaBooking;
