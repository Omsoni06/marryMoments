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
} from "lucide-react";
import { toast } from "sonner";

export default function GuestGalleryPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [likedPhotos, setLikedPhotos] = useState(new Set());

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
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );

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
  }, [photos, searchTerm, sortBy]);

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

  const handleLikePhoto = async (photoId) => {
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
    }
  };

  const handleDownloadPhoto = async (photo) => {
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
    }
  };

  const shareGallery = () => {
    const galleryUrl = window.location.href;
    navigator.clipboard.writeText(galleryUrl);
    toast.success("Gallery link copied! 🔗");
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
              Copy Link
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
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 md:pl-10 h-10 md:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
                />
              </div>

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
            </div>

            {searchTerm && (
              <div className="mt-3 md:mt-4 flex items-center justify-between text-xs md:text-sm text-gray-600">
                <span>
                  Showing {filteredPhotos.length} photos for "{searchTerm}"
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              </div>
            )}
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
              <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms or browse all photos"
                  : "Photos will appear here once the photographer uploads them. Check back soon!"}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 md:mt-6"
                >
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

                  {/* Overlay - Mobile Responsive */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black from-opacity-60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-1 md:bottom-4 left-1 md:left-4 right-1 md:right-4">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-1 md:space-x-2">
                          <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-sm text-xs">
                            <Heart className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                            {photo.likes || 0}
                          </Badge>
                          <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-sm text-xs">
                            <Download className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                            {photo.downloads || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile Responsive */}
                  <div className="absolute top-1 md:top-4 right-1 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white bg-opacity-90 text-gray-700 hover:bg-white shadow-lg p-1 md:p-2 h-6 w-6 md:h-8 md:w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePhoto(photo._id);
                      }}
                    >
                      <Heart
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          likedPhotos.has(photo._id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </Button>
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
                    className="bg-white bg-opacity-90 text-gray-700 hover:bg-white shadow-lg backdrop-blur-sm text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
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
                    className="bg-white bg-opacity-90 text-gray-700 hover:bg-white shadow-lg backdrop-blur-sm text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>

                {/* Photo Counter */}
                <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-black bg-opacity-50 text-white border-white border-opacity-30 backdrop-blur-sm text-xs md:text-sm">
                    {currentPhotoIndex + 1} of {filteredPhotos.length}
                  </Badge>
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
                {Math.floor(
                  (new Date(event.expiresAt) - new Date()) /
                    (1000 * 60 * 60 * 24)
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
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
