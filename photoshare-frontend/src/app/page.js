"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Share2,
  Download,
  Zap,
  Heart,
  Users,
  Shield,
  Smartphone,
  Star,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section - Mobile Responsive */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <Badge
              variant="secondary"
              className="mb-4 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm"
            >
              ✨ Made for Indian Weddings
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight px-2">
              PhotoShare Pro
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              The fastest way to share wedding memories. Upload photos
              instantly, share with guests via QR codes, and let everyone
              download their favorite moments in{" "}
              <span className="font-semibold text-blue-600">real-time</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Gallery
                <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/gallery/demo")}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg border-2 hover:bg-gray-50 transition-all duration-300"
              >
                <PlayCircle className="mr-2 w-4 md:w-5 h-4 md:h-5" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Feature Cards - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-20 px-4">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2 p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                  <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl">
                  Instant Upload
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm md:text-base">
                  Photographers upload photos in real-time during events. No
                  waiting for days!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2 p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                  <Share2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl">
                  Secure Sharing
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm md:text-base">
                  Unique access codes and QR codes for each event. Only invited
                  guests can access.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2 p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                  <Download className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl">
                  Easy Download
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm md:text-base">
                  Guests can view and download high-resolution photos instantly
                  on their phones.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section - Mobile Responsive */}
      <div className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
              Perfect for Indian Wedding Celebrations
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              From Mehendi to Reception - capture and share every precious
              moment instantly
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4">
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                ⚡
              </div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">
                Instant
              </div>
              <div className="text-sm md:text-base text-gray-600">
                Real-time sharing
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                🔒
              </div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">
                Secure
              </div>
              <div className="text-sm md:text-base text-gray-600">
                Private galleries
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                📱
              </div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">
                Mobile
              </div>
              <div className="text-sm md:text-base text-gray-600">
                Works on any device
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                ❤️
              </div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">
                Loved
              </div>
              <div className="text-sm md:text-base text-gray-600">
                By Indian families
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Mobile Responsive */}
      <div className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 px-2">
            Ready to Share Your Wedding Memories?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join photographers who are already using PhotoShare Pro to delight
            their clients
          </p>
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            variant="secondary"
            className="px-8 md:px-10 py-3 md:py-4 text-base md:text-lg bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
          </Button>
        </div>
      </div>

      {/* Footer - Mobile Responsive */}
      <footer className="py-6 md:py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base">
            &copy; 2025 PhotoShare Pro. Made with ❤️ for Indian weddings.
          </p>
        </div>
      </footer>
    </div>
  );
}
