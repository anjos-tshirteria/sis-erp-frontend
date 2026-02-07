import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'
import type { LoginResponse, Permission, User } from '@/types'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  const isAuthenticated = computed(() => !!accessToken.value)

  function hasPermission(permission: Permission): boolean {
    return user.value?.role.permissions.includes(permission) ?? false
  }

  async function login(username: string, password: string) {
    const response = await api.post<LoginResponse>('/login', { username, password })
    accessToken.value = response.data.accessToken
    refreshToken.value = response.data.refreshToken
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    await fetchUser()
  }

  async function fetchUser() {
    const response = await api.get<User>('/me')
    user.value = response.data
  }

  async function refresh(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const response = await api.post<LoginResponse>('/refresh', {
        refreshToken: refreshToken.value,
      })
      accessToken.value = response.data.accessToken
      localStorage.setItem('accessToken', response.data.accessToken)
      if (response.data.refreshToken) {
        refreshToken.value = response.data.refreshToken
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
      return true
    } catch {
      return false
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  async function initAuth() {
    if (!accessToken.value) return
    try {
      await fetchUser()
    } catch {
      const refreshed = await refresh()
      if (refreshed) {
        try {
          await fetchUser()
        } catch {
          logout()
        }
      } else {
        logout()
      }
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    hasPermission,
    login,
    fetchUser,
    refresh,
    logout,
    initAuth,
  }
})
