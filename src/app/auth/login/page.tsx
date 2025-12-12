"use client";

import { useState } from "react";
import { Input, Button, message } from "antd";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // sending test email
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "mushahidmuhammad724@gmail.com",
        name: "Mushahid",
      }),
    });

    const result = await response.json();
    console.log(result);
    // sending test email
    if (!email || !password) {
      message.error("Email and password required");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      message.success("Login successful!");
    } catch (err: unknown) {
      const error = err as { message?: string };
      message.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
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
