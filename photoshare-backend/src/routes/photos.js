const express = require("express");
const {
  uploadPhotos,
  getPhotosByEvent,
  likePhoto,
  downloadPhoto,
} = require("../controllers/photoController");
const auth = require("../middleware/auth");
const { upload, handleMulterError } = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload/:eventId",
  auth,
  upload.array("photos", 10),
  handleMulterError,
  uploadPhotos
);
router.get("/event/:eventId", getPhotosByEvent);
router.post("/:photoId/like", likePhoto);
router.get("/:photoId/download", downloadPhoto);
router.get("/event/:eventId/tag/:tag", getPhotosByTag);

module.exports = router;
