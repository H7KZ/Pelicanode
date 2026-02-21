import type { ListParams } from "./common.js"

export interface DatabaseHost {
    id: number
    name: string
    host: string
    port: number
    username: string
    node: number | null
    created_at: string
    updated_at: string
}

export interface ListDatabaseHostsParams extends ListParams {
    'filter[name]'?: string
    'filter[host]'?: string
}

export interface CreateDatabaseHostParams {
    name: string
    host: string
    port?: number
    username: string
    password: string
    node?: number | null
}

export interface UpdateDatabaseHostParams {
    name?: string
    host?: string
    port?: number
    username?: string
    password?: string
    node?: number | null
}
