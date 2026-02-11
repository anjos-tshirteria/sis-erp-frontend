<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{
          supplier ? t('suppliers.editSupplier') : t('suppliers.newSupplier')
        }}</DialogTitle>
        <DialogDescription class="sr-only">
          {{ supplier ? t('suppliers.editSupplier') : t('suppliers.newSupplier') }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="space-y-2">
          <Label for="supplier-name">{{ t('suppliers.form.name') }}</Label>
          <Input
            id="supplier-name"
            v-model="name"
            :placeholder="t('suppliers.form.namePlaceholder')"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="supplier-phone">{{ t('suppliers.form.phone') }}</Label>
          <Input
            id="supplier-phone"
            :model-value="phone"
            :placeholder="t('suppliers.form.phonePlaceholder')"
            inputmode="tel"
            :maxlength="15"
            @input="onPhoneInput"
          />
        </div>

        <div class="space-y-2">
          <Label for="supplier-notes">{{ t('suppliers.form.notes') }}</Label>
          <Textarea
            id="supplier-notes"
            v-model="notes"
            :placeholder="t('suppliers.form.notesPlaceholder')"
            :rows="3"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            {{ t('suppliers.form.cancel') }}
          </Button>
          <Button type="submit" :disabled="saving">
            {{
              saving
                ? t('suppliers.form.saving')
                : supplier
                  ? t('suppliers.form.save')
                  : t('suppliers.form.create')
            }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { phoneMask } from '@/lib/utils'
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  open: boolean
  supplier: Supplier | null
  saving: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [payload: CreateSupplierPayload | UpdateSupplierPayload]
}>()

const { t } = useI18n()

const name = ref('')
const phone = ref('')
const notes = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.supplier) {
      name.value = props.supplier.name
      phone.value = phoneMask(props.supplier.phone || '')
      notes.value = props.supplier.notes || ''
    } else if (isOpen) {
      name.value = ''
      phone.value = ''
      notes.value = ''
    }
  },
)

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  phone.value = phoneMask(input.value)
}

function handleSave() {
  if (props.supplier) {
    const payload: UpdateSupplierPayload = {
      name: name.value,
      phone: phone.value || null,
      notes: notes.value || null,
    }
    emit('save', payload)
  } else {
    const payload: CreateSupplierPayload = {
      name: name.value,
      phone: phone.value || undefined,
      notes: notes.value || undefined,
    }
    emit('save', payload)
  }
}
</script>
