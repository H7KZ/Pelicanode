import { apiRequest } from "../../http.js"
import type {
    Role,
    ListRolesParams,
    CreateRoleParams,
    UpdateRoleParams,
    PaginatedResponse,
    SingleResponse,
} from "../../types/index.js"

function unwrap<T>(res: SingleResponse<T>): T {
    return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
    return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createRolesApi(baseUrl: string, token: string) {
    return {
        /** List all roles (paginated). */
        list(params?: ListRolesParams) {
            return apiRequest<PaginatedResponse<Role>>(baseUrl, token, {
                method: 'GET',
                url: '/api/application/roles',
                params,
            }).then(unwrapList)
        },

        /** Get a single role. */
        get(roleId: number, include?: string) {
            return apiRequest<SingleResponse<Role>>(baseUrl, token, {
                method: 'GET',
                url: `/api/application/roles/${roleId}`,
                params: include ? { include } : undefined,
            }).then(unwrap)
        },

        /** Create a role. */
        create(params: CreateRoleParams) {
            return apiRequest<SingleResponse<Role>>(baseUrl, token, {
                method: 'POST',
                url: '/api/application/roles',
                data: params,
            }).then(unwrap)
        },

        /** Update a role. The built-in Root Admin role cannot be modified. */
        update(roleId: number, params: UpdateRoleParams) {
            return apiRequest<SingleResponse<Role>>(baseUrl, token, {
                method: 'PATCH',
                url: `/api/application/roles/${roleId}`,
                data: params,
            }).then(unwrap)
        },

        /** Delete a role. The built-in Root Admin role cannot be deleted. */
        delete(roleId: number): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'DELETE',
                url: `/api/application/roles/${roleId}`,
            })
        },
    }
}
