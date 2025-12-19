"use client";
import { useRouter } from "next/navigation";
import { message } from "antd"; // Keeping message for notifications as it's useful and doesn't conflict layout
import { useState } from "react";
import { UserOutlined, MailOutlined, LockOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [role, setRole] = useState<'player' | 'coach' | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormValues>({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      message.error("Please select a role");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      message.success("Signup successful! Check your email. Redirecting to login...");
      setRole("");
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      message.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md bg-[#111620] p-8 relative z-10 animate-fade-in border border-gray-800 rounded-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join the arena community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserOutlined className="text-gray-500" />
            </div>
            <input 
                type="text"
                name="name"
                required
                placeholder="Full Name"
                onChange={handleChange}
                value={formData.name}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0e13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

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

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockOutlined className="text-gray-500" />
            </div>
            <input 
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0e13] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-400 mb-3">Select Account Type</p>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setRole("player")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    role === 'player' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-[#0a0e13] border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <TeamOutlined className="text-xl" />
                <span className="font-medium">Player</span>
              </div>
              <div 
                onClick={() => setRole("coach")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    role === 'coach' 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                    : 'bg-[#0a0e13] border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                <TrophyOutlined className="text-xl" />
                <span className="font-medium">Coach</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !role}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg rounded-xl transition-colors ${loading || !role ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
