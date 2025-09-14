const Event = require("../models/Event");
const Photo = require("../models/Photo");
const { validationResult } = require("express-validator");
const { generateAccessCode } = require("../utils/helpers");

const createEvent = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const { title, description, date, venue, maxDownloads } = req.body;

    // Generate unique access code
    const accessCode = generateAccessCode();

    const event = await Event.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      date: new Date(date),
      venue: venue.trim(),
      photographer: req.user._id,
      accessCode,
      maxDownloads: maxDownloads || 100,
    });

    // Populate photographer info
    await event.populate("photographer", "name email");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating event",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ photographer: req.user._id })
      .populate("photographer", "name email")
      .sort({ createdAt: -1 });

    // Get photo count for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const photoCount = await Photo.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          photoCount,
        };
      })
    );

    res.json({
      success: true,
      events: eventsWithCounts,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching events",
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "photographer",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is the photographer
    if (event.photographer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Get photo count
    const photoCount = await Photo.countDocuments({ event: event._id });

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        photoCount,
      },
    });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
    });
  }
};

const getEventByAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.params;

    const event = await Event.findOne({
      accessCode: accessCode.toUpperCase(),
    }).populate("photographer", "name");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or access code invalid",
      });
    }

    if (new Date() > event.expiresAt) {
      return res.status(403).json({
        success: false,
        message: "Event access has expired",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event by access code error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("photographer", "name email");

    res.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating event",
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getEventByAccessCode,
  updateEvent,
};
