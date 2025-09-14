"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Share2, Copy, Eye } from "lucide-react";
import { toast } from "sonner";

export default function QRCodeGenerator({
  eventTitle,
  accessCode,
  venue,
  onViewGallery,
}) {
  const [galleryUrl, setGalleryUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setGalleryUrl(`${window.location.origin}/gallery/${accessCode}`);
    }
  }, [accessCode]);

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 400;
    canvas.height = 480;

    img.onload = () => {
      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // QR Code
      ctx.drawImage(img, 50, 80, 300, 300);

      // Title
      ctx.fillStyle = "black";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(eventTitle, 200, 40);

      // Instructions
      ctx.font = "16px Arial";
      ctx.fillText("Scan to view wedding photos", 200, 420);

      // Access code
      ctx.font = "14px Arial";
      ctx.fillStyle = "#666";
      ctx.fillText(`Access Code: ${accessCode}`, 200, 450);

      // Download
      const link = document.createElement("a");
      link.download = `${eventTitle}-QR-Code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    toast.success("QR Code downloaded! 📱");
  };

  const copyGalleryLink = () => {
    navigator.clipboard.writeText(galleryUrl);
    toast.success("Gallery link copied! 📋");
  };

  const shareGallery = () => {
    const message = `🎉 ${eventTitle}\n📍 ${venue}\n\n📸 View and download wedding photos!\n\n🔗 ${galleryUrl}\n📱 Access Code: ${accessCode}`;

    if (navigator.share) {
      navigator.share({
        title: `${eventTitle} - Wedding Photos`,
        text: message,
        url: galleryUrl,
      });
    } else {
      // WhatsApp fallback
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (!mounted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">📱 Guest QR Code</CardTitle>
          <CardDescription>
            Guests can scan this QR code to instantly access the photo gallery
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
            <QRCode
              id="qr-code"
              value={galleryUrl}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
            <div className="mt-4 space-y-1">
              <p className="font-bold text-lg text-gray-900">{eventTitle}</p>
              <p className="text-sm text-gray-600">Scan to view photos</p>
              <p className="text-xs text-gray-500 font-mono">
                Access Code: {accessCode}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={downloadQR}
              variant="outline"
              className="h-12 flex-col space-y-1"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">Download QR</span>
            </Button>

            <Button
              onClick={copyGalleryLink}
              variant="outline"
              className="h-12 flex-col space-y-1"
            >
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy Link</span>
            </Button>

            <Button
              onClick={shareGallery}
              variant="outline"
              className="h-12 flex-col space-y-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </Button>

            <Button
              onClick={() => window.open(galleryUrl, "_blank")}
              variant="outline"
              className="h-12 flex-col space-y-1"
            >
              <Eye className="w-4 h-4" />
              <span className="text-xs">Preview</span>
            </Button>
          </div>

          {/* Gallery URL */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-xs text-gray-600 mb-1">Gallery URL:</p>
            <p className="font-mono text-sm text-blue-600 break-all">
              {galleryUrl}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions for Guests */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
            📱 Instructions for Guests
          </h4>
          <div className="space-y-2 text-sm text-green-800">
            <div className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Open camera app on your phone</span>
            </div>
            <div className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Point camera at the QR code above</span>
            </div>
            <div className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Tap the notification to open gallery</span>
            </div>
            <div className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>View and download photos instantly!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
