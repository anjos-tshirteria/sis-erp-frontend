<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <Package class="w-6 h-6" />
      {{ $t('views.products.title') }}
    </h1>
    <p class="mt-1 text-gray-500">{{ $t('views.products.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'
</script>
