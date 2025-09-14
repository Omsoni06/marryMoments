const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload photos to an event
const uploadPhotos = async (req, res) => {
  try {
    const { eventId } = req.params;
    const files = req.files;

    console.log("📸 Upload photos request:", {
      eventId,
      filesCount: files?.length,
      userId: req.user?.id,
    });

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No photos provided",
      });
    }

    // Process each uploaded file
    const uploadPromises = files.map(async (file) => {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `photoshare/${eventId}`,
          public_id: `${Date.now()}_${file.originalname}`,
          resource_type: "image",
          transformation: [
            { width: 1920, height: 1080, crop: "limit" },
            { quality: "auto" },
          ],
        });

        // Generate thumbnail
        const thumbnailUrl = cloudinary.url(result.public_id, {
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto",
        });

        // Clean up temporary file
        fs.unlinkSync(file.path);

        return {
          publicId: result.public_id,
          url: result.secure_url,
          thumbnailUrl,
          originalName: file.originalname,
          size: file.size,
          format: result.format,
          width: result.width,
          height: result.height,
          uploadedBy: req.user.id,
          uploadedAt: new Date(),
          likes: 0,
          downloads: 0,
        };
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        // Clean up temporary file on error
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        throw uploadError;
      }
    });

    const uploadedPhotos = await Promise.all(uploadPromises);

    console.log("✅ Photos uploaded successfully:", uploadedPhotos.length);

    res.json({
      success: true,
      message: `Successfully uploaded ${uploadedPhotos.length} photos`,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error("❌ Upload photos error:", error);

    // Clean up any remaining temporary files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload photos",
      error: error.message,
    });
  }
};

// Get photos for an event
const getEventPhotos = async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log("📷 Get event photos:", eventId);

    // For now, return mock data since we don't have a database model yet
    // You'll need to replace this with actual database queries
    const mockPhotos = [
      {
        _id: "mock1",
        publicId: "sample1",
        url: "https://via.placeholder.com/800x600/4f46e5/ffffff?text=Sample+Photo+1",
        thumbnailUrl:
          "https://via.placeholder.com/400x400/4f46e5/ffffff?text=Sample+1",
        originalName: "sample1.jpg",
        size: 1024000,
        format: "jpg",
        width: 800,
        height: 600,
        uploadedBy: req.user?.id || "mock-user",
        uploadedAt: new Date(),
        likes: Math.floor(Math.random() * 10),
        downloads: Math.floor(Math.random() * 5),
      },
      {
        _id: "mock2",
        publicId: "sample2",
        url: "https://via.placeholder.com/800x600/7c3aed/ffffff?text=Sample+Photo+2",
        thumbnailUrl:
          "https://via.placeholder.com/400x400/7c3aed/ffffff?text=Sample+2",
        originalName: "sample2.jpg",
        size: 1536000,
        format: "jpg",
        width: 800,
        height: 600,
        uploadedBy: req.user?.id || "mock-user",
        uploadedAt: new Date(),
        likes: Math.floor(Math.random() * 10),
        downloads: Math.floor(Math.random() * 5),
      },
    ];

    res.json({
      success: true,
      photos: mockPhotos,
    });
  } catch (error) {
    console.error("❌ Get event photos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch photos",
      error: error.message,
    });
  }
};

module.exports = {
  uploadPhotos,
  getEventPhotos,
};
