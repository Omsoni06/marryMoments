"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { eventAPI, photoAPI } from "@/lib/api";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Download,
  Heart,
  Search,
  Grid3X3,
  Image as ImageIcon,
  Share2,
  Copy,
  ZoomIn,
  X,
  Filter,
  Star,
  Users,
  Camera,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Home,
  MessageCircle,
  Facebook,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function GuestGalleryPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState("all");
  const [tagCounts, setTagCounts] = useState({});

  // ✅ ADD FUNCTION TO CALCULATE TAG COUNTS
  const calculateTagCounts = (photos) => {
    const counts = {};
    photos.forEach((photo) => {
      if (photo.tags && photo.tags.length > 0) {
        photo.tags.forEach((tag) => {
          counts[tag.category] = (counts[tag.category] || 0) + 1;
        });
      }
    });
    return counts;
  };

  useEffect(() => {
    if (params.accessCode) {
      fetchEventByAccessCode();
    }
  }, [params.accessCode]);

  useEffect(() => {
    if (event) {
      fetchPhotos();
    }
  }, [event]);

  useEffect(() => {
    let filtered = photos.filter(
      (photo) =>
        photo.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (photo.tags &&
          photo.tags.some((tag) =>
            tag.category.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );

    // ✅ ADD TAG FILTERING
    if (selectedTag !== "all") {
      filtered = filtered.filter(
        (photo) =>
          photo.tags && photo.tags.some((tag) => tag.category === selectedTag)
      );
    }

    // Sort photos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    setFilteredPhotos(filtered);
    // ✅ CALCULATE TAG COUNTS
    setTagCounts(calculateTagCounts(photos));
  }, [photos, searchTerm, sortBy, selectedTag]);

  // ✅ ADD TAG CATEGORIES DEFINITION
  const tagCategories = [
    { key: "all", label: "🖼️ All Photos", color: "bg-gray-100 text-gray-800" },
    { key: "ceremony", label: "💒 Ceremony", color: "bg-red-100 text-red-800" },
    {
      key: "reception",
      label: "🎉 Reception",
      color: "bg-blue-100 text-blue-800",
    },
    { key: "couple", label: "💑 Couple", color: "bg-pink-100 text-pink-800" },
    { key: "family", label: "👨‍👩‍👧‍👦 Family", color: "bg-green-100 text-green-800" },
    { key: "dance", label: "💃 Dance", color: "bg-purple-100 text-purple-800" },
    {
      key: "candid",
      label: "📸 Candid",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      key: "mehendi",
      label: "🎨 Mehendi",
      color: "bg-orange-100 text-orange-800",
    },
    { key: "food", label: "🍽️ Food", color: "bg-indigo-100 text-indigo-800" },
    {
      key: "decoration",
      label: "🌸 Decorations",
      color: "bg-teal-100 text-teal-800",
    },
  ];

  const fetchEventByAccessCode = async () => {
    try {
      const response = await eventAPI.getByAccessCode(params.accessCode);
      setEvent(response.data.event);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Invalid access code or event not found");
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await photoAPI.getByEvent(event._id);
      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      toast.error("Failed to load photos");
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await fetchPhotos();
      toast.success("Gallery refreshed! 🔄");
    } catch (error) {
      toast.error("Failed to refresh gallery");
    }
    setRefreshing(false);
  };

  const handleLikePhoto = async (photoId) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      const response = await photoAPI.like(photoId);

      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === photoId
            ? { ...photo, likes: response.data.likes }
            : photo
        )
      );

      setLikedPhotos((prev) => new Set([...prev, photoId]));
      toast.success("Photo liked! ❤️");
    } catch (error) {
      console.error("Failed to like photo:", error);
      toast.error("Failed to like photo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPhoto = async (photo) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      const response = await photoAPI.download(photo._id);

      const link = document.createElement("a");
      link.href = response.data.downloadUrl;
      link.download = photo.originalName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started! 📥");
    } catch (error) {
      console.error("Failed to download photo:", error);
      toast.error("Failed to download photo");
    } finally {
      setActionLoading(false);
    }
  };

  const shareGallery = () => {
    const galleryUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: `${event.title} - Photo Gallery`,
        text: `Check out photos from ${event.title}! 📸✨`,
        url: galleryUrl,
      });
    } else {
      navigator.clipboard.writeText(galleryUrl);
      toast.success("Gallery link copied! 🔗");
    }
  };

  const shareOnSocial = (platform) => {
    const galleryUrl = window.location.href;
    const message = `Check out these amazing photos from ${event.title}! 📸✨`;

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        message + " " + galleryUrl
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        galleryUrl
      )}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const openPhotoViewer = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(index);
  };

  const navigatePhoto = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentPhotoIndex + 1) % filteredPhotos.length
        : (currentPhotoIndex - 1 + filteredPhotos.length) %
          filteredPhotos.length;

    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
            <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-sm md:text-base">
            Loading your memories...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl md:text-2xl text-red-600">
              Access Denied
            </CardTitle>
            <CardDescription className="text-base md:text-lg">
              Invalid access code or event not found. Please check your link and
              try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Make sure you have the correct QR code or access link from the
              photographer.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Header - Mobile Responsive */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            {/* Top badge - Mobile Responsive */}
            <div className="flex justify-center items-center space-x-2 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Photo Gallery
              </Badge>
            </div>

            {/* Title - Mobile Responsive */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 md:mb-4 leading-tight px-2">
              {event.title}
            </h1>

            {/* Description - Mobile Responsive */}
            {event.description && (
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                {event.description}
              </p>
            )}

            {/* Event Info Cards - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
              <Card className="border-0 shadow-sm bg-white bg-opacity-60 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white bg-opacity-60 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {event.venue}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white bg-opacity-60 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4 text-center">
                  <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600 mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    {filteredPhotos.length} Photos
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons - Mobile Responsive */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
            <Button
              variant="outline"
              onClick={shareGallery}
              className="bg-white bg-opacity-80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all text-xs md:text-sm px-3 md:px-4 py-2 h-auto"
            >
              <Copy className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Share Gallery
            </Button>
            <Button
              variant="outline"
              onClick={() => shareOnSocial("whatsapp")}
              className="bg-white bg-opacity-80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all text-xs md:text-sm px-3 md:px-4 py-2 h-auto"
            >
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => shareOnSocial("facebook")}
              className="bg-white bg-opacity-80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all text-xs md:text-sm px-3 md:px-4 py-2 h-auto"
            >
              <Facebook className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Facebook
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Search and Filter Bar - Mobile Responsive */}
        <Card className="mb-6 md:mb-8 border-0 shadow-lg bg-white bg-opacity-80 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {/* Header with refresh button */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Smart Photo Gallery
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>

              {/* Smart Tag Filters */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Smart Categories:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagCategories.map((category) => {
                    const count =
                      category.key === "all"
                        ? photos.length
                        : tagCounts[category.key] || 0;
                    return (
                      <Button
                        key={category.key}
                        variant={
                          selectedTag === category.key ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedTag(category.key)}
                        disabled={count === 0 && category.key !== "all"}
                        className={`text-xs h-8 ${
                          selectedTag === category.key
                            ? "bg-blue-600 text-white"
                            : count === 0 && category.key !== "all"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {category.label} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Search bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input
                  placeholder="Search photos by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 md:pl-10 h-10 md:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                />
              </div>

              {/* Sort controls */}
              <div className="flex gap-2 md:gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 h-10 md:h-12 px-3 md:px-4 border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>

                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "masonry" : "grid")
                  }
                  className="h-10 md:h-12 px-3 md:px-4"
                >
                  <Grid3X3 className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>

              {/* Active filters display */}
              {(selectedTag !== "all" || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-700 font-medium">
                    Active filters:
                  </span>
                  {selectedTag !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                      onClick={() => setSelectedTag("all")}
                    >
                      {
                        tagCategories.find((cat) => cat.key === selectedTag)
                          ?.label
                      }{" "}
                      ×
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                      onClick={() => setSearchTerm("")}
                    >
                      "{searchTerm}" ×
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTag("all");
                      setSearchTerm("");
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Results count */}
              {filteredPhotos.length !== photos.length && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Showing {filteredPhotos.length} of {photos.length} photos
                    {selectedTag !== "all" &&
                      ` in ${
                        tagCategories.find((cat) => cat.key === selectedTag)
                          ?.label
                      }`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photos Grid - Mobile Responsive */}
        {filteredPhotos.length === 0 && !loading ? (
          <Card className="border-0 shadow-lg bg-white bg-opacity-80 backdrop-blur-sm">
            <CardContent className="py-12 md:py-16 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <ImageIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? "No photos found" : "No photos uploaded yet"}
              </h3>
              <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or browse all photos"
                  : "Photos will appear here once the photographer uploads them. Check back soon!"}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  View All Photos
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
            {filteredPhotos.map((photo, index) => (
              <Card
                key={photo._id}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white bg-opacity-90 backdrop-blur-sm"
                onClick={() => openPhotoViewer(photo, index)}
              >
                <div className="aspect-square relative">
                  <img
                    src={photo.thumbnailUrl || photo.cloudinaryUrl}
                    alt={photo.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Mobile tap hint */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center md:hidden">
                    <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      Tap to View
                    </div>
                  </div>

                  {/* Desktop overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
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

                  {/* Action Button - Desktop Only */}
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white bg-opacity-90 text-red-600 hover:bg-white shadow-lg backdrop-blur-sm p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePhoto(photo._id);
                      }}
                      disabled={actionLoading}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedPhotos.has(photo._id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Photo index badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black bg-opacity-50 text-white border-0 text-xs">
                      #{index + 1}
                    </Badge>
                  </div>

                  {/* ✅ NEW: Smart Tags Display */}
                  <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2">
                    {photo.tags && photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            className="text-xs px-1.5 py-0.5 border-0 shadow-sm font-medium"
                            style={{
                              fontSize: "8px",
                              backgroundColor:
                                tag.category === "ceremony"
                                  ? "#fee2e2"
                                  : tag.category === "reception"
                                  ? "#dbeafe"
                                  : tag.category === "couple"
                                  ? "#fce7f3"
                                  : tag.category === "family"
                                  ? "#dcfce7"
                                  : tag.category === "dance"
                                  ? "#f3e8ff"
                                  : tag.category === "candid"
                                  ? "#fef3c7"
                                  : tag.category === "mehendi"
                                  ? "#fed7aa"
                                  : tag.category === "food"
                                  ? "#e0e7ff"
                                  : tag.category === "decoration"
                                  ? "#d1fae5"
                                  : tag.category === "ritual"
                                  ? "#fecaca"
                                  : tag.category === "kids"
                                  ? "#fde68a"
                                  : tag.category === "outdoor"
                                  ? "#bbf7d0"
                                  : tag.category === "indoor"
                                  ? "#e5e7eb"
                                  : "#f3f4f6",
                              color:
                                tag.category === "ceremony"
                                  ? "#991b1b"
                                  : tag.category === "reception"
                                  ? "#1e40af"
                                  : tag.category === "couple"
                                  ? "#be185d"
                                  : tag.category === "family"
                                  ? "#166534"
                                  : tag.category === "dance"
                                  ? "#7c3aed"
                                  : tag.category === "candid"
                                  ? "#d97706"
                                  : tag.category === "mehendi"
                                  ? "#ea580c"
                                  : tag.category === "food"
                                  ? "#4338ca"
                                  : tag.category === "decoration"
                                  ? "#065f46"
                                  : tag.category === "ritual"
                                  ? "#dc2626"
                                  : tag.category === "kids"
                                  ? "#b45309"
                                  : tag.category === "outdoor"
                                  ? "#047857"
                                  : tag.category === "indoor"
                                  ? "#4b5563"
                                  : "#6b7280",
                            }}
                          >
                            🏷️ {tag.category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile photo info */}
                <div className="p-3 md:hidden">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-900 truncate flex-1 mr-2">
                      Photo {index + 1}
                      {/* Show tags on mobile too */}
                      {photo.tags && photo.tags.length > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          • {photo.tags[0].category}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePhoto(photo._id);
                        }}
                        disabled={actionLoading}
                        className="flex items-center text-xs text-gray-500 hover:text-red-500 transition-colors p-1"
                      >
                        <Heart
                          className={`w-3 h-3 mr-1 ${
                            likedPhotos.has(photo._id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                        {photo.likes || 0}
                      </button>
                      <span className="flex items-center text-xs text-gray-500">
                        <Download className="w-3 h-3 mr-1" />
                        {photo.downloads || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Photo Viewer Modal - Mobile Responsive */}
        {selectedPhoto && (
          <Dialog
            open={!!selectedPhoto}
            onOpenChange={() => setSelectedPhoto(null)}
          >
            <DialogContent className="max-w-7xl w-full h-screen p-0 bg-black border-0 max-h-screen">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 md:top-4 right-2 md:right-4 z-10 text-white hover:bg-white hover:bg-opacity-20 bg-black bg-opacity-50 backdrop-blur-sm p-2 md:p-3"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </Button>

                {/* Navigation Buttons */}
                {filteredPhotos.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20 bg-black bg-opacity-50 backdrop-blur-sm p-2 md:p-3"
                      onClick={() => navigatePhoto("prev")}
                    >
                      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20 bg-black bg-opacity-50 backdrop-blur-sm p-2 md:p-3"
                      onClick={() => navigatePhoto("next")}
                    >
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </>
                )}

                {/* Main Image */}
                <img
                  src={
                    selectedPhoto.cloudinaryUrl || selectedPhoto.thumbnailUrl
                  }
                  alt={selectedPhoto.originalName}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Bottom Actions - Mobile Responsive */}
                <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleLikePhoto(selectedPhoto._id)}
                    disabled={actionLoading}
                    className="bg-white bg-opacity-90 text-red-600 hover:bg-white shadow-lg backdrop-blur-sm text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
                  >
                    <Heart
                      className={`w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 ${
                        likedPhotos.has(selectedPhoto._id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span className="hidden sm:inline">Like </span>(
                    {selectedPhoto.likes || 0})
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadPhoto(selectedPhoto)}
                    disabled={actionLoading}
                    className="bg-white bg-opacity-90 text-blue-600 hover:bg-white shadow-lg backdrop-blur-sm text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>

                {/* Photo Counter with Tags */}
                <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <Badge className="bg-black bg-opacity-50 text-white border-white border-opacity-30 backdrop-blur-sm text-xs md:text-sm">
                    {currentPhotoIndex + 1} of {filteredPhotos.length}
                  </Badge>
                  {/* Show tags in viewer */}
                  {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                    <Badge
                      className="bg-blue-600 bg-opacity-90 text-white border-0 text-xs md:text-sm"
                      style={{ fontSize: "10px" }}
                    >
                      🏷️ {selectedPhoto.tags[0].category}
                    </Badge>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>

      {/* Footer - Mobile Responsive */}
      <footer className="bg-white bg-opacity-80 backdrop-blur-lg border-t border-gray-100 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm md:text-base">
                <span className="font-semibold">Access Code:</span>
                <span className="font-mono font-bold ml-2 px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">
                  {event.accessCode}
                </span>
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Save this link to access photos anytime • Gallery expires in{" "}
                {Math.max(
                  0,
                  Math.floor(
                    (new Date(event.expiresAt) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                )}{" "}
                days
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <p className="text-xs md:text-sm text-gray-500">
                Share with others:
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial("whatsapp")}
                  className="p-2"
                >
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial("facebook")}
                  className="p-2"
                >
                  <Facebook className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareGallery}
                  className="p-2"
                >
                  <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              Powered by{" "}
              <span className="font-semibold text-blue-600">
                PhotoShare Pro
              </span>{" "}
              • Made with ❤️ for Indian weddings
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
