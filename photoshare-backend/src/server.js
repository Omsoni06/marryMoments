const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const photoRoutes = require("./routes/photos");

// Initialize Express app
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
  // These will be updated after deployment
  "https://photoshare-frontend-omsoni.onrender.com", // Replace with your actual frontend URL
  "https://photoshare-pro-omsoni.onrender.com", // Alternative naming
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(null, true); // Allow all origins for now, restrict later
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "PhotoShare Pro API is running! 🎉",
    version: "1.0.0",
    status: "healthy",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Test database connection route
app.get("/api/test", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      success: true,
      database: states[dbState],
      mongodb_uri: process.env.MONGODB_URI ? "Set" : "Not set",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// Add this test route
app.get("/api/test-cloudinary", async (req, res) => {
  try {
    const cloudinary = require("./config/cloudinary");

    // Test Cloudinary connection
    const testResult = await cloudinary.api.ping();

    res.json({
      success: true,
      cloudinary_status: "connected",
      config: {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key ? "Set" : "Missing",
      },
      test_result: testResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      cloudinary_config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
        api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
        api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
      },
    });
  }
});
// Debug route to check photos in database
app.get("/api/debug/photos/:eventId", async (req, res) => {
  try {
    const Photo = require("./models/Photo");
    const photos = await Photo.find({ event: req.params.eventId }).limit(10);

    res.json({
      success: true,
      count: photos.length,
      photos: photos.map((photo) => ({
        id: photo._id,
        originalName: photo.originalName,
        cloudinaryUrl: photo.cloudinaryUrl,
        thumbnailUrl: photo.thumbnailUrl,
        cloudinaryPublicId: photo.cloudinaryPublicId,
        createdAt: photo.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Test direct Cloudinary upload
app.post("/api/test-upload", async (req, res) => {
  try {
    const cloudinary = require("./config/cloudinary");

    // Upload a test image (base64 encoded small test image)
    const testImageBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const result = await cloudinary.uploader.upload(testImageBase64, {
      folder: "photoshare/test",
      public_id: `test_${Date.now()}`,
    });

    // Generate thumbnail
    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 400, height: 400, crop: "fill" },
        { quality: "auto:low" },
        { format: "jpg" },
      ],
    });

    res.json({
      success: true,
      original_url: result.secure_url,
      thumbnail_url: thumbnailUrl,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/photos", photoRoutes);

// 404 handler - Use named wildcard parameter for Express v5 compatibility
app.use("/{*notFound}", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join event room
  socket.on("join-event", (eventId) => {
    socket.join(`event-${eventId}`);
    console.log(`User ${socket.id} joined event-${eventId}`);
  });

  // Handle new photo upload broadcast
  socket.on("new-photo", (data) => {
    socket.to(`event-${data.eventId}`).emit("photo-uploaded", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(
    `🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log(
    `🗄️  Database: ${process.env.MONGODB_URI ? "Connected" : "Not configured"}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("Unhandled Promise Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err.message);
  process.exit(1);
});
