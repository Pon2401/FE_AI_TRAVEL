<template>
    <div class="register-wrapper d-flex align-items-center justify-content-center min-vh-100 py-5">
        <div class="register-overlay"></div>
        <div class="container z-index-1">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-10 col-xl-8">
                    <div class="card register-card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="row g-0">
                            <!-- Left Side: Image/Branding -->
                            <div class="col-md-5 d-none d-md-flex align-items-center justify-content-center bg-branding position-relative overflow-hidden p-5 text-center">
                                <div class="position-absolute top-0 start-0 w-100 h-100 bg-overlay"></div>
                                <div class="position-relative z-index-1 text-white">
                                    <div class="logo-icon bg-gradient-brand text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm"
                                        style="width: 60px; height: 60px;">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3H7FDGtE7IOwPdIbFilEYiOmUAI9w-x1U6A&s"
                                            alt="Logo" class="logo-img" />
                                    </div>
                                    <h2 class="fw-bold mb-3 text-uppercase" style="letter-spacing: 1px;">AI Travel</h2>
                                    <p class="opacity-75 fs-6 mb-0">Hành trình ngàn dặm bắt đầu từ một bước chân. Đăng ký ngay để trải nghiệm!</p>
                                </div>
                            </div>

                            <!-- Right Side: Form -->
                            <div class="col-md-7">
                                <div class="card-body p-4 p-sm-5">
                                    <div class="text-center mb-4 d-md-none">
                                        <div class="logo-icon bg-gradient-brand text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style="width: 60px; height: 60px;">
                                            <i class="fa-solid fa-earth-americas fs-2"></i>
                                        </div>
                                    </div>

                                    <div class="text-center mb-4">
                                        <h3 class="fw-bold text-uppercase mb-1" style="letter-spacing: 0.5px; color: #2c3e50;">Tạo Tài Khoản Mới</h3>
                                        <p class="text-muted small">Hãy điền thông tin bên dưới để tham gia với CDIO 4</p>
                                    </div>

                                    <div class="form-body mt-4">
                                        <div class="row g-3">
                                            <!-- Row 1: Tên & Email -->
                                            <div class="col-sm-6">
                                                <label class="form-label fw-semibold text-secondary small">Họ và tên <span class="text-danger">*</span></label>
                                                <div class="input-group bg-light rounded-3 transition-all" :class="{ 'border-danger': errors.ten }">
                                                    <span class="input-group-text border-0 bg-transparent text-primary px-3">
                                                        <i class="fa-regular fa-user"></i>
                                                    </span>
                                                    <input v-model="user.ten" type="text" class="form-control border-0 bg-transparent fs-6" :class="{ 'is-invalid': errors.ten }" placeholder="Nguyễn Văn A">
                                                </div>
                                                <div v-if="errors.ten" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.ten }}</div>
                                            </div>

                                            <div class="col-sm-6">
                                                <label class="form-label fw-semibold text-secondary small">Email <span class="text-danger">*</span></label>
                                                <div class="input-group bg-light rounded-3 transition-all" :class="{ 'border-danger': errors.email }">
                                                    <span class="input-group-text border-0 bg-transparent text-primary px-3">
                                                        <i class="fa-regular fa-envelope"></i>
                                                    </span>
                                                    <input v-model="user.email" type="email" class="form-control border-0 bg-transparent fs-6" :class="{ 'is-invalid': errors.email }" placeholder="email@example.com">
                                                </div>
                                                <div v-if="errors.email" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.email }}</div>
                                            </div>

                                            <!-- Row 2: SĐT, CCCD, Ngày sinh -->
                                            <div class="col-sm-4">
                                                <label class="form-label fw-semibold text-secondary small">Số điện thoại</label>
                                                <div class="input-group bg-light rounded-3 transition-all" :class="{ 'border-danger': errors.so_dien_thoai }">
                                                    <span class="input-group-text border-0 bg-transparent text-primary px-2">
                                                        <i class="fa-solid fa-phone fs-7"></i>
                                                    </span>
                                                    <input v-model="user.so_dien_thoai" type="text" class="form-control border-0 bg-transparent px-1 fs-6" :class="{ 'is-invalid': errors.so_dien_thoai }" placeholder="09xx">
                                                </div>
                                                <div v-if="errors.so_dien_thoai" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.so_dien_thoai }}</div>
                                            </div>

                                            <div class="col-sm-4">
                                                <label class="form-label fw-semibold text-secondary small">Số CCCD</label>
                                                <div class="input-group bg-light rounded-3 transition-all" :class="{ 'border-danger': errors.cccd }">
                                                    <span class="input-group-text border-0 bg-transparent text-primary px-2">
                                                        <i class="fa-regular fa-id-card fs-7"></i>
                                                    </span>
                                                    <input v-model="user.cccd" type="text" class="form-control border-0 bg-transparent px-1 fs-6" :class="{ 'is-invalid': errors.cccd }" placeholder="0012...">
                                                </div>
                                                <div v-if="errors.cccd" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.cccd }}</div>
                                            </div>

                                            <div class="col-sm-4">
                                                <label class="form-label fw-semibold text-secondary small">Ngày Sinh</label>
                                                <input v-model="user.ngay_sinh" type="date" class="form-control bg-light border-0 rounded-3 px-3 fs-6 transition-all" :class="{ 'is-invalid border-danger border': errors.ngay_sinh }" style="height: 38px;" min="1900-01-01" max="2025-12-31">
                                                <div v-if="errors.ngay_sinh" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.ngay_sinh }}</div>
                                            </div>

                                            <!-- Row 3: Mật khẩu -->
                                            <div class="col-sm-6 mt-4">
                                                <label class="form-label fw-semibold text-secondary small">Mật khẩu <span class="text-danger">*</span></label>
                                                <div class="input-group bg-light rounded-3 transition-all" :class="{ 'border-danger': errors.mat_khau }">
                                                    <span class="input-group-text border-0 bg-transparent text-primary px-3">
                                                        <i class="fa-solid fa-lock"></i>
                                                    </span>
                                                    <input v-model="user.mat_khau" type="password" class="form-control border-0 bg-transparent fs-6" :class="{ 'is-invalid': errors.mat_khau }" placeholder="••••••••">
                                                </div>
                                                <div v-if="errors.mat_khau" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.mat_khau }}</div>
                                            </div>

                                            <div class="col-sm-6 mt-4">
                                                <label class="form-label fw-semibold text-secondary small">Xác nhận MK <span class="text-danger">*</span></label>
                                                <div class="input-group bg-light rounded-3 transition-all" :class="{ 'border-danger': errors.re_password }">
                                                    <span class="input-group-text border-0 bg-transparent text-primary px-3">
                                                        <i class="fa-solid fa-check-double"></i>
                                                    </span>
                                                    <input v-model="user.re_password" type="password" class="form-control border-0 bg-transparent fs-6" :class="{ 'is-invalid': errors.re_password }" placeholder="••••••••">
                                                </div>
                                                <div v-if="errors.re_password" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.re_password }}</div>
                                            </div>

                                            <!-- Row 4: Điều khoản -->
                                            <div class="col-12 mt-4">
                                                <div class="form-check">
                                                    <input v-model="agreeTerms" class="form-check-input border-secondary" type="checkbox" id="termsCheck">
                                                    <label class="form-check-label text-muted small ms-1" for="termsCheck" style="line-height: 1.4;">
                                                        Tôi đồng ý với <a href="#" class="text-primary text-decoration-none">Điều khoản dịch vụ</a> và <a href="#" class="text-primary text-decoration-none">Chính sách bảo mật</a> của AI Travel.
                                                    </label>
                                                </div>
                                                <div v-if="errors.terms" class="text-danger small mt-1 ms-1"><i class="bi bi-exclamation-circle me-1"></i>{{ errors.terms }}</div>
                                            </div>

                                            <!-- Submit -->
                                            <div class="col-12 mt-4">
                                                <button @click="dangKyTaiKhoan()" class="btn btn-primary w-100 rounded-3 fw-bold btn-register shadow-sm py-2 fs-6 pb-2 pt-2 text-uppercase" style="letter-spacing: 1px;">
                                                    <i class="fa-solid fa-user-plus me-2"></i> Đăng Ký Ngay
                                                </button>
                                            </div>
                                        </div> <!-- ends row g-3 -->

                                        <div class="text-center mt-4">
                                            <p class="text-muted small mb-0">Bạn đã có tài khoản?
                                                <router-link to="/client/dang-nhap" class="text-primary fw-bold text-decoration-none ms-1 hover-underline">
                                                    Đăng nhập tại đây
                                                </router-link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-4 text-white-50 small" style="position: relative; z-index: 1;">
                        <p>&copy; 2026 CDIO 4 - AI Travel System.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            user: {},
            agreeTerms: false,
            errors: {},       // { ten, email, mat_khau, re_password, so_dien_thoai, cccd, ngay_sinh, terms }
            loading: false,
        }
    },
    methods: {
        clearErrors() {
            this.errors = {};
        },

        /** Kiểm tra client-side trước khi gửi API */
        validateClient() {
            this.clearErrors();
            let valid = true;

            if (!this.user.ten?.trim()) {
                this.errors.ten = 'Vui lòng nhập họ tên.';
                valid = false;
            }
            if (!this.user.email?.trim()) {
                this.errors.email = 'Vui lòng nhập địa chỉ email.';
                valid = false;
            }
            if (!this.user.mat_khau) {
                this.errors.mat_khau = 'Vui lòng nhập mật khẩu.';
                valid = false;
            } else if (this.user.mat_khau.length < 6) {
                this.errors.mat_khau = 'Mật khẩu phải có ít nhất 6 ký tự.';
                valid = false;
            }
            if (!this.user.re_password) {
                this.errors.re_password = 'Vui lòng xác nhận mật khẩu.';
                valid = false;
            } else if (this.user.mat_khau !== this.user.re_password) {
                this.errors.re_password = 'Mật khẩu xác nhận không khớp.';
                valid = false;
            }
            if (!this.agreeTerms) {
                this.errors.terms = 'Bạn cần đồng ý với điều khoản dịch vụ.';
                valid = false;
            }
            return valid;
        },

        dangKyTaiKhoan() {
            if (!this.validateClient()) return;

            this.loading = true;
            // Không gửi re_password lên server
            const { re_password, ...payload } = this.user;

            axios.post('http://127.0.0.1:8000/api/client/dang-ky', payload)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        this.$router.push('/client-login');
                    } else {
                        // HTTP 200 nhưng status=false (không thường xảy ra với Request mới)
                        this.$toast.error(res.data.message || 'Đăng ký thất bại!');
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 422) {
                        // Lỗi validation từ RegisterKhachHangRequest
                        const apiErrors = error.response.data.errors || {};
                        this.errors = { ...this.errors, ...apiErrors };
                        this.$toast.error(error.response.data.message || 'Dữ liệu không hợp lệ!');
                    } else if (error.response?.status === 500) {
                        this.$toast.error('Lỗi máy chủ, vui lòng thử lại sau.');
                    } else {
                        this.$toast.error('Không thể kết nối đến máy chủ!');
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
}
</script>

<style scoped>
.register-wrapper {
    position: relative;
    background: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop') no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
}

.register-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Gradient chéo */
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(14, 165, 233, 0.6) 100%);
    backdrop-filter: blur(5px);
}

.z-index-1 {
    z-index: 1;
}

.register-card {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.2) !important;
}

.bg-branding {
    background: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop') center center;
    background-size: cover;
}

.bg-overlay {
    background: linear-gradient(to bottom, rgba(14, 165, 233, 0.6), rgba(15, 23, 42, 0.9));
}

.bg-gradient-brand {
    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

.input-group.transition-all {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.08);
}

.input-group.transition-all:focus-within {
    background: #fff !important;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 0.25rem rgba(14, 165, 233, 0.15);
}

.form-control.transition-all {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.08) !important;
}

.form-control.transition-all:focus {
    background: #fff !important;
    border-color: #0ea5e9 !important;
    box-shadow: 0 0 0 0.25rem rgba(14, 165, 233, 0.15);
    outline: none;
}

.input-group .form-control:focus {
    box-shadow: none;
}

.btn-register {
    background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
    border: none;
    transition: all 0.3s ease;
}

.btn-register:hover {
    background: linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(37, 99, 235, 0.3) !important;
}

.hover-underline:hover {
    text-decoration: underline !important;
}

.logo-icon {
    animation: pulse-glow 2s infinite;
}
.logo-wrapper {
    animation: bounce-soft 3s ease-in-out infinite;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

@keyframes pulse-glow {
    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

/* Tinh chỉnh size icon */
.fs-7 {
    font-size: 0.85rem;
}
</style>