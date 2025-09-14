"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { eventAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  Users,
  Camera,
  Sparkles,
  QrCode,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    maxDownloads: 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.date || !formData.venue.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await eventAPI.create(formData);
      toast.success("Event created successfully! 🎉");
      router.push(`/events/${response.data.event._id}`);
    } catch (error) {
      console.error("Create event error:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Sparkles className="w-4 h-4 mr-1" />
              Create New Event
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600">
            Set up a new photo sharing event for your wedding or celebration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="w-6 h-6 mr-3" />
                  Event Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Fill in the information about your special event
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Title */}
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700 flex items-center mb-2"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Event Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Raj & Priya Wedding Celebration"
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700 flex items-center mb-2"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Share a beautiful description of your special day..."
                      className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  {/* Date and Venue */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="date"
                        className="text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Event Date & Time *
                      </Label>
                      <Input
                        id="date"
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleChange}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="venue"
                        className="text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Venue *
                      </Label>
                      <Input
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        placeholder="e.g., Grand Palace, Mumbai"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Max Downloads */}
                  <div>
                    <Label
                      htmlFor="maxDownloads"
                      className="text-sm font-medium text-gray-700 flex items-center mb-2"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Maximum Downloads per Photo
                    </Label>
                    <Input
                      id="maxDownloads"
                      name="maxDownloads"
                      type="number"
                      value={formData.maxDownloads}
                      onChange={handleChange}
                      min="1"
                      max="1000"
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Set a limit on how many times each photo can be downloaded
                      by guests
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/dashboard" className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Event...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 w-4 h-4" />
                          Create Event
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Unique 8-character access code
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  QR code for easy guest access
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Real-time photo uploads
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  HD downloads for guests
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  30-day gallery access
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg text-purple-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-purple-800">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Create your event before the ceremony starts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Share the access code via WhatsApp groups</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>
                      Upload photos during events for real-time sharing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Print QR codes for venue display</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sample Event Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">
                  Sample Event
                </CardTitle>
                <CardDescription className="text-blue-700">
                  See how your event will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">Raj & Priya Wedding</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access Code:</span>
                    <span className="font-mono font-bold">ABC12345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
