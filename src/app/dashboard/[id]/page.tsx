"use client";

import AddArenaDrawer from "@/components/arenas/AddArena";
import AppSidebar from "@/components/layout/AppSidebar";
import { useAuthState } from "@/hooks/useAuthState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyArenas } from "@/hooks/useMyArena";
import { Button, Card, Spin, Tag, Avatar, Descriptions } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuthState();
  const { userInfo, loading: userLoading } = useCurrentUser(user);
  const { arenas, loading: arenasLoading } = useMyArenas(user?.uid);
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#0a0e13] text-white">
      <AppSidebar />
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <Card className="mb-6" title="Profile Information">
          <div className="flex items-start gap-6">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              src={user?.photoURL}
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
                <Descriptions.Item label="Name">
                  {userInfo?.name || user?.displayName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={userInfo?.role === "coach" ? "blue" : "green"}>
                    {userInfo?.role?.toUpperCase() || "USER"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                  {user?.email || "N/A"}
                </Descriptions.Item>
              </Descriptions>
              <Button
                type="link"
                className="mt-2 px-0"
                onClick={() => router.push("/dashboard/profile/edit")}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My Arenas</h2>
          {userInfo?.role === "coach" && (
            <Button type="primary" onClick={() => setOpen(true)}>
              Add Arena
            </Button>
          )}
        </div>
        {userInfo?.role === "coach" ? (
          arenas.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {arenas.map((arena) => (
                <Card
                  key={arena.id}
                  hoverable
                  className="flex flex-col justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold mb-2">{arena.name}</p>
                    <p className="text-gray-500 text-sm mb-1">
                      📍 {arena.city}, {arena.country}
                    </p>
                    {arena.address && (
                      <p className="text-gray-400 text-xs">{arena.address}</p>
                    )}
                    {arena.contact_email && (
                      <p className="text-gray-400 text-xs mt-2">
                        ✉️ {arena.contact_email}
                      </p>
                    )}
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() =>
                      router.push(`/dashboard/arena/${arena.id}/edit`)
                    }
                  >
                    Edit Arena
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center">
              <p className="text-gray-500 mb-3">
                You haven't created any arena yet.
              </p>
              <Button type="primary" onClick={() => setOpen(true)}>
                Create Your First Arena
              </Button>
            </Card>
          )
        ) : (
          <Card className="text-center">
            <p className="text-gray-500">You are logged in as a regular user.</p>
            <p className="text-gray-400 text-sm mt-1">
              Only coaches can create and manage arenas.
            </p>
          </Card>
        )}
        <AddArenaDrawer open={open} onClose={onClose} />
      </main>
    </div>
  );
}
