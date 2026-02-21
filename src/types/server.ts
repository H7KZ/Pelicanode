import type { ListParams } from "./common.js"

export type ServerStatus =
    | 'installing'
    | 'running'
    | 'suspended'
    | 'stopping'
    | 'stopped'
    | 'install_failed'
    | 'reinstall_failed'
    | 'restoring_backup'
    | 'transferring'
    | null

export interface ServerLimits {
    memory: number
    swap: number
    disk: number
    io: number
    cpu: number
    threads: string | null
    oom_killer: boolean
}

export interface ServerFeatureLimits {
    databases: number | null
    allocations: number | null
    backups: number | null
}

export interface ServerContainer {
    startup_command: string
    image: string
    environment: Record<string, string>
}

// ============================================================
// APPLICATION API — Server
// ============================================================

export interface ApplicationServer {
    id: number
    external_id: string | null
    uuid: string
    identifier: string
    name: string
    description: string
    status: ServerStatus
    limits: ServerLimits
    feature_limits: ServerFeatureLimits
    user: number
    node: number
    allocation: number
    egg: number
    container: ServerContainer
    created_at: string
    updated_at: string
}

export interface ListApplicationServersParams extends ListParams {
    'filter[uuid]'?: string
    'filter[uuid_short]'?: string
    'filter[name]'?: string
    'filter[description]'?: string
    'filter[image]'?: string
    'filter[external_id]'?: string
}

export interface ServerLimitsInput {
    memory: number
    swap: number
    disk: number
    io: number
    cpu: number
    threads?: string | null
}

export interface ServerFeatureLimitsInput {
    databases?: number | null
    allocations?: number | null
    backups?: number | null
}

export interface CreateServerParams {
    external_id?: string | null
    name: string
    description?: string | null
    user: number
    egg: number
    docker_image?: string
    startup?: string
    environment: Record<string, unknown>
    skip_scripts?: boolean
    oom_killer?: boolean
    limits?: ServerLimitsInput
    feature_limits?: ServerFeatureLimitsInput
    start_on_completion?: boolean
    allocation?: {
        default: number
        additional?: number[]
    }
    deploy?: {
        tags?: string[]
        dedicated_ip?: boolean
        port_range?: string[]
    }
}

export interface UpdateServerDetailsParams {
    external_id?: string | null
    name?: string
    user?: number
    description?: string | null
}

export interface UpdateServerBuildParams {
    allocation?: number
    oom_killer?: boolean
    limits?: Partial<ServerLimitsInput>
    feature_limits?: ServerFeatureLimitsInput
    add_allocations?: number[]
    remove_allocations?: number[]
}

export interface UpdateServerStartupParams {
    startup?: string
    environment?: Record<string, unknown>
    egg?: number
    image?: string
    skip_scripts?: boolean
}

export interface StartTransferParams {
    node_id: number
    allocation_id: number
    additional_allocations?: number[]
}

// ============================================================
// CLIENT API — Server
// ============================================================

export interface ClientServerSftpDetails {
    ip: string
    alias: string | null
    port: number
}

export interface ClientServer {
    server_owner: boolean
    identifier: string
    internal_id: number
    uuid: string
    name: string
    node: string
    is_node_under_maintenance: boolean
    sftp_details: ClientServerSftpDetails
    description: string
    limits: ServerLimits
    invocation: string
    docker_image: string
    egg_features: string[] | null
    feature_limits: ServerFeatureLimits
    status: ServerStatus
    is_transferring: boolean
}

export interface ClientServerWithMeta {
    server: ClientServer
    is_server_owner: boolean
    user_permissions: string[]
}

export interface ListClientServersParams {
    page?: number
    per_page?: number
    include?: string
    type?: 'admin' | 'admin-all' | 'owner'
    'filter[uuid]'?: string
    'filter[name]'?: string
    'filter[description]'?: string
    'filter[external_id]'?: string
    'filter[*]'?: string
}

export interface ServerResources {
    memory_bytes: number
    cpu_absolute: number
    disk_bytes: number
    network_rx_bytes: number
    network_tx_bytes: number
    uptime: number
}

export interface ServerStats {
    current_state: 'running' | 'stopped' | 'starting' | 'stopping' | 'offline'
    is_suspended: boolean
    resources: ServerResources
}

export interface WebsocketToken {
    token: string
    socket: string
}
