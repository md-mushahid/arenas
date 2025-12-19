"use server";

import { adminDb } from "@/lib/firbaseAdminConfig";

export async function getArena(arenaId: string): Promise<any> {
  try {
    if (!arenaId) return null;

    const doc = await adminDb.collection("arenas").doc(arenaId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      // Serialize dates if necessary
    };
  } catch (error) {
    console.error("Error fetching arena:", error);
    throw new Error("Failed to fetch arena details");
  }
}

export async function updateArena(arenaId: string, data: any) {
  try {
    if (!arenaId) throw new Error("Arena ID is required");

    await adminDb.collection("arenas").doc(arenaId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating arena:", error);
    throw new Error("Failed to update arena");
  }
}
