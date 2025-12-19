"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/useAuthState";
import { Avatar, Button, Modal, Tag, message } from "antd";
import { EditOutlined, EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined, DollarCircleOutlined, MailOutlined } from "@ant-design/icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import dayjs from "dayjs";
import AddArenaDrawer from "@/components/arenas/AddArena";
import EditArenaDrawer from "@/components/arenas/EditArenaDrawer";
import UploadCard from "@/components/arenas/AddArena/UploadCard";
import dynamic from 'next/dynamic';

// Dynamically import Map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

import "leaflet/dist/leaflet.css";
import AppSidebar from "@/components/layout/AppSidebar";
import { useMyArenas } from "@/hooks/useMyArena";
import { updateUser } from "@/actions/user";

// Interface for Booking
interface Booking {
  id: string;
  arena_id: string;
  start_time: string;
  end_time: string;
  status: string;
  total_booking_hours: number;
  amount: number;
  currency: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuthState();
  const { userInfo, loading: userLoading } = useCurrentUser(user);
  const { arenas, loading: arenasLoading } = useMyArenas(user?.uid);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileImageTemp, setProfileImageTemp] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);

  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editArenaId, setEditArenaId] = useState<string | null>(null);

  const openEditDrawer = (id: string) => {
    setEditArenaId(id);
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

  useEffect(() => {
    async function fetchBookings() {
      if (user?.uid) {
        try {
          const res = await fetch(`/api/bookings/user?userId=${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setBookings(data.bookings || []);
          }
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setBookingsLoading(false);
        }
      }
    }
    fetchBookings();
  }, [user, loading]);

  const handleUpdateProfile = async () => {
    if (!profileImageTemp || !user?.uid) return;

    try {
      setSavingProfile(true);
      await updateUser(user.uid, { photoURL: profileImageTemp });
      message.success("Profile updated successfully!");
      setIsProfileModalOpen(false);
      setProfileImageTemp("");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };


  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e13] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0e13] text-white font-sans">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your profile, bookings, and arenas.</p>
          </div>
        </header>

        <section>
          <div className="bg-[#111620] rounded-2xl p-8 border border-gray-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="relative group/avatar">
                <Avatar
                  size={120}
                  src={userInfo?.photoURL || user?.photoURL}
                  className="border-4 border-[#1f2937] shadow-2xl"
                />
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-105"
                  title="Change Photo"
                >
                  <EditOutlined />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h2 className="text-2xl font-semibold text-white">
                      {userInfo?.name || user?.displayName || "N/A"}
                    </h2>
                    <Tag color={userInfo?.role === "coach" ? "geekblue" : "green"} className="m-0 px-2 py-0.5 rounded-full text-xs font-bold tracking-wider">
                      {userInfo?.role?.toUpperCase() || "USER"}
                    </Tag>
                  </div>
                  <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                    <MailOutlined /> {user?.email}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl bg-[#0a0e13]/50 p-4 rounded-xl border border-gray-800/50">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Member Since</span>
                    <span className="text-gray-300 font-medium">{dayjs(user?.metadata.creationTime).format('MMMM YYYY')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Status</span>
                    <span className="text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarOutlined className="text-blue-500" /> Recent Bookings
            </h2>
          </div>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#111620] rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-gray-500 text-xs font-mono">#{booking.id.slice(-6)}</span>
                    <Tag color={booking.status === "paid" ? "success" : "error"} className="mr-0 rounded-md">
                      {booking.status.toUpperCase()}
                    </Tag>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <CalendarOutlined className="text-gray-500" />
                      <span className="font-medium">{dayjs(booking.start_time).format("MMM D, YYYY")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <ClockCircleOutlined className="text-gray-500" />
                      <span>{dayjs(booking.start_time).format("h:mm A")} ({booking.total_booking_hours}h)</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <DollarCircleOutlined className="text-gray-500" />
                      <span>{booking.amount} {booking.currency.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111620] rounded-xl p-8 border border-gray-800 text-center text-gray-400">
              No bookings found.
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <EnvironmentOutlined className="text-yellow-500" /> My Arenas
            </h2>
            {userInfo?.role === "coach" && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 border-none h-10 px-6 rounded-lg font-medium shadow-lg shadow-blue-900/20"
              >
                Add New Arena
              </Button>
            )}
          </div>

          {userInfo?.role === "coach" ? (
            arenas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {arenas.map((arena) => (
                  <div
                    key={arena.id}
                    className="group bg-[#111620] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="h-48 bg-gray-800 relative w-full overflow-hidden">
                      {arena.cover_image_url ? (
                        <img src={arena.cover_image_url} alt={arena.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (arena.latitude && arena.longitude) ? (
                        // 🗺️ Map Fallback if no image but coordinates exist
                        <div className="w-full h-full relative z-0">
                          <MapContainer
                            center={[arena.latitude, arena.longitude]}
                            zoom={14}
                            zoomControl={false}
                            dragging={false}
                            scrollWheelZoom={false}
                            doubleClickZoom={false}
                            touchZoom={false}
                            style={{ height: '100%', width: '100%', pointerEvents: 'none' }} // Disable interaction
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[arena.latitude, arena.longitude]} />
                          </MapContainer>
                          {/* Overlay to darken map slightly for text readability */}
                          <div className="absolute inset-0 bg-black/20 pointer-events-none z-[1000]"></div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <EnvironmentOutlined className="text-4xl text-gray-700" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#111620] via-transparent to-transparent opacity-90 z-10 pointer-events-none"></div>
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h3 className="text-lg font-bold text-white mb-1 truncate shadow-sm">{arena.name}</h3>
                        <p className="text-gray-300 text-xs flex items-center gap-1 shadow-sm">
                          <EnvironmentOutlined /> {arena.city}, {arena.country}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="space-y-2 mb-4 flex-1">
                        {arena.address && <p className="text-gray-500 text-xs truncate">{arena.address}</p>}
                        {/* 💰 Price Display */}
                        {arena.price_per_hour && (
                          <p className="text-green-400 font-medium text-sm flex items-center gap-1">
                            <DollarCircleOutlined /> {arena.price_per_hour} / hour
                          </p>
                        )}
                        {arena.contact_email && <p className="text-gray-500 text-xs truncate">✉️ {arena.contact_email}</p>}
                      </div>

                      <Button
                        block
                        ghost
                        type="default"
                        className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white hover:border-yellow-500 hover:bg-yellow-500/10 mt-auto"
                        onClick={() => openEditDrawer(arena.id)}
                      >
                        Edit Arena Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111620] rounded-xl p-12 text-center border border-gray-800 border-dashed">
                <EnvironmentOutlined className="text-4xl text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium mb-4">You haven't added any arenas yet.</p>
                <Button type="primary" onClick={() => setOpen(true)}>
                  Create Your First Arena
                </Button>
              </div>
            )
          ) : (
            <div className="bg-[#111620] rounded-xl p-8 border border-gray-800 text-center">
              <p className="text-gray-400">Regular users cannot manage arenas.</p>
              <p className="text-xs text-gray-600 mt-2">Contact support to upgrade to a Coach account.</p>
            </div>
          )}
        </section>

        <AddArenaDrawer open={open} onClose={onClose} />
        <EditArenaDrawer
          open={editOpen}
          onClose={closeEditDrawer}
          arenaId={editArenaId}
          onSuccess={() => { }}
        />

        <Modal
          title="Update Profile Photo"
          open={isProfileModalOpen}
          onCancel={() => setIsProfileModalOpen(false)}
          onOk={handleUpdateProfile}
          confirmLoading={savingProfile}
          okText="Update Photo"
          centered
          className="dark-modal"
          styles={{ body: { padding: '20px 0' } }}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <UploadCard
              title=""
              accept="image/*"
              icon="camera"
              initialImage={profileImageTemp}
              onUpload={(url) => setProfileImageTemp(url)}
            />

            {profileImageTemp && (
              <div className="text-center">
                <p className="text-green-500 text-sm mb-2">Image uploaded successfully!</p>
                <p className="text-gray-500 text-xs">Click "Update Photo" to save changes.</p>
              </div>
            )}
          </div>
        </Modal>
      </main>
    </div>
  );
}
