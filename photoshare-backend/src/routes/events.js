const express = require("express");
const multer = require("multer");
const {
  createEvent,
  getEvents,
  getEventById,
  getEventByAccessCode,
  updateEvent,
} = require("../controllers/eventController");
const {
  uploadPhotos,
  getEventPhotos,
} = require("../controllers/photoController");
const auth = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Validation middleware
const validateEvent = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("venue")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Venue must be between 3 and 200 characters"),
  body("date").isISO8601().withMessage("Please provide a valid date"),
];

// Event routes
router.post("/", auth, validateEvent, createEvent);
router.get("/", auth, getEvents);
router.get("/:id", auth, getEventById);
router.get("/access/:accessCode", getEventByAccessCode);
router.put("/:id", auth, updateEvent);

// Photo routes for events
router.post("/:eventId/photos", auth, upload.array("photos", 10), uploadPhotos);
router.get("/:eventId/photos", getEventPhotos);

module.exports = router;
