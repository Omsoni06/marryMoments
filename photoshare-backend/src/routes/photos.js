const express = require("express");
const {
  uploadPhotos,
  getPhotosByEvent,
  likePhoto,
  downloadPhoto,
} = require("../controllers/photoController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/upload/:eventId", auth, upload.array("photos", 10), uploadPhotos);
router.get("/event/:eventId", getPhotosByEvent);
router.post("/:photoId/like", likePhoto);
router.get("/:photoId/download", downloadPhoto);

module.exports = router;
