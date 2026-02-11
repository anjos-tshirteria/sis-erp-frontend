<template>
  <div class="space-y-6">
    <template v-if="supplier">
      <div class="flex items-center gap-4">
        <RouterLink :to="{ name: 'fornecedores' }">
          <Button variant="outline" size="sm">
            <ArrowLeft class="w-4 h-4 mr-2" />
            {{ t('suppliers.details.back') }}
          </Button>
        </RouterLink>
        <div class="flex-1">
          <h1 class="text-3xl font-semibold">{{ supplier.name }}</h1>
          <p class="text-gray-600 mt-1">{{ t('suppliers.details.details') }}</p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="openEdit">
            <Pencil class="w-4 h-4 mr-2" />
            {{ t('suppliers.table.edit') }}
          </Button>
          <Button variant="destructive" size="sm" @click="openDelete">
            <Trash2 class="w-4 h-4 mr-2" />
            {{ t('suppliers.table.delete') }}
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{{ t('suppliers.details.info') }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <p class="text-sm text-gray-600">{{ t('suppliers.table.phone') }}</p>
                <p class="font-medium">{{ supplier.phone || '-' }}</p>
              </div>
              <div v-if="supplier.notes">
                <p class="text-sm text-gray-600">{{ t('suppliers.table.notes') }}</p>
                <p class="font-medium">{{ supplier.notes }}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{{ t('suppliers.details.products') }}</CardTitle>
            </CardHeader>
            <CardContent class="p-0">
              <div class="px-6 py-12 text-center text-gray-500">
                {{ t('suppliers.details.noProducts') }}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SupplierDialog
        v-model:open="showEditDialog"
        :supplier="supplier"
        :saving="saving"
        @save="handleSave"
      />

      <DeleteSupplierDialog
        v-model:open="showDeleteDialog"
        :supplier="supplier"
        :deleting="deleting"
        @confirm="handleDelete"
      />
    </template>

    <template v-else-if="!loading">
      <div class="text-center py-12">
        <h2 class="text-2xl font-semibold">{{ t('suppliers.details.notFound') }}</h2>
        <RouterLink
          :to="{ name: 'fornecedores' }"
          class="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          {{ t('suppliers.details.backToSuppliers') }}
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-vue-next'
import api from '@/services/api'
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SupplierDialog from '@/components/supplier/SupplierDialog.vue'
import DeleteSupplierDialog from '@/components/supplier/DeleteSupplierDialog.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const supplier = ref<Supplier | null>(null)
const loading = ref(false)

const showEditDialog = ref(false)
const saving = ref(false)

const showDeleteDialog = ref(false)
const deleting = ref(false)

async function fetchSupplier() {
  loading.value = true
  try {
    const response = await api.get<Supplier>(`/supplier/${route.params.id}`)
    supplier.value = response.data as Supplier
  } finally {
    loading.value = false
  }
}

function openEdit() {
  showEditDialog.value = true
}

function openDelete() {
  showDeleteDialog.value = true
}

async function handleSave(payload: CreateSupplierPayload | UpdateSupplierPayload) {
  saving.value = true
  try {
    await api.put(`/supplier/${route.params.id}`, payload)
    showEditDialog.value = false
    await fetchSupplier()
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await api.delete(`/supplier/${route.params.id}`)
    showDeleteDialog.value = false
    router.push({ name: 'fornecedores' })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchSupplier()
})
</script>
