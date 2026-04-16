<template>
  <div class="giai-tri-page">

    <!-- HERO -->
    <section class="hero-section py-5 position-relative">
      <button class="btn btn-success create-itinerary-btn" @click="createItinerary">
        <i class="fas fa-calendar-plus me-2"></i>Tạo lịch trình
      </button>
      <div class="container text-center">
        <h1 class="page-title mb-3">
          <i class="fas fa-utensils me-3"></i>Ẩm thực Đà Nẵng
        </h1>
        <p class="page-subtitle mb-4 text-center">
          <i class="fas fa-robot me-2 "></i>Khám phá ẩm thực Đà Nẵng: món ngon, quán ăn, street food, hải sản tươi
          sống.... và trải nghiệm AI đề xuất hợp ngân sách.
        </p>

        <!-- SEARCH -->
        <div class="search-bar d-flex justify-content-center mb-3">
          <input v-model="tempSearchQuery" type="text" class="form-control me-2" placeholder="Tìm kiếm địa điểm..."
            style="max-width: 400px;" @keyup.enter="performSearch">
          <button @click="performSearch" class="btn btn-primary me-2">Tìm kiếm</button>
          <button @click="clearSearch" class="btn btn-outline-secondary" v-if="searchQuery">Xóa</button>
          <button class="btn btn-outline-success ms-2" v-if="tempSearchQuery.length >= 2" @click="searchGoogle" :disabled="loadingSerp"><span v-if="loadingSerp" class="spinner-border spinner-border-sm"></span><i v-else class="bi bi-google"></i> Tìm GG Maps</button>
        </div>

        <!-- FILTER -->
        <div class="filter-bar d-flex justify-content-center flex-wrap gap-2">
          <button v-for="filter in filters" :key="filter"
            :class="['btn btn-sm', activeFilter === filter ? 'btn-primary' : 'btn-outline-primary']"
            @click="setFilter(filter)">
            {{ filter }}
          </button>
        </div>
      </div>
    </section>

    
    <!-- Googles Maps Serp API Results -->
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

    <!-- LIST -->
    <section class="places-section py-4">
      <div class="container">

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;"></div>
          <p class="mt-3 text-muted">Đang tải dữ liệu...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger text-center" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
          <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchAmThuc">Thử lại</button>
        </div>

        <!-- Data -->
        <div v-else class="row g-4">

          <div v-for="place in filteredPlaces" :key="place.id" class="col-12 col-md-6 col-xl-4">
            <div class="card place-card h-100 shadow-sm">

              <!-- IMAGE -->
              <div class="place-image" :style="{ backgroundImage: `url(${place.image})` }">
                <div :class="['place-badge', categoryClass(place.loai_dia_diem)]">{{ place.loai_dia_diem }}</div>
                <button class="favorite-btn" @click.stop="toggleFavorite(place)" :class="{ active: place.is_favorite }">
                  <i :class="place.is_favorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                </button>
              </div>

              <!-- BODY -->
              <div class="card-body d-flex flex-column">

                <!-- TITLE -->
                <div class="mb-2">
                  <h5 class="card-title">{{ place.ten_dia_diem }}</h5>
                  <small class="text-muted">
                    📍 {{ place.dia_chi }}
                  </small>
                </div>

                <!-- TIME -->
                <div class="mb-2">
                  <span class="badge bg-success me-2">
                    Mở: {{ place.gio_mo_cua }}
                  </span>
                  <span class="badge bg-danger">
                    Đóng: {{ place.gio_dong_cua }}
                  </span>
                </div>

                <!-- DESC -->
                <p class="text-secondary small">
                  {{ place.mo_ta }}
                </p>

                <!-- RATING -->
                <div class="mb-2">
                  ⭐ {{ place.danh_gia_trung_binh }}
                </div>

                <!-- PRICE -->
                <div class="mb-3">
                  <strong class="price-text">
                    {{ place.gia_ve == 0 ? 'Miễn phí' : formatPrice(place.gia_ve) }}
                  </strong>
                </div>

                <!-- ACTION -->
                <div class="mt-auto">
                  <button class="btn btn-primary w-100" @click="viewDetail(place)">
                    Xem chi tiết
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div v-if="filteredPlaces.length === 0 && !loading" class="text-center py-4 text-muted">
            <i class="fas fa-search fa-2x mb-2 d-block"></i>
            Không tìm thấy địa điểm phù hợp
          </div>

        </div>
      </div>
    </section>

    <!-- MODAL CHI TIẾT -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="btn-close" @click="closeModal">×</button>
        <div class="modal-header">
          <div class="d-flex justify-content-between align-items-center w-100 pe-5">
            <div>
              <h4>{{ selectedPlace.ten_dia_diem }}</h4>
              <small class="text-muted">{{ selectedPlace.loai_dia_diem }} - ⭐ {{ selectedPlace.danh_gia_trung_binh }}</small>
            </div>
            <div class="modal-tabs">
              <button :class="{ active: activeModalTab === 'info' }" @click="activeModalTab = 'info'">
                <i class="bi bi-info-circle me-1"></i> Thông tin
              </button>
              <button :class="{ active: activeModalTab === 'reviews' }" @click="activeModalTab = 'reviews'">
                <i class="bi bi-chat-left-text me-1"></i> Đánh giá ({{ detailReviews.length }})
              </button>
            </div>
          </div>
        </div>
        <div class="modal-body custom-scrollbar">
          <!-- Tab 1: Info -->
          <div v-if="activeModalTab === 'info'" class="fade-in-content">
            <div v-if="selectedPlace.vi_do && selectedPlace.kinh_do" id="detail-map" style="height: 250px; width: 100%; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e0e0e0; z-index: 1;"></div>
            <div v-else class="alert alert-warning py-2 mb-3" style="font-size: 0.9rem;"><i class="fas fa-map-marker-alt"></i> Chưa có tọa độ bản đồ chi tiết.</div>
            
            <div class="modal-gallery mb-3" v-if="selectedPlace.gallery && selectedPlace.gallery.length > 0">
              <div class="carousel-container" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
                <button class="carousel-nav prev" @click="prevImage" v-if="selectedPlace.gallery.length > 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <div class="carousel-slide" :style="{ backgroundImage: `url(${currentGalleryImage})` }"></div>
                <button class="carousel-nav next" @click="nextImage" v-if="selectedPlace.gallery.length > 1">
                  <i class="bi bi-chevron-right"></i>
                </button>
                <div class="carousel-indicators" v-if="selectedPlace.gallery.length > 1">
                  <span v-for="(img, idx) in selectedPlace.gallery" :key="idx" 
                        :class="{ active: currentImageIdx === idx }"
                        @click="currentImageIdx = idx"></span>
                </div>
              </div>
              <div class="carousel-thumbnails mt-2" v-if="selectedPlace.gallery.length > 1">
                <div v-for="(img, idx) in selectedPlace.gallery" :key="idx"
                     :class="['thumb-item', { active: currentImageIdx === idx }]"
                     @click="currentImageIdx = idx"
                     :style="{ backgroundImage: `url(${img.duong_dan_anh || img.image})` }">
                </div>
              </div>
            </div>
            <div v-else class="modal-image" :style="{ backgroundImage: `url(${selectedPlace.image})` }"></div>
            
            <p class="mb-3">{{ selectedPlace.mo_ta }}</p>
            <div class="info-list">
              <div class="info-item"><i class="bi bi-geo-alt text-danger"></i> <strong>Địa chỉ:</strong> {{ selectedPlace.dia_chi }}</div>
              <div class="info-item"><i class="bi bi-clock text-success"></i> <strong>Giờ mở cửa:</strong> {{ selectedPlace.gio_mo_cua }} - {{ selectedPlace.gio_dong_cua }}</div>
              <div class="info-item"><i class="bi bi-cash green-text"></i> <strong>Giá:</strong> {{ selectedPlace.gia_ve == 0 ? 'Miễn phí' : formatPrice(selectedPlace.gia_ve) }}</div>
              <div class="info-item"><i class="bi bi-tag text-primary"></i> <strong>Loại:</strong> {{ selectedPlace.loai_dia_diem }}</div>
            </div>
          </div>

          <!-- Tab 2: Reviews -->
          <div v-else class="fade-in-content">
            <!-- Review Form -->
            <div class="review-form-card mb-4" v-if="isLoggedIn">
              <h6>Gửi đánh giá của bạn</h6>
              <div class="star-rating-input mb-2">
                <i v-for="s in 5" :key="s" class="bi" 
                   :class="s <= newReview.so_sao ? 'bi-star-fill active' : 'bi-star'"
                   @click="newReview.so_sao = s"></i>
              </div>
              <textarea v-model="newReview.noi_dung" class="form-control mb-2" rows="2" placeholder="Chia sẻ cảm nhận của bạn..."></textarea>
              <button class="btn btn-sm btn-primary" @click="submitReview" :disabled="submittingReview">
                <span v-if="submittingReview" class="spinner-border spinner-border-sm me-1"></span>
                Gửi nhận xét
              </button>
            </div>
            <div v-else class="alert alert-info py-2" style="font-size: 0.85rem;">
              <i class="bi bi-info-circle me-1"></i> <router-link to="/client/dang-nhap">Đăng nhập</router-link> để để lại đánh giá.
            </div>

            <!-- Review List -->
            <div v-if="loadingReviews" class="text-center py-4">
              <div class="spinner-border text-primary spinner-border-sm"></div>
            </div>
            <div v-else-if="detailReviews.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-chat-square-dots fs-3 d-block mb-2"></i>
              Chưa có đánh giá nào cho địa điểm này.
            </div>
            <div v-else class="review-scroll-area">
              <div v-for="rv in detailReviews" :key="rv.id" class="review-item-card">
                <div class="rv-meta">
                  <div class="rv-user">
                    <div class="rv-avatar" v-if="rv.la_danh_gia_google && rv.avatar_nguoi_danh_gia">
                      <img :src="rv.avatar_nguoi_danh_gia" alt="avatar">
                    </div>
                    <div class="rv-avatar" v-else-if="rv.nguoi_dung?.avatar">
                      <img :src="getFullAvatar(rv.nguoi_dung.avatar)" alt="avatar">
                    </div>
                    <div class="rv-avatar-text" v-else>{{ (rv.la_danh_gia_google ? rv.ten_nguoi_danh_gia : rv.nguoi_dung?.ten || '?').charAt(0).toUpperCase() }}</div>
                    <span class="rv-name">
                      {{ rv.la_danh_gia_google ? rv.ten_nguoi_danh_gia : (rv.nguoi_dung?.ten || 'Người dùng') }}
                      <span v-if="rv.la_danh_gia_google" class="badge ms-1" style="font-size:0.65rem;background:linear-gradient(135deg,#4285f4,#34a853);color:#fff;padding:2px 6px;border-radius:10px;"><i class="bi bi-google me-1"></i>Google</span>
                    </span>
                  </div>
                  <div class="rv-stars">
                    <i v-for="s in rv.so_sao" :key="s" class="bi bi-star-fill text-warning"></i>
                  </div>
                </div>
                <p class="rv-text">{{ rv.noi_dung }}</p>
                <small class="rv-date text-muted">{{ formatDate(rv.created_at) }}</small>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">Đóng</button>
          <button class="btn btn-primary" @click="addToItinerary">Thêm vào lịch trình</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const BASE = 'http://localhost:8001/api';

export default {
  name: 'AmThuc',

  data() {
    return {
      activeFilter: 'Tất cả',
      filters: ['Tất cả', 'Quán ăn', 'Street food', 'Hải sản', 'Quán nhậu', 'Ăn vặt'],
      showModal: false,
      selectedPlace: null,
      modalMapInstance: null,
      searchQuery: '',
      tempSearchQuery: '',
      loadingSerp: false,
      serpResults: [],
      importingId: null,

      // Data từ backend
      places: [],
      loading: false,
      error: null,
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

  mounted() {
    this.fetchAmThuc();
  },

  computed: {
    filteredPlaces() {
      let filtered = this.places;
      if (this.activeFilter !== 'Tất cả') {
        filtered = filtered.filter(p => p.loai_dia_diem === this.activeFilter);
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.ten_dia_diem.toLowerCase().includes(q) ||
          (p.mo_ta && p.mo_ta.toLowerCase().includes(q))
        );
      }
      return filtered;
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
        const res = await fetch(`http://localhost:8001/api/serp/search?query=${encodeURIComponent(this.tempSearchQuery)}`);
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
        const res = await fetch(`http://localhost:8001/api/serp/import`, {
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

    async fetchAmThuc() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${BASE}/dia-diems/am-thuc`);
        if (!res.ok) throw new Error('Lỗi kết nối server (' + res.status + ')');
        const json = await res.json();
        
        const fallbacksByType = {
          'Quán ăn':    'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop',
          'Street food':'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
          'Hải sản':    'https://images.unsplash.com/photo-1559737022-8a20f87e61a6?w=800&h=600&fit=crop',
          'Quán nhậu':  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
          'Ăn vặt':     'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
        };
        this.places = (json.data || []).map(p => ({
          ...p,
          image: p.image || fallbacksByType[p.loai_dia_diem] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'
        }));
      } catch (e) {
        this.error = e.message || 'Không thể tải dữ liệu. Vui lòng thử lại.';
        this.places = [];
      } finally {
        this.loading = false;
      }
    },

    setFilter(filter) {
      this.activeFilter = filter;
    },

    categoryClass(category) {
      if (!category) return 'all';
      const mapping = {
        'Quán ăn': 'restaurant',
        'Street food': 'streetfood',
        'Hải sản': 'seafood',
        'Quán nhậu': 'bar',
        'Ăn vặt': 'snack',
      };
      return mapping[category] || 'restaurant';
    },

    formatPrice(price) {
      return Number(price).toLocaleString('vi-VN') + 'đ';
    },

    viewDetail(place) {
      this.selectedPlace = place;
      this.currentImageIdx = 0;
      this.showModal = true;
      this.activeModalTab = 'info';
      this.detailReviews = [];
      this.$nextTick(() => {
        this.initModalMap(place);
      });
      this.startAutoplay();
      this.fetchReviews(place.id);
    },

    startAutoplay() {
      this.stopAutoplay();
      if (this.selectedPlace?.gallery?.length > 1) {
        this.autoplayInterval = setInterval(() => {
          this.nextImage();
        }, 4000);
      }
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },

    nextImage() {
      if (this.selectedPlace.gallery) {
        this.currentImageIdx = (this.currentImageIdx + 1) % this.selectedPlace.gallery.length;
      }
    },
    prevImage() {
      if (this.selectedPlace.gallery) {
        this.currentImageIdx = (this.currentImageIdx - 1 + this.selectedPlace.gallery.length) % this.selectedPlace.gallery.length;
      }
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
      if (!place.vi_do || !place.kinh_do) return;
      const L = window.L;
      if (!L) return;
      
      const lat = parseFloat(place.vi_do);
      const lng = parseFloat(place.kinh_do);
      if (isNaN(lat) || isNaN(lng)) return;

      if (this.modalMapInstance) {
        this.modalMapInstance.off();
        this.modalMapInstance.remove();
        this.modalMapInstance = null;
      }

      // Initialize map
      this.modalMapInstance = L.map('detail-map', {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView([lat, lng], 16);

      // Google Maps Tile Layer
      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
      }).addTo(this.modalMapInstance);

      // Add a nice marker
      const marker = L.marker([lat, lng]).addTo(this.modalMapInstance)
        .bindPopup(`<div style="font-weight:700;">${place.ten_dia_diem}</div><div style="font-size:12px;">${place.dia_chi}</div>`)
        .openPopup();
      
      // Fix rendering issues in modals
      setTimeout(() => {
        if (this.modalMapInstance) {
          this.modalMapInstance.invalidateSize();
          this.modalMapInstance.setView([lat, lng], 16);
        }
      }, 400);
      
      // Extra check at 800ms for slow transitions
      setTimeout(() => {
        if (this.modalMapInstance) this.modalMapInstance.invalidateSize();
      }, 800);
    },

    closeModal() {
      this.stopAutoplay();
      this.showModal = false;
      this.selectedPlace = null;
    },

    createItinerary() {
      this.$router.push('/client/tao-lich-trinh');
    },

    addToItinerary() { this.$toast.info('Vui lòng sử dụng trang Tạo lịch trình để thêm địa điểm này!'); this.closeModal(); },

    performSearch() {
      this.searchQuery = this.tempSearchQuery;
    },

    clearSearch() {
      this.searchQuery = '';
      this.tempSearchQuery = '';
    },

    async fetchReviews(contentId) {
      this.loadingReviews = true;
      try {
        const res = await fetch(`${BASE}/dia-diems/danh-gia/place/${contentId}`);
        const json = await res.json();
        if (json.status === 'success') {
          this.detailReviews = json.data;
        }
      } catch (e) {
        console.error('Error fetching reviews:', e);
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
        const res = await fetch(`${BASE}/danh-gias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            id_dia_diem: this.selectedPlace.id,
            so_sao: this.newReview.so_sao,
            noi_dung: this.newReview.noi_dung,
            id_nguoi_dung: 0
          })
        });

        const json = await res.json();
        if (res.ok && json.status === 'success') {
          this.newReview.noi_dung = '';
          this.newReview.so_sao = 5;
          await this.fetchReviews(this.selectedPlace.id);
          this.$toast.success('Cảm ơn bạn đã gửi đánh giá! 🌟');
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
      return `http://localhost:8001${path.startsWith('/') ? '' : '/'}${path}`;
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { 
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
  },
};
</script>

<style scoped>
.check-in-page {
  background: linear-gradient(135deg, #f0f9ff 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.hero-section {
  position: relative;
  background:
    radial-gradient(circle at 10% 20%, rgba(58, 134, 255, 0.14), transparent 28%),
    radial-gradient(circle at 90% 15%, rgba(0, 200, 150, 0.16), transparent 20%),
    linear-gradient(180deg, #f6fbff 0%, #ffffff 48%, #f8fbff 100%);
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
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.search-bar .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.search-bar .btn-outline-secondary {
  border: 2px solid #cbd5e1;
  color: #64748b;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
}

.search-bar .btn-outline-secondary:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #334155;
}

.places-section {
  padding: 2rem 0;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-bar .btn-outline-primary {
  border-color: #e0e7ff;
  color: #4f46e5;
  background: #f0f4ff;
}

.filter-bar .btn-outline-primary:hover {
  background: #e0e7ff;
  border-color: #c7d2fe;
  color: #3730a3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.filter-bar .btn-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
  font-weight: 700;
}

.filter-bar .btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
}

.place-card {
  border-radius: 18px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: none;
  background: #ffffff;
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
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.badge.bg-danger {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 5;
}

.place-badge.restaurant {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.place-badge.streetfood {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
}

.place-badge.seafood {
  background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%);
}

.place-badge.bar {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
}

.place-badge.snack {
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-close:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%);
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.modal-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.2) 100%);
  border-radius: 16px;
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

.modal-actions .btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.modal-actions .btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.modal-actions .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05); }
.results-title { font-weight: 800; color: #1e293b; font-size: 1.4rem; }
.serp-item { background: #fff; border: 1px solid #f1f5f9; transition: all 0.3s ease; }
.serp-item:hover { transform: scale(1.02); box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-color: #3b82f6; }
.serp-item-img { width: 90px; height: 90px; border-radius: 12px; background-size: cover; background-position: center; border: 1px solid #eee; }
.serp-item-content h6 { font-weight: 700; color: #1e293b; }

/* Animation keyframes */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
