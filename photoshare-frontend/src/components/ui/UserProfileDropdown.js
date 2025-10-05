"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  LogOut,
  Camera,
  ChevronDown,
  UserCircle,
} from "lucide-react";

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  // Get user initials
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        className="h-10 px-3 hover:bg-slate-100 rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <span className="hidden md:inline text-sm font-medium text-slate-700">
            {user.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-72 border-0 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>

            <div className="relative flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                {initials}
              </div>
              <div>
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
            </div>

            <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
              <Camera className="w-3 h-3 mr-1" />
              Photographer
            </Badge>
          </div>

          {/* Access Code Section */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Your Access Code</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-mono font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HQ1XDUMM
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  navigator.clipboard.writeText("HQ1XDUMM");
                  // You can add toast notification here
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 hover:bg-slate-100 text-slate-700"
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
            >
              <UserCircle className="w-5 h-5 mr-3 text-indigo-600" />
              Profile Settings
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-12 hover:bg-slate-100 text-slate-700"
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
            >
              <Settings className="w-5 h-5 mr-3 text-indigo-600" />
              Account Settings
            </Button>
          </div>

          {/* Logout Button */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log out
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
