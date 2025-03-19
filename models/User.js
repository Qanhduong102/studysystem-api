// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["student", "admin", "teacher"], 
        required: true 
    },
    dateOfBirth: { type: Date, required: true }, // Ngày sinh
    phoneNumber: { type: String }, // Số điện thoại (tùy chọn)
    address: { type: String }, // Địa chỉ (tùy chọn)
    gender: { type: String, enum: ["male", "female", "other"] }, // Giới tính
    resetPasswordToken: { type: String }, // Token để khôi phục mật khẩu
    resetPasswordExpires: { type: Date }, // Thời gian hết hạn của token
}, { timestamps: true }); // ✅ Thêm createdAt và updatedAt tự động

const User = mongoose.model("User", userSchema);
module.exports = User;