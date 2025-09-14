const generateAccessCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateQRCodeData = (accessCode) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${frontendUrl}/gallery/${accessCode}`;
};

const validateObjectId = (id) => {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  generateAccessCode,
  generateQRCodeData,
  validateObjectId,
};
