const Event = require("../models/Event");
const Photo = require("../models/Photo");
const { generateAccessCode } = require("../utils/helpers");

const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, maxDownloads } = req.body;

    const accessCode = generateAccessCode();

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      venue,
      photographer: req.user._id,
      accessCode,
      maxDownloads: maxDownloads || 100,
    });

    await event.populate("photographer", "name email");

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ photographer: req.user._id })
      .populate("photographer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "photographer",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the photographer
    if (event.photographer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
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
    res.status(500).json({ message: "Server error" });
  }
};

const getEventByAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.params;

    const event = await Event.findOne({ accessCode }).populate(
      "photographer",
      "name"
    );

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or access code invalid" });
    }

    if (new Date() > event.expiresAt) {
      return res.status(403).json({ message: "Event access has expired" });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.photographer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("photographer", "name email");

    res.json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getEventByAccessCode,
  updateEvent,
};
