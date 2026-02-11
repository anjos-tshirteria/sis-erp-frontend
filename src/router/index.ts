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
        path: 'vendas',
        name: 'vendas',
        component: () => import('@/views/VendasView.vue'),
        meta: { permission: 'VIEW_SALES' },
      },
      {
        path: 'produtos',
        name: 'produtos',
        component: () => import('@/views/ProdutosView.vue'),
        meta: { permission: 'MANAGE_PRODUCTS' },
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/views/ClientesView.vue'),
        meta: { permission: 'MANAGE_CLIENTS' },
      },
      {
        path: 'fornecedores',
        name: 'fornecedores',
        component: () => import('@/views/FornecedoresView.vue'),
        meta: { permission: 'MANAGE_SUPPLIERS' },
      },
      {
        path: 'fornecedores/:id',
        name: 'fornecedor-detalhes',
        component: () => import('@/views/FornecedorDetalhesView.vue'),
        meta: { permission: 'MANAGE_SUPPLIERS' },
      },
      {
        path: 'etiquetas',
        name: 'etiquetas',
        component: () => import('@/views/EtiquetasView.vue'),
        meta: { permission: 'MANAGE_PRODUCTS' },
      },
      {
        path: 'contas-receber',
        name: 'contas-receber',
        component: () => import('@/views/ContasReceberView.vue'),
        meta: { permission: 'ACCOUNTS_RECEIVABLE' },
      },
      {
        path: 'contas-pagar',
        name: 'contas-pagar',
        component: () => import('@/views/ContasPagarView.vue'),
        meta: { permission: 'ACCOUNTS_PAYABLE' },
      },
      {
        path: 'relatorios',
        name: 'relatorios',
        component: () => import('@/views/RelatoriosView.vue'),
        meta: { permission: 'VIEW_REPORTS' },
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/UsuariosView.vue'),
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
