<script setup lang="ts">
import { UserCircle } from 'lucide-vue-next'
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <UserCircle class="w-6 h-6" />
      {{ $t('views.users.title') }}
    </h1>
    <p class="mt-1 text-gray-500">{{ $t('views.users.description') }}</p>
  </div>
</template>
