<template>
  <div class="staff-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Danh sách nhân viên</h1>
      </div>
    </div>

    <div class="card card-custom table-card">
      <div class="card-header-custom">
        <div class="toolbar d-flex justify-content-between align-items-center w-100 gap-3 flex-wrap">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input
              v-model.trim="keyword"
              type="text"
              class="form-control search-input"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
            >
          </div>

          <div class="d-flex align-items-center gap-2 flex-wrap">
            <button class="btn btn-light refresh-btn" :disabled="loading" @click="fetchAdmins">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="bi bi-arrow-clockwise me-2"></i>
              Làm mới
            </button>
            <button
              class="btn btn-primary action-btn"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#modalThemNhanVien"
            >
              <i class="bi bi-person-plus-fill me-2"></i>Thêm nhân viên
            </button>
          </div>
        </div>
      </div>

      <div class="card-body p-0">
        <div v-if="loading" class="state-box">
          <div class="spinner-border text-primary mb-3" role="status"></div>
          <div class="state-title">Đang tải danh sách nhân viên...</div>
        </div>

        <div v-else-if="errorMessage" class="state-box">
          <div class="state-icon state-error">
            <i class="bi bi-exclamation-octagon"></i>
          </div>
          <div class="state-title">Không thể tải danh sách nhân viên</div>
          <div class="state-text">{{ errorMessage }}</div>
        </div>

        <div v-else-if="!filteredAdmins.length" class="state-box">
          <div class="state-icon state-empty">
            <i class="bi bi-inbox"></i>
          </div>
          <div class="state-title">Không có nhân viên nào phù hợp</div>
          <div class="state-text">Thử đổi từ khóa tìm kiếm hoặc kiểm tra lại dữ liệu từ backend.</div>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="text-center" style="width: 70px;">#</th>
                <th style="min-width: 260px;">Nhân viên</th>
                <th>Email</th>
                <th style="min-width: 150px;">Số điện thoại</th>
                <th style="min-width: 140px;">Chức vụ</th>
                <th style="min-width: 140px;">Trạng thái</th>
                <th class="text-center" style="width: 150px;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(admin, index) in filteredAdmins" :key="admin.id || admin.email">
                <td class="text-center fw-semibold">{{ index + 1 }}</td>
                <td>
                  <div class="staff-cell">
                    <div class="avatar-badge">
                      {{ getInitials(admin) }}
                    </div>
                    <div>
                      <div class="staff-name">{{ getDisplayName(admin) }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-body">{{ admin.email || 'Chưa có email' }}</span>
                </td>
                <td>
                  <span class="text-body">{{ getPhone(admin) || 'Chưa cập nhật' }}</span>
                </td>
                <td>
                  <span class="role-badge">
                    {{ getRole(admin) }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(admin)">
                    {{ getStatusLabel(admin) }}
                  </span>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    type="button"
                    title="Sửa"
                    data-bs-toggle="modal"
                    data-bs-target="#modalSuaNhanVien"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    type="button"
                    title="Xóa"
                    data-bs-toggle="modal"
                    data-bs-target="#modalXoaNhanVien"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      id="modalThemNhanVien"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="modalThemNhanVienLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content staff-modal">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 id="modalThemNhanVienLabel" class="modal-title">Thêm nhân viên</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body pt-3">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Họ và tên</label>
                <input type="text" class="form-control modal-input" placeholder="Nhập họ và tên">
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control modal-input" placeholder="Nhập địa chỉ email">
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input type="text" class="form-control modal-input" placeholder="Nhập số điện thoại">
              </div>
              <div class="col-md-6">
                <label class="form-label">Chức vụ</label>
                <select class="form-select modal-input">
                  <option selected disabled>Chọn chức vụ</option>
                  <option>Quản trị viên</option>
                  <option>Nhân viên</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Mật khẩu</label>
                <input type="password" class="form-control modal-input" placeholder="Nhập mật khẩu">
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select class="form-select modal-input">
                  <option selected>Đang hoạt động</option>
                  <option>Tạm khóa</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label">Ghi chú</label>
                <textarea
                  class="form-control modal-input modal-textarea"
                  rows="4"
                  placeholder="Nhập ghi chú nếu có"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-light modal-cancel-btn" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary action-btn">Lưu nhân viên</button>
          </div>
        </div>
      </div>
    </div>

    <div
      id="modalSuaNhanVien"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="modalSuaNhanVienLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content staff-modal">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 id="modalSuaNhanVienLabel" class="modal-title">Sửa nhân viên</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body pt-3">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Họ và tên</label>
                <input type="text" class="form-control modal-input" placeholder="Tên nhân viên">
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control modal-input" placeholder="Email nhân viên">
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input type="text" class="form-control modal-input" placeholder="Số điện thoại">
              </div>
              <div class="col-md-6">
                <label class="form-label">Chức vụ</label>
                <select class="form-select modal-input">
                  <option>Quản trị viên</option>
                  <option selected>Nhân viên</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select class="form-select modal-input">
                  <option selected>Đang hoạt động</option>
                  <option>Tạm khóa</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Mật khẩu mới</label>
                <input type="password" class="form-control modal-input" placeholder="Bỏ trống nếu không đổi">
              </div>
              <div class="col-12">
                <label class="form-label">Ghi chú</label>
                <textarea
                  class="form-control modal-input modal-textarea"
                  rows="4"
                  placeholder="Cập nhật ghi chú"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-light modal-cancel-btn" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary action-btn">Cập nhật</button>
          </div>
        </div>
      </div>
    </div>

    <div
      id="modalXoaNhanVien"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="modalXoaNhanVienLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content staff-modal">
          <div class="modal-body delete-modal-body">
            <div class="delete-icon">
              <i class="bi bi-trash3"></i>
            </div>
            <h5 id="modalXoaNhanVienLabel" class="modal-title text-center">Xóa nhân viên</h5>
            <p class="delete-text mb-0">
              Bạn có chắc chắn muốn xóa nhân viên này không? 
            </p>
          </div>
          <div class="modal-footer border-0 justify-content-center pt-0">
            <button type="button" class="btn btn-light modal-cancel-btn" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-danger modal-delete-btn">Xác nhận xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api/admin/danh-sach-nhan-vien'

export default {
  name: 'DanhSachNhanVien',
  data() {
    return {
      admins: [],
      keyword: '',
      loading: false,
      errorMessage: '',
    }
  },
  computed: {
    filteredAdmins() {
      const keyword = this.keyword.toLowerCase()
      if (!keyword) return this.admins

      return this.admins.filter((admin) => {
        const values = [
          admin.id,
          admin.email,
          admin.ten,
          admin.ho_ten,
          admin.so_dien_thoai,
          admin.id_chuc_vu,
          admin.trang_thai,
          admin.vai_tro,
          admin.role,
        ]

        return values.some((value) => String(value || '').toLowerCase().includes(keyword))
      })
    },
  },
  mounted() {
    this.fetchAdmins()
  },
  methods: {
    authHeader() {
      const token = localStorage.getItem('key_admin')
      return token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}
    },
    async fetchAdmins() {
      this.loading = true
      this.errorMessage = ''

      try {
        const res = await axios.get(API_URL, this.authHeader())
        this.admins = Array.isArray(res.data.data) ? res.data.data : []
      } catch (error) {
        this.admins = []
        this.errorMessage = error.response?.data?.message || 'Không thể tải danh sách nhân viên.'
      } finally {
        this.loading = false
      }
    },
    getDisplayName(admin) {
      return admin.ho_ten || admin.ten || admin.email || `Nhân viên #${admin.id ?? ''}`
    },
    getInitials(admin) {
      const name = this.getDisplayName(admin).trim()
      const parts = name.split(/\s+/).filter(Boolean)
      if (!parts.length) return 'NV'
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
      return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
    },
    getRole(admin) {
      if (admin.vai_tro || admin.role) {
        return admin.vai_tro || admin.role
      }

      const roleMap = {
        1: 'Quản trị viên',
        2: 'Nhân viên',
      }

      return roleMap[Number(admin.id_chuc_vu)] || `Chức vụ #${admin.id_chuc_vu ?? '--'}`
    },
    getPhone(admin) {
      return admin.so_dien_thoai || admin.sdt || ''
    },
    getStatusLabel(admin) {
      return Number(admin.trang_thai) === 1 ? 'Đang hoạt động' : 'Tạm khóa'
    },
    getStatusClass(admin) {
      return Number(admin.trang_thai) === 1 ? 'status-active' : 'status-inactive'
    },
    formatDate(value) {
      if (!value) return 'Chưa có dữ liệu'
      return new Date(value).toLocaleString('vi-VN')
    },
  },
}
</script>

<style scoped>
.staff-page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.card-custom {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
}

.card-header-custom {
  padding: 20px 22px;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
}

.toolbar {
  min-width: 320px;
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  min-height: 44px;
  padding-left: 42px;
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  background: #fff;
}

.search-input:focus {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 4px rgba(90, 103, 216, 0.12);
  background: #fff;
}

.action-btn {
  white-space: nowrap;
  background: linear-gradient(90deg, #5a67d8 0%, #7c3aed 100%);
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 600;
}

.refresh-btn {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  border: 1px solid #dbe4f0;
  color: #475569;
  background: #fff;
}

.refresh-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.table thead th {
  background: #f8fafc;
  color: #64748b;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 14px 18px;
  border-bottom: 1px solid #e2e8f0;
}

.table tbody td {
  padding: 16px 18px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}

.table tbody tr:hover {
  background: #fafcff;
}

.staff-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-badge {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #5a67d8, #7c3aed);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.staff-name {
  font-weight: 700;
  color: #0f172a;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(90, 103, 216, 0.12);
  color: #4c51bf;
  font-size: 0.82rem;
  font-weight: 700;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.status-active {
  background: rgba(16, 185, 129, 0.14);
  color: #047857;
}

.status-inactive {
  background: rgba(239, 68, 68, 0.14);
  color: #b91c1c;
}

.state-box {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 20px;
  text-align: center;
}

.state-icon {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 18px;
}

.state-error {
  background: #fff1f2;
  color: #dc2626;
}

.state-empty {
  background: #eff6ff;
  color: #2563eb;
}

.state-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.state-text {
  max-width: 420px;
  color: #64748b;
}

.staff-modal {
  border: 0;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.modal-subtitle {
  color: #64748b;
  margin-top: 6px;
}

.form-label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.modal-input {
  min-height: 46px;
  border-radius: 14px;
  border: 1px solid #dbe4f0;
  padding: 10px 14px;
  color: #0f172a;
}

.modal-input:focus {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 4px rgba(90, 103, 216, 0.12);
}

.modal-textarea {
  min-height: 110px;
  resize: none;
}

.modal-cancel-btn {
  min-width: 110px;
  border-radius: 12px;
  border: 1px solid #dbe4f0;
  color: #475569;
  font-weight: 600;
}

.delete-modal-body {
  padding: 32px 28px 12px;
  text-align: center;
}

.delete-icon {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1f2;
  color: #dc2626;
  font-size: 1.6rem;
}

.delete-text {
  max-width: 360px;
  margin: 12px auto 0;
  color: #64748b;
  line-height: 1.6;
}

.modal-delete-btn {
  min-width: 140px;
  border-radius: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .card-header-custom,
  .toolbar {
    min-width: 100%;
  }

  .search-box {
    width: 100%;
    min-width: 100%;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-cancel-btn,
  .modal-delete-btn,
  .action-btn {
    width: 100%;
  }
}
</style>
