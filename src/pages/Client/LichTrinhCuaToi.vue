<template>
  <div class="ltct-page">
    <div class="container ltct-container">

      <!-- Header -->
      <div class="ltct-header">
        <div>
          <h1><i class="bi bi-collection-fill me-2 text-brand"></i>Lịch trình của tôi</h1>
          <p>Tất cả các chuyến đi bạn đã lên kế hoạch.</p>
        </div>
        <router-link to="/tao-lich-trinh" class="btn-brand-lg">
          <i class="bi bi-plus-circle me-2"></i>Tạo chuyến đi mới
        </router-link>
      </div>

      <!-- Not logged in -->
      <div v-if="!token" class="ltct-empty">
        <i class="bi bi-lock-fill"></i>
        <h4>Bạn chưa đăng nhập</h4>
        <p>Vui lòng đăng nhập để xem lịch trình của bạn.</p>
        <router-link to="/client-login" class="btn-brand-lg">Đăng nhập ngay</router-link>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="ltct-loading">
        <div class="spinner"></div>
        <span>Đang tải lịch trình...</span>
      </div>

      <!-- Empty list -->
      <div v-else-if="chuyenDis.length === 0" class="ltct-empty">
        <i class="bi bi-calendar-x"></i>
        <h4>Chưa có chuyến đi nào</h4>
        <p>Hãy tạo chuyến đi đầu tiên của bạn ngay hôm nay!</p>
        <router-link to="/tao-lich-trinh" class="btn-brand-lg">Tạo ngay</router-link>
      </div>

      <!-- Trip list -->
      <div v-else class="trips-grid">
        <div
          v-for="trip in chuyenDis"
          :key="trip.id"
          class="trip-card"
        >
          <div class="trip-card-header">
            <div class="trip-icon-wrap">
              <i class="bi bi-airplane-fill"></i>
            </div>
            <div class="trip-card-status" :class="trip.tinh_trang == 1 ? 'active' : 'done'">
              {{ trip.tinh_trang == 1 ? 'Đang lên kế hoạch' : 'Hoàn thành' }}
            </div>
          </div>

          <h4 class="trip-title">{{ trip.ten_chuyen_di }}</h4>

          <div class="trip-info-rows">
            <div class="trip-info-row" v-if="trip.ngay_bat_dau">
              <i class="bi bi-calendar3 me-2"></i>
              <span>{{ formatDate(trip.ngay_bat_dau) }} → {{ formatDate(trip.ngay_ket_thuc) }}</span>
            </div>
            <div class="trip-info-row">
              <i class="bi bi-sun me-2"></i>
              <span>{{ calcSoNgay(trip.ngay_bat_dau, trip.ngay_ket_thuc) }}</span>
            </div>
            <div class="trip-info-row">
              <i class="bi bi-people me-2"></i>
              <span>{{ trip.so_luong_thanh_vien || 1 }} thành viên</span>
            </div>
            <div class="trip-info-row" v-if="trip.ngan_sach_du_kien > 0">
              <i class="bi bi-wallet2 me-2"></i>
              <span>Ngân sách: {{ formatCurrency(trip.ngan_sach_du_kien) }}</span>
            </div>
            <div class="trip-info-row" v-if="trip.chu_thich">
              <i class="bi bi-chat-left-text me-2"></i>
              <span class="text-muted">{{ trip.chu_thich }}</span>
            </div>
          </div>

          <div class="trip-card-footer">
            <span class="trip-date-created">Tạo: {{ formatDateFull(trip.created_at) }}</span>
            <button class="btn-delete" @click="confirmDelete(trip)" title="Xóa chuyến đi">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Delete confirm modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal-box">
        <div class="modal-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h4>Xóa chuyến đi?</h4>
        <p>Bạn có chắc muốn xóa <strong>"{{ deleteTarget.ten_chuyen_di }}"</strong>? Hành động này không thể hoàn tác.</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="deleteTarget = null">Hủy</button>
          <button class="btn-danger" @click="doDelete" :disabled="deleting">
            <span v-if="deleting"><i class="bi bi-hourglass-split me-1"></i>Đang xóa...</span>
            <span v-else><i class="bi bi-trash3 me-1"></i>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BASE = 'http://localhost:8000/api';

export default {
  name: 'LichTrinhCuaToi',

  data() {
    return {
      token: localStorage.getItem('client_token'),
      chuyenDis: [],
      loading: false,
      deleteTarget: null,
      deleting: false,
    };
  },

  mounted() {
    if (this.token) this.fetchData();
  },

  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const res = await fetch(`${BASE}/client/chuyen-di/get-data`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        const json = await res.json();
        this.chuyenDis = json.data || [];
      } catch {
        this.chuyenDis = [];
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '?';
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    formatDateFull(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('vi-VN');
    },

    formatCurrency(val) {
      return Number(val).toLocaleString('vi-VN') + 'đ';
    },

    calcSoNgay(start, end) {
      if (!start || !end) return '?';
      const ms = new Date(end) - new Date(start);
      const days = Math.max(1, Math.round(ms / 86400000) + 1);
      return `${days} ngày ${days - 1} đêm`;
    },

    confirmDelete(trip) {
      this.deleteTarget = trip;
    },

    async doDelete() {
      if (!this.deleteTarget) return;
      this.deleting = true;
      try {
        const res = await fetch(`${BASE}/client/chuyen-di/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
          body: JSON.stringify({ id: this.deleteTarget.id }),
        });
        const json = await res.json();
        if (json.status) {
          this.chuyenDis = this.chuyenDis.filter(t => t.id !== this.deleteTarget.id);
          this.deleteTarget = null;
        }
      } catch {}
      this.deleting = false;
    },
  },
};
</script>

<style scoped>
.ltct-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #f0f7ff 0%, #fafbff 60%, #f0fff8 100%);
  padding-bottom: 5rem;
}

.ltct-container {
  max-width: 1040px;
  padding-top: 3rem;
}

.ltct-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.ltct-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e2d44;
  margin-bottom: 0.25rem;
}

.ltct-header p {
  color: #6b7a90;
  font-size: 0.95rem;
  margin: 0;
}

.text-brand { color: #10b981; }

.btn-brand-lg {
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.72rem 1.6rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
  transition: all 0.2s;
}
.btn-brand-lg:hover { transform: translateY(-2px); color: #fff; }

/* Empty state */
.ltct-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 5rem 1rem;
  text-align: center;
  color: #7a8ea0;
}
.ltct-empty i { font-size: 3.5rem; color: #c0cedf; }
.ltct-empty h4 { font-size: 1.25rem; font-weight: 700; color: #3d5166; margin: 0; }
.ltct-empty p { font-size: 0.93rem; margin: 0; }

/* Loading */
.ltct-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: #7a8ea0;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3.5px solid #e8edf5;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Grid */
.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.3rem;
}

.trip-card {
  background: #fff;
  border-radius: 1.3rem;
  padding: 1.4rem 1.5rem;
  border: 1px solid #e6ecf5;
  box-shadow: 0 6px 22px rgba(30, 45, 68, 0.07);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: all 0.22s;
}
.trip-card:hover {
  box-shadow: 0 14px 35px rgba(30, 45, 68, 0.12);
  transform: translateY(-3px);
}

.trip-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.trip-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7, #dbeafe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #10b981;
}
.trip-card-status {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.22rem 0.75rem;
  border-radius: 999px;
}
.trip-card-status.active { background: #dcfce7; color: #15803d; }
.trip-card-status.done { background: #e0f2fe; color: #0369a1; }

.trip-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e2d44;
  margin: 0;
  line-height: 1.35;
}

.trip-info-rows { display: flex; flex-direction: column; gap: 0.38rem; }
.trip-info-row {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #5a6d80;
}
.trip-info-row i { color: #10b981; font-size: 0.9rem; }

.trip-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f4fb;
}
.trip-date-created { font-size: 0.78rem; color: #a0adbf; }
.btn-delete {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #fecdd3;
  background: #fff1f2;
  color: #e11d48;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.18s;
}
.btn-delete:hover { background: #e11d48; color: #fff; border-color: #e11d48; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(4px);
}
.modal-box {
  background: #fff;
  border-radius: 1.4rem;
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  text-align: center;
  animation: popIn 0.28s ease both;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.18);
}
@keyframes popIn {
  from { transform: scale(0.88); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff1f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #e11d48;
  margin: 0 auto 1rem;
}
.modal-box h4 { font-weight: 800; color: #1e2d44; margin-bottom: 0.5rem; }
.modal-box p { font-size: 0.92rem; color: #5a6d80; margin-bottom: 1.5rem; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: center; }

.btn-ghost {
  background: transparent;
  color: #5a6d80;
  border: 1.5px solid #d5dde8;
  border-radius: 999px;
  padding: 0.62rem 1.4rem;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-ghost:hover { background: #f0f4fb; }

.btn-danger {
  background: linear-gradient(135deg, #e11d48, #f97316);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.62rem 1.4rem;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(225, 29, 72, 0.28);
  transition: all 0.18s;
}
.btn-danger:hover:not(:disabled) { transform: translateY(-1px); }
.btn-danger:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
