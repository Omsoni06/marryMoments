"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Camera } from "lucide-react";

export default function SimpleLogoutButton() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await logout();
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {getInitials(user.name)}
          </span>
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium text-gray-900">{user.name}</span>
          <Badge variant="secondary" className="text-xs px-2 py-0 w-fit">
            <Camera className="w-3 h-3 mr-1" />
            Photographer
          </Badge>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        <LogOut className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
}
