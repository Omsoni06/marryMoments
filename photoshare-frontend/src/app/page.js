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
import Image from "next/image";
import {
  Camera,
  Zap,
  Shield,
  QrCode,
  ArrowRight,
  Heart,
  Sparkles,
  Star,
  CheckCircle,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                PhotoShare Pro
              </span>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="h-11 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Dribbble Style */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                For Wedding Photographers
              </Badge>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                Share Wedding
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Memories Instantly
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Professional photo sharing platform for weddings. Upload photos,
                generate QR codes, and let guests access them instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-xl text-base"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-2 border-slate-200 hover:bg-slate-50 rounded-xl text-base font-semibold"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                  <span>Instant Setup</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/photo1.jpg"
                  alt="Wedding photography"
                  width={800}
                  height={1000}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Floating Card */}
              <div className="hidden lg:block absolute -bottom-8 -left-8 w-72 bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
                <Image
                  src="/hands.jpg"
                  alt="Share photos"
                  width={400}
                  height={300}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
                <p className="text-sm font-semibold text-slate-900">
                  Professional Photography
                </p>
                <p className="text-xs text-slate-600">
                  Share instantly with guests
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Modern Cards */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional tools to share wedding photos seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/instant shring.png"
                  alt="Instant sharing"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-3">
                  Instant Upload
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Upload photos during the event. Guests access them in
                  real-time through QR codes.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/image.png"
                  alt="QR code access"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-3">
                  QR Code Magic
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Generate unique QR codes. Display at venue or share via
                  WhatsApp for easy access.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/privacy.jpeg"
                  alt="Privacy"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-3">
                  Private & Secure
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Your photos stay private. Only guests with access codes can
                  view them.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works - Minimal */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-indigo-50 text-indigo-700 border-indigo-200">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-slate-600">
              Three simple steps to share wedding photos
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Create Event
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Sign up and add your wedding event details. Takes less than a
                  minute.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Upload Photos
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Upload photos during or after the event. Organize them
                  beautifully.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Share with Guests
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Generate QR code and display at venue. Guests scan and access
                  instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Premium */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start sharing memories today
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join photographers and couples creating beautiful wedding memories
          </p>
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            className="h-14 px-10 bg-white text-indigo-600 hover:bg-slate-50 font-semibold rounded-xl shadow-2xl text-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer - Clean */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                PhotoShare Pro
              </span>
            </div>
            <p className="text-sm text-slate-600">
              © 2025 PhotoShare Pro · Made with{" "}
              <Heart className="w-4 h-4 inline text-rose-500 fill-rose-500" />{" "}
              for weddings
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
