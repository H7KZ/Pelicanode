import type { ListParams } from "./common.js"

export interface Role {
    id: number
    name: string
    created_at: string
    updated_at: string
}

export interface ListRolesParams extends ListParams {
    'filter[id]'?: number
    'filter[name]'?: string
}

export interface CreateRoleParams {
    name: string
}

export interface UpdateRoleParams {
    name?: string
}
