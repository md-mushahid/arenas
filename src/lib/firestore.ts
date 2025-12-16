import admin from "firebase-admin"; // Added import for FieldValue
import { AppUser } from "@/types/arenasType";
import { adminDb } from "./firbaseAdminConfig";

export const saveUser = async (user: AppUser) => {
  console.log("Saving user (Admin SDK):", user);
  try {
    // Admin SDK: collection().doc().set()
    await adminDb.collection("users").doc(user.user_id).set({
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ User saved successfully!");
    return { success: true };
  } catch (err) {
    console.error("❌ Error saving user:", err);
    return { success: false, error: err };
  }
};