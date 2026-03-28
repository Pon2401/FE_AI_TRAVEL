<template>
  <div class="giai-tri-page">

    <!-- HERO -->
    <section class="hero-section py-5 position-relative">
      <button class="btn btn-success create-itinerary-btn" @click="createItinerary">
        <i class="fas fa-calendar-plus me-2"></i>Tạo lịch trình
      </button>
      <div class="container text-center">
        <h1 class="page-title mb-3">
          <i class="fas fa-map-marker-alt me-3"></i>Địa điểm giải trí Đà Nẵng
        </h1>
        <p class="page-subtitle mb-4 text-center">
          <i class="fas fa-robot me-2 "></i>Khám phá địa điểm  giải trí:ngoài trời, cafe, mua sắm, xem phim, công viên ... và trải nghiệm AI đề xuất hợp ngân sách.
        </p>

        <!-- SEARCH -->
        <div class="search-bar d-flex justify-content-center mb-3">
          <input v-model="tempSearchQuery" type="text" class="form-control me-2" placeholder="Tìm kiếm địa điểm..." style="max-width: 400px;" @keyup.enter="performSearch">
          <button @click="performSearch" class="btn btn-primary me-2">Tìm kiếm</button>
          <button @click="clearSearch" class="btn btn-outline-secondary" v-if="searchQuery">Xóa</button>
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

    <!-- LIST -->
    <section class="places-section py-4">
      <div class="container">
        <div class="row g-4">

          <div v-for="place in filteredPlaces" :key="place.id" class="col-12 col-md-6 col-xl-4">
            <div class="card place-card h-100 shadow-sm">

              <!-- IMAGE -->
              <div class="place-image" :style="{ backgroundImage: `url(${place.image})` }">
                <div :class="['place-badge', categoryClass(place.category)]">{{ place.category }}</div>
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

          <div v-if="filteredPlaces.length === 0" class="text-center">
            Không có dữ liệu
          </div>

        </div>
      </div>
    </section>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="btn-close" @click="closeModal">×</button>
        <div class="modal-header">
          <h4>{{ selectedPlace.ten_dia_diem }}</h4>
          <small class="text-muted">{{ selectedPlace.category }} - ⭐ {{ selectedPlace.danh_gia_trung_binh }}</small>
        </div>
        <div class="modal-body">
          <div class="modal-image" :style="{ backgroundImage: `url(${selectedPlace.image})` }"></div>
          <p>{{ selectedPlace.mo_ta }}</p>
          <ul>
            <li><strong>Địa chỉ:</strong> {{ selectedPlace.dia_chi }}</li>
            <li><strong>Giờ mở / đóng:</strong> {{ selectedPlace.gio_mo_cua }} - {{ selectedPlace.gio_dong_cua }}</li>
            <li><strong>Giá vé:</strong> {{ selectedPlace.gia_ve === 0 ? 'Miễn phí' : formatPrice(selectedPlace.gia_ve) }}</li>
            <li><strong>Category:</strong> {{ selectedPlace.category }}</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">Đóng</button>
          <button class="btn btn-primary" @click="alert('Chức năng thêm vào lịch trình đang phát triển'); closeModal()">Thêm vào lịch trình</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeFilter: 'Tất cả',
      filters: ['Tất cả', 'Ngoài trời', 'Mua sắm', 'Xem phim', 'Công viên', 'Âm nhạc', 'Cafe'],
      showModal: false,
      selectedPlace: null,
      searchQuery: '',
      tempSearchQuery: '',

      places: [
        {
          id: 1,
          ten_dia_diem: 'Cầu Rồng',
          mo_ta: 'Biểu tượng Đà Nẵng, phun lửa cuối tuần',
          dia_chi: 'Đường Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.227,
          vi_do: 16.061,
          gia_ve: 0,
          gio_mo_cua: '00:00',
          gio_dong_cua: '23:59',
          danh_gia_trung_binh: 4.8,
          category: 'Ngoài trời',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
        },
        {
          id: 6,
          ten_dia_diem: 'The Espresso Station',
          mo_ta: 'Quán cà phê hiện đại, không gian làm việc mở, đồ uống thơm ngon.',
          dia_chi: '48 Trần Phú, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.218,
          vi_do: 16.061,
          gia_ve: 50000,
          gio_mo_cua: '06:30',
          gio_dong_cua: '22:00',
          danh_gia_trung_binh: 4.7,
          category: 'Cafe',
          image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&h=600&fit=crop'
        },
        {
          id: 7,
          ten_dia_diem: 'Cong Caphe - Trần Phú',
          mo_ta: 'Cafe phong cách Việt, vibe vintage đặc trưng, phù hợp check-in.',
          dia_chi: '56 Trần Phú, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.223,
          vi_do: 16.067,
          gia_ve: 40000,
          gio_mo_cua: '07:30',
          gio_dong_cua: '23:00',
          danh_gia_trung_binh: 4.5,
          category: 'Cafe',
          image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop'
        },
        {
          id: 8,
          ten_dia_diem: 'Rainforest Coffee',
          mo_ta: 'Cafe xanh giữa đô thị, hoà mình với cây cối, nước ép healthy.',
          dia_chi: '12 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.215,
          vi_do: 16.056,
          gia_ve: 45000,
          gio_mo_cua: '07:00',
          gio_dong_cua: '22:30',
          danh_gia_trung_binh: 4.6,
          category: 'Cafe',
          image: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&h=600&fit=crop'
        },
    
        {
          id: 2,
          ten_dia_diem: 'Vincom Plaza',
          mo_ta: 'Trung tâm mua sắm lớn',
          dia_chi: '109 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.223,
          vi_do: 16.067,
          gia_ve: 0,
          gio_mo_cua: '09:00',
          gio_dong_cua: '22:00',
          danh_gia_trung_binh: 4.6,
          category: 'Mua sắm',
          image: 'https://images.unsplash.com/photo-1519567770579-c2fc3b6d5d9b?w=800&h=600&fit=crop'
        },
        {
          id: 3,
          ten_dia_diem: 'CGV Cinema',
          mo_ta: 'Rạp chiếu phim hiện đại',
          dia_chi: '31 Thái Phiên, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.22,
          vi_do: 16.06,
          gia_ve: 90000,
          gio_mo_cua: '09:00',
          gio_dong_cua: '23:00',
          danh_gia_trung_binh: 4.5,
          category: 'Xem phim',
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
        },
        {
          id: 4,
          ten_dia_diem: 'Công viên Biển Đông',
          mo_ta: 'Công viên rộng, gần biển',
          dia_chi: 'TP. Đà Nẵng',
          kinh_do: 108.24,
          vi_do: 16.07,
          gia_ve: 0,
          gio_mo_cua: '05:00',
          gio_dong_cua: '22:00',
          danh_gia_trung_binh: 4.7,
          category: 'Công viên',
          image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop'
        },
        {
          id: 5,
          ten_dia_diem: 'Sky36',
          mo_ta: 'Bar nhạc sống, view đẹp',
          dia_chi: '36 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
          kinh_do: 108.21,
          vi_do: 16.05,
          gia_ve: 150000,
          gio_mo_cua: '17:00',
          gio_dong_cua: '01:00',
          danh_gia_trung_binh: 4.4,
          category: 'Âm nhạc',
          image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop'
        }
      ]
    }
  },

  computed: {
    filteredPlaces() {
      let filtered = this.places;
      if (this.activeFilter !== 'Tất cả') {
        filtered = filtered.filter(p => p.category === this.activeFilter);
      }
      if (this.searchQuery) {
        filtered = filtered.filter(p =>
          p.ten_dia_diem.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          p.mo_ta.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return filtered;
    }
  },

  methods: {
    setFilter(filter) {
      this.activeFilter = filter
    },

    categoryClass(category) {
      const mapping = {
        'Ngoài trời': 'outdoor',
        'Mua sắm': 'shopping',
        'Xem phim': 'cinema',
        'Công viên': 'park',
        'Âm nhạc': 'music',
        'Cafe': 'cafe'
      }
      return mapping[category] || 'outdoor'
    },

    formatPrice(price) {
      return price.toLocaleString() + 'đ'
    },

    viewDetail(place) {
      this.selectedPlace = place
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedPlace = null
    },

    createItinerary() {
      alert('Chức năng tạo lịch trình đang phát triển')
    },

    performSearch() {
      this.searchQuery = this.tempSearchQuery;
    },

    clearSearch() {
      this.searchQuery = '';
      this.tempSearchQuery = '';
    }
  }
}
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
.place-badge.outdoor { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); }
.place-badge.shopping { background: linear-gradient(135deg, #34d399 0%, #059669 100%); }
.place-badge.cinema { background: linear-gradient(135deg, #f97316 0%, #c2410c 100%); }
.place-badge.park { background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); }
.place-badge.music { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); }
.place-badge.cafe { background: linear-gradient(135deg, #10b981 0%, #047857 100%); }

.price-text {
  color: #059669;
  font-weight: 800;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}



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
