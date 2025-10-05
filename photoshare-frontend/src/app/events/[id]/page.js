"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventAPI, photoAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/ui/UserProfileDropdown";
import QRCodeGenerator from "@/components/ui/QRCodeGenerator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Users,
  Camera,
  Download,
  Heart,
  ArrowLeft,
  Share2,
  Copy,
  Eye,
  Upload,
  BarChart3,
  Settings,
  QrCode,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Globe,
  Trash2, // ✅ ADD THIS
  ZoomIn,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import PhotoUpload from "@/components/forms/PhotoUpload";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
    activeGuests: 0,
  });
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    if (params.id) {
      fetchEvent();
      fetchPhotos();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getById(params.id);
      setEvent(response.data.event);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to load event details");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const fetchPhotos = async () => {
    setPhotosLoading(true);
    try {
      const response = await photoAPI.getByEvent(params.id);
      setPhotos(response.data.photos || []);

      // Calculate stats from photos
      const totalLikes =
        response.data.photos?.reduce(
          (sum, photo) => sum + (photo.likes || 0),
          0
        ) || 0;
      const totalDownloads =
        response.data.photos?.reduce(
          (sum, photo) => sum + (photo.downloads || 0),
          0
        ) || 0;

      setStats((prev) => ({
        ...prev,
        totalLikes,
        totalDownloads,
        totalViews: Math.floor(Math.random() * 500) + 100, // Mock data
        activeGuests: Math.floor(Math.random() * 20) + 5, // Mock data
      }));
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
    setPhotosLoading(false);
  };

  const handleDeletePhoto = async (photoId) => {
    if (deleteLoading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this photo? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleteLoading(true);

    try {
      await photoAPI.delete(photoId);

      // Remove from local state
      setPhotos((prev) => prev.filter((p) => p._id !== photoId));

      toast.success("Photo deleted successfully! 🗑️");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete photo. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleUploadComplete = () => {
    fetchPhotos();
    fetchEvent();
    setActiveTab("photos");
  };

  const copyAccessCode = () => {
    navigator.clipboard.writeText(event.accessCode);
    toast.success("Access code copied! 📋");
  };

  const copyGalleryLink = () => {
    const galleryLink = `${window.location.origin}/gallery/${event.accessCode}`;
    navigator.clipboard.writeText(galleryLink);
    toast.success("Gallery link copied! 🔗");
  };

  const shareViaWhatsApp = () => {
    const galleryLink = `${window.location.origin}/gallery/${event.accessCode}`;
    const message = `🎉 ${event.title}\n\n📸 View and download photos from our celebration!\n\n🔗 ${galleryLink}\n📱 Access Code: ${event.accessCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">
              Event Not Found
            </CardTitle>
            <CardDescription>
              The event you're looking for doesn't exist or you don't have
              access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                  {event.title}
                </h1>
                <p className="text-sm text-gray-500">Event Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge
                variant={event.status === "active" ? "default" : "secondary"}
                className={`${
                  event.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                } border font-medium`}
              >
                {event.status === "active" ? (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Live
                  </>
                ) : (
                  event.status
                )}
              </Badge>

              <Button variant="outline" size="sm" onClick={shareViaWhatsApp}>
                <Share2 className="w-4 h-4" />
              </Button>

              {/* ✅ ADD USER PROFILE DROPDOWN */}
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Header Card */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                  {event.description && (
                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-blue-100">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-100">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-blue-100">
                      <Camera className="w-5 h-5 mr-2" />
                      <span>{photos.length} Photos</span>
                    </div>
                    <div className="flex items-center text-blue-100">
                      <Users className="w-5 h-5 mr-2" />
                      <span>{stats.activeGuests} Active Guests</span>
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <div className="mb-4">
                      <p className="text-blue-100 text-sm font-medium">
                        Access Code
                      </p>
                      <div className="text-4xl font-bold font-mono tracking-wider">
                        {event.accessCode}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={copyAccessCode}
                        className="bg-white/90 text-blue-600 hover:bg-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={copyGalleryLink}
                        className="bg-white/90 text-blue-600 hover:bg-white"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalViews}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12% today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalLikes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  +{Math.floor(Math.random() * 10) + 1} today
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalDownloads}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  +{Math.floor(Math.random() * 5) + 1} today
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Guests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeGuests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-green-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Online now</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg font-medium"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="photos" className="rounded-lg font-medium">
                  <Camera className="w-4 h-4 mr-2" />
                  Photos ({photos.length})
                </TabsTrigger>
                <TabsTrigger value="upload" className="rounded-lg font-medium">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="share" className="rounded-lg font-medium">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab - Enhanced */}
            <TabsContent value="overview" className="p-6 space-y-8">
              {/* Activity Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-blue-900">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Activity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700">Photos Uploaded</span>
                        </div>
                        <span className="font-bold text-xl text-blue-600">
                          {photos.length}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700">
                            Total Engagement
                          </span>
                        </div>
                        <span className="font-bold text-xl text-purple-600">
                          {stats.totalLikes + stats.totalDownloads}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700">Gallery Views</span>
                        </div>
                        <span className="font-bold text-xl text-green-600">
                          {stats.totalViews}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700">Expires In</span>
                        </div>
                        <span className="font-bold text-xl text-orange-600">
                          {Math.floor(
                            (new Date(event.expiresAt) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-purple-900">
                      <Star className="w-5 h-5 mr-2" />
                      Top Performing Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {photos.length > 0 ? (
                      <div className="space-y-3">
                        {photos.slice(0, 3).map((photo, index) => (
                          <div
                            key={photo._id}
                            className="flex items-center space-x-3 p-3 bg-white bg-opacity-60 rounded-lg hover:bg-opacity-80 transition-all"
                          >
                            <div className="relative">
                              <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden shadow-md">
                                <img
                                  src={photo.thumbnailUrl}
                                  alt={photo.originalName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate text-gray-900">
                                {photo.originalName}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1 text-red-500" />
                                  {photo.likes || 0}
                                </span>
                                <span className="flex items-center">
                                  <Download className="w-3 h-3 mr-1 text-blue-500" />
                                  {photo.downloads || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Camera className="w-8 h-8 text-purple-500" />
                        </div>
                        <p className="text-purple-700 font-medium">
                          No photos uploaded yet
                        </p>
                        <p className="text-purple-600 text-sm mt-1">
                          Upload photos to see performance metrics
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-green-900">
                      <Users className="w-5 h-5 mr-2" />
                      Guest Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-white bg-opacity-60 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {stats.activeGuests}
                        </div>
                        <div className="text-sm text-green-700 font-medium">
                          Active Guests
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Currently online
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-white bg-opacity-60 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {stats.totalViews}
                          </div>
                          <div className="text-xs text-gray-600">
                            Total Views
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white bg-opacity-60 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {Math.floor(stats.totalViews * 0.7)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Unique Visitors
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Engagement Rate</span>
                          <span className="font-semibold text-green-600">
                            {photos.length > 0
                              ? Math.round(
                                  ((stats.totalLikes + stats.totalDownloads) /
                                    photos.length) *
                                    10
                                ) / 10
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                photos.length > 0
                                  ? Math.min(
                                      ((stats.totalLikes +
                                        stats.totalDownloads) /
                                        photos.length) *
                                        10,
                                      100
                                    )
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Manage your event with one-click actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("upload")}
                      className="h-24 flex-col space-y-2 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium">Upload Photos</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={shareViaWhatsApp}
                      className="h-24 flex-col space-y-2 border-2 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium">Share WhatsApp</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={copyGalleryLink}
                      className="h-24 flex-col space-y-2 border-2 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium">Copy Gallery Link</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("share")}
                      className="h-24 flex-col space-y-2 border-2 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <QrCode className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium">Generate QR</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Timeline */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates from your event gallery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {photos.length > 0 ? (
                      <>
                        <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Photos uploaded
                            </p>
                            <p className="text-xs text-gray-600">
                              Added {photos.length} new photos to gallery
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 bg-green-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Gallery views increasing
                            </p>
                            <p className="text-xs text-gray-600">
                              +{Math.floor(Math.random() * 20) + 5} views in
                              last hour
                            </p>
                            <p className="text-xs text-gray-500">Just now</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 bg-purple-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Photos getting likes
                            </p>
                            <p className="text-xs text-gray-600">
                              Total {stats.totalLikes} likes from guests
                            </p>
                            <p className="text-xs text-gray-500">Ongoing</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No activity yet
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Activity will appear here once guests start viewing
                          photos
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Photos Tab - Enhanced */}
            <TabsContent value="photos" className="p-6">
              {photosLoading ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              ) : photos.length > 0 ? (
                <div className="space-y-6">
                  {/* Photos Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Event Photos
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {photos.length} photo{photos.length !== 1 ? "s" : ""} •{" "}
                        {stats.totalLikes} like
                        {stats.totalLikes !== 1 ? "s" : ""} •{" "}
                        {stats.totalDownloads} download
                        {stats.totalDownloads !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("upload")}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add More Photos
                      </Button>
                      <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Sort by newest</option>
                        <option>Sort by oldest</option>
                        <option>Sort by most liked</option>
                        <option>Sort by most downloaded</option>
                      </select>
                    </div>
                  </div>

                  {/* Photos Grid */}
                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {photos.map((photo, index) => (
                      <Card
                        key={photo._id}
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg"
                      >
                        <div className="aspect-square relative">
                          <img
                            src={photo.thumbnailUrl}
                            alt={photo.originalName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Photo Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <div className="flex justify-between items-end">
                                <div className="flex space-x-2">
                                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-sm">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {photo.likes || 0}
                                  </Badge>
                                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-sm">
                                    <Download className="w-3 h-3 mr-1" />
                                    {photo.downloads || 0}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ✅ Action Buttons - UPDATED WITH DELETE */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
                            {/* View Button */}
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(photo.cloudinaryUrl, "_blank")
                              }
                              className="bg-white bg-opacity-90 text-blue-600 hover:bg-white shadow-lg backdrop-blur-sm p-2"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </Button>

                            {/* Download Button */}
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(photo.cloudinaryUrl, "_blank")
                              }
                              className="bg-white bg-opacity-90 text-green-600 hover:bg-white shadow-lg backdrop-blur-sm p-2"
                            >
                              <Download className="w-4 h-4" />
                            </Button>

                            {/* ✅ DELETE BUTTON - NEW */}
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePhoto(photo._id);
                              }}
                              disabled={deleteLoading}
                              className="bg-white bg-opacity-90 text-red-600 hover:bg-red-50 shadow-lg backdrop-blur-sm p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Photo Number Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-black bg-opacity-50 text-white border-0">
                              #{index + 1}
                            </Badge>
                          </div>

                          {/* ✅ Show AI Tags if available */}
                          {photo.tags && photo.tags.length > 0 && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-blue-600 bg-opacity-90 text-white text-xs px-2 py-1 border-0">
                                🏷️ {photo.tags[0].category}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Photo Info */}
                        <CardContent className="p-4">
                          <p className="text-sm font-medium truncate text-gray-900">
                            {photo.originalName}
                          </p>
                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>
                              Uploaded{" "}
                              {new Date(photo.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {photo.likes || 0}
                              </span>
                              <span className="flex items-center">
                                <Download className="w-3 h-3 mr-1" />
                                {photo.downloads || 0}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {photos.length >= 12 && (
                    <div className="text-center pt-6">
                      <Button variant="outline" className="px-8">
                        Load More Photos
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    No Photos Yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    Start uploading beautiful wedding photos to share with your
                    guests instantly
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => setActiveTab("upload")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Your First Photos
                    </Button>
                    <div className="text-sm text-gray-500">
                      <p>
                        💡 <strong>Tip:</strong> Upload photos during the event
                        for real-time sharing
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Upload Tab - Enhanced */}
            <TabsContent value="upload" className="p-6">
              <div className="space-y-8">
                {/* Upload Header */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Upload Event Photos
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Share beautiful memories with your guests instantly. Photos
                    will be available for viewing and downloading as soon as
                    they're uploaded.
                  </p>
                </div>

                {/* Upload Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {photos.length}
                      </div>
                      <div className="text-sm text-blue-700">
                        Photos Uploaded
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.activeGuests}
                      </div>
                      <div className="text-sm text-green-700">
                        Active Viewers
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.totalDownloads}
                      </div>
                      <div className="text-sm text-purple-700">
                        Total Downloads
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* MAIN CHANGE: Fixed Upload Complete Handler */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Upload Photos</h3>
                  <PhotoUpload
                    eventId={event?._id}
                    onUploadComplete={handleUploadComplete}
                  />
                </div>

                {/* Upload Tips */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-3">
                          Pro Tips for Better Photos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              <span>
                                Upload high-resolution images (at least 1080p)
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              <span>
                                Use meaningful file names for easy recognition
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              <span>
                                Upload photos during events for instant sharing
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              <span>
                                Photos are automatically optimized for web
                                viewing
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              <span>
                                Guests can download original quality images
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                              <span>Maximum 10 files per upload session</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Uploads Preview */}
                {photos.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Recently Uploaded Photos
                      </CardTitle>
                      <CardDescription>
                        Your latest photo uploads
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {photos.slice(0, 6).map((photo) => (
                          <div
                            key={photo._id}
                            className="aspect-square relative group"
                          >
                            <img
                              src={photo.thumbnailUrl}
                              alt={photo.originalName}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                      {photos.length > 6 && (
                        <div className="text-center mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab("photos")}
                          >
                            View All {photos.length} Photos
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Share Tab */}
            {/* Share Tab */}
            <TabsContent value="share" className="p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Share Your Event Gallery
                  </h3>
                  <p className="text-gray-600">
                    Let guests access photos instantly with QR codes
                  </p>
                </div>

                {/* Enhanced QR Code Generator */}
                <QRCodeGenerator
                  eventTitle={event.title}
                  accessCode={event.accessCode}
                  venue={event.venue}
                  onViewGallery={() =>
                    window.open(`/gallery/${event.accessCode}`, "_blank")
                  }
                />

                {/* Additional sharing options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle>WhatsApp Share</CardTitle>
                      <CardDescription>
                        Send QR code and gallery link via WhatsApp
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        onClick={shareViaWhatsApp}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Share on WhatsApp
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle>Preview Gallery</CardTitle>
                      <CardDescription>
                        See what guests will see
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        onClick={() =>
                          window.open(`/gallery/${event.accessCode}`, "_blank")
                        }
                        variant="outline"
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Guest View
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
