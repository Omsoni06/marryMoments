"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, Camera, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="relative">
      {/* Profile Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-auto px-3 py-2 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {getInitials(user.name)}
            </span>
          </div>

          {/* User Info - Hidden on mobile */}
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {user.name}
            </span>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              <Camera className="w-3 h-3 mr-1" />
              Photographer
            </Badge>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Content */}
          <Card className="absolute right-0 top-full mt-2 w-64 z-50 border-0 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Badge variant="secondary" className="text-xs">
                  <Camera className="w-3 h-3 mr-1" />
                  Photographer
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs text-green-600 border-green-200"
                >
                  ● Online
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-3"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile Settings
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Account Settings
                </Button>

                <div className="border-t border-gray-100 my-2"></div>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
