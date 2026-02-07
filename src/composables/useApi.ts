import { ref } from 'vue'
import type { Ref } from 'vue'
import api from '@/services/api'
import i18n from '@/i18n'

interface UseApiReturn<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  loading: Ref<boolean>
  execute: (payload?: unknown) => Promise<T | null>
}

export function useApi<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function execute(payload?: unknown): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const response =
        method === 'get' || method === 'delete'
          ? await api[method]<T>(url)
          : await api[method]<T>(url, payload)
      data.value = response.data
      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : i18n.global.t('errors.unknown')
      error.value = message
      return null
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, execute }
}
