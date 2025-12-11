"use client";

import { useState } from "react";
import { Input, Button, message } from "antd";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { sendBookingConfirmation } from "@/lib/email";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  try {
    // Call YOUR API route (not Resend directly)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'mushahidmuhammad724@gmail.com',
        facility: '11v11 Pitch',
        date: 'Dec 15, 2024',
        time: '2:00 PM',
        hours: 2
      })
    });

    const result = await response.json();

    if (result.success) {
      alert('✅ Email sent successfully!');
      console.log('Email sent:', result);
    } else {
      alert('❌ Failed to send email');
      console.error('Error:', result.error);
    }
    
  } catch (error) {
    console.error('Request failed:', error);
    alert('❌ Something went wrong');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e13] px-4">
      <div className="w-full max-w-md bg-[#1a1f2b] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Login
        </h1>

        <div className="space-y-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="dark-input"
          />
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="dark-input"
          />
        </div>

        <Button
          type="primary"
          block
          className="mt-6 book-button"
          onClick={handleLogin}
          loading={loading}
        >
          Login
        </Button>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Do not have an account?{" "}
          <Link href="/auth/signup" className="text-purple-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
