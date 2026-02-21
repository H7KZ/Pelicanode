import { apiRequest } from '../../../http.js'
import type { ClientAllocation, ListResponse, SingleResponse } from '../../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: ListResponse<T>): T[] {
	return res.data.map(item => item.attributes)
}

export function createNetworkApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** List all allocations for this server. Requires `allocation.read` permission. */
		list() {
			return apiRequest<ListResponse<ClientAllocation>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/network/allocations`
			}).then(unwrapList)
		},

		/** Auto-assign a new allocation to the server. Requires `allocation.create` permission. */
		create() {
			return apiRequest<SingleResponse<ClientAllocation>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/network/allocations`
			}).then(unwrap)
		},

		/** Update the notes for an allocation. Requires `allocation.update` permission. */
		update(allocationId: number, notes: string | null) {
			return apiRequest<SingleResponse<ClientAllocation>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/network/allocations/${allocationId}`,
				data: { notes }
			}).then(unwrap)
		},

		/** Set an allocation as the primary allocation. Requires `allocation.update` permission. */
		setPrimary(allocationId: number) {
			return apiRequest<SingleResponse<ClientAllocation>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/network/allocations/${allocationId}/primary`
			}).then(unwrap)
		},

		/** Remove an allocation from the server. Requires `allocation.delete` permission. */
		delete(allocationId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/client/servers/${serverUuid}/network/allocations/${allocationId}`
			})
		}
	}
}
