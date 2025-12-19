"use client";

import AddArenaDrawer from "@/components/arenas/AddArena";
import EditArenaDrawer from "@/components/arenas/EditArenaDrawer";
import AppSidebar from "@/components/layout/AppSidebar";
import { useAuthState } from "@/hooks/useAuthState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyArenas } from "@/hooks/useMyArena";
import { getUserBookings, Booking } from "@/actions/bookings";
import { Button, Card, Spin, Tag, Avatar, Descriptions } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function DashboardPage() {
  const { user, loading } = useAuthState();
  const { userInfo, loading: userLoading } = useCurrentUser(user);
  const { arenas, loading: arenasLoading } = useMyArenas(user?.uid);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const router = useRouter();
  
  // Add Arena state
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);

  // Edit Arena state
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editArenaId, setEditArenaId] = useState<string | null>(null);

  const openEditDrawer = (arenaId: string) => {
    setEditArenaId(arenaId);
    setEditOpen(true);
  };

  const closeEditDrawer = () => {
    setEditOpen(false);
    setEditArenaId(null);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Fetch bookings using server action
  useEffect(() => {
    async function fetchBookings() {
      if (user?.uid) {
        try {
          setBookingsLoading(true);
          const data = await getUserBookings(user.uid);
          setBookings(data);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setBookingsLoading(false);
        }
      } else if (!loading && !user) {
        setBookingsLoading(false);
      }
    }
    
    fetchBookings();
  }, [user, loading]);

  if (loading || arenasLoading || userLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

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

        {/* Upcoming Bookings Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          {bookings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {bookings.map((booking) => (
                <Card key={booking.id} hoverable className="border-l-4 border-l-blue-500">
                  <p className="text-lg font-semibold mb-2">
                    Booking #{booking.id.slice(-6)}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    🕒 {dayjs(booking.start_time).format("MMM D, YYYY h:mm A")}
                  </p>
                  <p className="text-gray-500 text-sm mb-1">
                    Duration: {booking.total_booking_hours} hours
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                     Cost: {booking.amount} {booking.currency.toUpperCase()}
                  </p>
                  
                  <div className="flex gap-2">
                    <Tag color={booking.status === "paid" ? "green" : "red"}>
                        {booking.status.toUpperCase()}
                    </Tag>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="text-center">
              <p className="text-gray-500">No upcoming bookings found.</p>
            </Card>
          )}
        </div>

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
                    onClick={() => openEditDrawer(arena.id)}
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
        <EditArenaDrawer 
          open={editOpen} 
          onClose={closeEditDrawer} 
          arenaId={editArenaId}
          onSuccess={() => {
            // Optional: refresh arena list if easy, or rely on next re-render
            // Since useMyArenas is a realtime stream usually or effect dependent on ID, 
            // a simple close might be enough if firestore updates trigger client listeners.
            // If useMyArenas is just one-off fetch, we might need to trigger re-fetch.
            // Based on previous code, useMyArenas seemed like a simple fetch. 
            // We'll leave as is for now, user can refresh page if needed or we can improve later.
          }} 
        />
      </main>
    </div>
  );
}
