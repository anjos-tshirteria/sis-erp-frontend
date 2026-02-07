import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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
      },
      {
        path: 'produtos',
        name: 'produtos',
        component: () => import('@/views/ProdutosView.vue'),
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/views/ClientesView.vue'),
      },
      {
        path: 'fornecedores',
        name: 'fornecedores',
        component: () => import('@/views/FornecedoresView.vue'),
      },
      {
        path: 'etiquetas',
        name: 'etiquetas',
        component: () => import('@/views/EtiquetasView.vue'),
      },
      {
        path: 'contas-receber',
        name: 'contas-receber',
        component: () => import('@/views/ContasReceberView.vue'),
      },
      {
        path: 'contas-pagar',
        name: 'contas-pagar',
        component: () => import('@/views/ContasPagarView.vue'),
      },
      {
        path: 'relatorios',
        name: 'relatorios',
        component: () => import('@/views/RelatoriosView.vue'),
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/UsuariosView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
