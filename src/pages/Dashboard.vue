<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back to MatDash Admin Panel</p>
      </div>
      <button class="btn btn-primary">
        <i class="bi bi-download me-2"></i>Download Report
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="stats-card card-users">
          <div class="stats-icon">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="stats-content">
            <p class="stats-label">Total Users</p>
            <h2 class="stats-value">1,234</h2>
            <small class="stats-change text-success"><i class="bi bi-arrow-up"></i> +12% this month</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stats-card card-orders">
          <div class="stats-icon">
            <i class="bi bi-cart-fill"></i>
          </div>
          <div class="stats-content">
            <p class="stats-label">Total Orders</p>
            <h2 class="stats-value">456</h2>
            <small class="stats-change text-success"><i class="bi bi-arrow-up"></i> +8% this month</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stats-card card-revenue">
          <div class="stats-icon">
            <i class="bi bi-cash-coin"></i>
          </div>
          <div class="stats-content">
            <p class="stats-label">Revenue</p>
            <h2 class="stats-value">$12,340</h2>
            <small class="stats-change text-success"><i class="bi bi-arrow-up"></i> +25% this month</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stats-card card-products">
          <div class="stats-icon">
            <i class="bi bi-box-fill"></i>
          </div>
          <div class="stats-content">
            <p class="stats-label">Products</p>
            <h2 class="stats-value">789</h2>
            <small class="stats-change text-danger"><i class="bi bi-arrow-down"></i> -5% this month</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row g-3 mb-4">
      <!-- Revenue Chart -->
      <div class="col-lg-8">
        <div class="card card-custom">
          <div class="card-header">
            <h5 class="mb-0">Revenue Overview</h5>
            <div class="chart-actions">
              <button class="btn btn-sm btn-light active">Week</button>
              <button class="btn btn-sm btn-light">Month</button>
              <button class="btn btn-sm btn-light">Year</button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <p class="text-muted text-center py-5">Chart coming soon...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="col-lg-4">
        <div class="card card-custom">
          <div class="card-header">
            <h5 class="mb-0">Top Products</h5>
          </div>
          <div class="card-body">
            <div class="top-products-list">
              <div v-for="product in topProducts" :key="product.id" class="product-item">
                <div class="product-info">
                  <p class="product-name">{{ product.name }}</p>
                  <p class="product-sales">{{ product.sales }} sales</p>
                </div>
                <span class="product-badge">{{ product.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="row">
      <div class="col-12">
        <div class="card card-custom">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Recent Orders</h5>
            <a href="/orders/list" class="text-primary small text-decoration-none">View all</a>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td class="fw-600">{{ order.id }}</td>
                    <td>{{ order.customer }}</td>
                    <td>${{ order.amount }}</td>
                    <td>{{ order.date }}</td>
                    <td>
                      <span 
                        class="badge"
                        :class="getStatusClass(order.status)"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      recentOrders: [
        { id: '#ORD001', customer: 'John Doe', amount: 450, date: 'Jan 15, 2024', status: 'Completed' },
        { id: '#ORD002', customer: 'Jane Smith', amount: 320, date: 'Jan 14, 2024', status: 'Pending' },
        { id: '#ORD003', customer: 'Mike Johnson', amount: 680, date: 'Jan 13, 2024', status: 'Processing' },
        { id: '#ORD004', customer: 'Sarah Williams', amount: 280, date: 'Jan 12, 2024', status: 'Completed' },
        { id: '#ORD005', customer: 'Tom Brown', amount: 550, date: 'Jan 11, 2024', status: 'Cancelled' },
      ],
      topProducts: [
        { id: 1, name: 'Laptop Pro', sales: 1240, percentage: 73.2 },
        { id: 2, name: 'Web App Project', sales: 980, percentage: 65.8 },
        { id: 3, name: 'UI Components', sales: 745, percentage: 52.1 },
        { id: 4, name: 'Dashboard Kit', sales: 620, percentage: 48.5 },
      ]
    };
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        'Completed': 'badge-success',
        'Pending': 'badge-warning',
        'Processing': 'badge-info',
        'Cancelled': 'badge-danger'
      };
      return statusMap[status] || 'badge-secondary';
    }
  }
};
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #adb5bd;
  font-weight: 400;
}

/* Stats Cards */
.stats-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  animation: slideIn 0.3s ease;
}

.stats-card.card-users::before {
  background: linear-gradient(90deg, #5a67d8 0%, #7c3aed 100%);
}

.stats-card.card-orders::before {
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
}

.stats-card.card-revenue::before {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.stats-card.card-products::before {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.stats-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stats-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-users .stats-icon {
  background: rgba(90, 103, 216, 0.1);
  color: #5a67d8;
}

.card-orders .stats-icon {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.card-revenue .stats-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.card-products .stats-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stats-content {
  flex-grow: 1;
}

.stats-label {
  font-size: 0.8125rem;
  color: #adb5bd;
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.3px;
}

.stats-change {
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-weight: 500;
}

.stats-change.text-success {
  color: #48bb78;
}

.stats-change.text-danger {
  color: #ef4444;
}

/* Cards */
.card-custom {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none;
  transition: all 0.3s ease;
}

.card-custom:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.2px;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-placeholder {
  background: #f8f9fa;
  border-radius: 8px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Top Products */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.product-item:hover {
  background: #e9ecef;
}

.product-info {
  flex-grow: 1;
}

.product-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
  letter-spacing: -0.2px;
}

.product-sales {
  font-size: 0.8125rem;
  color: #adb5bd;
  margin: 0;
  font-weight: 400;
}

.product-badge {
  background: #e7f5ff;
  color: #0c63e4;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Table */
.table {
  font-size: 0.9375rem;
  margin-bottom: 0;
}

.table thead th {
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
}

.table tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f2f5;
  vertical-align: middle;
  color: #495057;
  font-weight: 400;
}

.table tbody tr:hover {
  background: #f8f9fa;
}

.fw-600 {
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.2px;
}

/* Badges */
.badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background: rgba(72, 187, 120, 0.15);
  color: #2f855a;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #b45309;
}

.badge-info {
  background: rgba(59, 130, 246, 0.15);
  color: #1e40af;
}

.badge-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #991b1b;
}

.badge-secondary {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(90deg, #5a67d8 0%, #7c3aed 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(90, 103, 216, 0.3);
}

.btn-outline-primary {
  color: #5a67d8;
  border: 1px solid #5a67d8;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  background: #5a67d8;
  color: white;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-header .btn {
    width: 100%;
  }
}
</style>
