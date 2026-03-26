import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('../pages/Client/Home.vue'),
        meta: { layout: 'client' }
    },
    {
        path: '/client-login',
        component: () => import('../pages/Client/DangNhap.vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/admin-login',
        component: () => import('../pages/Admin/DangNhap.vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/client-dangky',
        component: () => import('../pages/Client/DangKy.vue'),
        meta: { layout: 'blank' }
    },
    {
        path: '/dashboard',
        component: () => import('../pages/Admin/Dashboard.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/users',
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
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
