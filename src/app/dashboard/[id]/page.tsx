"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Button, Spin } from "antd";
import { useAuthState } from "@/hooks/useAuthState";
import { useEffect } from "react";
import { userStore } from "@/lib/userStore";

export default function DashboardPage() {
  const { user, loading } = useAuthState();
  console.log('user', user)
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading])

  const handleLogout = async () => {
    try {
      await signOut(auth);
      userStore.clear();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-gray-300 mb-2">Welcome back!</p>
          <p className="text-gray-400 mb-6">Email: {user?.email}</p>
          
          <Button onClick={handleLogout} danger>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}