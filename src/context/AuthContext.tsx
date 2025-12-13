// src/context/AuthContext.tsx
"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAuthState } from "@/hooks/useAuthState"; // the hook above


const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthState();
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
