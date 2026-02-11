import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { Permission } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    permission?: Permission
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'sales',
        name: 'sales',
        component: () => import('@/views/SalesView.vue'),
        meta: { permission: 'VIEW_SALES' },
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/ProductsView.vue'),
        meta: { permission: 'MANAGE_PRODUCTS' },
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import('@/views/ClientsView.vue'),
        meta: { permission: 'MANAGE_CLIENTS' },
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        component: () => import('@/views/SuppliersView.vue'),
        meta: { permission: 'MANAGE_SUPPLIERS' },
      },
      {
        path: 'suppliers/:id',
        name: 'supplier-details',
        component: () => import('@/views/SupplierDetailsView.vue'),
        meta: { permission: 'MANAGE_SUPPLIERS' },
      },
      {
        path: 'labels',
        name: 'labels',
        component: () => import('@/views/LabelsView.vue'),
        meta: { permission: 'MANAGE_PRODUCTS' },
      },
      {
        path: 'accounts-receivable',
        name: 'accounts-receivable',
        component: () => import('@/views/AccountsReceivableView.vue'),
        meta: { permission: 'ACCOUNTS_RECEIVABLE' },
      },
      {
        path: 'accounts-payable',
        name: 'accounts-payable',
        component: () => import('@/views/AccountsPayableView.vue'),
        meta: { permission: 'ACCOUNTS_PAYABLE' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/ReportsView.vue'),
        meta: { permission: 'VIEW_REPORTS' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { permission: 'MANAGE_USERS' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  if (to.name === 'login') {
    if (authStore.isAuthenticated) return { path: '/' }
    return true
  }

  if (to.name === 'forbidden') return true

  if (!authStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    return { path: '/403' }
  }

  return true
})

export default router
