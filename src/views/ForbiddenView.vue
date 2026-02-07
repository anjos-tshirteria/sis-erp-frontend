<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
    <ShieldX class="h-16 w-16 text-gray-400" />
    <h1 class="text-2xl font-semibold text-gray-900">Acesso Negado</h1>
    <p class="text-gray-500">Você não tem permissão para acessar esta página.</p>
    <Button variant="outline" @click="router.push('/')">Voltar ao Dashboard</Button>
  </div>
</template>
