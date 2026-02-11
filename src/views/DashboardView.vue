<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <LayoutDashboard class="w-6 h-6" />
      {{ $t('views.dashboard.title') }}
    </h1>
    <p class="mt-1 text-gray-500">{{ $t('views.dashboard.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'
</script>
