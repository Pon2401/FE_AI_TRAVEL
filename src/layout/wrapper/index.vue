<template>
  <div class="layout-wrapper">
    <!-- Header -->
    <Header />

    <!-- Main Container -->
    <div class="layout-container">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="main-content">
        <div class="page-wrapper">
          <router-view></router-view>
        </div>

        <!-- Footer -->
        <Footer />
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'DefaultLayout',
  components: {
    Header,
    Sidebar,
    Footer,
  },
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f0f4f8;
}

.layout-container {
  display: flex;
  flex-grow: 1;
  margin-top: 70px;
}

.main-content {
  flex-grow: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 70px);
  transition: margin-left 0.3s ease;
}

.page-wrapper {
  flex-grow: 1;
  padding: 28px;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 80px;
  }

  .page-wrapper {
    padding: 16px;
  }
}

/* Scrollbar styling for main content */
.page-wrapper::-webkit-scrollbar {
  width: 6px;
}

.page-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.page-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.page-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>