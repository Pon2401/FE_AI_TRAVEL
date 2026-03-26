<template>
    <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
        <div class="login-overlay"></div>
        <div class="container z-index-1">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card login-card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="card-body p-5">
                            <div class="text-center mb-5">
                                <div class="logo-wrapper mb-3">
                                    <div class="logo-icon bg-primary text-white bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center shadow" style="width: 65px; height: 65px;">
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3H7FDGtE7IOwPdIbFilEYiOmUAI9w-x1U6A&s"
                                            alt="Logo" class="logo-img" style="width: 95px; height: 95px;" />
                                    </div>
                                </div>
                                <h3 class="fw-bold text-uppercase mb-1" style="letter-spacing: 1px; color: #2c3e50;">Login Admin</h3>
                                <!-- <p class="text-muted mb-0">Hệ Thống Quản Trị Thông Minh</p> -->
                            </div>

                            <div class="form-body">
                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-secondary small text-uppercase">Email Đăng Nhập</label>
                                    <div class="input-group input-group-lg bg-light rounded-3">
                                        <span class="input-group-text border-0 bg-transparent text-primary px-3">
                                            <i class="fa-solid fa-envelope"></i>
                                        </span>
                                        <input v-model="thong_tin_dang_nhap.email" @keydown.enter="dangNhap()" type="email" class="form-control border-0 bg-transparent"
                                            placeholder="admin@travel.com">
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-secondary small text-uppercase">Mật Khẩu</label>
                                    <div class="input-group input-group-lg bg-light rounded-3">
                                        <span class="input-group-text border-0 bg-transparent text-primary px-3">
                                            <i class="fa-solid fa-lock"></i>
                                        </span>
                                        <input v-model="thong_tin_dang_nhap.mat_khau" @keydown.enter="dangNhap()" type="password" class="form-control border-0 bg-transparent"
                                            placeholder="••••••••">
                                    </div>
                                </div>

                                <div class="d-grid mt-5">
                                    <button @click="dangNhap()" class="btn btn-primary btn-lg rounded-3 fw-bold btn-login position-relative overflow-hidden">
                                        <span class="position-relative z-index-1 d-flex align-items-center justify-content-center">
                                            <i class="fa-solid fa-right-to-bracket me-2"></i> Đăng Nhập
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-4 text-white-50 small" style="position: relative; z-index: 1;">
                        <p>&copy; 2026 AI Travel System. Hệ thống phục vụ Khóa Luận Tốt Nghiệp.</p>
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
            thong_tin_dang_nhap : {}
        }
    },
    methods: {
        dangNhap(){
            axios.post('http://127.0.0.1:8000/api/admin/dang-nhap', this.thong_tin_dang_nhap)
                .then((res) => {
                    if (res.data.status) {
                        this.$toast.success(res.data.message);
                        localStorage.setItem('key_admin', res.data.token)
                        this.$router.push('/dashboard')
                    } else {
                        this.$toast.error(res.data.message);
                    }
                });
        }
    }
}
</script>

<style scoped>
.login-wrapper {
    position: relative;
    background: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop') no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
}

.login-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(14, 165, 233, 0.5) 100%);
    backdrop-filter: blur(5px);
}

.z-index-1 {
    z-index: 1;
}

.login-card {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.2) !important;
}

.input-group {
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.05);
}

.input-group:focus-within {
    background: #fff !important;
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.15);
}

.form-control:focus {
    box-shadow: none;
}

.btn-login {
    background: linear-gradient(45deg, #2563eb, #3b82f6);
    border: none;
    transition: all 0.3s ease;
}

.btn-login:hover {
    background: linear-gradient(45deg, #1d4ed8, #2563eb);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
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

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
}
</style>
