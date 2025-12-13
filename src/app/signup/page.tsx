"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { saveUser } from "@/lib/firestore";
import { AppUser } from "@/types/arenasType";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [role, setRole] = useState<'player' | 'coach' | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFinish = async (values: SignupFormValues) => {
    if (!role) {
      message.error("Please select a role");
      return;
    }
    setLoading(true);
    try {
      const { name, email, password } = values;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const newUser: AppUser = {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      await saveUser(newUser);
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          mail_type: "welcome",
        }),
      });
      message.success("Signup successful! Redirecting to login...");
      setRole("");
      setLoading(false);
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Sign Up
        </h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span className="text-gray-300">Full Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input className="input" placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            label={<span className="text-gray-300">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input className="input" placeholder="Email" />
          </Form.Item>
          <Form.Item
            label={<span className="text-gray-300">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password className="input" placeholder="Password" />
          </Form.Item>
          <div className="mt-2 mb-4">
            <p className="text-sm text-gray-300 mb-1">Select Role</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="default"
                onClick={() => setRole("player")}
                className={`role-btn ${role === "player" ? "selected" : ""}`}
              >
                Player
              </Button>
              <Button
                type="default"
                onClick={() => setRole("coach")}
                className={`role-btn ${role === "coach" ? "selected" : ""}`}
              >
                Coach
              </Button>
            </div>
          </div>
          <Button
            loading={loading}
            htmlType="submit"
            block
            className="signup-btn mt-4"
            disabled={!role}
          >
            Sign Up
          </Button>
        </Form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-purple-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
