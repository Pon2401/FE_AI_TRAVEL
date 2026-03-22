<template>
  <footer class="client-footer pt-5 pb-4">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <h5 class="footer-title">Travelo Client</h5>
          <p class="footer-text">
            Master layout client tách riêng để dùng chung cho toàn bộ trang giao diện
            người dùng với Bootstrap.
          </p>
        </div>

        <div class="col-sm-6 col-lg-2">
          <h6 class="footer-heading">Company</h6>
          <ul class="list-unstyled footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Service</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div class="col-sm-6 col-lg-3">
          <h6 class="footer-heading">Support</h6>
          <ul class="list-unstyled footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>

        <div class="col-lg-3">
          <h6 class="footer-heading">Contact</h6>
          <p class="footer-text mb-2">123 Travel Street, Ho Chi Minh City</p>
          <p class="footer-text mb-0">contact@travelo-client.test</p>
        </div>
      </div>

      <div class="footer-bottom mt-4 pt-3 d-flex flex-column flex-md-row justify-content-between gap-2">
        <span>© 2026 Travelo Client Layout</span>
        <span>Built with Vue 3 and Bootstrap 5</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ClientFooter',
};
</script>

<style scoped>
.client-footer {
  background: #082032;
  color: rgba(255, 255, 255, 0.76);
}

.footer-title,
.footer-heading {
  color: #ffffff;
}

.footer-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.footer-heading {
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.footer-links li + li {
  margin-top: 0.65rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

.footer-links a:hover {
  color: #ffcf8b;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.92rem;
}
</style>
