<template>
  <div class="tam-linh-page">
    <div v-show="!showModal">
    <section class="hero-section py-5 position-relative">
      <button class="btn btn-success create-itinerary-btn" @click="createItinerary">
        <i class="fas fa-calendar-plus me-2"></i>Tạo lịch trình
      </button>
      <div class="container text-center">
        <h1 class="page-title mb-3"><i class="fas fa-camera me-3"></i>Địa điểm tâm linh tại Đà Nẵng</h1>
        <p class="page-subtitle mb-4 text-center">
          <i class="fas fa-star me-2"></i>Khám phá những địa điểm tâm linh nổi tiếng nhất: Chùa, Đền, Nhà thờ, Thánh
          địa, Tu viện... và nhận đề xuất từ AI sao cho phù hợp ngân sách của bạn.
        </p>
        <div class="search-bar d-flex justify-content-center mb-3">
          <input v-model="tempSearchQuery" type="text" class="form-control me-2" placeholder="Tìm kiếm địa điểm..."
            style="max-width: 400px;" @keyup.enter="performSearch">
          <button @click="performSearch" class="btn btn-primary me-2">Tìm kiếm</button>
          <button @click="clearSearch" class="btn btn-outline-secondary" v-if="searchQuery">Xóa</button>
          <button class="btn btn-outline-success ms-2" v-if="tempSearchQuery.length >= 2" @click="searchGoogle" :disabled="loadingSerp"><span v-if="loadingSerp" class="spinner-border spinner-border-sm"></span><i v-else class="bi bi-google"></i> Tìm GG Maps</button>
        </div>
        <div class="filter-bar d-flex justify-content-center flex-wrap gap-2">
          <button v-for="filter in dynamicFilters" :key="filter"
            :class="['btn btn-sm', activeFilter === filter ? 'btn-primary' : 'btn-outline-primary']"
            @click="setFilter(filter)">{{ filter }}</button>
        </div>
      </div>
    </section>
    
    <section class="serp-results-section py-4" v-if="serpResults.length > 0">
      <div class="container">
        <div class="glass-panel p-4 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="results-title mb-0">
              <i class="bi bi-google me-2 text-primary"></i>Kết quả từ Google Maps
            </h3>
            <button class="btn btn-sm btn-outline-danger" @click="serpResults = []">Đóng kết quả</button>
          </div>
          <div class="row g-3">
            <div v-for="(res, index) in serpResults" :key="index" class="col-12 col-lg-6">
              <div class="serp-item d-flex align-items-start gap-3 p-3 rounded-4 transition-all">
                <div class="serp-item-img flex-shrink-0" :style="{ backgroundImage: `url(${res.image})` }"></div>
                <div class="serp-item-content flex-grow-1">
                  <h6 class="mb-1 text-truncate">{{ res.ten_dia_diem }}</h6>
                  <p class="text-muted small mb-2 text-truncate-2">{{ res.dia_chi }}</p>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-light text-dark border"><i class="bi bi-geo-alt-fill text-danger me-1"></i>{{ res.vi_do }}, {{ res.kinh_do }}</span>
                    <span class="badge bg-warning text-dark" v-if="res.danh_gia_trung_binh"><i class="bi bi-star-fill me-1"></i>{{ res.danh_gia_trung_binh }}</span>
                  </div>
                  <button 
                    class="btn btn-sm btn-primary w-100 rounded-3" 
                    @click="importAndShow(res, index)"
                    :disabled="importingId === index"
                  >
                    <span v-if="importingId === index" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-plus-circle me-1"></i>Lưu vào hệ thống
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="places-section py-4">
      <div class="container">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;"></div>
          <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger text-center">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
          <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchData">Thử lại</button>
        </div>
        <div v-else class="row g-4">
          <div v-for="place in filteredPlaces" :key="place.id" class="col-12 col-md-6 col-xl-4">
            <div class="card place-card h-100 shadow-sm">
              <div class="place-image" :style="{ backgroundImage: `url(${place.image})` }">
                <div :class="['place-badge', categoryClass(place.loai_dia_diem)]">{{ place.loai_dia_diem }}</div>
                <button class="favorite-btn" @click.stop="toggleFavorite(place)" :class="{ active: place.is_favorite }">
                  <i :class="place.is_favorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                </button>
              </div>
              <div class="card-body d-flex flex-column">
                <div class="mb-2">
                  <h5 class="card-title">{{ place.ten_dia_diem }}</h5>
                  <small class="text-muted">📍 {{ place.dia_chi }}</small>
                </div>
                <div class="mb-2">
                  <span class="badge bg-success me-2">Mở: {{ place.gio_mo_cua }}</span>
                  <span class="badge bg-danger">Đóng: {{ place.gio_dong_cua }}</span>
                </div>
                <p class="text-secondary small">{{ place.mo_ta }}</p>
                <div class="mb-2">⭐ {{ place.danh_gia_trung_binh }}</div>
                <div class="mb-3">
                  <strong class="price-text">{{ place.gia_ve == 0 ? 'Miễn phí' : formatPrice(place.gia_ve) }}</strong>
                </div>
                <div class="mt-auto">
                  <button class="btn btn-primary w-100" @click="viewDetail(place)">Xem chi tiết</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredPlaces.length === 0 && !loading" class="text-center py-4 text-muted">
            <i class="fas fa-search fa-2x mb-2 d-block"></i>Không tìm thấy địa điểm phù hợp
          </div>
        </div>
      </div>
    </section>
    </div>

    <!-- VIEW CHI TIẾT (Thay thế Modal) -->
    <div v-if="showModal" class="detail-page bg-light py-4 fade-in-content">
      <div class="container">
        <!-- Breadcrumb / Header -->
        <nav aria-label="breadcrumb" class="mb-4 d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary me-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center" @click="closeModal" style="width: 36px; height: 36px; padding: 0;">
            <i class="bi bi-arrow-left"></i>
          </button>
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="#" @click.prevent="closeModal" class="text-decoration-none text-muted">Địa điểm</a></li>
            <li class="breadcrumb-item"><a href="#" @click.prevent="closeModal" class="text-decoration-none text-muted">{{ activeFilter }}</a></li>
            <li class="breadcrumb-item active fw-bold text-dark" aria-current="page">{{ selectedPlace.ten_dia_diem }}</li>
          </ol>
        </nav>

        <div class="row g-4">
          <!-- LEFT COLUMN -->
          <div class="col-lg-8">
            <!-- Gallery Section -->
            <div class="gallery-container bg-white p-3 rounded-4 shadow-sm mb-4">
              <div class="main-image mb-2 rounded-3" :style="{ backgroundImage: `url(${currentGalleryImage})`, height: '450px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }">
                <button v-if="selectedPlace.gallery && selectedPlace.gallery.length > 1" class="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 shadow-sm d-flex align-items-center justify-content-center" @click="prevImage" style="border-radius: 50%; width: 44px; height: 44px; z-index: 10;"><i class="bi bi-chevron-left fs-5"></i></button>
                <button v-if="selectedPlace.gallery && selectedPlace.gallery.length > 1" class="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 shadow-sm d-flex align-items-center justify-content-center" @click="nextImage" style="border-radius: 50%; width: 44px; height: 44px; z-index: 10;"><i class="bi bi-chevron-right fs-5"></i></button>
              </div>
              <div class="thumbnails d-flex gap-2 py-2 flex-wrap" v-if="selectedPlace.gallery && selectedPlace.gallery.length > 1">
                <div v-for="(img, idx) in selectedPlace.gallery" :key="idx"
                     :class="['thumbnail-item rounded-3', { 'border border-3 border-primary': currentImageIdx === idx }]"
                     @click="currentImageIdx = idx"
                     :style="{ backgroundImage: `url(${img.duong_dan_anh || img.image})`, flex: '1 1 0', minWidth: '100px', maxWidth: '140px', height: '80px', backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', opacity: currentImageIdx === idx ? '1' : '0.6', transition: 'all 0.3s' }">
                </div>
              </div>
            </div>

            <!-- Intro Section -->
            <div class="intro-container bg-white p-4 rounded-4 shadow-sm mb-4">
              <h4 class="mb-3 fw-bold">Giới thiệu</h4>
              <p class="text-secondary" style="line-height: 1.8; font-size: 1.05rem;">{{ selectedPlace.mo_ta }}</p>
            </div>

            <!-- Reviews Section -->
            <div class="reviews-container bg-white p-4 rounded-4 shadow-sm">
              <h4 class="mb-4 fw-bold">Đánh giá ({{ detailReviews.length }})</h4>
              
              <div class="review-form-card mb-5 p-4 bg-light border-0 rounded-4" v-if="isLoggedIn">
                <h6 class="fw-bold mb-3">Gửi đánh giá của bạn</h6>
                <div class="d-flex align-items-center mb-3">
                  <div class="star-rating-input me-3" style="font-size: 1.5rem; cursor: pointer;">
                    <i v-for="s in 5" :key="s" class="bi" 
                       :class="s <= newReview.so_sao ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"
                       @click="newReview.so_sao = s"></i>
                  </div>
                  <span class="text-muted">{{ newReview.so_sao }} sao</span>
                </div>
                <textarea v-model="newReview.noi_dung" class="form-control mb-3 border-0 shadow-sm rounded-3 p-3" rows="3" placeholder="Chia sẻ cảm nhận của bạn về địa điểm này..."></textarea>
                <div class="text-end">
                  <button class="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm" @click="submitReview" :disabled="submittingReview">
                    <span v-if="submittingReview" class="spinner-border spinner-border-sm me-2"></span>
                    Gửi nhận xét
                  </button>
                </div>
              </div>
              <div v-else class="alert alert-info py-3 border-0 shadow-sm rounded-3 mb-5">
                <i class="bi bi-info-circle-fill me-2"></i> Vui lòng <router-link to="/client/dang-nhap" class="fw-bold text-decoration-none">Đăng nhập</router-link> để để lại đánh giá.
              </div>

              <div v-if="loadingReviews" class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
              </div>
              <div v-else-if="detailReviews.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-chat-square-text" style="font-size: 3rem; opacity: 0.5;"></i>
                <p class="mt-3 fs-6">Chưa có đánh giá nào cho địa điểm này.</p>
              </div>
              <div v-else class="review-list">
                <div v-for="rv in detailReviews" :key="rv.id" class="review-item border-bottom py-4 last-border-0">
                  <div class="d-flex align-items-center mb-3">
                    <div class="avatar shadow-sm me-3" style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; background: #e9ecef; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; color: #6c757d;">
                      <img v-if="rv.nguoi_dung?.anh_dai_dien" :src="getFullAvatar(rv.nguoi_dung.anh_dai_dien)" alt="avatar" style="width: 100%; height: 100%; object-fit: cover;">
                      <img v-else-if="rv.avatar_nguoi_danh_gia" :src="rv.avatar_nguoi_danh_gia" alt="avatar" style="width: 100%; height: 100%; object-fit: cover;" referrerpolicy="no-referrer">
                      <span v-else>{{ (rv.nguoi_dung?.ten || rv.ten_nguoi_danh_gia || '?').charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <h6 class="mb-0 fw-bold">{{ rv.nguoi_dung?.ten || rv.ten_nguoi_danh_gia || 'Người dùng' }}</h6>
                      <small class="text-muted">{{ formatDate(rv.created_at) }}</small>
                    </div>
                    <div class="ms-auto text-warning" style="font-size: 1.1rem;">
                      <i v-for="s in rv.so_sao" :key="s" class="bi bi-star-fill me-1"></i>
                    </div>
                  </div>
                  <p class="mb-0 text-secondary" style="padding-left: 66px; line-height: 1.6;">{{ rv.noi_dung }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-lg-4">
            <div class="info-card bg-white p-4 rounded-4 shadow-sm position-sticky" style="top: 20px;">
              <h3 class="fw-bold mb-2">{{ selectedPlace.ten_dia_diem }}</h3>
              <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div class="stars text-warning me-2">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                </div>
                <span class="fw-bold me-1">{{ selectedPlace.danh_gia_trung_binh }}</span>
                <span class="text-muted">({{ detailReviews.length }} đánh giá)</span>
              </div>

              <!-- Map Block -->
              <div v-if="selectedPlace.vi_do && selectedPlace.kinh_do" class="map-container mb-4 rounded-4 overflow-hidden shadow-sm border" style="height: 220px; position: relative;">
                <div id="detail-map" style="width: 100%; height: 100%; z-index: 1;"></div>
              </div>
              <div v-else class="alert alert-warning py-2 mb-4 d-flex align-items-center rounded-3">
                <i class="bi bi-geo-alt-fill me-2"></i> Chưa có tọa độ bản đồ chi tiết.
              </div>

              <!-- Info List -->
              <ul class="list-unstyled mb-4">
                <li class="d-flex align-items-start mb-3">
                  <i class="bi bi-geo-alt text-danger me-3 fs-5 mt-1"></i>
                  <div>
                    <span class="d-block text-muted small">Địa chỉ</span>
                    <span class="fw-medium">{{ selectedPlace.dia_chi }}</span>
                  </div>
                </li>
                <li class="d-flex align-items-start mb-3">
                  <i class="bi bi-clock text-success me-3 fs-5 mt-1"></i>
                  <div>
                    <span class="d-block text-muted small">Giờ hoạt động</span>
                    <span class="fw-medium">{{ selectedPlace.gio_mo_cua }} - {{ selectedPlace.gio_dong_cua }}</span>
                  </div>
                </li>
                <li class="d-flex align-items-start mb-3">
                  <i class="bi bi-telephone text-primary me-3 fs-5 mt-1"></i>
                  <div>
                    <span class="d-block text-muted small">Điện thoại</span>
                    <span class="fw-medium">Liên hệ ban quản lý</span>
                  </div>
                </li>
                <li class="d-flex align-items-start mb-3">
                  <i class="bi bi-tag text-info me-3 fs-5 mt-1"></i>
                  <div>
                    <span class="d-block text-muted small">Loại hình</span>
                    <span class="fw-medium">{{ selectedPlace.loai_dia_diem }}</span>
                  </div>
                </li>
                <li class="d-flex align-items-start py-3 mt-2 border-top">
                  <i class="bi bi-cash-coin text-success me-3 fs-4 mt-1"></i>
                  <div>
                    <span class="d-block text-muted small">Giá vé tham khảo</span>
                    <span class="fw-bold text-success fs-5">{{ selectedPlace.gia_ve == 0 ? 'Miễn phí' : formatPrice(selectedPlace.gia_ve) }}</span>
                  </div>
                </li>
              </ul>

              <button class="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center mt-4" style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); border: none;" @click="alert('Chức năng thêm vào lịch trình đang phát triển')">
                <i class="bi bi-calendar-plus me-2 fs-5"></i> Thêm vào lịch trình
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BASE = 'http://localhost:8000/api';
export default {
  name: 'TamLinh',
  data() {
    return {
      activeFilter: 'Tất cả',
      showModal: false, selectedPlace: null,
      modalMapInstance: null,
      searchQuery: '', tempSearchQuery: '',
      loadingSerp: false,
      serpResults: [],
      importingId: null,
      places: [], loading: false, error: null,
      currentImageIdx: 0,
      token: localStorage.getItem('client_token'),
      isLoggedIn: !!localStorage.getItem('client_token'),
      autoplayInterval: null,
      
      // Reviews
      activeModalTab: 'info',
      loadingReviews: false,
      detailReviews: [],
      newReview: { so_sao: 5, noi_dung: '' },
      submittingReview: false,
    };
  },
  mounted() { this.fetchData(); },
  computed: {
    dynamicFilters() {
      const types = Array.from(new Set(this.places.map(p => p.loai_dia_diem))).filter(Boolean);
      return ['Tất cả', ...types];
    },
    filteredPlaces() {
      let f = this.places;
      if (this.activeFilter !== 'Tất cả') f = f.filter(p => p.loai_dia_diem === this.activeFilter);
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        f = f.filter(p => p.ten_dia_diem.toLowerCase().includes(q) || (p.mo_ta && p.mo_ta.toLowerCase().includes(q)));
      }
      return f;
    },
    currentGalleryImage() {
      if (!this.selectedPlace || !this.selectedPlace.gallery || this.selectedPlace.gallery.length === 0) {
        return this.selectedPlace ? this.selectedPlace.image : '';
      }
      return this.selectedPlace.gallery[this.currentImageIdx].duong_dan_anh || this.selectedPlace.gallery[this.currentImageIdx].image;
    }
  },
  methods: {
    async searchGoogle() {
      if (!this.tempSearchQuery.trim()) return;
      this.loadingSerp = true;
      this.serpResults = [];
      try {
        const res = await fetch(`http://localhost:8000/api/serp/search?query=${encodeURIComponent(this.tempSearchQuery)}`);
        const json = await res.json();
        if (json.status) {
          this.serpResults = json.data || [];
          if (this.serpResults.length === 0) this.$toast.info('Không tìm thấy kết quả nào mới trên Google Maps.');
        }
      } catch (e) {
        this.$toast.error('Lỗi Google Maps: ' + e.message);
      } finally {
        this.loadingSerp = false;
      }
    },

    async importAndShow(googlePlace, index) {
      this.importingId = index;
      const typeMap = {
        'AmThuc': ['Quán ăn', 1],
        'CheckIn': ['Điểm check-in', 2],
        'GiaiTri': ['Khu vui chơi', 3],
        'TamLinh': ['Chùa', 4],
      };
      let compName = this.$options.name || 'CheckIn';
      let loai = typeMap[compName] ? typeMap[compName][0] : 'Điểm check-in';
      let dm = typeMap[compName] ? typeMap[compName][1] : 2;

      const payload = {
        ten_dia_diem: googlePlace.ten_dia_diem,
        dia_chi: googlePlace.dia_chi,
        vi_do: googlePlace.vi_do,
        kinh_do: googlePlace.kinh_do,
        danh_gia_trung_binh: googlePlace.danh_gia_trung_binh,
        image: googlePlace.image,
        mo_ta: googlePlace.mo_ta || 'Được thêm chi tiết từ Google Maps.',
        loai_dia_diem: loai, 
        id_danh_muc: dm, 
      };

      try {
        const res = await fetch(`http://localhost:8000/api/serp/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();

        if (!json.status && json.message === 'Địa điểm này đã tồn tại trong hệ thống.') {
          this.$toast.warning('Địa điểm này đã có trong hệ thống nội bộ, bạn có thể tìm thấy ngay bên dưới!');
          return;
        }

        if (json.status && json.data) {
          this.$toast.success('Đã lưu địa điểm và crawl ảnh + đánh giá từ Google!');
          this.places.unshift(json.data);
          this.serpResults.splice(index, 1);
          this.viewDetail(json.data);
        }
      } catch (e) {
        this.$toast.error('Lỗi khi tải địa điểm: ' + e.message);
      } finally {
        this.importingId = null;
      }
    },

    async fetchData() {
      this.loading = true; this.error = null;
      try {
        const headers = {};
        if (this.token) {
          headers['Authorization'] = `Bearer ${this.token}`;
        }
        const res = await fetch(`${BASE}/dia-diems/tam-linh`, { headers });
        if (!res.ok) throw new Error('Lỗi kết nối server (' + res.status + ')');
        const json = await res.json();
        const fallbacks = {
          'Chùa':      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
          'Đền':       'https://images.unsplash.com/photo-1560185127-6a7f4e9e1e88?w=800&h=600&fit=crop',
          'Nhà thờ':   'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&h=600&fit=crop',
          'Thánh địa': 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800&h=600&fit=crop',
          'Tu viện':   'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&h=600&fit=crop',
        };
        this.places = (json.data || []).map(p => ({
          ...p,
          image: p.image || fallbacks[p.loai_dia_diem] || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800&h=600&fit=crop'
        }));
      } catch (e) { this.error = e.message; this.places = []; }
      finally { this.loading = false; }
    },
    setFilter(f) { this.activeFilter = f; },
    categoryClass(c) {
      const m = { 'Chùa': 'temple', 'Đền': 'shrine', 'Nhà thờ': 'church', 'Thánh địa': 'holy', 'Tu viện': 'monastery' };
      return m[c] || 'temple';
    },
    formatPrice(p) { return Number(p).toLocaleString('vi-VN') + 'đ'; },
    viewDetail(p) {
      this.selectedPlace = p;
      this.currentImageIdx = 0;
      this.showModal = true;
      this.activeModalTab = 'info';
      this.detailReviews = [];
      this.$nextTick(() => { this.initModalMap(p); });
      this.startAutoplay();
      this.fetchReviews(p.id);
    },
    closeModal() {
      this.stopAutoplay();
      this.showModal = false;
      this.selectedPlace = null;
    },
    nextImage() {
      if (!this.selectedPlace.gallery) return;
      this.currentImageIdx = (this.currentImageIdx + 1) % this.selectedPlace.gallery.length;
    },
    prevImage() {
      if (!this.selectedPlace.gallery) return;
      this.currentImageIdx = (this.currentImageIdx - 1 + this.selectedPlace.gallery.length) % this.selectedPlace.gallery.length;
    },
    startAutoplay() {
      this.stopAutoplay();
      if (this.selectedPlace?.gallery?.length > 1) {
        this.autoplayInterval = setInterval(this.nextImage, 4000);
      }
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },
    async fetchReviews(contentId) {
      this.loadingReviews = true;
      try {
        const res = await fetch(`${BASE}/dia-diems/danh-gia/place/${contentId}`);
        const json = await res.json();
        if (json.status === 'success') this.detailReviews = json.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loadingReviews = false;
      }
    },
    async submitReview() {
      if (!this.newReview.noi_dung.trim()) {
        this.$toast.warning('Vui lòng nhập nội dung đánh giá!');
        return;
      }
      this.submittingReview = true;
      try {
        const res = await fetch(`http://localhost:8000/api/danh-gias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            id_dia_diem: this.selectedPlace.id,
            so_sao: this.newReview.so_sao,
            noi_dung: this.newReview.noi_dung
          })
        });

        const json = await res.json();
        if (res.ok && json.status === 'success') {
          this.newReview.noi_dung = '';
          this.newReview.so_sao = 5;
          await this.fetchReviews(this.selectedPlace.id);
          this.$toast.success('Cảm ơn bạn đã gửi đánh giá! Đánh giá của bạn đang chờ xếp hàng kiểm duyệt. 🌟');
        } else {
          const msg = json.message || (json.errors ? Object.values(json.errors).flat().join('\n') : 'Không thể gửi đánh giá.');
          this.$toast.error('Lỗi: ' + msg);
        }
      } catch (e) {
        console.error('Submit review error:', e);
        this.$toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.');
      } finally {
        this.submittingReview = false;
      }
    },
    getFullAvatar(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
    },
    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('vi-VN', { 
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
    async toggleFavorite(place) {
      if (!this.token) {
        this.$toast.warning('Vui lòng đăng nhập để thêm vào yêu thích!');
        return;
      }
      try {
        const res = await fetch(`${BASE}/client/yeu-thich/toggle`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ id_dia_diem: place.id })
        });
        const json = await res.json();
        if (json.status) {
          place.is_favorite = json.is_favorite;
          this.$toast.success(json.is_favorite ? `Đã thêm vào yêu thích! ❤️` : `Đã xoá khỏi yêu thích`);
        } else {
          this.$toast.error(json.message || 'Lỗi khi thực hiện thao tác.');
        }
      } catch (e) {
        console.error(e);
      }
    },
    initModalMap(place) {
      const el = document.getElementById('detail-map');
      if (!el || !place.vi_do) return;
      const L = window.L;
      const lat = parseFloat(place.vi_do);
      const lng = parseFloat(place.kinh_do);
      
      if (this.modalMapInstance) {
        this.modalMapInstance.off();
        this.modalMapInstance.remove();
        this.modalMapInstance = null;
      }

      this.modalMapInstance = L.map('detail-map', {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView([lat, lng], 16);

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
      }).addTo(this.modalMapInstance);

      L.marker([lat, lng]).addTo(this.modalMapInstance)
        .bindPopup(`<strong>${place.ten_dia_diem}</strong>`)
        .openPopup();
      
      setTimeout(() => {
        if (this.modalMapInstance) this.modalMapInstance.invalidateSize();
      }, 500);
    },

    createItinerary() { this.$router.push('/client/tao-lich-trinh'); },
    addToItinerary() { this.$toast.info('Vui lòng sử dụng trang Tạo lịch trình để thêm địa điểm này!'); this.closeModal(); },
    performSearch() { this.searchQuery = this.tempSearchQuery; },
    clearSearch() { this.searchQuery = ''; this.tempSearchQuery = ''; },
  },
};
</script>

<style scoped>
.hero-section {
  position: relative;
  background: radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.14), transparent 28%), radial-gradient(circle at 90% 15%, rgba(0, 200, 150, 0.16), transparent 20%), linear-gradient(180deg, #f6fbff 0%, #ffffff 48%, #f8fbff 100%);
}

.create-itinerary-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  font-weight: 600;
  padding: 0.7rem 1.5rem;
  transition: all 0.3s ease;
}

.create-itinerary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(34, 197, 94, 0.5);
}

.page-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: -0.5px;
  animation: fadeInDown 0.8s ease-out;
}

.page-subtitle {
  color: #475569;
  font-size: 1.05rem;
  margin-top: 1rem;
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  line-height: 1.6;
  animation: fadeInDown 0.9s ease-out;
}

.search-bar {
  animation: fadeInUp 1s ease-out;
}

.search-bar input {
  border: 2px solid transparent;
  border-radius: 15px;
  padding: 0.8rem 1.2rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.search-bar input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 6px 25px rgba(14, 165, 233, 0.2);
  outline: none;
}

.search-bar .btn {
  border-radius: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

.search-bar .btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  padding: 0.8rem 1.5rem;
}

.search-bar .btn-outline-secondary {
  border: 2px solid #cbd5e1;
  color: #64748b;
  padding: 0.6rem 1.2rem;
}

.filter-bar {
  margin-top: 1.5rem;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 1.1s ease-out;
  padding: 0 1rem;
}

.filter-bar .btn {
  border-radius: 25px;
  font-weight: 600;
  padding: 0.65rem 1.4rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-size: 0.9rem;
}

.filter-bar .btn-outline-primary {
  border-color: #e0e7ff;
  color: #4f46e5;
  background: #f0f4ff;
}

.filter-bar .btn-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
  font-weight: 700;
}

.places-section {
  padding: 2rem 0;
}

.place-card {
  border-radius: 18px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: none;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

.place-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.2);
}

.place-image {
  height: 220px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s ease;
}

.place-card:hover .place-image {
  transform: scale(1.1);
}

.place-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.3) 100%);
}

.card-body {
  padding: 1.5rem !important;
}

.card-title {
  font-weight: 800;
  font-size: 1.2rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.card-body small {
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  font-weight: 700;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

.badge.bg-success {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%) !important;
}

.badge.bg-danger {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
}

.place-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  color: white;
  padding: 7px 16px;
  border-radius: 25px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 5;
}

.place-badge.temple {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.place-badge.shrine {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
}

.place-badge.church {
  background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
}

.place-badge.holy {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
}

.place-badge.monastery {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.price-text {
  color: #059669;
  font-weight: 800;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Favorite Button */
.favorite-btn {
  position: absolute; top: 15px; right: 15px; width: 40px; height: 40px;
  background: rgba(255, 255, 255, 0.85); color: #64748b; border: none;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 20px; cursor: pointer; transition: all 0.3s ease; z-index: 10;
  backdrop-filter: blur(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.favorite-btn:hover { transform: scale(1.1); background: #fff; color: #ef4444; }
.favorite-btn.active { color: #ef4444; background: #fff; }

/* Carousel */
.carousel-container { position: relative; width: 100%; height: 320px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
.carousel-slide { width: 100%; height: 100%; background-size: cover; background-position: center; transition: background-image 0.4s ease; }
.carousel-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: all 0.3s ease; z-index: 5; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.carousel-nav:hover { background: #fff; color: #3b82f6; transform: translateY(-50%) scale(1.1); }
.carousel-nav.prev { left: 15px; }
.carousel-nav.next { right: 15px; }
.carousel-indicators { position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5; }
.carousel-indicators span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3; }
.carousel-indicators span.active { background: #fff; width: 24px; border-radius: 4px; }

/* Thumbnails */
.carousel-thumbnails { display: flex; gap: 8px; overflow-x: auto; padding: 4px 0; scrollbar-width: thin; }
.carousel-thumbnails::-webkit-scrollbar { height: 4px; }
.carousel-thumbnails::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.thumb-item { width: 70px; height: 50px; border-radius: 8px; background-size: cover; background-position: center; cursor: pointer; opacity: 0.6; transition: all 0.3s ease; border: 2px solid transparent; flex-shrink: 0; }
.thumb-item:hover { opacity: 0.9; }
.thumb-item.active { opacity: 1; border-color: #3b82f6; transform: scale(1.05); }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: min(96%, 760px);
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.35);
  position: relative;
  padding: 2rem;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.4s ease;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #1f2937;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%);
  transform: rotate(90deg) scale(1.1);
}

.modal-header h4 {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.modal-header small {
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
}

.modal-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 5px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.modal-tabs button {
  border: none !important;
  outline: none !important;
  background: transparent;
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-tabs button:hover {
  color: #3b82f6;
}

.modal-tabs button.active {
  background: #ffffff;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15), 0 2px 4px rgba(0, 0, 0, 0.05);
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.fade-in-content { animation: fadeIn 0.4s ease; }

.info-list { display: flex; flex-direction: column; gap: 0.8rem; }
.info-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #f8fbff; border-radius: 12px; border: 1px solid #edf2f7; font-weight: 600; color: #334155; }
.info-item i { font-size: 1.2rem; }

/* Review Section */
.review-form-card { background: #f8fafc; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; }
.review-form-card h6 { font-weight: 800; color: #1e293b; margin-bottom: 0.75rem; }
.star-rating-input { display: flex; gap: 4px; font-size: 1.4rem; color: #d1d5db; }
.star-rating-input i { cursor: pointer; transition: 0.2s; }
.star-rating-input i:hover { transform: scale(1.15); }
.star-rating-input i.active { color: #f59e0b; }

.review-scroll-area { display: flex; flex-direction: column; gap: 1rem; padding-right: 5px; }
.review-item-card { background: #fff; padding: 1.25rem; border-radius: 16px; border: 1px solid #f1f5f9; transition: all 0.3s; }
.review-item-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.rv-meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.rv-user { display: flex; align-items: center; gap: 0.75rem; }
.rv-avatar, .rv-avatar-text { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #3b82f6; color: #fff; font-weight: 700; font-size: 0.9rem; overflow: hidden; }
.rv-avatar img { width: 100%; height: 100%; object-fit: cover; }
.rv-name { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
.rv-stars { display: flex; gap: 2px; font-size: 0.8rem; }
.rv-text { color: #475569; font-size: 0.92rem; line-height: 1.5; margin-bottom: 0.5rem; }
.rv-date { font-size: 0.75rem; font-weight: 500; }

.modal-image {
  width: 100%;
  height: 280px;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.modal-body p {
  margin-top: 1rem;
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
}

.modal-body ul {
  margin-top: 1.5rem;
  padding-left: 0;
  color: #334155;
  list-style: none;
}

.modal-body li {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%);
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.modal-actions .btn {
  border-radius: 12px;
  font-weight: 600;
  padding: 0.8rem 1.8rem;
  transition: all 0.3s ease;
}

.modal-actions .btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: none;
}

.modal-actions .btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
}

.text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05); }
.results-title { font-weight: 800; color: #1e293b; font-size: 1.4rem; }
.serp-item { background: #fff; border: 1px solid #f1f5f9; transition: all 0.3s ease; }
.serp-item:hover { transform: scale(1.02); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: #3b82f6; }
.serp-item-img { width: 90px; height: 90px; border-radius: 12px; background-size: cover; background-position: center; border: 1px solid #eee; }
.serp-item-content h6 { font-weight: 700; color: #1e293b; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>
