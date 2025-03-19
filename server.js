require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Đã kết nối MongoDB");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1); // Thoát server nếu lỗi
  }
};

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public")); // Phục vụ file tĩnh từ thư mục public

// Middleware log request (bật khi debug)
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Import routes
try {
  const userRoutes = require("./routes/userRoutes");
  const courseRoutes = require("./routes/courseRoutes");
  app.use("/api/users", userRoutes);
  app.use("/api/courses", courseRoutes);
} catch (error) {
  console.error("❌ Lỗi khi import routes:", error);
  process.exit(1);
}

// Route kiểm tra API
app.get("/", (_req, res) => {
  res.json({
    message: "StudySystem API is running...",
    status: "✅ OK",
    time: new Date(),
  });
});

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error("💥 Lỗi xảy ra:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
