<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ role ? t('users.editRole') : t('users.newRole') }}</DialogTitle>
        <DialogDescription class="sr-only">
          {{ role ? t('users.editRole') : t('users.newRole') }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="space-y-2">
          <Label for="role-name">{{ t('users.form.roleName') }}</Label>
          <Input
            id="role-name"
            v-model="name"
            :placeholder="t('users.form.roleNamePlaceholder')"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="role-description">{{ t('users.form.roleDescription') }}</Label>
          <Textarea
            id="role-description"
            v-model="description"
            :placeholder="t('users.form.roleDescriptionPlaceholder')"
            :rows="2"
          />
        </div>

        <div class="space-y-3">
          <Label>{{ t('users.form.permissions') }}</Label>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="perm in ALL_PERMISSIONS" :key="perm" class="flex items-center gap-2">
              <input
                :id="`perm-${perm}`"
                type="checkbox"
                :checked="permissions.includes(perm)"
                class="border-input h-4 w-4 shrink-0 rounded-[4px] border accent-primary"
                @change="togglePermission(perm)"
              />
              <Label :for="`perm-${perm}`" class="cursor-pointer text-sm font-normal">
                {{ t(`users.permissions.${perm}`) }}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            {{ t('users.form.cancel') }}
          </Button>
          <Button type="submit" :disabled="saving">
            {{
              saving
                ? t('users.form.saving')
                : role
                  ? t('users.form.save')
                  : t('users.form.createRole')
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
import type { Role, Permission, CreateRolePayload } from '@/types'
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

const ALL_PERMISSIONS: Permission[] = [
  'MANAGE_USERS',
  'VIEW_REPORTS',
  'CREATE_SALE',
  'UPDATE_SALE',
  'VIEW_SALES',
  'MANAGE_PRODUCTS',
  'MANAGE_CLIENTS',
  'MANAGE_SUPPLIERS',
  'ACCOUNTS_RECEIVABLE',
  'ACCOUNTS_PAYABLE',
]

const props = defineProps<{
  open: boolean
  role: Role | null
  saving: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [payload: CreateRolePayload]
}>()

const { t } = useI18n()

const name = ref('')
const description = ref('')
const permissions = ref<Permission[]>([])

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.role) {
      name.value = props.role.name
      description.value = props.role.description
      permissions.value = [...props.role.permissions]
    } else if (isOpen) {
      name.value = ''
      description.value = ''
      permissions.value = []
    }
  },
)

function togglePermission(perm: Permission) {
  const idx = permissions.value.indexOf(perm)
  if (idx >= 0) {
    permissions.value.splice(idx, 1)
  } else {
    permissions.value.push(perm)
  }
}

function handleSave() {
  emit('save', {
    name: name.value,
    description: description.value,
    permissions: permissions.value,
  })
}
</script>
