// public/script.js
// Biến lưu email tạm thời
let tempEmail = "";

// Hiển thị form đăng ký
function showRegister() {
    document.getElementById("register-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-form").style.display = "none";
    document.getElementById("reset-password-form").style.display = "none";
}

// Hiển thị form đăng nhập
function showLogin() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("forgot-password-form").style.display = "none";
    document.getElementById("reset-password-form").style.display = "none";
}

// Hiển thị form quên mật khẩu
function showForgotPassword() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-form").style.display = "block";
    document.getElementById("reset-password-form").style.display = "none";
}

// Hiển thị form đặt lại mật khẩu
function showResetPassword() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-form").style.display = "none";
    document.getElementById("reset-password-form").style.display = "block";
}

// Hàm chuyển hướng về trang chủ
function redirectToHome() {
    window.location.href = "http://localhost:3000/";
}

// Xử lý form đăng ký
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;
    const dateOfBirth = document.getElementById("registerDob").value;
    const phoneNumber = document.getElementById("registerPhone").value;
    const address = document.getElementById("registerAddress").value;
    const gender = document.getElementById("registerGender").value;

    try {
        const response = await fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password,
                role,
                dateOfBirth,
                phoneNumber,
                address,
                gender,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            showLogin();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Có lỗi xảy ra: " + error.message);
    }
});

// Xử lý form đăng nhập
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        }); 

        const data = await response.json();
        if (response.ok) {
            // Lưu token, email và role vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);
            localStorage.setItem("role", data.role);

            // Thay vì chuyển hướng ngay, hiển thị thông báo và nút để người dùng nhấp
            const loginForm = document.getElementById("login-form");
            loginForm.innerHTML = `
                <div class="success-message">
                    <h3>Đăng nhập thành công!</h3>
                    <p>Bạn đã đăng nhập với email: ${email}</p>
                    <button onclick="redirectToHome()" class="btn btn-primary">Về trang chủ</button>
                </div>
            `;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Có lỗi xảy ra: " + error.message);
    }
});

// Xử lý form quên mật khẩu
document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value;
    tempEmail = email;

    try {
        const response = await fetch("http://localhost:5000/api/users/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            showResetPassword();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Có lỗi xảy ra: " + error.message);
    }
});

// Xử lý form đặt lại mật khẩu
document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const resetCode = document.getElementById("resetCode").value;
    const newPassword = document.getElementById("newPassword").value;
    const email = tempEmail;

    try {
        const response = await fetch("http://localhost:5000/api/users/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, resetCode, newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            tempEmail = "";
            showLogin();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Có lỗi xảy ra: " + error.message);
    }
});

// Mặc định hiển thị form đăng nhập khi tải trang
showLogin();