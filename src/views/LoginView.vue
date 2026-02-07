<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await authStore.login(username.value, password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch {
    error.value = 'Usuário ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">ERP System</CardTitle>
        <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <Label for="username">Usuário</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="Seu usuário"
              required
              :disabled="loading"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Senha</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Sua senha"
              required
              :disabled="loading"
            />
          </div>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
