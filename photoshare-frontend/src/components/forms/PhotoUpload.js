"use client";
import { useState, useCallback, useRef } from "react"; // Add useRef here
import { photoAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Image,
  AlertCircle,
  Camera,
  Smartphone,
} from "lucide-react"; // Add Camera, Smartphone
import { toast } from "sonner";

export default function PhotoUpload({ eventId, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Add these refs for mobile buttons
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Your existing handleFiles, removeFile, uploadPhotos functions stay the same...
  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const validFiles = imageFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (imageFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    if (validFiles.length !== imageFiles.length) {
      toast.error("Some files are too large. Maximum size is 10MB per file.");
    }

    if (selectedFiles.length + validFiles.length > 10) {
      toast.error("Maximum 10 files can be uploaded at once");
      return;
    }

    const filesWithPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setSelectedFiles((prev) => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select photos to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      selectedFiles.forEach((fileObj) => {
        formData.append("photos", fileObj.file);
      });

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await photoAPI.upload(eventId, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(
        `${response.data.photos.length} photos uploaded successfully!`
      );

      selectedFiles.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
      setSelectedFiles([]);
      setUploadProgress(0);

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Upload error:", error);
      const message =
        error.response?.data?.message || "Failed to upload photos";
      toast.error(message);
      setUploadProgress(0);
    }

    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Photos</CardTitle>
        <CardDescription>
          Upload event photos to share with guests. Maximum 10 files, 10MB each.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* REPLACE THIS SECTION - Enhanced File Drop Zone with Mobile Buttons */}
        <div className="space-y-4">
          {/* Mobile-First Buttons - Show on mobile */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                className="h-16 flex-col space-y-1 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
              >
                <Camera className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Take Photo</span>
              </Button>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-16 flex-col space-y-1 border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
              >
                <Image className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Choose Photos</span>
              </Button>
            </div>

            {/* Mobile tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <Smartphone className="w-4 h-4 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  <strong>Mobile:</strong> Use buttons above or drag photos to
                  the area below
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Drag & Drop Area - Works on all devices */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()} // Make entire area clickable
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drag and drop photos here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG, WebP up to 10MB each
              </p>

              {/* Desktop-specific button */}
              <Button
                type="button"
                variant="outline"
                className="mt-3 hidden md:inline-flex"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Camera input for mobile */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="camera" // This enables camera on mobile
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Keep all your existing code below this - Selected Files Preview, Upload Progress, Upload Button, Upload Tips */}

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Selected Photos ({selectedFiles.length})
              </h3>
              <Badge variant="secondary">{selectedFiles.length}/10</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedFiles.map((fileObj) => (
                <div key={fileObj.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(fileObj.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs truncate">
                    {fileObj.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading photos...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-4">
          <Button
            onClick={uploadPhotos}
            disabled={selectedFiles.length === 0 || uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

          {selectedFiles.length > 0 && !uploading && (
            <Button
              variant="outline"
              onClick={() => {
                selectedFiles.forEach((fileObj) =>
                  URL.revokeObjectURL(fileObj.preview)
                );
                setSelectedFiles([]);
              }}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Upload Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Upload Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• High-quality images look best (at least 1080px width)</li>
                <li>
                  • Photos are automatically optimized and thumbnails created
                </li>
                <li>
                  • Guests will be able to view and download uploaded photos
                  instantly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
