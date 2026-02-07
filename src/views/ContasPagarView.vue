<script setup lang="ts">
import { CreditCard } from 'lucide-vue-next'
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2">
      <CreditCard class="w-6 h-6" />
      {{ $t('views.accountsPayable.title') }}
    </h1>
    <p class="mt-1 text-gray-500">{{ $t('views.accountsPayable.description') }}</p>
  </div>
</template>
