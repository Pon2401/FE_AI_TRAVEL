import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('../pages/Client/Home.vue'),
        meta: { layout: 'client' }
    },
    {
        path: '/client/dang-nhap',
        component: () => import('../pages/Client/DangNhap.vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/admin/dang-nhap',
        component: () => import('../pages/Admin/DangNhap.vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/client/dang-ky',
        component: () => import('../pages/Client/DangKy.vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/dashboard',
        component: () => import('../pages/Admin/Dashboard.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/admin/users',
        component: () => import('../pages/Admin/Users.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/products',
        component: () => import('../pages/Admin/Products.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/reports',
        component: () => import('../pages/Admin/Reports.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/settings',
        component: () => import('../pages/Admin/Settings.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/orders/list',
        component: () => import('../pages/Admin/OrdersList.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/orders/create',
        component: () => import('../pages/Admin/OrdersCreate.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/tao-lich-trinh',
        component: () => import('../pages/Client/TaoLichTrinh.vue'),
        meta: { layout: 'client' }
    },
    {
        path: '/lich-trinh-cua-toi',
        component: () => import('../pages/Client/LichTrinhCuaToi.vue'),
        meta: { layout: 'client' }
    },
    {
        path: '/nhom-du-lich',
        component: () => import('../pages/Client/NhomDuLich.vue'),
        meta: { layout: 'client' }
    },
    {
        path: '/profile',
        component: () => import('../pages/Client/profile.vue'),
        meta: { layout: 'client' }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
