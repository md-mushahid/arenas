"use client";

import ArenaMap from "@/components/ArenaDetail/ArenaMap";
import ArenaTabs from "@/components/ArenaDetail/ArenaTabs";
import AppSidebar from "@/components/layout/AppSidebar";
import { db } from "@/lib/firebaseConfig";
import { Spin } from "antd";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ArenaDetailPage() {
  const { id: arenaId } = useParams();

  const [arena, setArena] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArena = async () => {
      if (!arenaId || Array.isArray(arenaId)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const arenaRef = doc(db, "arenas", arenaId);
        const arenaSnap = await getDoc(arenaRef);
        if (arenaSnap.exists()) {
          setArena({
            id: arenaSnap.id,
            ...arenaSnap.data(),
          });
        } else {
          alert("Arena not found");
          window.location.href = "/arenas";
        }
      } catch (err: any) {
        console.error("Error fetching arena:", err);
        setArena(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArena();
  }, [arenaId]);

  if (loading) return <Spin />;

  return (
    <div className="flex min-h-screen bg-[#0a0e13] text-white">
      <AppSidebar />

      <main className="flex-1 overflow-x-hidden">
        <ArenaMap />
        <ArenaTabs arena={arena} />
      </main>
    </div>
  );
}
