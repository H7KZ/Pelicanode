export interface ApiKey {
    identifier: string
    description: string
    allowed_ips: string[]
    last_used_at: string | null
    created_at: string
}

export interface ApiKeyWithSecret extends ApiKey {
    secret_token: string
}

export interface CreateApiKeyParams {
    description: string
    allowed_ips?: string[]
}

export interface SshKey {
    name: string
    fingerprint: string
    public_key: string
    created_at: string
}

export interface CreateSshKeyParams {
    name: string
    public_key: string
}

export interface ActivityLog {
    id: string
    event: string
    is_api: boolean
    ip: string | null
    description: string | null
    properties: Record<string, unknown>
    has_additional_metadata: boolean
    timestamp: string
}

export interface ListActivityParams {
    page?: number
    per_page?: number
    'filter[event]'?: string
    sort?: 'timestamp' | '-timestamp'
}

export interface UpdateUsernameParams {
    username: string
    password: string
}

export interface UpdateEmailParams {
    email: string
    password: string
}

export interface UpdatePasswordParams {
    current_password: string
    password: string
    password_confirmation: string
}
