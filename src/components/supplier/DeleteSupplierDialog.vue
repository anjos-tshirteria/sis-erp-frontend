<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Supplier } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps<{
  open: boolean
  supplier: Supplier | null
  deleting: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const { t } = useI18n()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t('suppliers.delete.confirmTitle') }}</DialogTitle>
        <DialogDescription>
          {{ t('suppliers.delete.confirmMessage', { name: supplier?.name }) }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          {{ t('suppliers.delete.cancel') }}
        </Button>
        <Button variant="destructive" :disabled="deleting" @click="emit('confirm')">
          {{ deleting ? t('suppliers.delete.deleting') : t('suppliers.delete.confirm') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
