<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <Tag class="w-6 h-6" />
      {{ $t('views.labels.title') }}
    </h1>
    <p class="mt-1 text-gray-500">{{ $t('views.labels.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
</script>
