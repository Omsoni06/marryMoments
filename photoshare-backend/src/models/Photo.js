const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isProcessed: {
      type: Boolean,
      default: true,
    },
    metadata: {
      size: Number,
      format: String,
      width: Number,
      height: Number,
      cameraMake: String,
      cameraModel: String,
    },

    tags: [
      {
        category: {
          type: String,
          enum: [
            "ceremony", // Main wedding rituals
            "reception", // Reception party
            "family", // Family portraits
            "couple", // Bride & groom photos
            "candid", // Candid moments
            "dance", // Dancing moments
            "food", // Food/catering
            "decoration", // Venue decorations
            "group", // Group photos
            "ritual", // Religious rituals
            "mehendi", // Mehendi ceremony
            "sangam", // Pre-wedding functions
            "kids", // Children at wedding
            "elderly", // Elder family members
            "outdoor", // Outdoor shots
            "indoor", // Indoor shots
          ],
          required: true,
        },
        confidence: {
          type: Number,
          min: 0,
          max: 1,
          required: true,
        },
        detectedObjects: [String], // What AI detected in image
        manuallyAdded: {
          type: Boolean,
          default: false,
        },
      },
    ],

    aiAnalysis: {
      processed: {
        type: Boolean,
        default: false,
      },
      processedAt: Date,
      detectedObjects: [String],
      sceneType: String,
      peopleCount: Number,
      emotionAnalysis: {
        dominant: String, // happy, joyful, surprised
        confidence: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
photoSchema.index({ event: 1, createdAt: -1 });
photoSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model("Photo", photoSchema);
