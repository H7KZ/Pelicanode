import { apiRequest } from '../../http.js'
import type {
	ApplicationServer,
	CreateServerParams,
	ListApplicationServersParams,
	PaginatedResponse,
	SingleResponse,
	StartTransferParams,
	UpdateServerBuildParams,
	UpdateServerDetailsParams,
	UpdateServerStartupParams
} from '../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createServersApi(baseUrl: string, token: string) {
	return {
		/** List all servers (paginated). */
		list(params?: ListApplicationServersParams) {
			return apiRequest<PaginatedResponse<ApplicationServer>>(baseUrl, token, {
				method: 'GET',
				url: '/api/application/servers',
				params
			}).then(unwrapList)
		},

		/** Get a single server by ID. */
		get(serverId: number, include?: string) {
			return apiRequest<SingleResponse<ApplicationServer>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/servers/${serverId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Get a server by its external ID. */
		getByExternalId(externalId: string, include?: string) {
			return apiRequest<SingleResponse<ApplicationServer>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/servers/external/${externalId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Create a new server. */
		create(params: CreateServerParams) {
			return apiRequest<SingleResponse<ApplicationServer>>(baseUrl, token, {
				method: 'POST',
				url: '/api/application/servers',
				data: params
			}).then(unwrap)
		},

		/** Update server details (name, owner, description, external ID). */
		updateDetails(serverId: number, params: UpdateServerDetailsParams) {
			return apiRequest<SingleResponse<ApplicationServer>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/servers/${serverId}/details`,
				data: params
			}).then(unwrap)
		},

		/** Update server build configuration (limits, allocations). */
		updateBuild(serverId: number, params: UpdateServerBuildParams) {
			return apiRequest<SingleResponse<ApplicationServer>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/servers/${serverId}/build`,
				data: params
			}).then(unwrap)
		},

		/** Update server startup configuration (egg, image, environment). */
		updateStartup(serverId: number, params: UpdateServerStartupParams) {
			return apiRequest<SingleResponse<ApplicationServer>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/servers/${serverId}/startup`,
				data: params
			}).then(unwrap)
		},

		/** Suspend a server. */
		suspend(serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/suspend`
			})
		},

		/** Unsuspend a server. */
		unsuspend(serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/unsuspend`
			})
		},

		/** Queue a server for reinstall. */
		reinstall(serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/reinstall`
			})
		},

		/** Initiate a server transfer to a different node. */
		startTransfer(serverId: number, params: StartTransferParams): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/transfer`,
				data: params
			})
		},

		/** Cancel an in-progress server transfer. */
		cancelTransfer(serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/servers/${serverId}/transfer/cancel`
			})
		},

		/** Delete a server. */
		delete(serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/servers/${serverId}`
			})
		},

		/** Force-delete a server even if the daemon is unreachable. */
		forceDelete(serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/servers/${serverId}/force`
			})
		}
	}
}
