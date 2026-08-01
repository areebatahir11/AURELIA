"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.service";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("aurelia_token") : null;

        if (!token) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        const res = await authService.getCurrentUser();
        if (!cancelled) {
          setUser(res.data);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("aurelia_token");
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem("aurelia_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const signup = useCallback(async (payload) => {
    const res = await authService.signup(payload);
    localStorage.setItem("aurelia_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aurelia_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}