import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { AppUser } from "@/types/arenasType";

export const saveUser = async (user: AppUser) => {
  console.log("Saving user:", user);
  try {
    await setDoc(doc(db, "users", user.uid), user);
    console.log("User saved successfully!");
    return { success: true };
  } catch (err) {
    console.error("Error saving user:", err);
    return { success: false };
  }
};