const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// 🟢 Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// 🟢 Lấy thông tin user theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// 🟢 Đăng ký người dùng mới
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, dateOfBirth, phoneNumber, address, gender } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        });

        await newUser.save();
        res.status(201).json({ message: "Tạo tài khoản thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// 🟢 Đăng nhập người dùng
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không đúng" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// 🟢 Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 🟢 Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        // Tạo mã 6 số ngẫu nhiên
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu mã vào database
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút
        await user.save();

        // Gửi email với mã 6 số
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Khôi phục mật khẩu - StudySystem",
            text: `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu khôi phục mật khẩu cho tài khoản của bạn.\n\n` +
                  `Mã khôi phục mật khẩu của bạn là: ${resetCode}\n\n` +
                  `Mã này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Mã khôi phục mật khẩu đã được gửi qua email", email });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// 🟢 Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordToken: resetCode,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Mã không hợp lệ hoặc đã hết hạn" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Các hàm liên quan đến Course (giữ nguyên)
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "name email");
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructor", "name email");
        if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.createCourse = async (req, res) => {
    const { title, description, price, category, thumbnail, instructor } = req.body;

    if (!title || !description || !price || !category || !instructor) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    try {
        const newCourse = new Course({
            title,
            description,
            instructor,
            price,
            category,
            thumbnail,
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: "Lỗi khi tạo khóa học" });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: "Không tìm thấy khóa học" });

        res.json({ message: "Xóa khóa học thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};