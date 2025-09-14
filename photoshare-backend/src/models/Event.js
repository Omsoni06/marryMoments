const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
      minlength: [3, "Venue must be at least 3 characters"],
      maxlength: [200, "Venue cannot exceed 200 characters"],
    },
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    maxDownloads: {
      type: Number,
      default: 100,
      min: [1, "Max downloads must be at least 1"],
      max: [1000, "Max downloads cannot exceed 1000"],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "archived"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
eventSchema.index({ accessCode: 1 });
eventSchema.index({ photographer: 1, createdAt: -1 });

module.exports = mongoose.model("Event", eventSchema);
