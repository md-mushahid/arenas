"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useAuthState } from "@/hooks/useAuthState";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { message } from "antd";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { user, loading: authLoading } = useAuthState(); // Fixed destructuring
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: ""
  });

  useEffect(()=> {
    if (user && !authLoading) router.push(`/dashboard/${user.uid}`);
  } ,[user, authLoading, router]) // Added proper dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password } = formData;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Login successful:", userCredential.user.uid);
      message.success("Login successful!");
      // Redirect handled by useEffect, but we can also push here for immediate response
      router.push(`/dashboard/${userCredential.user.uid}`);
      
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md bg-[#111620] p-8 relative z-10 animate-fade-in border border-gray-800 rounded-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailOutlined className="text-gray-500" />
            </div>
            <input 
                type="email"
                name="email"
                required
                placeholder="Email Address"
                onChange={handleChange}
                value={formData.email}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0e13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockOutlined className="text-gray-500" />
            </div>
            <input 
                type="password"
                name="password"
                required
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0e13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end mb-6">
              <a href="#" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg rounded-xl transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}