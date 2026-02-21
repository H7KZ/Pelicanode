import { apiRequest } from "../../http.js"
import type {
    ClientServer,
    ListClientServersParams,
    PaginatedResponse,
} from "../../types/index.js"

function unwrapPaginated<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
    return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createClientServersApi(baseUrl: string, token: string) {
    return {
        /** List all servers the authenticated user has access to. */
        list(params?: ListClientServersParams) {
            return apiRequest<PaginatedResponse<ClientServer>>(baseUrl, token, {
                method: 'GET',
                url: '/api/client',
                params,
            }).then(unwrapPaginated)
        },

        /** Get all available subuser permission keys. */
        listPermissions() {
            return apiRequest<{ object: string; attributes: { permissions: string[] } }>(baseUrl, token, {
                method: 'GET',
                url: '/api/client/permissions',
            }).then(res => res.attributes.permissions)
        },
    }
}
