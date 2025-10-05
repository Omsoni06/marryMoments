"use client";

import { useAuth } from "@/context/AuthContext";
import SimpleLogoutButton from "@/components/ui/SimpleLogoutButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { eventAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Camera,
  Plus,
  Search,
  Eye,
  Share2,
  MapPin,
  Heart,
  Download,
  TrendingUp,
  Users,
  ArrowRight,
  Copy,
  ExternalLink,
  CheckCircle2,
  MoreVertical,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
    setLoadingEvents(false);
  };

  const handleCopyLink = (accessCode, eventId) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/gallery/${accessCode}`
    );
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPhotos = events.reduce(
    (sum, event) => sum + (event.photoCount || 0),
    0
  );
  const activeEvents = events.filter((e) => e.status === "active").length;
  const totalLikes = events.reduce(
    (sum, event) => sum + (event.totalLikes || 0),
    0
  );

  if (loading || loadingEvents) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
            <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Camera className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Premium Header - Roohi Koohi Style */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-[80px]">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  PhotoShare Pro
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Wedding Platform
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/events/create">
                <Button className="h-11 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </Link>
              <SimpleLogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10">
        {/* Hero Section - Sayeed Style */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                Welcome, {user?.name} 👋
              </h2>
              <p className="text-lg text-slate-600">
                Manage your wedding events and share beautiful moments
              </p>
            </div>
            <Link href="/events/create" className="hidden lg:block">
              <Button
                size="lg"
                className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Event
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Premium Stats - Roohi Koohi Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Stat 1 */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="flex items-center space-x-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">+12%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                Total Events
              </p>
              <p className="text-4xl font-bold text-slate-900">
                {events.length}
              </p>
              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-3/4"></div>
              </div>
            </CardContent>
          </Card>

          {/* Stat 2 */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-emerald-600">
                    Live
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                Active Now
              </p>
              <p className="text-4xl font-bold text-slate-900">
                {activeEvents}
              </p>
              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full w-2/3"></div>
              </div>
            </CardContent>
          </Card>

          {/* Stat 3 */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Camera className="w-7 h-7 text-violet-600" />
                </div>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                Total Photos
              </p>
              <p className="text-4xl font-bold text-slate-900">{totalPhotos}</p>
              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full w-4/5"></div>
              </div>
            </CardContent>
          </Card>

          {/* Stat 4 */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Heart className="w-7 h-7 text-rose-600" />
                </div>
                <Download className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                Total Likes
              </p>
              <p className="text-4xl font-bold text-slate-900">{totalLikes}</p>
              <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-600 to-pink-600 rounded-full w-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar - Modern */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-14 bg-white border-0 shadow-lg rounded-2xl text-base focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Events Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Your Events</h3>
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-700 text-sm px-4 py-2 rounded-lg"
            >
              {filteredEvents.length} total
            </Badge>
          </div>

          {filteredEvents.length === 0 && !searchTerm ? (
            // Empty State
            <Card className="border-0 shadow-xl">
              <CardContent className="py-24 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No events yet
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
                  Create your first wedding event to start sharing photos
                </p>
                <Link href="/events/create">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredEvents.length === 0 && searchTerm ? (
            <Card className="border-0 shadow-xl">
              <CardContent className="py-20 text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No events found</p>
              </CardContent>
            </Card>
          ) : (
            // Premium Events Grid
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event._id}
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
                >
                  {/* Event Header - Gradient */}
                  <div className="h-52 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>

                    {/* Status */}
                    <div className="absolute top-5 right-5">
                      <Badge
                        className={`
                        ${event.status === "active" ? "bg-emerald-500" : ""}
                        ${event.status === "upcoming" ? "bg-amber-500" : ""}
                        ${event.status === "completed" ? "bg-slate-500" : ""}
                        text-white text-xs px-3 py-1.5 border-0 shadow-lg backdrop-blur-sm
                      `}
                      >
                        {event.status}
                      </Badge>
                    </div>

                    {/* Event Info */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h3 className="text-2xl font-bold mb-3 line-clamp-1 drop-shadow-lg">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-white/95 text-sm backdrop-blur-sm bg-white/10 px-3 py-2 rounded-lg w-fit">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Venue */}
                    <div className="flex items-start text-sm text-slate-600 mb-6">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-slate-400" />
                      <span className="line-clamp-2 font-medium">
                        {event.venue}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                        <Camera className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
                        <p className="text-xl font-bold text-slate-900">
                          {event.photoCount || 0}
                        </p>
                        <p className="text-xs text-slate-500">Photos</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                        <Heart className="w-5 h-5 text-rose-600 mx-auto mb-1.5" />
                        <p className="text-xl font-bold text-slate-900">
                          {event.totalLikes || 0}
                        </p>
                        <p className="text-xs text-slate-500">Likes</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                        <Users className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
                        <p className="text-base font-mono font-bold text-purple-600">
                          {event.accessCode}
                        </p>
                        <p className="text-xs text-slate-500">Code</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/events/${event._id}`} className="flex-1">
                        <Button className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg">
                          <Eye className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className={`h-11 px-4 rounded-xl border-2 transition-all ${
                          copiedId === event._id
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                            : "hover:bg-slate-50"
                        }`}
                        onClick={() =>
                          handleCopyLink(event.accessCode, event._id)
                        }
                      >
                        {copiedId === event._id ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Link
                        href={`/gallery/${event.accessCode}`}
                        target="_blank"
                      >
                        <Button
                          variant="outline"
                          className="h-11 px-4 rounded-xl border-2 hover:bg-slate-50"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
