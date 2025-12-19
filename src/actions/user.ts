"use server";

import { adminDb } from "@/lib/firbaseAdminConfig";

export async function updateUser(userId: string, data: any) {
  try {
    if (!userId) throw new Error("User ID is required");

    await adminDb.collection("users").doc(userId).update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user profile");
  }
}
