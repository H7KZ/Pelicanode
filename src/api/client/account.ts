import { apiRequest } from "../../http.js"
import type {
    ClientUser,
    ApiKey,
    ApiKeyWithSecret,
    SshKey,
    ActivityLog,
    CreateApiKeyParams,
    CreateSshKeyParams,
    ListActivityParams,
    UpdateUsernameParams,
    UpdateEmailParams,
    UpdatePasswordParams,
    PaginatedResponse,
    ListResponse,
    SingleResponse,
} from "../../types/index.js"

function unwrap<T>(res: SingleResponse<T>): T {
    return res.attributes
}

function unwrapList<T>(res: ListResponse<T>): T[] {
    return res.data.map(item => item.attributes)
}

function unwrapPaginated<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
    return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createAccountApi(baseUrl: string, token: string) {
    return {
        /** Get the authenticated user's account details. */
        get() {
            return apiRequest<SingleResponse<ClientUser>>(baseUrl, token, {
                method: 'GET',
                url: '/api/client/account',
            }).then(unwrap)
        },

        /** Update the authenticated user's username. */
        updateUsername(params: UpdateUsernameParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'PUT',
                url: '/api/client/account/username',
                data: params,
            })
        },

        /** Update the authenticated user's email. */
        updateEmail(params: UpdateEmailParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'PUT',
                url: '/api/client/account/email',
                data: params,
            })
        },

        /** Update the authenticated user's password. Invalidates all other sessions. */
        updatePassword(params: UpdatePasswordParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'PUT',
                url: '/api/client/account/password',
                data: params,
            })
        },

        /** List account activity logs (paginated). */
        listActivity(params?: ListActivityParams) {
            return apiRequest<PaginatedResponse<ActivityLog>>(baseUrl, token, {
                method: 'GET',
                url: '/api/client/account/activity',
                params,
            }).then(unwrapPaginated)
        },

        apiKeys: {
            /** List all API keys for the authenticated user. */
            list() {
                return apiRequest<ListResponse<ApiKey>>(baseUrl, token, {
                    method: 'GET',
                    url: '/api/client/account/api-keys',
                }).then(unwrapList)
            },

            /** Create a new API key. The secret_token is only shown once. */
            create(params: CreateApiKeyParams) {
                return apiRequest<{ object: string; attributes: ApiKey; meta: { secret_token: string } }>(baseUrl, token, {
                    method: 'POST',
                    url: '/api/client/account/api-keys',
                    data: params,
                }).then(res => ({
                    ...res.attributes,
                    secret_token: (res.meta as { secret_token: string }).secret_token,
                } satisfies ApiKeyWithSecret))
            },

            /** Delete an API key by its identifier. */
            delete(identifier: string): Promise<void> {
                return apiRequest<void>(baseUrl, token, {
                    method: 'DELETE',
                    url: `/api/client/account/api-keys/${identifier}`,
                })
            },
        },

        sshKeys: {
            /** List all SSH keys for the authenticated user. */
            list() {
                return apiRequest<ListResponse<SshKey>>(baseUrl, token, {
                    method: 'GET',
                    url: '/api/client/account/ssh-keys',
                }).then(unwrapList)
            },

            /** Add an SSH public key. */
            create(params: CreateSshKeyParams) {
                return apiRequest<SingleResponse<SshKey>>(baseUrl, token, {
                    method: 'POST',
                    url: '/api/client/account/ssh-keys',
                    data: params,
                }).then(unwrap)
            },

            /** Remove an SSH key by its SHA-256 fingerprint. */
            delete(fingerprint: string): Promise<void> {
                return apiRequest<void>(baseUrl, token, {
                    method: 'DELETE',
                    url: `/api/client/account/ssh-keys/${fingerprint}`,
                })
            },
        },
    }
}
