import { apiRequest } from "../../http.js"
import type {
    DatabaseHost,
    ListDatabaseHostsParams,
    CreateDatabaseHostParams,
    UpdateDatabaseHostParams,
    PaginatedResponse,
    SingleResponse,
} from "../../types/index.js"

function unwrap<T>(res: SingleResponse<T>): T {
    return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
    return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createDatabaseHostsApi(baseUrl: string, token: string) {
    return {
        /** List all database hosts (paginated). */
        list(params?: ListDatabaseHostsParams) {
            return apiRequest<PaginatedResponse<DatabaseHost>>(baseUrl, token, {
                method: 'GET',
                url: '/api/application/database-hosts',
                params,
            }).then(unwrapList)
        },

        /** Get a single database host. */
        get(databaseHostId: number, include?: string) {
            return apiRequest<SingleResponse<DatabaseHost>>(baseUrl, token, {
                method: 'GET',
                url: `/api/application/database-hosts/${databaseHostId}`,
                params: include ? { include } : undefined,
            }).then(unwrap)
        },

        /** Create a database host. */
        create(params: CreateDatabaseHostParams) {
            return apiRequest<SingleResponse<DatabaseHost>>(baseUrl, token, {
                method: 'POST',
                url: '/api/application/database-hosts',
                data: params,
            }).then(unwrap)
        },

        /** Update a database host. */
        update(databaseHostId: number, params: UpdateDatabaseHostParams) {
            return apiRequest<SingleResponse<DatabaseHost>>(baseUrl, token, {
                method: 'PATCH',
                url: `/api/application/database-hosts/${databaseHostId}`,
                data: params,
            }).then(unwrap)
        },

        /** Delete a database host. */
        delete(databaseHostId: number): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'DELETE',
                url: `/api/application/database-hosts/${databaseHostId}`,
            })
        },
    }
}
