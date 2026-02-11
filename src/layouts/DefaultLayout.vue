<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar />

    <main :class="['transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-0 md:ml-20']">
      <div class="p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AppSidebar from '@/components/AppSidebar.vue'

const appStore = useAppStore()
const sidebarOpen = computed(() => appStore.sidebarOpen)
</script>
