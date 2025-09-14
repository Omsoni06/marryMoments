"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "sonner"; // Changed from react-hot-toast

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data.user);
      }
    } catch (error) {
      Cookies.remove("token");
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      toast.success("Successfully logged in!"); // Using Sonner

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message); // Using Sonner
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      toast.success("Account created successfully!"); // Using Sonner

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message); // Using Sonner
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      Cookies.remove("token");
      setUser(null);
      toast.success("Logged out successfully"); // Using Sonner
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
