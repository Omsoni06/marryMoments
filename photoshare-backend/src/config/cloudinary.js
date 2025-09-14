const cloudinary = require("cloudinary").v2;

// Log the environment variables to debug
console.log("Cloudinary Environment Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "NOT SET",
  api_key: process.env.CLOUDINARY_API_KEY || "NOT SET",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test the configuration
const testConfig = async () => {
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
  }
};

testConfig();

module.exports = cloudinary;
