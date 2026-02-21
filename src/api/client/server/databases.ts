import { apiRequest } from '../../../http.js'
import type { ClientDatabase, CreateClientDatabaseParams, ListResponse } from '../../../types/index.js'

function unwrapList<T>(res: ListResponse<T>): T[] {
	return res.data.map(item => item.attributes)
}

export function createClientDatabasesApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** List all databases for this server. Requires `database.read` permission. */
		list(include?: string) {
			return apiRequest<ListResponse<ClientDatabase>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/databases`,
				params: include ? { include } : undefined
			}).then(unwrapList)
		},

		/** Create a database. Requires `database.create` permission. Response includes the password. */
		create(params: CreateClientDatabaseParams) {
			return apiRequest<{
				object: string
				attributes: ClientDatabase
				relationships?: {
					password?: {
						object: string
						attributes: { password: string }
					}
				}
			}>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/databases`,
				data: params
			}).then(res => ({
				...res.attributes,
				password: res.relationships?.password?.attributes.password
			}))
		},

		/** Rotate the database password. Requires `database.update` permission. */
		rotatePassword(databaseId: string) {
			return apiRequest<{
				object: string
				attributes: ClientDatabase
				relationships?: {
					password?: {
						object: string
						attributes: { password: string }
					}
				}
			}>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/databases/${databaseId}/rotate-password`
			}).then(res => ({
				...res.attributes,
				password: res.relationships?.password?.attributes.password
			}))
		},

		/** Delete a database. Requires `database.delete` permission. */
		delete(databaseId: string): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/client/servers/${serverUuid}/databases/${databaseId}`
			})
		}
	}
}
