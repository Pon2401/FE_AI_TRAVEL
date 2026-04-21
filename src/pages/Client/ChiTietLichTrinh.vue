<template>
  <div class="tlt-page">
    <div class="container tlt-body mt-4">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-brand" style="width: 3rem; height: 3rem;" role="status"></div>
        <div class="mt-3 text-muted fs-5">Đang tải lịch trình...</div>
      </div>
      <div v-else-if="!trip" class="text-center py-5 bg-white rounded-4 shadow-sm border border-light">
        <i class="bi bi-calendar-x text-danger display-1 mb-3"></i>
        <h3 class="text-danger fw-bold">Không tìm thấy chuyến đi</h3>
        <p class="text-muted mb-4">Chuyến đi này không tồn tại hoặc đã bị xóa.</p>
        <router-link to="/lich-trinh-cua-toi" class="btn-brand-lg mt-3 text-decoration-none d-inline-block px-4 py-2 text-white" style="border-radius: 999px"><i class="bi bi-arrow-left me-2"></i>Quay lại danh sách</router-link>
      </div>
      <div v-else class="tlt-section animate-in bg-white rounded-4 p-4 shadow-sm" style="border-radius: 1.5rem;">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-3">
          <div>
            <h2 class="fw-bold mb-1"><i class="bi bi-map me-2 text-brand"></i>{{ trip.ten_chuyen_di }}</h2>
            <div class="text-muted mt-2 d-flex gap-3 flex-wrap">
              <span class="badge border bg-light text-dark py-2 px-3 fw-normal" style="border-radius: 8px;"><i class="bi bi-calendar3 me-2 text-primary"></i>{{ formatDateFull(trip.ngay_bat_dau) }}</span>
              <span class="badge border bg-light text-dark py-2 px-3 fw-normal" style="border-radius: 8px;"><i class="bi bi-people me-2 text-info"></i>{{ trip.so_nguoi || 1 }} thành viên</span>
              <span class="badge border bg-light text-dark py-2 px-3 fw-normal" style="border-radius: 8px;"><i class="bi bi-sun me-2 text-warning"></i>{{ formatDuration(trip.so_ngay) }}</span>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary rounded-pill px-3 py-2 fw-bold d-flex align-items-center" @click="$router.push('/lich-trinh-cua-toi')">
              <i class="bi bi-arrow-left me-2"></i>Quay lại
            </button>
            <button class="btn btn-primary rounded-pill px-4 py-2 border-0 fw-bold shadow-sm d-flex align-items-center position-relative overflow-hidden share-btn" @click="showShareModal = true" style="background: linear-gradient(135deg, #10b981, #0ea5e9);">
              <i class="bi bi-share-fill me-2"></i> Gửi vào nhóm
            </button>
          </div>
        </div>

        <div class="alert alert-success d-inline-flex align-items-center py-2 px-3 mt-2 mb-4" v-if="trip.ngan_sach > 0" style="border-radius: 20px;">
          <i class="bi bi-piggy-bank me-2 fs-5"></i>
          <span>
            Chi phí dự kiến (<i class="bi bi-people-fill mx-1"></i>{{ trip.so_nguoi || 1 }} người):
            <strong>{{ formatCurrency(tongChiPhiDuKien) }}</strong> / 
            Ngân sách: <strong>{{ formatCurrency(trip.ngan_sach) }}</strong> 
            <span v-if="tongChiPhiDuKien <= trip.ngan_sach">✅</span>
            <span v-else class="text-danger">❌</span>
          </span>
        </div>

        <!-- Budget tracker -->
        <div class="budget-tracker">
          <div class="budget-info">
            <span>Chi phí vé dự kiến</span>
            <strong>{{ formatCurrency(tongGiaVe) }}</strong>
          </div>
          <div v-if="trip.ngan_sach > 0" class="budget-info">
            <span>Ngân sách</span>
            <strong :class="tongGiaVe > trip.ngan_sach ? 'over' : 'ok'">
              {{ formatCurrency(trip.ngan_sach) }}
            </strong>
          </div>
          <div v-if="trip.ngan_sach > 0" class="budget-bar-wrap">
            <div class="budget-bar-fill" :class="tongGiaVe > trip.ngan_sach ? 'over' : ''"
              :style="{ width: Math.min(100, (tongGiaVe / trip.ngan_sach) * 100) + '%' }"></div>
          </div>
        </div>

        <!-- Day tabs -->
        <div class="day-tabs">
          <button v-for="n in (trip.so_ngay || 1)" :key="n" class="day-tab" :class="{ active: activeDayTab === n }" @click="activeDayTab = n">
            <span class="day-tab-num">Ngày {{ n }}</span>
            <span class="day-tab-date">{{ formatDateDate(trip.ngay_bat_dau, n - 1) }}</span>
            <span class="day-tab-cost fw-bold d-block mt-1" style="font-size: 0.8rem;">
              <i class="bi bi-cash-coin me-1"></i>{{ formatCurrency(chiPhiTheoNgay(n - 1)) }}
            </span>
          </button>
        </div>

        <!-- 2-col layout: Timeline + Map -->
        <div class="step3-layout mt-4">
          <!-- LEFT: Timeline -->
          <div class="step3-left">
            <div class="timeline" v-if="lichTrinhTheoNgay[activeDayTab - 1] && lichTrinhTheoNgay[activeDayTab - 1].length > 0">
              <div v-for="(item, idx) in lichTrinhTheoNgay[activeDayTab - 1]" :key="idx" class="timeline-item">
                <div class="timeline-time">
                  <span class="time-badge">{{ extractTime(item.thoi_gian_du_kien) || '08:00' }}</span>
                  <div class="timeline-line" v-if="idx < lichTrinhTheoNgay[activeDayTab - 1].length - 1"></div>
                </div>
                <div class="timeline-card">
                  <div class="tc-header">
                    <div class="tc-img-wrap">
                      <img
                        :src="item.hinh_anh || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=70'"
                        class="tc-img" loading="lazy" />
                    </div>
                    <div class="tc-meta">
                      <h5>{{ item.ten_dia_diem }}</h5>
                      <p><i class="bi bi-pin-map me-1"></i>{{ item.dia_chi || 'Đà Nẵng' }}</p>
                      <p v-if="item.gia_ve > 0">
                        <i class="bi bi-ticket-perforated me-1"></i>{{ formatCurrency(item.gia_ve) }} / người
                      </p>
                    </div>
                  </div>
                  <div v-if="item.ghi_chu" class="tc-note mt-3 p-2 rounded" style="background: #f8fafc; border: 1px dashed #cbd5e1; font-size: 0.85rem; color: #475569;">
                    <i class="bi bi-pencil-square me-1"></i><span style="font-style: italic;">{{ item.ghi_chu }}</span>
                  </div>
                  <div v-if="item.travel_tips" class="tc-tips mt-2 p-2 rounded"
                    style="background: #fff8e1; border-left: 3px solid #ffc107;">
                    <small class="d-block mb-1 font-weight-bold" style="color: #856404;">
                      <i class="bi bi-lightbulb-fill me-1"></i>Gợi ý chuyên gia:
                    </small>
                    <span style="font-size: 0.85rem; color: #555;">{{ item.travel_tips }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Empty State for Day -->
            <div v-else class="empty-day-placeholder py-5 text-center rounded-4" style="background: #f8fafc;">
              <div class="empty-icon-wrap mb-3">
                <i class="bi bi-calendar-x text-muted fs-1"></i>
              </div>
              <h5 class="text-muted">Ngày này chưa có lịch trình</h5>
            </div>
          </div>

          <!-- RIGHT: Map + Route Info -->
          <div class="step3-right">
            <div class="map-panel">
              <div class="map-panel-head">
                <i class="bi bi-map me-2"></i>Bản đồ vị trí ngày {{ activeDayTab }}
              </div>
              <div id="trip-map" style="height: 500px"></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal chọn nhóm chia sẻ -->
    <div v-if="showShareModal" class="share-modal-overlay d-flex align-items-center justify-content-center" @click.self="showShareModal = false">
      <div class="share-modal-box bg-white p-5 rounded-4 shadow-lg w-100 animate-in position-relative" style="max-width: 440px;">
        <button class="btn-close position-absolute top-0 end-0 m-4" @click="showShareModal = false"></button>
        <div class="text-center mb-4 mt-2">
          <div class="share-icon-wrap mb-3 mx-auto shadow-sm">
             <i class="bi bi-send-check-fill fs-2 text-white"></i>
          </div>
          <h4 class="fw-bold mb-1 text-dark">Chia sẻ lịch trình</h4>
          <p class="text-muted mb-0" style="font-size: 0.95rem;">Chọn nhóm để gửi chuyến đi này nhé!</p>
        </div>
        
        <div class="form-group mb-4">
          <label class="fw-bold mb-2 text-dark" style="font-size: 0.95rem;">Bạn muốn gửi vào nhóm nào?</label>
          <select v-model="selectedGroupToShare" class="form-select border-2 shadow-none modal-select text-dark" style="padding: 0.9rem 1rem; border-radius: 12px; font-weight: 500; cursor: pointer; border-color: #e2e8f0; background-color: #f8fafc;">
            <option :value="null">-- Click để chọn nhóm --</option>
            <option v-for="g in myJoinedGroups" :key="g.id" :value="g">{{ g.ten_nhom }}</option>
          </select>
        </div>

        <button class="btn w-100 rounded-pill fw-bold text-white shadow-sm mt-3" @click="shareToGroup" :disabled="!selectedGroupToShare || sendingShare" style="background: #10b981; padding: 0.9rem; font-size: 1.05rem; transition: all 0.2s;">
          <span v-if="sendingShare" class="d-flex align-items-center justify-content-center"><span class="spinner-border spinner-border-sm me-2"></span> Đang gửi...</span>
          <span v-else class="d-flex align-items-center justify-content-center"><i class="bi bi-chat-heart-fill me-2 fs-5"></i> Chia sẻ ngay</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script>
const BASE = 'http://localhost:8000/api';

export default {
  name: 'ChiTietLichTrinh',
  data() {
    return {
      tripId: this.$route.params.id,
      token: localStorage.getItem('client_token'),
      loading: true,
      trip: null,
      rawPlaces: [],
      lichTrinhTheoNgay: [],
      activeDayTab: 1,

      // Modal chia sẻ
      showShareModal: false,
      myJoinedGroups: [],
      selectedGroupToShare: null,
      sendingShare: false,

      mapInstance: null,
      mapLayers: [],
    };
  },

  computed: {
    tongGiaVe() {
      if (!this.trip) return 0;
      return this.rawPlaces.reduce((sum, item) => sum + (Number(item.gia_ve) || 0) * (this.trip.so_nguoi || 1), 0);
    },
    tongChiPhiDuKien() {
      return this.tongGiaVe;
    }
  },

  watch: {
    activeDayTab(newVal) {
      if (this.trip) {
        this.$nextTick(() => {
          this.renderMapForDay(newVal - 1);
        });
      }
    },
    showShareModal(newVal) {
      if (newVal && this.myJoinedGroups.length === 0) {
        this.fetchMyGroups();
      }
    }
  },

  async mounted() {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(script);
    }

    if (!this.token) {
      this.$toast.warning("Vui lòng đăng nhập để xem lịch trình.");
      this.$router.push('/client/dang-nhap');
      return;
    }
    await this.fetchTripData();
  },

  methods: {
    async fetchTripData() {
      this.loading = true;
      try {
        // Lấy chi tiết chuyến đi
        const res = await fetch(`${BASE}/chuyen-dis/${this.tripId}`);
        const json = await res.json();
        
        if (json.status === 'success' && json.data) {
          this.trip = json.data;
          if(!this.trip.so_ngay) this.trip.so_ngay = 1;

          // Lấy danh sách địa điểm theo chuyến đi
          const res2 = await fetch(`${BASE}/chuyen-di/${this.tripId}/dia-diems`);
          const json2 = await res2.json();
          this.rawPlaces = json2.data || [];

          // Parse vào lịch trình theo ngày
          this.buildSchedule();

          this.$nextTick(() => {
            this.initMap();
          });
        }
      } catch (e) {
        console.error("Lỗi khi tải chuyến đi:", e);
      } finally {
        this.loading = false;
      }
    },

    buildSchedule() {
      const soNgay = this.trip.so_ngay || 1;
      const schedule = Array.from({ length: soNgay }, () => []);

      this.rawPlaces.forEach(item => {
        let dayIdx = 0;
        let t = String(item.thoi_gian_du_kien || '');
        let m = t.match(/Ngày (\d+)/i);
        if (m && m[1]) {
          dayIdx = parseInt(m[1]) - 1;
        }
        if (dayIdx < 0) dayIdx = 0;
        if (dayIdx >= soNgay) dayIdx = soNgay - 1;

        if (item.ghi_chu && item.ghi_chu.includes('|AI_TIPS|')) {
            const parts = item.ghi_chu.split('|AI_TIPS|');
            item.ghi_chu = parts[0];
            item.travel_tips = parts[1];
        }

        // Bóc tách ghi chú và gợi ý AI vào đây nếu backend trả về, hiện map có `ghi_chu`.
        schedule[dayIdx].push(item);
      });

      this.lichTrinhTheoNgay = schedule;
    },

    extractTime(t) {
        if(!t) return '';
        let parts = String(t).split(/[-–]/);
        if(parts.length > 1) return parts[1].trim();
        return String(t).replace(/Ngày \d+\s*[-–]\s*/i, '').trim();
    },

    chiPhiTheoNgay(dayIndex) {
      if (!this.lichTrinhTheoNgay[dayIndex]) return 0;
      return this.lichTrinhTheoNgay[dayIndex].reduce((sum, item) => {
        return sum + (Number(item.gia_ve) || 0) * (this.trip.so_nguoi || 1);
      }, 0);
    },

    formatCurrency(val) {
      if (!val) return '0đ';
      return Number(val).toLocaleString('vi-VN') + 'đ';
    },

    formatDateFull(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('vi-VN', { 
        weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' 
      });
    },

    formatDateDate(baseDate, addDays) {
      if (!baseDate) return '';
      const d = new Date(baseDate);
      d.setDate(d.getDate() + addDays);
      return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
    },

    formatDuration(soNgay) {
      if (!soNgay) return '?';
      return `${soNgay} ngày ${Math.max(0, soNgay - 1)} đêm`;
    },

    // ─── Modal & Chia sẻ ────────────────────────────────
    async fetchMyGroups() {
      try {
        const [joinedRes, ownedRes] = await Promise.all([
          fetch(`${BASE}/client/nhom-du-lich/get-joined`, { headers: { Authorization: `Bearer ${this.token}` } }),
          fetch(`${BASE}/client/nhom-du-lich/get-my-groups`, { headers: { Authorization: `Bearer ${this.token}` } })
        ]);
        const jData = await joinedRes.json();
        const oData = await ownedRes.json();
        
        const groups = [];
        if (jData.status && jData.data) groups.push(...jData.data);
        if (oData.status && oData.data) groups.push(...oData.data);
        
        this.myJoinedGroups = groups;
      } catch (e) {
        console.error("Lỗi lấy danh sách nhóm", e);
      }
    },

    async shareToGroup() {
      if (!this.selectedGroupToShare) return;
      this.sendingShare = true;
      try {
        const payload = {
            id_nhom_du_lich: this.selectedGroupToShare.id,
            id_chi_tiet_nhom: this.selectedGroupToShare.id_chi_tiet_nhom,
            message: JSON.stringify({ type: 'itinerary', id: this.tripId, title: this.trip.ten_chuyen_di })
        };

        const r = await fetch(`${BASE}/nhom-chats`, {
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${this.token}` 
          },
          body: JSON.stringify(payload)
        });
        const res = await r.json();
        
        if (res.status) {
          this.$toast.success('Gửi lịch trình thành công!');
          this.showShareModal = false;
        } else {
          this.$toast.error('Gửi thất bại: ' + res.message);
        }
      } catch (e) {
        this.$toast.error('Lỗi khi chia sẻ.');
        console.error(e);
      } finally {
        this.sendingShare = false;
      }
    },

    // ─── Map Methods ───────────────────────────────────────────
    initMap() {
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
      }
      const checkAndInit = () => {
        const L = window.L;
        if (!L) {
            setTimeout(checkAndInit, 300);
            return;
        }
        const el = document.getElementById('trip-map');
        if (!el) {
            setTimeout(checkAndInit, 300);
            return;
        }
        this.mapInstance = L.map('trip-map').setView([16.0544, 108.2022], 13);
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          attribution: '&copy; Google Maps',
          maxZoom: 19,
        }).addTo(this.mapInstance);
      };
      
      checkAndInit();
    },

    clearMapLayers() {
      if (!this.mapInstance) return;
      this.mapLayers.forEach(layer => this.mapInstance.removeLayer(layer));
      this.mapLayers = [];
    },

    async renderMapForDay(dayIndex) {
      const waitForMap = () => {
        const L = window.L;
        if (!L || !this.mapInstance) {
          setTimeout(waitForMap, 300);
          return;
        }

        this.clearMapLayers();

        const dayItems = this.lichTrinhTheoNgay[dayIndex] || [];
        const validItems = dayItems.filter(item => item.vi_do && item.kinh_do);

        if (validItems.length === 0) return;

        const bounds = [];
        validItems.forEach((item, idx) => {
          const lat = parseFloat(item.vi_do);
          const lng = parseFloat(item.kinh_do);
          if (isNaN(lat) || isNaN(lng)) return;

          bounds.push([lat, lng]);

          const icon = L.divIcon({
            className: '',
            html: `<div style="
              background: #10b981; color: #fff; border-radius: 50%;
              width: 32px; height: 32px; display: flex; align-items: center;
              justify-content: center; font-weight: bold; font-size: 14px;
              border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              position: relative; top: -16px; left: -16px;
            ">${idx + 1}</div>`,
            iconSize: [0, 0],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([lat, lng], { icon })
            .bindPopup(`
              <div style="min-width:180px; font-family: 'Inter', sans-serif;">
                <strong style="font-size:15px; color: #1e293b;">${item.ten_dia_diem}</strong><br>
                <small style="color:#64748b"><i class="bi bi-geo-alt me-1"></i>${item.dia_chi || 'Đà Nẵng'}</small><br>
                <div class="mt-2 text-primary fw-bold"><i class="bi bi-clock me-1"></i>${this.extractTime(item.thoi_gian_du_kien)}</div>
              </div>
            `, { maxWidth: 220 })
            .addTo(this.mapInstance);

          this.mapLayers.push(marker);
        });

        if (bounds.length > 0) {
          this.mapInstance.fitBounds(bounds, { padding: [50, 50] });
        }
      };

      if (!this.mapInstance) {
        this.initMap();
      }
      waitForMap();
    },
  },
};
</script>

<style scoped>
.tlt-page {
  min-height: 100vh;
  background: #f0f7ff;
  font-family: 'Inter', sans-serif;
  color: #1e2d44;
  padding-bottom: 5rem;
}

.text-brand { color: #10b981 !important; }
.bg-brand { background-color: #10b981 !important; }

.animate-in {
  animation: fadeUp 0.45s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

.share-btn:hover { background: linear-gradient(135deg, #0ea5e9, #10b981) !important; transform: translateY(-2px); transition: 0.3s; }

/* Budget Tracker */
.budget-tracker {
  background: #fff;
  border-radius: 1.2rem;
  padding: 1rem 1.4rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  border: 1px solid #e8edf5;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 14px rgba(30, 45, 68, 0.06);
}
.budget-info { display: flex; flex-direction: column; font-size: 0.85rem; }
.budget-info span { color: #7a8ea0; }
.budget-info strong { font-size: 1.1rem; color: #1e2d44; font-weight: 800; }
.budget-info strong.over { color: #f43f5e; }
.budget-info strong.ok { color: #10b981; }
.budget-bar-wrap { flex: 1; min-width: 120px; height: 8px; background: #e8edf5; border-radius: 999px; overflow: hidden; }
.budget-bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #0ea5e9); border-radius: 999px; transition: width 0.4s ease; }
.budget-bar-fill.over { background: linear-gradient(90deg, #f43f5e, #fb923c); }

/* Day tabs */
.day-tabs {
  display: flex; gap: 0.55rem; flex-wrap: wrap; margin-bottom: 1.5rem; border: none; padding-bottom: 0;
}
.day-tab {
  display: flex; flex-direction: column; align-items: center; padding: 0.55rem 1.2rem;
  border-radius: 0.9rem; border: 1.5px solid #dbe3f0; background: #fff;
  cursor: pointer; transition: all 0.2s; min-width: 80px;
}
.day-tab.active { background: linear-gradient(135deg, #10b981, #0ea5e9); border-color: transparent; color: #fff; box-shadow: 0 6px 16px rgba(16, 185, 129, 0.28); }
.day-tab-num { font-weight: 700; font-size: 0.88rem; }
.day-tab.active .day-tab-cost { color: #fff !important; }
.day-tab-date { font-size: 0.75rem; opacity: 0.8; }

/* Timeline area */
.step3-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
@media(max-width: 900px) { .step3-layout { grid-template-columns: 1fr; } }

.step3-left { padding-right: 1rem; }
.timeline { display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; gap: 1rem; }
.timeline-time { width: 62px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding-top: 0.2rem; }
.time-badge { background: linear-gradient(135deg, #10b981, #0ea5e9); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 0.28rem 0.5rem; border-radius: 0.6rem; white-space: nowrap; }
.timeline-line { flex: 1; width: 3px; background: linear-gradient(to bottom, #10b981, #0ea5e9, transparent); margin: 0.4rem 0; min-height: 40px; border-radius: 99px; opacity: 0.4; }

.timeline-card { flex: 1; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 1.25rem; border: 1px solid rgba(255, 255, 255, 0.5); padding: 1.2rem; margin-bottom: 1.2rem; box-shadow: 0 10px 30px rgba(30, 45, 68, 0.08); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.timeline-card:hover { transform: translateX(8px); box-shadow: 0 15px 40px rgba(30, 45, 68, 0.12); border-color: #10b981; }

.tc-header { display: flex; gap: 0.9rem; align-items: flex-start; }
.tc-img-wrap { flex-shrink: 0; }
.tc-img { width: 70px; height: 60px; object-fit: cover; border-radius: 0.7rem; display: block; }
.tc-meta { flex: 1; }
.tc-meta h5 { font-size: 0.93rem; font-weight: 700; margin-bottom: 0.2rem; color: #1e2d44; }
.tc-meta p { font-size: 0.8rem; color: #7a8ea0; margin-bottom: 0.15rem; }

/* Map Area */
.map-panel {
  background: #fff;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(30, 45, 68, 0.08);
  border: 1px solid rgba(15, 23, 42, 0.05);
  position: sticky;
  top: 90px;
}
.map-panel-head {
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
}

/* Modal chia sẻ */
.share-modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.65); z-index: 1050; backdrop-filter: blur(8px);
}
.share-icon-wrap {
  width: 76px; height: 76px; border-radius: 50%;
  background: #10b981;
  display: flex; align-items: center; justify-content: center;
}
.modal-select:focus {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15) !important;
  background-color: #fff !important;
}
</style>
