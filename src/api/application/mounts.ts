import { apiRequest } from '../../http.js'
import type {
	ApplicationServer,
	CreateMountParams,
	Egg,
	ListMountsParams,
	ListResponse,
	Mount,
	Node,
	PaginatedResponse,
	SingleResponse,
	UpdateMountParams
} from '../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

function unwrapSimpleList<T>(res: ListResponse<T>): T[] {
	return res.data.map(item => item.attributes)
}

export function createMountsApi(baseUrl: string, token: string) {
	return {
		/** List all mounts (paginated). */
		list(params?: ListMountsParams) {
			return apiRequest<PaginatedResponse<Mount>>(baseUrl, token, {
				method: 'GET',
				url: '/api/application/mounts',
				params
			}).then(unwrapList)
		},

		/** Get a single mount. */
		get(mountId: number, include?: string) {
			return apiRequest<SingleResponse<Mount>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/mounts/${mountId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Create a mount. */
		create(params: CreateMountParams) {
			return apiRequest<SingleResponse<Mount>>(baseUrl, token, {
				method: 'POST',
				url: '/api/application/mounts',
				data: params
			}).then(unwrap)
		},

		/** Update a mount. */
		update(mountId: number, params: UpdateMountParams) {
			return apiRequest<SingleResponse<Mount>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/mounts/${mountId}`,
				data: params
			}).then(unwrap)
		},

		/** Delete a mount. The mount must not have attached servers. */
		delete(mountId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/mounts/${mountId}`
			})
		},

		/** List eggs assigned to a mount. */
		listEggs(mountId: number, include?: string) {
			return apiRequest<ListResponse<Egg>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/mounts/${mountId}/eggs`,
				params: include ? { include } : undefined
			}).then(unwrapSimpleList)
		},

		/** Assign eggs to a mount. */
		addEggs(mountId: number, eggs: number[]) {
			return apiRequest<SingleResponse<Mount>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/mounts/${mountId}/eggs`,
				data: { eggs }
			}).then(unwrap)
		},

		/** Remove an egg from a mount. */
		removeEgg(mountId: number, eggId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/mounts/${mountId}/eggs/${eggId}`
			})
		},

		/** List nodes assigned to a mount. */
		listNodes(mountId: number, include?: string) {
			return apiRequest<ListResponse<Node>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/mounts/${mountId}/nodes`,
				params: include ? { include } : undefined
			}).then(unwrapSimpleList)
		},

		/** Assign nodes to a mount. */
		addNodes(mountId: number, nodes: number[]) {
			return apiRequest<SingleResponse<Mount>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/mounts/${mountId}/nodes`,
				data: { nodes }
			}).then(unwrap)
		},

		/** Remove a node from a mount. */
		removeNode(mountId: number, nodeId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/mounts/${mountId}/nodes/${nodeId}`
			})
		},

		/** List servers assigned to a mount. */
		listServers(mountId: number, include?: string) {
			return apiRequest<ListResponse<ApplicationServer>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/mounts/${mountId}/servers`,
				params: include ? { include } : undefined
			}).then(unwrapSimpleList)
		},

		/** Assign servers to a mount. */
		addServers(mountId: number, servers: number[]) {
			return apiRequest<SingleResponse<Mount>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/mounts/${mountId}/servers`,
				data: { servers }
			}).then(unwrap)
		},

		/** Remove a server from a mount. */
		removeServer(mountId: number, serverId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/mounts/${mountId}/servers/${serverId}`
			})
		}
	}
}
