import { apiRequest } from '../../http.js'
import type { CreateServerDatabaseParams, PaginatedResponse, ServerDatabase, SingleResponse } from '../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createServerDatabasesApi(baseUrl: string, token: string) {
	return {
		/** List all databases for a server. */
		list(serverId: number, include?: string) {
			return apiRequest<PaginatedResponse<ServerDatabase>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/servers/${serverId}/databases`,
				params: include ? { include } : undefined
			}).then(unwrapList)
		},

		/** Get a single server database. */
		get(serverId: number, databaseId: number, include?: string) {
			return apiRequest<SingleResponse<ServerDatabase>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/servers/${serverId}/databases/${databaseId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Create a database for a server. */
		create(serverId: number, params: CreateServerDatabaseParams) {
			return apiRequest<SingleResponse<ServerDatabase>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/databases`,
				data: params
			}).then(unwrap)
		},

		/** Rotate/reset the database password. */
		resetPassword(serverId: number, databaseId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/databases/${databaseId}/reset-password`
			})
		},

		/** Delete a server database. */
		delete(serverId: number, databaseId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/servers/${serverId}/databases/${databaseId}`
			})
		}
	}
}
