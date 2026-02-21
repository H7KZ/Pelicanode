import { apiRequest } from '../../../http.js'
import type {
	ActivityLog,
	ClientServer,
	ClientServerWithMeta,
	ListActivityParams,
	PaginatedResponse,
	ServerStats,
	SingleResponse,
	WebsocketToken
} from '../../../types/index.js'
import { createBackupsApi } from './backups.js'
import { createClientDatabasesApi } from './databases.js'
import { createFilesApi } from './files.js'
import { createNetworkApi } from './network.js'
import { createSchedulesApi } from './schedules.js'
import { createSettingsApi } from './settings.js'
import { createStartupApi } from './startup.js'
import { createSubusersApi } from './subusers.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapPaginated<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createServerApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** Get server details. Includes allocations and variables. */
		get(include?: string): Promise<ClientServerWithMeta> {
			return apiRequest<{
				object: string
				attributes: ClientServer
				meta: { is_server_owner: boolean; user_permissions: string[] }
			}>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}`,
				params: include ? { include } : undefined
			}).then(res => ({
				server: res.attributes,
				is_server_owner: res.meta.is_server_owner,
				user_permissions: res.meta.user_permissions
			}))
		},

		/** Get a short-lived WebSocket token for connecting to the Wings daemon. */
		getWebsocketToken(): Promise<WebsocketToken> {
			return apiRequest<{ data: WebsocketToken }>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/websocket`
			}).then(res => res.data)
		},

		/** Get current resource utilization. Cached for ~20 seconds. */
		getResources() {
			return apiRequest<SingleResponse<ServerStats>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/resources`
			}).then(unwrap)
		},

		/** List server activity logs (paginated). Requires `activity.read` permission. */
		listActivity(params?: ListActivityParams) {
			return apiRequest<PaginatedResponse<ActivityLog>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/activity`,
				params
			}).then(unwrapPaginated)
		},

		/** Send a console command to the server. Requires `control.console` permission. */
		sendCommand(command: string): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/command`,
				data: { command }
			})
		},

		/** Send a power signal to the server. */
		sendPower(signal: 'start' | 'stop' | 'restart' | 'kill'): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/power`,
				data: { signal }
			})
		},

		files: createFilesApi(baseUrl, token, serverUuid),
		databases: createClientDatabasesApi(baseUrl, token, serverUuid),
		schedules: createSchedulesApi(baseUrl, token, serverUuid),
		network: createNetworkApi(baseUrl, token, serverUuid),
		subusers: createSubusersApi(baseUrl, token, serverUuid),
		backups: createBackupsApi(baseUrl, token, serverUuid),
		startup: createStartupApi(baseUrl, token, serverUuid),
		settings: createSettingsApi(baseUrl, token, serverUuid)
	}
}
