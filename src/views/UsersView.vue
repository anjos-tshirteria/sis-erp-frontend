<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <UserCircle class="w-6 h-6" />
          {{ $t('views.users.title') }}
        </h1>
        <p class="mt-1 text-gray-500">{{ $t('views.users.description') }}</p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="openNewRole">
          <Shield class="w-4 h-4 mr-2" />
          {{ t('users.newRole') }}
        </Button>
        <Button @click="openNewUser">
          <Plus class="w-4 h-4 mr-2" />
          {{ t('users.newUser') }}
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>{{ t('users.sectionUsers') }}</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('users.table.id') }}</TableHead>
              <TableHead>{{ t('users.table.name') }}</TableHead>
              <TableHead>{{ t('users.table.username') }}</TableHead>
              <TableHead>{{ t('users.table.email') }}</TableHead>
              <TableHead>{{ t('users.table.role') }}</TableHead>
              <TableHead>{{ t('users.table.status') }}</TableHead>
              <TableHead>{{ t('users.table.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="!loadingUsers && users.length === 0">
              <TableCell :colspan="7" class="text-center text-gray-500">
                {{ t('users.table.noUsers') }}
              </TableCell>
            </TableRow>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell class="text-gray-500">#{{ user.id }}</TableCell>
              <TableCell class="font-medium">{{ user.name }}</TableCell>
              <TableCell class="font-mono text-sm">{{ user.username }}</TableCell>
              <TableCell>{{ user.email || '-' }}</TableCell>
              <TableCell>
                <Badge variant="secondary">{{
                  typeof user.role === 'object' ? user.role?.name : user.role
                }}</Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="user.active ? 'default' : 'outline'">
                  {{ user.active ? t('users.table.active') : t('users.table.inactive') }}
                </Badge>
              </TableCell>
              <TableCell>
                <button
                  class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  @click="openEditUser(user)"
                >
                  {{ t('users.table.edit') }}
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>{{ t('users.sectionRoles') }}</CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('users.table.id') }}</TableHead>
              <TableHead>{{ t('users.table.name') }}</TableHead>
              <TableHead>{{ t('users.table.description') }}</TableHead>
              <TableHead>{{ t('users.table.permissions') }}</TableHead>
              <TableHead>{{ t('users.table.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="!loadingRoles && roles.length === 0">
              <TableCell :colspan="5" class="text-center text-gray-500">
                {{ t('users.table.noRoles') }}
              </TableCell>
            </TableRow>
            <TableRow v-for="role in roles" :key="role.id">
              <TableCell class="text-gray-500">#{{ role.id }}</TableCell>
              <TableCell class="font-medium">{{ role.name }}</TableCell>
              <TableCell>{{ role.description }}</TableCell>
              <TableCell class="text-sm text-gray-600">
                {{ t('users.table.permissionCount', { count: role.permissions.length }) }}
              </TableCell>
              <TableCell>
                <button
                  class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  @click="openEditRole(role)"
                >
                  {{ t('users.table.edit') }}
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <UserDialog
      v-model:open="showUserDialog"
      :user="editingUser"
      :roles="roles"
      :saving="savingUser"
      @save="handleSaveUser"
    />

    <RoleDialog
      v-model:open="showRoleDialog"
      :role="editingRole"
      :saving="savingRole"
      @save="handleSaveRole"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserCircle, Plus, Shield } from 'lucide-vue-next'
import api from '@/services/api'
import type {
  User,
  Role,
  CreateUserPayload,
  UpdateUserPayload,
  CreateRolePayload,
  UpdateRolePayload,
} from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UserDialog from '@/components/users/UserDialog.vue'
import RoleDialog from '@/components/users/RoleDialog.vue'

const { t } = useI18n()

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const loadingUsers = ref(false)
const loadingRoles = ref(false)

const showUserDialog = ref(false)
const showRoleDialog = ref(false)
const editingUser = ref<User | null>(null)
const editingRole = ref<Role | null>(null)
const savingUser = ref(false)
const savingRole = ref(false)

async function fetchUsers() {
  loadingUsers.value = true
  try {
    const response = await api.get<User[]>('/user')
    users.value = response.data
  } finally {
    loadingUsers.value = false
  }
}

async function fetchRoles() {
  loadingRoles.value = true
  try {
    const response = await api.get<Role[]>('/role')
    roles.value = response.data
  } finally {
    loadingRoles.value = false
  }
}

function openNewUser() {
  editingUser.value = null
  showUserDialog.value = true
}

function openEditUser(user: User) {
  editingUser.value = user
  showUserDialog.value = true
}

function openNewRole() {
  editingRole.value = null
  showRoleDialog.value = true
}

function openEditRole(role: Role) {
  editingRole.value = role
  showRoleDialog.value = true
}

async function handleSaveUser(payload: CreateUserPayload | UpdateUserPayload) {
  savingUser.value = true
  try {
    if (editingUser.value) {
      await api.put(`/user/${editingUser.value.id}`, payload)
    } else {
      await api.post('/user', payload)
    }
    showUserDialog.value = false
    await fetchUsers()
  } finally {
    savingUser.value = false
  }
}

async function handleSaveRole(payload: CreateRolePayload | UpdateRolePayload) {
  savingRole.value = true
  try {
    if (editingRole.value) {
      await api.put(`/role/${editingRole.value.id}`, payload)
    } else {
      await api.post('/role', payload)
    }
    showRoleDialog.value = false
    await fetchRoles()
  } finally {
    savingRole.value = false
  }
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>
