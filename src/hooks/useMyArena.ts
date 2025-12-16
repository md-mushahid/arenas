"use client";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useEffect, useState } from "react";

export const useMyArenas = (userId?: string) => {
  const [arenas, setArenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchArenas = async () => {
      try {
        const q = query(
          collection(db, "arenas"),
          where("uid", "==", userId)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArenas(data);
      } catch (error) {
        console.error("Failed to fetch arenas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArenas();
  }, [userId]);

  return { arenas, loading };
};
