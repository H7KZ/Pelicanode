export interface Backup {
    uuid: string
    is_successful: boolean
    is_locked: boolean
    name: string
    ignored_files: string[]
    checksum: string | null
    bytes: number
    created_at: string
    completed_at: string | null
}

export interface CreateBackupParams {
    name?: string | null
    is_locked?: boolean | null
    ignored?: string | null
}

export interface RestoreBackupParams {
    truncate: boolean
}
