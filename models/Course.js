const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    teacherName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    courseType: { type: String, enum: ['chuyen-nganh', 'dai-cuong'], required: true },
    courseMaterial: { type: String }, // Lưu tên file (hoặc URL nếu dùng cloud)
    courseFee: { type: Number, default: 0 }
});

module.exports = mongoose.model('Course', CourseSchema);
