"use server";

import { adminDb } from "@/lib/firbaseAdminConfig";
import { Timestamp } from "firebase-admin/firestore";

export interface Booking {
  id: string;
  amount: number;
  arena_id: string;
  currency: string;
  end_time: string;
  start_time: string;
  status: string;
  total_booking_hours: number;
  user_id: string;
  [key: string]: any;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    if (!userId) return [];

    const now = new Date().toISOString();
        
    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef
      .where("user_id", "==", userId)
      // .where("start_time", ">", now)
      // .orderBy("start_time", "asc")
      .get();

    if (snapshot.empty) {
      return [];
    }

    const bookings: Booking[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        paidAt: data.paidAt instanceof Timestamp ? data.paidAt.toDate().toISOString() : data.paidAt,
      } as unknown as Booking;
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}
