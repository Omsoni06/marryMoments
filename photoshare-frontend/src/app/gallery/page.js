"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, QrCode, Smartphone, Camera } from "lucide-react";

export default function GalleryEntryPage() {
  const [accessCode, setAccessCode] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessCode.trim()) {
      router.push(`/gallery/${accessCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Access Event Gallery</CardTitle>
            <CardDescription>
              Enter your access code to view and download photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Enter 8-character code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="text-center font-mono text-lg"
                  maxLength={8}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!accessCode.trim()}
              >
                View Gallery
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* QR Code Instructions */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <QrCode className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-lg text-purple-900">
              Have a QR Code?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-purple-800">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Scan with your phone camera</p>
                  <p className="text-purple-600">
                    Point your camera at the QR code
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Camera className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium">Instant access</p>
                  <p className="text-purple-600">
                    No need to type the access code
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your wedding invitation for the QR code</li>
                <li>• Look for table cards at the venue</li>
                <li>• Ask the photographer for the access code</li>
                <li>• Check WhatsApp messages from the couple</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
