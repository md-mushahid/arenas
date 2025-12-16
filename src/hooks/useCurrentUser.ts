"use client";

import { useEffect, useState } from "react";
import { userStore, AppUser } from "@/lib/userStore";

export const useCurrentUser = (user: any) => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<AppUser | null>(userStore.get());

  const getUserInfo = async () => {
     if (!user) {
      userStore.clear();
      setUserInfo(null);
      setLoading(false);
      return;
    }
    const stored = userStore.get();
    if (stored) {
      setUserInfo(stored);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/user/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid }),
    });
    const data = await res.json();
    if (data.user) {
      userStore.set(data.user);
      setUserInfo(data.user);
    }
    setLoading(false);
  };

  useEffect(() => {
   getUserInfo();
  }, [user, loading]);

  return { userInfo, loading };
};
