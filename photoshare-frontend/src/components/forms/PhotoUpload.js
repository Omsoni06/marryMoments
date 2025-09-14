"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { photoAPI } from "@/lib/api";

export default function PhotoUpload({ eventId, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-8">
          <div className="h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isUnderLimit = file.size <= 10 * 1024 * 1024;

      if (!isValid) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isUnderLimit) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 10));
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select photos to upload");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await photoAPI.upload(eventId, formData);

      if (response.data.success) {
        toast.success(`Successfully uploaded ${selectedFiles.length} photos!`);
        setSelectedFiles([]);

        if (onUploadComplete) {
          onUploadComplete();
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const getFilePreview = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Buttons */}
      <div className="block md:hidden">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            variant="outline"
            className="h-20 flex-col space-y-2"
          >
            <Camera className="w-6 h-6 text-blue-600" />
            <span className="text-sm">Take Photo</span>
          </Button>

          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="h-20 flex-col space-y-2"
          >
            <ImageIcon className="w-6 h-6 text-purple-600" />
            <span className="text-sm">Choose Photos</span>
          </Button>
        </div>
      </div>

      {/* Desktop Upload */}
      <Card className="hidden md:block">
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-4">Upload Photos</h3>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Choose Photos
          </Button>
        </CardContent>
      </Card>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="camera"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Preview and Upload */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Photos ({selectedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={getFilePreview(file)}
                    alt={file.name}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Photos`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
