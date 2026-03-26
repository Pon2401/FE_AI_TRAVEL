<template>
  <nav class="navbar navbar-expand-lg client-navbar fixed-top">
    <div class="container">

      <!-- LOGO -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3H7FDGtE7IOwPdIbFilEYiOmUAI9w-x1U6A&s"
          alt="Logo" class="logo-img" />
        <span class="ms-2 brand-text">DaNang Travel</span>
      </router-link>

      <!-- TOGGLE -->
      <button class="navbar-toggler border-0 shadow-none" data-bs-toggle="collapse" data-bs-target="#clientNavbar">
        <i class="bi bi-list fs-2 text-white"></i>
      </button>

      <div id="clientNavbar" class="collapse navbar-collapse">

        <!-- MENU -->
        <ul class="navbar-nav mx-auto">

          <li class="nav-item">
            <router-link to="/" class="nav-link">Trang Chủ</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/tao-lich-trinh" class="nav-link">
              Tạo lịch trình
            </router-link>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Địa điểm</a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/dia-diem">Giải trí</router-link></li>
              <li><router-link class="dropdown-item" to="/am-thuc">Ẩm thực</router-link></li>
              <li><router-link class="dropdown-item" to="/giai-tri">Tâm linh</router-link></li>
            </ul>
          </li>


          <li class="nav-item">
            <router-link to="/nhom-du-lich" class="nav-link">Nhóm du lịch</router-link>
          </li>
        </ul>

        <!-- AUTH BUTTONS / PROFILE -->
        <div class="d-flex align-items-center gap-2">

          <!-- === Chưa đăng nhập === -->
          <template v-if="!isLoggedIn">
            <router-link to="/client/dang-nhap" class="btn btn-login px-4">
              Đăng nhập
            </router-link>
            <router-link to="/client/dang-ky" class="btn btn-register-outline px-4 rounded-pill">
              Đăng ký
            </router-link>
          </template>

          <!-- === Đã đăng nhập: Profile dropdown === -->
          <div v-else class="dropdown">
            <button class="btn btn-profile d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              data-bs-toggle="dropdown" aria-expanded="false">
              <div class="avatar-circle">
                {{ avatarLetter }}
              </div>
              <span class="user-name d-none d-sm-inline">{{ userName }}</span>
              <i class="bi bi-chevron-down small opacity-75"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-end profile-dropdown shadow">
              <!-- Header -->
              <li class="dropdown-header px-4 pt-3 pb-2">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle avatar-lg">{{ avatarLetter }}</div>
                  <div>
                    <div class="fw-bold text-dark" style="font-size:0.95rem;">{{ userName }}</div>
                    <div class="text-muted" style="font-size:0.78rem;">Thành viên</div>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>

              <!-- Menu items -->
              <li>
                <router-link to="/profile" class="dropdown-item d-flex align-items-center gap-2">
                  <i class="bi bi-person-circle text-primary"></i> Thông tin cá nhân
                </router-link>
              </li>
              <li>
                <router-link to="/lich-trinh-cua-toi" class="dropdown-item d-flex align-items-center gap-2">
                  <i class="bi bi-map text-success"></i> Lịch trình của tôi
                </router-link>
              </li>
              <li>
                <router-link to="/nhom-du-lich" class="dropdown-item d-flex align-items-center gap-2">
                  <i class="bi bi-people text-warning"></i> Nhóm du lịch
                </router-link>
              </li>

              <li><hr class="dropdown-divider"></li>
              <li>
                <button @click="dangXuat" class="dropdown-item d-flex align-items-center gap-2 text-danger">
                  <i class="bi bi-box-arrow-right"></i> Đăng xuất
                </button>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userName: '',
    }
  },
  computed: {
    avatarLetter() {
      return this.userName ? this.userName.trim().charAt(0).toUpperCase() : '?'
    }
  },
  mounted() {
    this.checkAuth()
    // Cập nhật khi localStorage thay đổi (đăng nhập từ tab khác)
    window.addEventListener('storage', this.checkAuth)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuth)
  },
  watch: {
    // Cập nhật mỗi khi route thay đổi (đăng nhập/đăng xuất trong cùng tab)
    $route() {
      this.checkAuth()
    }
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('client_token')
      this.isLoggedIn = !!token
      this.userName = localStorage.getItem('client_ten') || 'Tôi'
    },
    dangXuat() {
      localStorage.removeItem('client_token')
      localStorage.removeItem('client_ten')
      this.isLoggedIn = false
      this.userName = ''
      this.$router.replace('/client/dang-nhap')
    },
    isActive(path) {
      return this.$route.path === path
    }
  }
}
</script>

<style scoped>
/* NAVBAR */
.client-navbar {
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(12px);
  transition: 0.3s;
}

/* LOGO */
.brand-mark {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 700;
}

.brand-badge {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7b54, #ffb26b);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* MENU */
.nav-link {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  margin: 0 10px;
  position: relative;
}

/* underline */
.nav-link::after {
  content: '';
  width: 0;
  height: 2px;
  background: #ffb26b;
  position: absolute;
  bottom: -5px;
  left: 0;
  transition: 0.3s;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}

/* DROPDOWN */
.dropdown-menu {
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* LOGIN BUTTON */
.btn-login {
  background: linear-gradient(135deg, #ff7b54, #ffb26b);
  color: #fff;
  border-radius: 30px;
  font-weight: 600;
  transition: 0.3s;
}

.btn-login:hover {
  transform: translateY(-2px);
  color: #fff;
}

/* MOBILE */
@media (max-width: 991px) {
  #clientNavbar {
    background: rgba(10, 25, 47, 0.95);
    padding: 15px;
    border-radius: 10px;
    margin-top: 10px;
  }
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.brand-text {
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}

.btn-register-outline {
  background: transparent;
  color: #00c6ff;
  border: 1.5px solid #00c6ff;
  transition: all 0.3s ease;
}

.btn-register-outline:hover {
  background: #00c6ff;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 198, 255, 0.4);
}

/* ===== PROFILE BUTTON & DROPDOWN ===== */
.btn-profile {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  transition: all 0.3s ease;
}
.btn-profile:hover, .btn-profile:focus {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.1);
}

/* Avatar circle */
.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7b54, #ffb26b);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar-circle.avatar-lg {
  width: 46px;
  height: 46px;
  font-size: 1.2rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Dropdown panel */
.profile-dropdown {
  min-width: 240px;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  padding: 0;
  margin-top: 8px;
  background: #fff;
}
.profile-dropdown .dropdown-header {
  background: linear-gradient(135deg, #f0f4ff, #fff8ef);
}
.profile-dropdown .dropdown-item {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  transition: background 0.2s;
}
.profile-dropdown .dropdown-item:hover {
  background: #f5f7ff;
}
.profile-dropdown .dropdown-item.text-danger:hover {
  background: #fff0f0;
}
.profile-dropdown .dropdown-divider {
  margin: 0;
}
</style>