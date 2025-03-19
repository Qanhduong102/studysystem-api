const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course'); // Import model Course
const router = express.Router();
const fs = require('fs');

// Cấu hình multer để lưu file vào thư mục 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu file vào thư mục uploads/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
    }
});
const upload = multer({ storage });

// API thêm khóa học (có hỗ trợ upload file)
router.post('/courses', upload.single('courseMaterial'), async (req, res) => {
    try {
        const { courseName, teacherName, courseCode, courseType, courseFee } = req.body;

        if (!courseName || !teacherName || !courseCode || !courseType || !courseFee) {
            return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin khóa học!" });
        }

        const courseMaterial = req.file ? `/uploads/${req.file.filename}` : null; // Để null nếu không có file

        const newCourse = new Course({ courseName, teacherName, courseCode, courseType, courseMaterial, courseFee });
        await newCourse.save();
        res.status(201).json({ message: "Khóa học đã được tạo", course: newCourse });
    } catch (error) {
        console.error("Lỗi khi thêm khóa học:", error);
        res.status(500).json({ error: "Lỗi khi thêm khóa học!" });
    }
});

// API lấy danh sách khóa học
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        res.status(500).json({ error: 'Không thể lấy danh sách khóa học!' });
    }
});
// API xóa khóa học theo mã học phần (courseCode)
router.delete('/courses/:courseCode', async (req, res) => {
    try {
        const courseCode = req.params.courseCode; // Lấy mã học phần từ URL
        const deletedCourse = await Course.findOneAndDelete({ courseCode });

        if (!deletedCourse) {
            return res.status(404).json({ message: "Khóa học không tồn tại!" });
        }

        // Xóa file tài liệu nếu có
        if (deletedCourse.courseMaterial) {
            const filePath = path.join(__dirname, '../', deletedCourse.courseMaterial);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Lỗi khi xóa file:", err);
            });
        }

        res.json({ message: "Xóa khóa học thành công!" });
    } catch (error) {
        console.error("Lỗi xóa khóa học:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;
