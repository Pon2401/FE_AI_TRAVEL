<template>
  <div class="users-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-2">Users</h1>
        <p class="text-muted">Manage all users in the system</p>
      </div>
      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Add New User
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr class="text-muted small">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td class="fw-bold">{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge bg-light text-dark">{{ user.role }}</span>
                </td>
                <td>
                  <span v-if="user.active" class="badge bg-success">Active</span>
                  <span v-else class="badge bg-secondary">Inactive</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2">Edit</button>
                  <button class="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', active: false },
      ]
    };
  }
};
</script>

<style scoped>
.users-page {
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
</style>
