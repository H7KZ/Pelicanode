import { apiRequest } from '../../../http.js'
import type { CreateSubuserParams, ListResponse, SingleResponse, Subuser, UpdateSubuserParams } from '../../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: ListResponse<T>): T[] {
	return res.data.map(item => item.attributes)
}

export function createSubusersApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** List all subusers. Requires `user.read` permission. */
		list() {
			return apiRequest<ListResponse<Subuser>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/users`
			}).then(unwrapList)
		},

		/** Get a single subuser. Requires `user.read` permission. */
		get(userUuid: string) {
			return apiRequest<SingleResponse<Subuser>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/users/${userUuid}`
			}).then(unwrap)
		},

		/** Add a user as a subuser. Requires `user.create` permission. */
		create(params: CreateSubuserParams) {
			return apiRequest<SingleResponse<Subuser>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/users`,
				data: params
			}).then(unwrap)
		},

		/** Update subuser permissions. Requires `user.update` permission. */
		update(userUuid: string, params: UpdateSubuserParams) {
			return apiRequest<SingleResponse<Subuser>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/users/${userUuid}`,
				data: params
			}).then(unwrap)
		},

		/** Remove a subuser. Requires `user.delete` permission. */
		delete(userUuid: string): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/client/servers/${serverUuid}/users/${userUuid}`
			})
		}
	}
}
