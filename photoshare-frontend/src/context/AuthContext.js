"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        Cookies.remove("token");
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 });
      setUser(user);

      toast.success(`Welcome back, ${user.name}! 👋`);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, message: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 });
      setUser(user);

      toast.success(`Welcome, ${user.name}! Account created successfully! 🎉`);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, message: error.response?.data?.message };
    }
  };

  // ✅ ADD LOGOUT FUNCTION
  const logout = async () => {
    try {
      // Call backend logout endpoint (optional)
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if backend call fails
    }

    // Clear token and user state
    Cookies.remove("token");
    setUser(null);

    // Success message
    toast.success("Logged out successfully! 👋");

    // Redirect to login page
    window.location.href = "/login";
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout, // ✅ ADD TO CONTEXT VALUE
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
