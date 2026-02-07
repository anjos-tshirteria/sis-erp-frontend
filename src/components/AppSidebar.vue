<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Tag,
  DollarSign,
  CreditCard,
  BarChart3,
  UserCircle,
  X,
  Menu,
} from 'lucide-vue-next'

const route = useRoute()
const appStore = useAppStore()

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/vendas', icon: ShoppingCart, label: 'Vendas' },
  { path: '/produtos', icon: Package, label: 'Produtos' },
  { path: '/clientes', icon: Users, label: 'Clientes' },
  { path: '/fornecedores', icon: Truck, label: 'Fornecedores' },
  { path: '/etiquetas', icon: Tag, label: 'Etiquetas' },
  { path: '/contas-receber', icon: DollarSign, label: 'Contas a Receber' },
  { path: '/contas-pagar', icon: CreditCard, label: 'Contas a Pagar' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { path: '/usuarios', icon: UserCircle, label: 'Usuários' },
]

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
  </aside>
</template>
