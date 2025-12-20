"use client";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useState } from "react";
import { UserOutlined, MailOutlined, LockOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [role, setRole] = useState<'player' | 'coach' | ''>('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormValues>({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Partial<SignupFormValues>>({});

  const validateName = (name: string): string => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return "Password must contain at least one letter and one number";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof SignupFormValues]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";
    if (name === "name") error = validateName(value);
    if (name === "email") error = validateEmail(value);
    if (name === "password") error = validatePassword(value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      message.error("Please select a role");
      return;
    }

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError
      });
      return;
    }

    setLoading(true);
    setLoadingMessage("Creating your account...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.error || "Signup failed. Please try again.");
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      // Show success for account creation
      message.success("Account created successfully!");
      setLoadingMessage("Logging you in...");

      // Auto-login user after successful signup
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        setLoadingMessage("Redirecting to dashboard...");
        message.success("Welcome! Redirecting to your dashboard...", 2);

        // Small delay to show the redirect message
        setTimeout(() => {
          router.push(`/dashboard/${userCredential.user.uid}`);
        }, 500);
      } catch (loginError: any) {
        console.error("Auto-login error:", loginError);
        message.warning("Account created! Please login with your credentials.");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      message.error("Signup failed. Please check your connection and try again.");
      setLoading(false);
      setLoadingMessage("");
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
              placeholder="Full Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.name}
              className={`w-full pl-10 pr-4 py-3 bg-[#0a0e13] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                }`}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailOutlined className="text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.email}
              className={`w-full pl-10 pr-4 py-3 bg-[#0a0e13] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>
          )}

          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockOutlined className="text-gray-500" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars, 1 letter, 1 number)"
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.password}
              className={`w-full pl-10 pr-4 py-3 bg-[#0a0e13] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                }`}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-400 mb-3">Select Account Type</p>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole("player")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${role === 'player'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-[#0a0e13] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
              >
                <TeamOutlined className="text-xl" />
                <span className="font-medium">Player</span>
              </div>
              <div
                onClick={() => setRole("coach")}
                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${role === 'coach'
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
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                {loadingMessage || 'Processing...'}
              </span>
            ) : 'Sign Up'}
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
