export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  last_page: number
}

export type Permission =
  | 'MANAGE_USERS'
  | 'VIEW_REPORTS'
  | 'CREATE_SALE'
  | 'UPDATE_SALE'
  | 'VIEW_SALES'
  | 'MANAGE_PRODUCTS'
  | 'MANAGE_CLIENTS'
  | 'MANAGE_SUPPLIERS'
  | 'ACCOUNTS_RECEIVABLE'
  | 'ACCOUNTS_PAYABLE'

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface User {
  id: string
  name: string
  username: string
  email: string | null
  active: boolean
  role: Role
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}
