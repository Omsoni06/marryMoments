"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventAPI, photoAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import UserProfileDropdown from "@/components/ui/UserProfileDropdown";
import QRCodeGenerator from "@/components/ui/QRCodeGenerator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Camera,
  Download,
  Heart,
  ArrowLeft,
  Share2,
  Eye,
  Upload,
  QrCode,
  Trash2,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  BarChart3,
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
  const [activeTab, setActiveTab] = useState("overview");

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
      toast.error("Failed to load event");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const fetchPhotos = async () => {
    try {
      const response = await photoAPI.getByEvent(params.id);
      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error("Failed to fetch photos");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await photoAPI.delete(photoId);
      setPhotos(photos.filter((p) => p._id !== photoId));
      toast.success("Photo deleted!");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleUploadComplete = () => {
    fetchPhotos();
    fetchEvent();
    setActiveTab("gallery");
  };

  const copyLink = () => {
    const link = `${window.location.origin}/gallery/${event.accessCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied! 🔗");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null;

  const stats = {
    photos: photos.length,
    likes: photos.reduce((sum, p) => sum + (p.likes || 0), 0),
    downloads: photos.reduce((sum, p) => sum + (p.downloads || 0), 0),
    views: Math.floor(Math.random() * 500) + 200,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Clean Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-[300px]">
                  {event.title}
                </h1>
                <p className="text-xs text-slate-500">{photos.length} photos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                {event.status}
              </Badge>
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner - Beautiful Gradient */}
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>

            <div className="relative space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Date</p>
                      <p className="text-sm font-medium">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Venue</p>
                      <p className="text-sm font-medium line-clamp-1">
                        {event.venue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={copyLink}
                  className="bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    window.open(`/gallery/${event.accessCode}`, "_blank")
                  }
                  className="bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-lg"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </div>

              {/* Floating Access Code */}
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl p-4 hidden sm:block">
                <p className="text-xs text-white/70 mb-1">Access Code</p>
                <p className="text-3xl font-mono font-bold text-white tracking-wider">
                  {event.accessCode}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid - Compact & Beautiful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Camera,
              label: "Photos",
              value: stats.photos,
              color: "indigo",
              gradient: "from-indigo-500 to-purple-500",
            },
            {
              icon: Heart,
              label: "Likes",
              value: stats.likes,
              color: "rose",
              gradient: "from-rose-500 to-pink-500",
            },
            {
              icon: Download,
              label: "Downloads",
              value: stats.downloads,
              color: "emerald",
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              icon: Eye,
              label: "Views",
              value: stats.views,
              color: "violet",
              gradient: "from-violet-500 to-purple-500",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 duration-300"
            >
              <CardContent className="p-5">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modern Tabs Card */}
        <Card className="border-0 shadow-2xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tab Navigation */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 pt-6">
              <TabsList className="w-full grid grid-cols-4 bg-white p-1.5 rounded-xl shadow-sm">
                {[
                  { value: "overview", icon: BarChart3, label: "Overview" },
                  {
                    value: "gallery",
                    icon: ImageIcon,
                    label: "Gallery",
                    count: stats.photos,
                  },
                  { value: "upload", icon: Upload, label: "Upload" },
                  { value: "share", icon: QrCode, label: "Share" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-lg text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                  >
                    <tab.icon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.count !== undefined && (
                      <Badge className="ml-2 bg-slate-200 text-slate-700 text-xs hidden lg:inline-flex">
                        {tab.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-4 sm:p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-0 bg-slate-50 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Event Statistics
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Total Photos",
                          value: stats.photos,
                          trend: "+12%",
                        },
                        {
                          label: "Total Engagement",
                          value: stats.likes + stats.downloads,
                          trend: "+8%",
                        },
                        {
                          label: "Gallery Views",
                          value: stats.views,
                          trend: "+24%",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-white rounded-xl"
                        >
                          <span className="text-sm font-medium text-slate-700">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900">
                              {item.value}
                            </span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-0">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {item.trend}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-slate-50 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      {[
                        {
                          icon: Upload,
                          label: "Upload Photos",
                          action: () => setActiveTab("upload"),
                        },
                        {
                          icon: Share2,
                          label: "Share Gallery Link",
                          action: copyLink,
                        },
                        {
                          icon: QrCode,
                          label: "Generate QR Code",
                          action: () => setActiveTab("share"),
                        },
                        {
                          icon: Eye,
                          label: "Preview Gallery",
                          action: () =>
                            window.open(`/gallery/${event.accessCode}`),
                        },
                      ].map((action, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          className="w-full justify-start hover:bg-white"
                          onClick={action.action}
                        >
                          <action.icon className="w-5 h-5 mr-3 text-indigo-600" />
                          <span className="text-slate-700">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="p-4 sm:p-6">
              {photos.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">
                      {photos.length} Photos
                    </h3>
                    <Button
                      onClick={() => setActiveTab("upload")}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add More
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <Card
                        key={photo._id}
                        className="group border-0 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                      >
                        <div className="aspect-square relative bg-slate-100">
                          <img
                            src={photo.thumbnailUrl}
                            alt="Event photo"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-white text-slate-900 hover:bg-slate-100"
                                onClick={() =>
                                  window.open(photo.cloudinaryUrl, "_blank")
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePhoto(photo._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-white/90 text-slate-900 border-0 text-xs">
                              <Heart className="w-3 h-3 mr-1" />
                              {photo.likes || 0}
                            </Badge>
                            <Badge className="bg-white/90 text-slate-900 border-0 text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              {photo.downloads || 0}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    No Photos Yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Upload photos to share with your guests
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setActiveTab("upload")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="p-4 sm:p-6">
              <PhotoUpload
                eventId={event._id}
                onUploadComplete={handleUploadComplete}
              />
            </TabsContent>

            {/* Share Tab */}
            <TabsContent value="share" className="p-4 sm:p-6">
              <div className="max-w-2xl mx-auto">
                <QRCodeGenerator
                  eventTitle={event.title}
                  accessCode={event.accessCode}
                  venue={event.venue}
                  onViewGallery={() =>
                    window.open(`/gallery/${event.accessCode}`, "_blank")
                  }
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
