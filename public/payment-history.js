// public/payment-history.js
document.addEventListener('DOMContentLoaded', () => {
    fetchPaymentHistory(); // Tải dữ liệu ban đầu

    // Tự động làm mới danh sách mỗi 5 giây
    setInterval(fetchPaymentHistory, 5000);
});

async function fetchPaymentHistory() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vui lòng đăng nhập trước!");
        window.location.href = "/index.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/users/payment-history", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const payments = await response.json();

        const paymentList = document.getElementById("paymentList");
        paymentList.innerHTML = '<h3>Danh sách thanh toán:</h3>';
        if (Array.isArray(payments)) {
            payments.forEach(payment => {
                paymentList.innerHTML += `
                    <p>Khóa học: ${payment.courseId?.name || 'Không xác định'}</p>
                    <p>Số tiền: ${payment.amount || 0} VND</p>
                    <p>Ngày: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
                    <p>Trạng thái: ${payment.status || 'N/A'}</p>
                    <hr>
                `;
            });
        } else {
            paymentList.innerHTML += '<p>Không có dữ liệu thanh toán.</p>';
        }
    } catch (error) {
        console.error('Lỗi khi tải lịch sử thanh toán:', error);
        document.getElementById('paymentList').innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
    }
}