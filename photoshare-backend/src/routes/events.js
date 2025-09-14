const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  getEventByAccessCode,
  updateEvent,
} = require("../controllers/eventController");
const auth = require("../middleware/auth");
const { body } = require("express-validator");

const router = express.Router();

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

// ❌ REMOVE ANY PHOTO ROUTES FROM HERE - they should be in routes/photos.js
// Don't add photo routes here since you already have them in routes/photos.js

module.exports = router;
