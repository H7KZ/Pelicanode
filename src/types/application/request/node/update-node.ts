import type { NodeModel } from "../../../../api/application/model/node.js"

type OmitPartialNodeModel = Pick<
    Partial<NodeModel>,
    'public' | 'name' |
    'fqdn' | 'scheme' | 'behind_proxy' |
    'memory' | 'memory_overallocate' | 'disk' |
    'disk_overallocate' | 'cpu' | 'cpu_overallocate' |
    'upload_size' | 'daemon_base' |
    'daemon_sftp' | 'daemon_sftp_alias' | 'daemon_listen' | 'daemon_connect' |
    'description' | 'maintenance_mode' | 'tags'
>

interface UpdateNodeRequest extends OmitPartialNodeModel {
    reset_secret?: boolean
}

export type { UpdateNodeRequest }
