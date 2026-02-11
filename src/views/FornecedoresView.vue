<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <Truck class="w-6 h-6" />
          {{ $t('views.suppliers.title') }}
        </h1>
        <p class="mt-1 text-gray-500">{{ $t('views.suppliers.description') }}</p>
      </div>
      <Button @click="openNewSupplier">
        <Plus class="w-4 h-4 mr-2" />
        {{ t('suppliers.newSupplier') }}
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>{{ t('views.suppliers.title') }}</CardTitle>
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="searchName"
                :placeholder="t('suppliers.search.placeholder')"
                class="pl-8 w-64"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('suppliers.table.name') }}</TableHead>
              <TableHead>{{ t('suppliers.table.phone') }}</TableHead>
              <TableHead>{{ t('suppliers.table.notes') }}</TableHead>
              <TableHead>{{ t('suppliers.table.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="!loading && suppliers.length === 0">
              <TableCell :colspan="4" class="text-center text-gray-500">
                {{ t('suppliers.table.noSuppliers') }}
              </TableCell>
            </TableRow>
            <TableRow v-for="supplier in suppliers" :key="supplier.id">
              <TableCell class="font-medium">{{ supplier.name }}</TableCell>
              <TableCell>{{ supplier.phone || '-' }}</TableCell>
              <TableCell class="max-w-xs truncate">{{ supplier.notes || '-' }}</TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <button
                    class="text-sm font-medium text-blue-600 hover:text-blue-800"
                    @click="viewSupplier(supplier)"
                  >
                    {{ t('suppliers.table.view') }}
                  </button>
                  <button
                    class="text-sm font-medium text-gray-600 hover:text-gray-800"
                    @click="openEditSupplier(supplier)"
                  >
                    {{ t('suppliers.table.edit') }}
                  </button>
                  <button
                    class="text-sm font-medium text-red-600 hover:text-red-800"
                    @click="openDeleteSupplier(supplier)"
                  >
                    {{ t('suppliers.table.delete') }}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div v-if="lastPage > 1" class="flex items-center justify-between border-t px-4 py-3">
          <span class="text-sm text-muted-foreground">
            {{ t('suppliers.pagination.page', { page, lastPage }) }}
          </span>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" :disabled="page <= 1" @click="goToPage(page - 1)">
              {{ t('suppliers.pagination.previous') }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="page >= lastPage"
              @click="goToPage(page + 1)"
            >
              {{ t('suppliers.pagination.next') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <SupplierDialog
      v-model:open="showDialog"
      :supplier="editingSupplier"
      :saving="saving"
      @save="handleSaveSupplier"
    />

    <DeleteSupplierDialog
      v-model:open="showDeleteDialog"
      :supplier="deletingSupplier"
      :deleting="deleting"
      @confirm="handleDeleteSupplier"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Truck, Plus, Search } from 'lucide-vue-next'
import api from '@/services/api'
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SupplierDialog from '@/components/supplier/SupplierDialog.vue'
import DeleteSupplierDialog from '@/components/supplier/DeleteSupplierDialog.vue'

const { t } = useI18n()
const router = useRouter()

const suppliers = ref<Supplier[]>([])
const loading = ref(false)
const searchName = ref('')
const page = ref(1)
const lastPage = ref(1)
const perPage = 10

const showDialog = ref(false)
const editingSupplier = ref<Supplier | null>(null)
const saving = ref(false)

const showDeleteDialog = ref(false)
const deletingSupplier = ref<Supplier | null>(null)
const deleting = ref(false)

async function fetchSuppliers() {
  loading.value = true
  try {
    const response = await api.get('/supplier', {
      params: {
        page: page.value,
        perPage,
        ...(searchName.value ? { name: searchName.value } : {}),
      },
    })

    const data = response.data
    suppliers.value = data
    page.value = data.page
    lastPage.value = data.last_page
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchSuppliers()
}

function goToPage(newPage: number) {
  page.value = newPage
  fetchSuppliers()
}

function openNewSupplier() {
  editingSupplier.value = null
  showDialog.value = true
}

function openEditSupplier(supplier: Supplier) {
  editingSupplier.value = supplier
  showDialog.value = true
}

function openDeleteSupplier(supplier: Supplier) {
  deletingSupplier.value = supplier
  showDeleteDialog.value = true
}

function viewSupplier(supplier: Supplier) {
  router.push({ name: 'fornecedor-detalhes', params: { id: supplier.id } })
}

async function handleSaveSupplier(payload: CreateSupplierPayload | UpdateSupplierPayload) {
  saving.value = true
  try {
    if (editingSupplier.value) {
      await api.put(`/supplier/${editingSupplier.value.id}`, payload)
    } else {
      await api.post('/supplier', payload)
    }
    showDialog.value = false
    await fetchSuppliers()
  } finally {
    saving.value = false
  }
}

async function handleDeleteSupplier() {
  if (!deletingSupplier.value) return
  deleting.value = true
  try {
    await api.delete(`/supplier/${deletingSupplier.value.id}`)
    showDeleteDialog.value = false
    await fetchSuppliers()
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchSuppliers()
})
</script>
