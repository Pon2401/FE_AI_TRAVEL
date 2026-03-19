import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('../pages/Dashboard.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/users',
        component: () => import('../pages/Users.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/products',
        component: () => import('../pages/Products.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/reports',
        component: () => import('../pages/Reports.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/settings',
        component: () => import('../pages/Settings.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/orders/list',
        component: () => import('../pages/OrdersList.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/orders/create',
        component: () => import('../pages/OrdersCreate.vue'),
        meta: { layout: 'default' }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router