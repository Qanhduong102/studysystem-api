// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");

// Các route hiện có
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/:id", userController.deleteUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// Route hiện có cho lịch sử thanh toán
router.get("/payment-history", auth, paymentController.getPaymentHistory);

// Route để thêm thanh toán (dùng cho phần thanh toán khóa học)
router.post("/payment", auth, paymentController.addPayment);

module.exports = router;