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
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
photoSchema.index({ event: 1, createdAt: -1 });
photoSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model("Photo", photoSchema);
