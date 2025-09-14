const Photo = require("../models/Photo");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");

const uploadPhotos = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.photographer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `photoshare/events/${eventId}`,
            transformation: [
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      // Create thumbnail
      const thumbnailUrl = cloudinary.url(result.public_id, {
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto:low" },
        ],
      });

      // Save photo record
      const photo = await Photo.create({
        event: eventId,
        filename: result.public_id,
        originalName: file.originalname,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
        thumbnailUrl,
        uploadedBy: req.user._id,
        metadata: {
          size: file.size,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      });

      return photo;
    });

    const photos = await Promise.all(uploadPromises);

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.to(`event-${eventId}`).emit("photos-uploaded", {
        eventId,
        photos: photos.map((p) => ({
          id: p._id,
          thumbnailUrl: p.thumbnailUrl,
          uploadedAt: p.createdAt,
        })),
      });
    }

    res.status(201).json({
      success: true,
      message: `${photos.length} photos uploaded successfully`,
      photos,
    });
  } catch (error) {
    console.error("Upload photos error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getPhotosByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const photos = await Photo.find({ event: eventId })
      .populate("uploadedBy", "name")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Photo.countDocuments({ event: eventId });

    res.json({
      success: true,
      photos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get photos by event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching photos",
    });
  }
};

const likePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.photoId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    res.json({
      success: true,
      likes: photo.likes,
    });
  } catch (error) {
    console.error("Like photo error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const downloadPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Increment download count
    await Photo.findByIdAndUpdate(photo._id, { $inc: { downloads: 1 } });

    res.json({
      success: true,
      downloadUrl: photo.cloudinaryUrl,
    });
  } catch (error) {
    console.error("Download photo error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  uploadPhotos,
  getPhotosByEvent,
  likePhoto,
  downloadPhoto,
};
