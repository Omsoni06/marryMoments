"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  Check,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { photoAPI } from "@/lib/api";

export default function PhotoUpload({ eventId, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isUnderLimit = file.size <= 10 * 1024 * 1024; // 10MB limit

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

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload photos
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select photos to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`photos`, file);
      });

      // Add event ID to form data
      formData.append("eventId", eventId);

      const response = await photoAPI.upload(eventId, formData);

      if (response.data.success) {
        toast.success(`Successfully uploaded ${selectedFiles.length} photos!`);
        setSelectedFiles([]);
        setUploadProgress(100);

        // Call callback to refresh photos
        if (onUploadComplete) {
          onUploadComplete();
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload photos");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Get file preview URL
  const getFilePreview = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Camera & Gallery Buttons */}
      <div className="block md:hidden">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Camera className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium">Take Photo</span>
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <ImageIcon className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium">Choose Photos</span>
          </Button>
        </div>

        {/* Mobile Instructions */}
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Mobile Tip:</strong> Use "Take Photo" to capture new photos
            or "Choose Photos" to select from gallery
          </AlertDescription>
        </Alert>
      </div>

      {/* Desktop/Tablet Drag & Drop Area */}
      <Card
        className={`hidden md:block border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drag and drop photos here
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your files
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Photos
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Support: JPEG, PNG, WebP • Max size: 10MB each • Max files: 10
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Camera input for mobile - captures from camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="camera" // This enables camera on mobile
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Photos ({selectedFiles.length})</span>
              <Button
                onClick={() => setSelectedFiles([])}
                variant="outline"
                size="sm"
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={getFilePreview(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="mt-1 text-xs text-gray-600 truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading photos...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {selectedFiles.length} Photo
                  {selectedFiles.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Tips for Mobile */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">
                Mobile Upload Tips
              </h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Use "Take Photo" to capture new photos instantly</li>
                <li>
                  • "Choose Photos" opens your gallery to select existing photos
                </li>
                <li>
                  • You can select multiple photos from your gallery at once
                </li>
                <li>• Photos are automatically compressed for faster upload</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
