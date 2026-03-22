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
            <router-link to="/" class="nav-link">Home</router-link>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Explore</a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/dia-diem">Địa điểm</router-link></li>
              <li><router-link class="dropdown-item" to="/am-thuc">Ẩm thực</router-link></li>
              <li><router-link class="dropdown-item" to="/giai-tri">Giải trí</router-link></li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link to="/tao-lich-trinh" class="nav-link fw-bold text-warning">
              AI Planner 
            </router-link>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">My Trips</a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/lich-trinh-cua-toi">Lịch trình</router-link></li>
              <li><router-link class="dropdown-item" to="/lich-su">Lịch sử</router-link></li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link to="/reviews" class="nav-link">Community</router-link>
          </li>

        </ul>

        <!-- LOGIN BUTTON -->
        <div class="d-flex align-items-center">
          <router-link to="/client-login" class="btn btn-login px-4">
            Đăng nhập
          </router-link>
        </div>

      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
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
</style>