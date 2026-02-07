<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import type { Permission } from '@/types'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Tags,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  UserCircle,
  X,
  Menu,
  LogOut,
} from 'lucide-vue-next'

const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()

const allMenuItems: Array<{
  path: string
  icon: typeof LayoutDashboard
  label: string
  permission?: Permission
}> = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/vendas', icon: ShoppingCart, label: 'Vendas', permission: 'VIEW_SALES' },
  { path: '/produtos', icon: Package, label: 'Produtos', permission: 'MANAGE_PRODUCTS' },
  { path: '/clientes', icon: Users, label: 'Clientes', permission: 'MANAGE_CLIENTS' },
  { path: '/fornecedores', icon: Truck, label: 'Fornecedores', permission: 'MANAGE_SUPPLIERS' },
  { path: '/etiquetas', icon: Tags, label: 'Etiquetas', permission: 'MANAGE_PRODUCTS' },
  {
    path: '/contas-receber',
    icon: ArrowDownCircle,
    label: 'Contas a Receber',
    permission: 'ACCOUNTS_RECEIVABLE',
  },
  {
    path: '/contas-pagar',
    icon: ArrowUpCircle,
    label: 'Contas a Pagar',
    permission: 'ACCOUNTS_PAYABLE',
  },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios', permission: 'VIEW_REPORTS' },
  { path: '/usuarios', icon: UserCircle, label: 'Usuários', permission: 'MANAGE_USERS' },
]

const menuItems = computed(() =>
  allMenuItems.filter((item) => !item.permission || authStore.hasPermission(item.permission)),
)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const sidebarOpen = computed(() => appStore.sidebarOpen)
</script>

<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col',
      sidebarOpen ? 'w-64' : 'w-0 overflow-hidden md:w-20 md:overflow-visible',
    ]"
  >
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h1 v-if="sidebarOpen" class="font-semibold text-xl truncate">ERP System</h1>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        @click="appStore.toggleSidebar()"
      >
        <X v-if="sidebarOpen" class="w-5 h-5" />
        <Menu v-else class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
          isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100',
          !sidebarOpen && 'justify-center',
        ]"
        :title="!sidebarOpen ? item.label : ''"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span v-if="sidebarOpen">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-gray-200 p-4">
      <div v-if="authStore.user" class="flex items-center gap-3">
        <UserCircle class="w-8 h-8 text-gray-400 shrink-0" />
        <div v-if="sidebarOpen" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user.name }}</p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.user.role.name }}</p>
        </div>
        <button
          :class="[
            'p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-600',
            !sidebarOpen && 'hidden md:block',
          ]"
          title="Sair"
          @click="authStore.logout()"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>
