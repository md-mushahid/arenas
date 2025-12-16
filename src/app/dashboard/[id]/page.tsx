"use client";

import AddArenaDrawer from "@/components/arenas/AddArena";
import { useAuthState } from "@/hooks/useAuthState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyArenas } from "@/hooks/useMyArena";
import { Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading, handleLogout } = useAuthState();
  const { userInfo, loading: userLoading } = useCurrentUser(user);
  const { arenas, loading: arenasLoading } = useMyArenas(user?.uid);
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || arenasLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  console.log('isCoach', arenas);
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {userInfo?.role == "coach" && (
          <Button
            type="primary"
            onClick={() => setOpen(true)}
          >
            Add Arena
          </Button>
        )}
      </div>

      {userInfo?.role == "coach" ? (
        arenas.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {arenas.map((arena) => (
              <div
                key={arena.id}
                className="border rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {arena.arenaName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {arena.city}
                  </p>
                </div>

                <Button
                  className="mt-4"
                  onClick={() =>
                    router.push(
                      `/dashboard/arena/${arena.id}/edit`
                    )
                  }
                >
                  Edit Arena
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-3">
              You haven’t created any arena yet.
            </p>
            <Button
              type="primary"
              onClick={() => router.push("/dashboard/arena/create")}
            >
              Create Your First Arena
            </Button>
          </div>
        )
      ) : (
        <div className="border border-dashed rounded-lg p-6 text-center">
          <p className="text-gray-500">
            You are logged in as a regular user.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Only coaches can create and manage arenas.
          </p>
        </div>
      )}

      {/* ===== LOGOUT ===== */}
      <Button danger className="mt-10" onClick={handleLogout}>
        Logout
      </Button>
      <AddArenaDrawer open={open} onClose={onClose} />
    </div>
  );
}
