<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ user ? t('users.editUser') : t('users.newUser') }}</DialogTitle>
        <DialogDescription class="sr-only">
          {{ user ? t('users.editUser') : t('users.newUser') }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="space-y-2">
          <Label for="user-name">{{ t('users.form.fullName') }}</Label>
          <Input
            id="user-name"
            v-model="name"
            :placeholder="t('users.form.fullNamePlaceholder')"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="user-username">{{ t('users.form.username') }}</Label>
            <Input
              id="user-username"
              v-model="username"
              :placeholder="t('users.form.usernamePlaceholder')"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="user-email">{{ t('users.form.email') }}</Label>
            <Input
              id="user-email"
              v-model="email"
              type="email"
              :placeholder="t('users.form.emailPlaceholder')"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="user-password">{{ t('users.form.password') }}</Label>
          <Input
            id="user-password"
            v-model="password"
            type="password"
            :placeholder="t('users.form.passwordPlaceholder')"
            :required="!user"
          />
        </div>

        <div class="space-y-2">
          <Label>{{ t('users.form.role') }}</Label>
          <div class="relative">
            <button
              type="button"
              class="border-input bg-background ring-offset-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
              @click="roleDropdownOpen = !roleDropdownOpen"
            >
              <span v-if="selectedRoleName">{{ selectedRoleName }}</span>
              <span v-else class="text-muted-foreground">
                {{ t('users.form.selectRole') }}
              </span>
              <ChevronDown class="h-4 w-4 shrink-0 opacity-50" />
            </button>

            <div
              v-if="roleDropdownOpen"
              class="fixed inset-0 z-40"
              @click="roleDropdownOpen = false"
            />
            <div
              v-if="roleDropdownOpen"
              class="bg-popover absolute z-50 mt-1 w-full rounded-md border p-1 shadow-md"
            >
              <button
                v-for="role in roles"
                :key="role.id"
                type="button"
                class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
                @click="selectRole(String(role.id))"
              >
                <Check
                  class="h-4 w-4 shrink-0"
                  :class="String(role.id) === roleId ? 'opacity-100' : 'opacity-0'"
                />
                {{ role.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="user-active"
            v-model="active"
            type="checkbox"
            class="border-input h-4 w-4 shrink-0 rounded-[4px] border accent-primary"
          />
          <Label for="user-active" class="cursor-pointer">
            {{ t('users.form.activeUser') }}
          </Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            {{ t('users.form.cancel') }}
          </Button>
          <Button type="submit" :disabled="saving">
            {{
              saving
                ? t('users.form.saving')
                : user
                  ? t('users.form.save')
                  : t('users.form.createUser')
            }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check } from 'lucide-vue-next'
import type { User, Role, CreateUserPayload, UpdateUserPayload } from '@/types'
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

const props = defineProps<{
  open: boolean
  user: User | null
  roles: Role[]
  saving: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [payload: CreateUserPayload | UpdateUserPayload]
}>()

const { t } = useI18n()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const active = ref(true)
const roleId = ref('')
const roleDropdownOpen = ref(false)

const selectedRoleName = computed(() => {
  const role = props.roles.find((r) => String(r.id) === roleId.value)
  return role?.name || ''
})

function resolveRoleId(user: User): string {
  const role = user.role as Role | string
  if (role && typeof role === 'object' && 'id' in role) {
    return String(role.id)
  }
  // API may return role as a string (name) — match by name
  if (typeof role === 'string') {
    const matched = props.roles.find((r) => r.name === role)
    if (matched) return String(matched.id)
  }
  return ''
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.user) {
      name.value = props.user.name
      username.value = props.user.username
      email.value = props.user.email || ''
      password.value = ''
      active.value = props.user.active
      roleId.value = resolveRoleId(props.user)
    } else if (isOpen) {
      name.value = ''
      username.value = ''
      email.value = ''
      password.value = ''
      active.value = true
      roleId.value = props.roles[0] ? String(props.roles[0].id) : ''
    }
    roleDropdownOpen.value = false
  },
)

function selectRole(id: string) {
  roleId.value = id
  roleDropdownOpen.value = false
}

function handleSave() {
  if (props.user) {
    const payload: UpdateUserPayload = {
      name: name.value,
      username: username.value,
      email: email.value || null,
      active: active.value,
      roleId: roleId.value,
    }
    if (password.value) {
      payload.password = password.value
    }
    emit('save', payload)
  } else {
    const payload: CreateUserPayload = {
      name: name.value,
      username: username.value,
      email: email.value || null,
      password: password.value,
      active: active.value,
      roleId: roleId.value,
    }
    emit('save', payload)
  }
}
</script>
