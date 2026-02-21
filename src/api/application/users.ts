import { apiRequest } from '../../http.js'
import type {
	ApplicationUser,
	AssignRolesParams,
	CreateUserParams,
	ListUsersParams,
	PaginatedResponse,
	SingleResponse,
	UpdateUserParams
} from '../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createUsersApi(baseUrl: string, token: string) {
	return {
		/** List all users (paginated). */
		list(params?: ListUsersParams) {
			return apiRequest<PaginatedResponse<ApplicationUser>>(baseUrl, token, {
				method: 'GET',
				url: '/api/application/users',
				params
			}).then(unwrapList)
		},

		/** Get a single user by ID. */
		get(userId: number, include?: string) {
			return apiRequest<SingleResponse<ApplicationUser>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/users/${userId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Get a user by their external ID. */
		getByExternalId(externalId: string, include?: string) {
			return apiRequest<SingleResponse<ApplicationUser>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/users/external/${externalId}`,
				params: include ? { include } : undefined
			}).then(unwrap)
		},

		/** Create a new user. */
		create(params: CreateUserParams) {
			return apiRequest<SingleResponse<ApplicationUser>>(baseUrl, token, {
				method: 'POST',
				url: '/api/application/users',
				data: params
			}).then(unwrap)
		},

		/** Update a user. */
		update(userId: number, params: UpdateUserParams) {
			return apiRequest<SingleResponse<ApplicationUser>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/users/${userId}`,
				data: params
			}).then(unwrap)
		},

		/** Delete a user. */
		delete(userId: number): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/application/users/${userId}`
			})
		},

		/** Assign roles to a user. */
		assignRoles(userId: number, params: AssignRolesParams) {
			return apiRequest<SingleResponse<ApplicationUser>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/users/${userId}/roles/assign`,
				data: params
			}).then(unwrap)
		},

		/** Remove roles from a user. */
		removeRoles(userId: number, params: AssignRolesParams) {
			return apiRequest<SingleResponse<ApplicationUser>>(baseUrl, token, {
				method: 'PATCH',
				url: `/api/application/users/${userId}/roles/remove`,
				data: params
			}).then(unwrap)
		}
	}
}
