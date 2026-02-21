import type { ListParams } from "./common.js"

// ============================================================
// APPLICATION API — User
// ============================================================

export interface ApplicationUser {
    id: number
    external_id: string | null
    is_managed_externally: boolean
    uuid: string
    username: string
    email: string
    language: string
    root_admin: boolean
    '2fa_enabled': boolean
    '2fa': boolean
    created_at: string
    updated_at: string
}

export interface ListUsersParams extends ListParams {
    'filter[email]'?: string
    'filter[uuid]'?: string
    'filter[username]'?: string
    'filter[external_id]'?: string
}

export interface CreateUserParams {
    email: string
    username: string
    password: string
    external_id?: string | null
    is_managed_externally?: boolean
    language?: string
    timezone?: string
}

export interface UpdateUserParams {
    email?: string
    username?: string
    password?: string | null
    external_id?: string | null
    is_managed_externally?: boolean
    language?: string
    timezone?: string
}

export interface AssignRolesParams {
    roles: number[]
}

// ============================================================
// CLIENT API — Account (user self)
// ============================================================

export interface ClientUser {
    uuid: string
    username: string
    email: string
    language: string
    root_admin: boolean
    '2fa_enabled': boolean
    created_at: string
    updated_at: string
}
