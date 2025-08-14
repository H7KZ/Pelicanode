import type { AxiosResponse } from "axios"
import type { UpdateNodeResponse } from "../../../types/application/response/node/update-node.js"

interface NodeModel {
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

/**
 * Class representing a Node retrieved from the Pelican API
 */
class Node {
    /**
     * Unique identifier for the node
     */
    id: number

    /**
     * Whether the node is public or not
     * @default true
     */
    public: boolean

    /**
     * Name of the node
     */
    name: string

    /**
     * Fully Qualified Domain Name of the node
     * either <fqdn> or <ip>
     */
    fqdn: string

    /**
     * The protocol used by the node
     * http = non SSL
     * https = SSL or Cloudflare proxy
     */
    scheme: 'http' | 'https'

    /**
     * Amount of memory allocated to the node in MB
     * @default 0
     */
    memory: number

    /**
     * Amount of memory overallocate for the node in MB
     * @default 0
     */
    memory_overallocate: number

    /**
     * Amount of disk allocated to the node in MB
     * @default 0
     */
    disk: number

    /**
     * Amount of disk overallocate for the node in MB
     * @default 0
     */
    disk_overallocate: number

    /**
     * Port the daemon listens on
     * @default 8080
     */
    daemon_listen: number

    /**
     * Port the daemon listens on for SFTP connections
     * @default 2022
     */
    daemon_sftp: number

    /**
     * Base path of the docker volumes
     * @default /var/lib/pelican/volumes
     */
    daemon_base: string

    /**
     * Timestamp when the node was created
     */
    created_at: Date

    /**
     * Timestamp when the node was last updated
     */
    updated_at: Date

    /**
     * Maximum upload size for files inside the node in MB
     * @default 100
     */
    upload_size: number

    /**
     * Whether the node is behind a proxy
     * @default false
     */
    behind_proxy: boolean

    /**
     * Description of the node done by admins
     * @default null
     */
    description: string | null

    /**
     * Whether the node is in maintenance mode
     * @default false
     */
    maintenance_mode: boolean

    /**
     * Unique identifier for the node (same as ID but in UUID format)
     */
    uuid: string

    /**
     * Tags associated with the node
     * @default []
     */
    tags: string[]

    /**
     * Number of CPU cores allocated to the node (in percentage, 100% = 1 core)
     * @default 0
     */
    cpu: number

    /**
     * Amount of CPU overallocate for the node (in percentage, 100% = 1 core)
     * @default 0
     */
    cpu_overallocate: number

    /**
     * Alias for the SFTP daemon
     * @default null
     */
    daemon_sftp_alias: string | null

    /**
     * Port the daemon listens on for incoming connections
     * @default 8080
     */
    daemon_connect: number

    /**
     * Resources allocated to the node
     */
    allocated_resources: {
        /**
         * Amount of memory allocated to the node in MB
         */
        memory: number
        /**
         * Amount of disk allocated to the node in MB
         */
        disk: number
        /**
         * Number of CPU cores allocated to the node (in percentage, 100% = 1 core)
         */
        cpu: number
    }

    constructor(data: NodeModel) {
        this.id = data.id
        this.public = data.public
        this.name = data.name
        this.fqdn = data.fqdn
        this.scheme = data.scheme
        this.memory = data.memory
        this.memory_overallocate = data.memory_overallocate
        this.disk = data.disk
        this.disk_overallocate = data.disk_overallocate
        this.daemon_listen = data.daemon_listen
        this.daemon_sftp = data.daemon_sftp
        this.daemon_base = data.daemon_base
        this.created_at = new Date(data.created_at)
        this.updated_at = new Date(data.updated_at)
        this.upload_size = data.upload_size
        this.behind_proxy = data.behind_proxy
        this.description = data.description
        this.maintenance_mode = data.maintenance_mode
        this.uuid = data.uuid
        this.tags = data.tags
        this.cpu = data.cpu
        this.cpu_overallocate = data.cpu_overallocate
        this.daemon_sftp_alias = data.daemon_sftp_alias
        this.daemon_connect = data.daemon_connect
        this.allocated_resources = data.allocated_resources
    }

    async save(): Promise<AxiosResponse<UpdateNodeResponse>> {
        

        return response
    }
}

export { type NodeModel, Node }
