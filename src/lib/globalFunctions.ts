import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { AppUser } from "@/types/arenasType";

export const getUserByUid = async (uid: string): Promise<AppUser | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("User not found");
      return null;
    }

    return userSnap.data() as AppUser;
  } catch (err) {
    console.error("Error getting user:", err);
    return null;
  }
};
