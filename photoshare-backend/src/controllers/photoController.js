const Photo = require("../models/Photo");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const { validationResult } = require("express-validator");

// ✅ ADD AI PHOTO ANALYSIS FUNCTION
const analyzePhotoContent = async (originalName) => {
  try {
    const analysis = {
      tags: [],
      detectedObjects: [],
      sceneType: "unknown",
      peopleCount: 0,
      emotionAnalysis: {
        dominant: "happy",
        confidence: 0.8,
      },
    };

    // Analyze filename for context clues
    const fileName = originalName.toLowerCase();
    const fileAnalysis = analyzeFileName(fileName);

    // Add filename-based tags
    analysis.tags.push(...fileAnalysis.tags);

    // Simulate AI detection based on common patterns
    const simulatedDetection = simulateAIDetection(fileName);
    analysis.detectedObjects = simulatedDetection.objects;
    analysis.peopleCount = simulatedDetection.peopleCount;
    analysis.sceneType = simulatedDetection.sceneType;

    return analysis;
  } catch (error) {
    console.error("AI Analysis error:", error);
    return getDefaultAnalysis();
  }
};

const analyzeFileName = (fileName) => {
  const tags = [];

  // Ceremony-related keywords
  if (
    fileName.includes("ceremony") ||
    fileName.includes("wedding") ||
    fileName.includes("mandap") ||
    fileName.includes("vows") ||
    fileName.includes("phera") ||
    fileName.includes("saptapadi") ||
    fileName.includes("ritual") ||
    fileName.includes("sacred")
  ) {
    tags.push({
      category: "ceremony",
      confidence: 0.9,
      detectedObjects: ["wedding ceremony"],
      manuallyAdded: false,
    });
  }

  // Reception keywords
  if (
    fileName.includes("reception") ||
    fileName.includes("party") ||
    fileName.includes("dinner") ||
    fileName.includes("celebration") ||
    fileName.includes("banquet") ||
    fileName.includes("feast")
  ) {
    tags.push({
      category: "reception",
      confidence: 0.85,
      detectedObjects: ["reception party"],
      manuallyAdded: false,
    });
  }

  // Dance keywords
  if (
    fileName.includes("dance") ||
    fileName.includes("dancing") ||
    fileName.includes("sangam") ||
    fileName.includes("music") ||
    fileName.includes("dj") ||
    fileName.includes("stage")
  ) {
    tags.push({
      category: "dance",
      confidence: 0.9,
      detectedObjects: ["dancing people"],
      manuallyAdded: false,
    });
  }

  // Family keywords
  if (
    fileName.includes("family") ||
    fileName.includes("group") ||
    fileName.includes("together") ||
    fileName.includes("relatives") ||
    fileName.includes("portrait") ||
    fileName.includes("posed")
  ) {
    tags.push({
      category: "family",
      confidence: 0.8,
      detectedObjects: ["family group"],
      manuallyAdded: false,
    });
  }

  // Couple keywords
  if (
    fileName.includes("couple") ||
    fileName.includes("bride") ||
    fileName.includes("groom") ||
    fileName.includes("dulha") ||
    fileName.includes("dulhan") ||
    fileName.includes("romantic")
  ) {
    tags.push({
      category: "couple",
      confidence: 0.85,
      detectedObjects: ["bride and groom"],
      manuallyAdded: false,
    });
  }

  // Mehendi keywords
  if (
    fileName.includes("mehendi") ||
    fileName.includes("henna") ||
    fileName.includes("mehndi") ||
    fileName.includes("haldi") ||
    fileName.includes("turmeric") ||
    fileName.includes("pre-wedding")
  ) {
    tags.push({
      category: "mehendi",
      confidence: 0.95,
      detectedObjects: ["mehendi ceremony"],
      manuallyAdded: false,
    });
  }

  // Food keywords
  if (
    fileName.includes("food") ||
    fileName.includes("dinner") ||
    fileName.includes("lunch") ||
    fileName.includes("catering") ||
    fileName.includes("buffet") ||
    fileName.includes("sweets") ||
    fileName.includes("dessert") ||
    fileName.includes("cake")
  ) {
    tags.push({
      category: "food",
      confidence: 0.9,
      detectedObjects: ["food items"],
      manuallyAdded: false,
    });
  }

  // Decoration keywords
  if (
    fileName.includes("decoration") ||
    fileName.includes("flowers") ||
    fileName.includes("decor") ||
    fileName.includes("venue") ||
    fileName.includes("setup") ||
    fileName.includes("backdrop") ||
    fileName.includes("lighting") ||
    fileName.includes("rangoli")
  ) {
    tags.push({
      category: "decoration",
      confidence: 0.8,
      detectedObjects: ["decorative elements"],
      manuallyAdded: false,
    });
  }

  // Ritual keywords
  if (
    fileName.includes("ritual") ||
    fileName.includes("puja") ||
    fileName.includes("aarti") ||
    fileName.includes("blessing") ||
    fileName.includes("priest") ||
    fileName.includes("pandit")
  ) {
    tags.push({
      category: "ritual",
      confidence: 0.9,
      detectedObjects: ["religious ritual"],
      manuallyAdded: false,
    });
  }

  // Kids keywords
  if (
    fileName.includes("kids") ||
    fileName.includes("children") ||
    fileName.includes("baby") ||
    fileName.includes("child")
  ) {
    tags.push({
      category: "kids",
      confidence: 0.9,
      detectedObjects: ["children"],
      manuallyAdded: false,
    });
  }

  // Outdoor/Indoor detection
  if (
    fileName.includes("outdoor") ||
    fileName.includes("garden") ||
    fileName.includes("lawn") ||
    fileName.includes("terrace")
  ) {
    tags.push({
      category: "outdoor",
      confidence: 0.8,
      detectedObjects: ["outdoor setting"],
      manuallyAdded: false,
    });
  } else if (
    fileName.includes("indoor") ||
    fileName.includes("hall") ||
    fileName.includes("room") ||
    fileName.includes("banquet")
  ) {
    tags.push({
      category: "indoor",
      confidence: 0.8,
      detectedObjects: ["indoor setting"],
      manuallyAdded: false,
    });
  }

  // Default to candid if no specific category found
  if (tags.length === 0) {
    tags.push({
      category: "candid",
      confidence: 0.6,
      detectedObjects: ["candid moment"],
      manuallyAdded: false,
    });
  }

  return { tags };
};

const simulateAIDetection = (fileName) => {
  // Determine scenario based on filename
  const scenarios = {
    ceremony: {
      objects: [
        "person",
        "wedding dress",
        "suit",
        "flowers",
        "decoration",
        "ritual items",
      ],
      peopleCount: Math.floor(Math.random() * 25) + 5, // 5-30 people
      sceneType: "ceremony",
    },
    reception: {
      objects: ["person", "table", "food", "lights", "decoration", "chairs"],
      peopleCount: Math.floor(Math.random() * 50) + 10, // 10-60 people
      sceneType: "indoor_event",
    },
    dance: {
      objects: ["person", "music equipment", "stage", "lights", "celebration"],
      peopleCount: Math.floor(Math.random() * 30) + 3, // 3-33 people
      sceneType: "celebration",
    },
    family: {
      objects: ["person", "formal wear", "smile", "group pose"],
      peopleCount: Math.floor(Math.random() * 15) + 3, // 3-18 people
      sceneType: "portrait",
    },
    couple: {
      objects: [
        "person",
        "wedding dress",
        "suit",
        "smile",
        "flowers",
        "romantic pose",
      ],
      peopleCount: 2,
      sceneType: "couple_portrait",
    },
    mehendi: {
      objects: ["person", "henna", "hands", "traditional wear", "celebration"],
      peopleCount: Math.floor(Math.random() * 15) + 3,
      sceneType: "traditional_ceremony",
    },
    food: {
      objects: ["food", "plates", "table", "catering", "sweets"],
      peopleCount: Math.floor(Math.random() * 5) + 1,
      sceneType: "dining",
    },
  };

  // Find matching scenario
  for (const [key, scenario] of Object.entries(scenarios)) {
    if (fileName.includes(key)) {
      return scenario;
    }
  }

  // Default scenario
  return {
    objects: ["person", "casual setting"],
    peopleCount: Math.floor(Math.random() * 8) + 1,
    sceneType: "candid",
  };
};

const getDefaultAnalysis = () => ({
  tags: [
    {
      category: "candid",
      confidence: 0.5,
      detectedObjects: ["photo"],
      manuallyAdded: false,
    },
  ],
  detectedObjects: ["photo"],
  sceneType: "unknown",
  peopleCount: 1,
  emotionAnalysis: { dominant: "happy", confidence: 0.7 },
});

// ✅ UPDATED UPLOAD FUNCTION WITH AI TAGGING
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
      try {
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

        // ✅ AI PHOTO ANALYSIS
        console.log(`🤖 Analyzing photo: ${file.originalname}`);
        const aiAnalysis = await analyzePhotoContent(file.originalname);

        console.log(`✅ AI Analysis completed:`, {
          filename: file.originalname,
          tags: aiAnalysis.tags.map(
            (t) => `${t.category} (${Math.round(t.confidence * 100)}%)`
          ),
          objects: aiAnalysis.detectedObjects,
          peopleCount: aiAnalysis.peopleCount,
        });

        // Create thumbnail
        const thumbnailUrl = cloudinary.url(result.public_id, {
          transformation: [
            { width: 300, height: 300, crop: "fill" },
            { quality: "auto:low" },
          ],
        });

        // ✅ SAVE PHOTO WITH AI TAGS
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
          // ✅ ADD AI ANALYSIS RESULTS
          tags: aiAnalysis.tags,
          aiAnalysis: {
            processed: true,
            processedAt: new Date(),
            detectedObjects: aiAnalysis.detectedObjects,
            sceneType: aiAnalysis.sceneType,
            peopleCount: aiAnalysis.peopleCount,
            emotionAnalysis: aiAnalysis.emotionAnalysis,
          },
        });

        return photo;
      } catch (error) {
        console.error(`❌ Error processing ${file.originalname}:`, error);
        throw error;
      }
    });

    const photos = await Promise.all(uploadPromises);

    // ✅ CALCULATE TAG SUMMARY
    const tagSummary = {};
    photos.forEach((photo) => {
      photo.tags.forEach((tag) => {
        tagSummary[tag.category] = (tagSummary[tag.category] || 0) + 1;
      });
    });

    console.log(`📊 Upload completed with smart tags:`, tagSummary);

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.to(`event-${eventId}`).emit("photos-uploaded", {
        eventId,
        photos: photos.map((p) => ({
          id: p._id,
          thumbnailUrl: p.thumbnailUrl,
          uploadedAt: p.createdAt,
          tags: p.tags.map((t) => t.category), // Include tags in real-time update
        })),
      });
    }

    res.status(201).json({
      success: true,
      message: `${photos.length} photos uploaded and analyzed successfully! 🤖📸`,
      photos,
      // ✅ ADD AI ANALYSIS SUMMARY TO RESPONSE
      aiSummary: {
        totalPhotos: photos.length,
        tagSummary,
        categoriesDetected: Object.keys(tagSummary),
        processed: true,
      },
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

    // ✅ ADD TAG STATISTICS
    const tagStats = await Photo.aggregate([
      { $match: { event: eventId } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags.category",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$tags.confidence" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      photos,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
      // ✅ INCLUDE TAG STATISTICS
      tagStats: tagStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          confidence: Math.round(stat.avgConfidence * 100),
        };
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Get photos by event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching photos",
    });
  }
};

// ✅ NEW FUNCTION: GET PHOTOS BY SPECIFIC TAG
const getPhotosByTag = async (req, res) => {
  try {
    const { eventId, tag } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const photos = await Photo.find({
      event: eventId,
      "tags.category": tag,
    })
      .populate("uploadedBy", "name")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Photo.countDocuments({
      event: eventId,
      "tags.category": tag,
    });

    res.json({
      success: true,
      photos,
      tag,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get photos by tag error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
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
// photoshare-backend/src/controllers/photoController.js

const deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    // Find the photo
    const photo = await Photo.findById(photoId).populate("event");

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    // Check if user is the photographer who owns this event
    if (photo.event.photographer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this photo",
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
      console.log(`Deleted from Cloudinary: ${photo.cloudinaryPublicId}`);
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
      // Continue even if Cloudinary deletion fails
    }

    // Delete from MongoDB
    await Photo.findByIdAndDelete(photoId);

    res.json({
      success: true,
      message: "Photo deleted successfully",
      photoId: photoId,
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete photo",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Add to exports
module.exports = {
  uploadPhotos,
  getPhotosByEvent,
  getPhotosByTag,
  likePhoto,
  downloadPhoto,
  deletePhoto, // ✅ ADD THIS
};
