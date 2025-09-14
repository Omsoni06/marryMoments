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
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Copy,
  Share2,
  Printer,
  QrCode,
  Smartphone,
  Camera,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function QRCodeGenerator({ event, galleryUrl, className = "" }) {
  const [qrSize, setQrSize] = useState(256);
  const [showInstructions, setShowInstructions] = useState(false);

  const downloadQRCode = () => {
    const svg = document.getElementById(`qr-code-${event._id}`);
    if (!svg) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = qrSize + 100; // Add padding
      canvas.height = qrSize + 150; // Add space for text

      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 50, 50, qrSize, qrSize);

      // Add event title
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(event.title, canvas.width / 2, 30);

      // Add access code
      ctx.font = "18px Arial";
      ctx.fillText(
        `Access Code: ${event.accessCode}`,
        canvas.width / 2,
        qrSize + 80
      );

      // Add instructions
      ctx.font = "14px Arial";
      ctx.fillText(
        "Scan to view & download photos",
        canvas.width / 2,
        qrSize + 110
      );

      // Download
      const link = document.createElement("a");
      link.download = `${event.title}-QR-Code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    img.src = url;
  };

  const copyQRCodeLink = () => {
    navigator.clipboard.writeText(galleryUrl);
    toast.success("Gallery link copied! 📋");
  };

  const printQRCode = () => {
    const printWindow = window.open("", "_blank");
    const qrCodeElement = document.getElementById(`qr-code-${event._id}`);

    if (printWindow && qrCodeElement) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${event.title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 40px;
                background: white;
              }
              .header { 
                margin-bottom: 30px; 
                border-bottom: 2px solid #E5E7EB;
                padding-bottom: 20px;
              }
              .qr-container { 
                margin: 30px 0; 
                padding: 20px;
                border: 2px dashed #9CA3AF;
                display: inline-block;
              }
              .instructions {
                margin-top: 30px;
                padding: 20px;
                background: #F3F4F6;
                border-radius: 8px;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
              }
              .access-code {
                font-family: monospace;
                font-size: 18px;
                font-weight: bold;
                background: #EEF2FF;
                padding: 10px 20px;
                border-radius: 6px;
                display: inline-block;
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${event.title}</h1>
              <p>Wedding Photo Gallery</p>
            </div>
            
            <div class="qr-container">
              ${qrCodeElement.outerHTML}
            </div>
            
            <div class="access-code">
              Access Code: ${event.accessCode}
            </div>
            
            <div class="instructions">
              <h3>📱 How to Access Photos:</h3>
              <p>1. Scan this QR code with your phone camera</p>
              <p>2. Or visit the website and enter the access code</p>
              <p>3. View and download your favorite photos</p>
              <p>4. Share with family and friends</p>
            </div>
            
            <p style="margin-top: 40px; color: #6B7280; font-size: 14px;">
              Gallery expires: ${new Date(event.expiresAt).toLocaleDateString(
                "en-IN"
              )}
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* QR Code Display */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            <span>QR Code Gallery Access</span>
          </CardTitle>
          <CardDescription>
            Let guests scan this code to instantly access photos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 inline-block">
            <QRCode
              id={`qr-code-${event._id}`}
              value={galleryUrl}
              size={qrSize}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>

          {/* Event Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
              <span>{new Date(event.date).toLocaleDateString("en-IN")}</span>
              <span>•</span>
              <span>{event.venue}</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <span className="font-mono font-bold">
                Access Code: {event.accessCode}
              </span>
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={downloadQRCode}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            <Button variant="outline" onClick={printQRCode}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={copyQRCodeLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>

          {/* Size Selector */}
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-600">Size:</span>
            <select
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value={128}>Small (128px)</option>
              <option value={256}>Medium (256px)</option>
              <option value={512}>Large (512px)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              For Guests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </div>
                <span>Open camera app on phone</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </div>
                <span>Point camera at QR code</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </div>
                <span>Tap notification to open gallery</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </div>
                <span>View & download photos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-lg text-purple-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Display Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-purple-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  📋
                </div>
                <span>Print and place on guest tables</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  🖼️
                </div>
                <span>Display on welcome board</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  📱
                </div>
                <span>Share in WhatsApp groups</span>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  💌
                </div>
                <span>Include in wedding invitations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Stats */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Quick Access Benefits
              </h4>
              <p className="text-sm text-gray-600">
                Make it easy for guests to find their photos
              </p>
            </div>
            <div className="flex space-x-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">⚡</div>
                <div className="text-xs text-gray-600">Instant Access</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">📱</div>
                <div className="text-xs text-gray-600">Mobile Friendly</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">🔒</div>
                <div className="text-xs text-gray-600">Secure</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
