// controllers/paymentController.js
const Payment = require('../models/Payment');

exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware xác thực
    const payments = await Payment.find({ userId }).populate('courseId', 'name');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử thanh toán', error });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { courseId, amount, status } = req.body;
    const userId = req.user.id; // Lấy từ middleware xác thực (phải có token)

    const newPayment = new Payment({
      userId,
      courseId,
      amount,
      status: status || 'completed', // Mặc định là 'completed' nếu không có
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({ message: 'Lưu lịch sử thanh toán thành công', payment: savedPayment });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lưu lịch sử thanh toán', error });
  }
};