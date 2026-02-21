import { apiRequest } from '../../../http.js'
import type { Backup, CreateBackupParams, PaginatedResponse, RestoreBackupParams, SingleResponse } from '../../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapPaginated<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createBackupsApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** List backups (paginated). Requires `backup.read` permission. */
		list(perPage?: number) {
			return apiRequest<PaginatedResponse<Backup>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/backups`,
				params: perPage ? { per_page: perPage } : undefined
			}).then(unwrapPaginated)
		},

		/** Get a single backup. Requires `backup.read` permission. */
		get(backupUuid: string) {
			return apiRequest<SingleResponse<Backup>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/backups/${backupUuid}`
			}).then(unwrap)
		},

		/** Create a new backup. Requires `backup.create` permission. */
		create(params?: CreateBackupParams) {
			return apiRequest<SingleResponse<Backup>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/backups`,
				data: params ?? {}
			}).then(unwrap)
		},

		/** Delete a backup. Requires `backup.delete` permission. */
		delete(backupUuid: string): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'DELETE',
				url: `/api/client/servers/${serverUuid}/backups/${backupUuid}`
			})
		},

		/** Get a signed download URL for a backup. Requires `backup.download` permission. */
		getDownloadUrl(backupUuid: string) {
			return apiRequest<SingleResponse<{ url: string }>>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/backups/${backupUuid}/download`
			}).then(res => res.attributes.url)
		},

		/** Rename a backup. Requires `backup.delete` permission. */
		rename(backupUuid: string, name: string) {
			return apiRequest<SingleResponse<Backup>>(baseUrl, token, {
				method: 'PUT',
				url: `/api/client/servers/${serverUuid}/backups/${backupUuid}/rename`,
				data: { name }
			}).then(unwrap)
		},

		/** Toggle the lock on a backup. Requires `backup.delete` permission. */
		toggleLock(backupUuid: string) {
			return apiRequest<SingleResponse<Backup>>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/backups/${backupUuid}/lock`
			}).then(unwrap)
		},

		/** Restore a backup. Requires `backup.restore` permission. */
		restore(backupUuid: string, params: RestoreBackupParams): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: `/api/client/servers/${serverUuid}/backups/${backupUuid}/restore`,
				data: params
			})
		}
	}
}
