import { apiRequest } from "../../http.js"
import type {
    Allocation,
    ListAllocationsParams,
    CreateAllocationsParams,
    PaginatedResponse,
} from "../../types/index.js"

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
    return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createAllocationsApi(baseUrl: string, token: string) {
    return {
        /** List all allocations for a node (paginated). */
        list(nodeId: number, params?: ListAllocationsParams) {
            return apiRequest<PaginatedResponse<Allocation>>(baseUrl, token, {
                method: 'GET',
                url: `/api/application/nodes/${nodeId}/allocations`,
                params,
            }).then(unwrapList)
        },

        /** Create one or more allocations on a node. */
        create(nodeId: number, params: CreateAllocationsParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/application/nodes/${nodeId}/allocations`,
                data: params,
            })
        },

        /** Delete an allocation. The allocation must not be assigned to a server. */
        delete(nodeId: number, allocationId: number): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'DELETE',
                url: `/api/application/nodes/${nodeId}/allocations/${allocationId}`,
            })
        },
    }
}
