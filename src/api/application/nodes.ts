import { apiRequest } from '../../http.js'
import type {
	CreateNodeParams,
	GetDeployableNodesParams,
	ListNodesParams,
	Node,
	NodeConfiguration,
	PaginatedResponse,
	SingleResponse,
	UpdateNodeParams
} from '../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createNodesApi(baseUrl: string, token: string) {
	return {
		/** List all nodes (paginated). */
		list(params?: ListNodesParams) {
			return apiRequest<PaginatedResponse<Node>>(baseUrl, token, {
				method: 'GET',
				url: '/api/application/nodes',
				params
			}).then(unwrapList)
		},

		/** Get a single node by ID. */
		get(nodeId: number, include?: string) {
			return apiRequest<SingleResponse<Node>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/nodes/${nodeId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Get deployable nodes matching resource requirements. */
		getDeployable(params: GetDeployableNodesParams) {
			return apiRequest<PaginatedResponse<Node>>(baseUrl, token, {
				method: 'GET',
				url: '/api/application/nodes/deployable',
				params
			}).then(unwrapList)
		},

		/** Get the Wings daemon configuration for a node. */
		getConfiguration(nodeId: number) {
			return apiRequest<NodeConfiguration>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/nodes/${nodeId}/configuration`
			})
		},

		/** Create a new node. */
		create(params: CreateNodeParams) {
			return apiRequest<SingleResponse<Node>>(baseUrl, token, {
				method: 'POST',
				url: '/api/application/nodes',
				data: params
			}).then(unwrap)
		},

		/** Update a node. */
		update(nodeId: number, params: UpdateNodeParams) {
			return apiRequest<SingleResponse<Node>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/nodes/${nodeId}`,
				data: params
			}).then(unwrap)
		},

		/** Delete a node. The node must have no servers assigned. */
		delete(nodeId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/nodes/${nodeId}`
			})
		}
	}
}
