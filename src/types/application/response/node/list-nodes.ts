interface ListNodesResponse {
    object: 'list'

    data: Array<{
        object: 'node'
        attributes: {
            id: number
            public: boolean
            name: string
            fqdn: string
            scheme: 'http' | 'https'
            memory: number
            memory_overallocate: number
            disk: number
            disk_overallocate: number
            daemon_listen: number
            daemon_sftp: number
            daemon_base: string
            created_at: string
            updated_at: string
            upload_size: number
            behind_proxy: boolean
            description: string | null
            maintenance_mode: boolean
            uuid: string
            tags: string[]
            cpu: number
            cpu_overallocate: number
            daemon_sftp_alias: string | null
            daemon_connect: number
            allocated_resources: {
                memory: number
                disk: number
                cpu: number
            }
        }
    }>

    meta: {
        pagination: {
            total: number
            count: number
            per_page: number
            current_page: number
            total_pages: number
            links: {
                previous?: string
                next?: string
            }
        }
    }
}

export type { ListNodesResponse }
