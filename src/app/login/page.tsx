"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Login successful:", userCredential.user.uid);
      setLoading(false);
      router.push(`/dashboard/${userCredential.user.uid}`);
      
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Login
        </h1>
        <div>
          <Form layout="vertical" onFinish={onFinish}>
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
            ]}
          >
            <Input.Password className="input" placeholder="Password" />
          </Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            block
            className="signup-btn mt-4"
          >
            Login
          </Button>
        </Form>
        </div>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Do not have an account?{" "}
          <a href="/auth/signup" className="text-purple-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}