import type { ListParams } from "./common.js"

export interface NodeAllocatedResources {
    memory: number
    disk: number
    cpu: number
}

export interface Node {
    id: number
    uuid: string
    public: boolean
    name: string
    description: string | null
    fqdn: string
    scheme: 'http' | 'https'
    behind_proxy: boolean
    maintenance_mode: boolean
    memory: number
    memory_overallocate: number
    disk: number
    disk_overallocate: number
    cpu: number
    cpu_overallocate: number
    upload_size: number
    daemon_listen: number
    daemon_connect: number
    daemon_sftp: number
    daemon_sftp_alias: string | null
    daemon_base: string
    tags: string[]
    allocated_resources: NodeAllocatedResources
    created_at: string
    updated_at: string
}

export interface NodeConfiguration {
    debug: boolean
    uuid: string
    token_id: string
    token: string
    api: {
        host: string
        port: number
        ssl: {
            enabled: boolean
            cert: string
            key: string
        }
        upload_limit: number
    }
    system: {
        data: string
        sftp: {
            bind_port: number
        }
    }
    allowed_mounts: string[]
    remote: string
}

export interface ListNodesParams extends ListParams {
    'filter[uuid]'?: string
    'filter[name]'?: string
    'filter[fqdn]'?: string
    'filter[daemon_token_id]'?: string
}

export interface GetDeployableNodesParams {
    memory: number
    disk: number
    cpu?: number
    'tags[]'?: string[]
    include?: string
}

export interface CreateNodeParams {
    name: string
    description?: string | null
    public?: boolean
    fqdn: string
    scheme: 'http' | 'https'
    behind_proxy?: boolean
    memory: number
    memory_overallocate: number
    disk: number
    disk_overallocate: number
    cpu: number
    cpu_overallocate: number
    daemon_base?: string
    daemon_sftp: number
    daemon_sftp_alias?: string | null
    daemon_listen: number
    daemon_connect: number
    upload_size?: number
    tags?: string[]
    maintenance_mode?: boolean
}

export interface UpdateNodeParams {
    name?: string
    description?: string | null
    public?: boolean
    fqdn?: string
    scheme?: 'http' | 'https'
    behind_proxy?: boolean
    memory?: number
    memory_overallocate?: number
    disk?: number
    disk_overallocate?: number
    cpu?: number
    cpu_overallocate?: number
    daemon_base?: string
    daemon_sftp?: number
    daemon_sftp_alias?: string | null
    daemon_listen?: number
    daemon_connect?: number
    upload_size?: number
    tags?: string[]
    maintenance_mode?: boolean
    reset_secret?: boolean
}
