"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { eventAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Camera,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Share2,
  Download,
  Heart,
  MapPin,
  Clock,
  TrendingUp,
  Zap,
  Star,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalPhotos = events.reduce(
    (sum, event) => sum + (event.photoCount || 0),
    0
  );
  const activeEvents = events.filter((e) => e.status === "active").length;
  const totalDownloads = events.reduce(
    (sum, event) => sum + (event.totalDownloads || 0),
    0
  );

  if (loading || loadingEvents) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm md:text-base">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Mobile Responsive */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PhotoShare Pro
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  Photographer Dashboard
                </p>
              </div>
            </div>

            {/* User Menu - Mobile Responsive */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <div className="flex items-center space-x-2 md:space-x-3 bg-white/60 rounded-full px-2 md:px-4 py-1 md:py-2 shadow-sm">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">Photographer</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Section - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your events and share beautiful wedding memories with guests.
          </p>
        </div>

        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs md:text-sm font-medium">
                    Total Events
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {events.length}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="flex items-center mt-2 md:mt-4 text-blue-100">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm">+2 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs md:text-sm font-medium">
                    Active Events
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {activeEvents}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="flex items-center mt-2 md:mt-4 text-green-100">
                <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm">Live now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs md:text-sm font-medium">
                    Total Photos
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {totalPhotos}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Camera className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="flex items-center mt-2 md:mt-4 text-purple-100">
                <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm">Loved by guests</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs md:text-sm font-medium">
                    Downloads
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {totalDownloads || 0}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Download className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="flex items-center mt-2 md:mt-4 text-orange-100">
                <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm">Happy memories</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Search - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <Input
                placeholder="Search events by name or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 md:pl-10 h-10 md:h-12 bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white focus:border-blue-300 text-sm md:text-base"
              />
            </div>
          </div>
          <Link href="/events/create">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-10 md:h-12 px-4 md:px-6 text-sm md:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="hidden sm:inline">Create New Event</span>
              <span className="sm:hidden">Create Event</span>
            </Button>
          </Link>
        </div>

        {/* Events Grid - Mobile Responsive */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Your Events
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Manage and share your wedding photo galleries
            </p>
          </div>

          <div className="p-4 md:p-6">
            {filteredEvents.length === 0 && !searchTerm ? (
              <div className="text-center py-12 md:py-16">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Camera className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Create Your First Event
                </h3>
                <p className="text-gray-600 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                  Start sharing beautiful wedding memories with guests instantly
                </p>
                <Link href="/events/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            ) : filteredEvents.length === 0 && searchTerm ? (
              <div className="text-center py-12 md:py-16">
                <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event._id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group"
                  >
                    <div className="relative">
                      <div className="h-32 md:h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-3 md:top-4 right-3 md:right-4">
                          <Badge
                            className={`${getStatusColor(
                              event.status
                            )} border font-medium text-xs`}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white">
                          <h3 className="font-bold text-lg md:text-xl mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center text-white/80 text-xs md:text-sm">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center mt-2 text-gray-500 text-xs md:text-sm">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            {event.venue}
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2 md:py-3 border-t border-gray-100">
                          <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center">
                              <Camera className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {event.photoCount || 0}
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {event.totalLikes || 0}
                            </div>
                            <div className="flex items-center">
                              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                              {event.totalDownloads || 0}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium">
                              Access Code
                            </p>
                            <p className="text-xs md:text-sm font-mono font-bold text-gray-900">
                              {event.accessCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/events/${event._id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              className="w-full group-hover:border-blue-300 transition-colors text-xs md:text-sm h-8 md:h-10"
                            >
                              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              Manage
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 md:h-10 px-2 md:px-3"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/gallery/${event.accessCode}`
                              );
                            }}
                          >
                            <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
