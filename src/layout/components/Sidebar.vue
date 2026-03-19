<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <span v-if="!isCollapsed" class="text-white fw-bold">Menu</span>
      <button 
        class="btn-collapse" 
        @click="toggleSidebar"
        :title="isCollapsed ? 'Expand' : 'Collapse'"
      >
        <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <ul class="nav-menu">
        <!-- Dashboard -->
        <li class="nav-item">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ active: isActive('/') }"
          >
            <i class="bi bi-house-door"></i>
            <span v-if="!isCollapsed" class="nav-label">Dashboard</span>
          </router-link>
        </li>

        <!-- Users -->
        <li class="nav-item">
          <router-link 
            to="/users" 
            class="nav-link"
            :class="{ active: isActive('/users') }"
          >
            <i class="bi bi-people"></i>
            <span v-if="!isCollapsed" class="nav-label">Users</span>
          </router-link>
        </li>

        <!-- Products -->
        <li class="nav-item">
          <router-link 
            to="/products" 
            class="nav-link"
            :class="{ active: isActive('/products') }"
          >
            <i class="bi bi-box"></i>
            <span v-if="!isCollapsed" class="nav-label">Products</span>
          </router-link>
        </li>

        <!-- Orders with submenu -->
        <li class="nav-item">
          <a 
            class="nav-link" 
            @click="toggleSubmenu"
            :class="{ active: showSubmenu }"
          >
            <i class="bi bi-cart"></i>
            <span v-if="!isCollapsed" class="nav-label">Orders</span>
            <i v-if="!isCollapsed" class="bi bi-chevron-down ms-auto chevron"></i>
          </a>
          <ul v-if="showSubmenu && !isCollapsed" class="submenu">
            <li>
              <router-link to="/orders/list" class="submenu-link">
                <i class="bi bi-list-check"></i>
                <span>List Orders</span>
              </router-link>
            </li>
            <li>
              <router-link to="/orders/create" class="submenu-link">
                <i class="bi bi-plus-circle"></i>
                <span>Create Order</span>
              </router-link>
            </li>
          </ul>
        </li>

        <!-- Reports -->
        <li class="nav-item">
          <router-link 
            to="/reports" 
            class="nav-link"
            :class="{ active: isActive('/reports') }"
          >
            <i class="bi bi-bar-chart"></i>
            <span v-if="!isCollapsed" class="nav-label">Reports</span>
          </router-link>
        </li>

        <!-- Settings -->
        <li class="nav-item">
          <router-link 
            to="/settings" 
            class="nav-link"
            :class="{ active: isActive('/settings') }"
          >
            <i class="bi bi-gear"></i>
            <span v-if="!isCollapsed" class="nav-label">Settings</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <small v-if="!isCollapsed" class="text-secondary">v1.0.0</small>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isCollapsed: false,
      showSubmenu: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleSubmenu() {
      this.showSubmenu = !this.showSubmenu;
    },
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 260px;
  position: fixed;
  top: 70px;
  left: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  transition: all 0.3s ease;
  z-index: 100;
  border-right: 1px solid #e9ecef;
}

.sidebar.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-bottom: 1px solid #e2e8f0;
  height: 60px;
  color: #495057;
  font-weight: 600;
  font-size: 0.9375rem;
}

.btn-collapse {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-collapse:hover {
  background: #e9ecef;
  color: #5a67d8;
}

.sidebar-nav {
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px 8px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: #6c757d;
  text-decoration: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-link:hover {
  background: #e7f5ff;
  color: #5a67d8;
  border-left-color: #5a67d8;
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(90, 103, 216, 0.1) 0%, rgba(90, 103, 216, 0.05) 100%);
  color: #5a67d8;
  border-left-color: #5a67d8;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.125rem;
  min-width: 20px;
}

.nav-label {
  flex-grow: 1;
}

.chevron {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.nav-link.active .chevron {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  padding: 8px 0 8px 0;
  margin: 0;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 4px;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  margin: 0 8px;
}

.submenu-link:hover {
  background: #e7f5ff;
  color: #5a67d8;
}

.submenu-link.router-link-active {
  color: #5a67d8;
  background: #e7f5ff;
  font-weight: 600;
}

.submenu-link i {
  font-size: 1rem;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #e9ecef;
  text-align: center;
  color: #adb5bd;
  font-size: 0.75rem;
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .sidebar.sidebar-collapsed {
    width: 260px;
  }

  .sidebar-header span,
  .nav-label {
    display: none;
  }

  .sidebar.sidebar-collapsed .sidebar-header span,
  .sidebar.sidebar-collapsed .nav-label {
    display: inline;
  }
}
</style>
