<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <BarChart3 class="w-6 h-6" />
      {{ $t('views.reports.title') }}
    </h1>
    <p class="mt-1 text-gray-500">{{ $t('views.reports.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
</script>
