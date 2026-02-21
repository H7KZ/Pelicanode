import { apiRequest } from '../../http.js'
import type { ListPluginsParams, PaginatedResponse, Plugin, SingleResponse } from '../../types/index.js'

function unwrap<T>(res: SingleResponse<T>): T {
	return res.attributes
}

function unwrapList<T>(res: PaginatedResponse<T>): { data: T[]; meta: PaginatedResponse<T>['meta'] } {
	return { data: res.data.map(item => item.attributes), meta: res.meta }
}

export function createPluginsApi(baseUrl: string, token: string) {
	return {
		/** List all plugins (paginated). */
		list(params?: ListPluginsParams) {
			return apiRequest<PaginatedResponse<Plugin>>(baseUrl, token, {
				method: 'GET',
				url: '/api/application/plugins',
				params
			}).then(unwrapList)
		},

		/** Get a single plugin. */
		get(pluginId: number) {
			return apiRequest<SingleResponse<Plugin>>(baseUrl, token, {
				method: 'GET',
				url: `/api/application/plugins/${pluginId}`
			}).then(unwrap)
		},

		/** Install a plugin (must be in NotInstalled state). */
		install(pluginId: number) {
			return apiRequest<SingleResponse<Plugin>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/plugins/${pluginId}/install`
			}).then(unwrap)
		},

		/** Update a plugin to a newer version. */
		update(pluginId: number) {
			return apiRequest<SingleResponse<Plugin>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/plugins/${pluginId}/update`
			}).then(unwrap)
		},

		/** Uninstall a plugin. */
		uninstall(pluginId: number, deleteFiles = false) {
			return apiRequest<SingleResponse<Plugin>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/plugins/${pluginId}/uninstall`,
				data: { delete: deleteFiles }
			}).then(unwrap)
		},

		/** Enable a plugin. */
		enable(pluginId: number) {
			return apiRequest<SingleResponse<Plugin>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/plugins/${pluginId}/enable`
			}).then(unwrap)
		},

		/** Disable a plugin. */
		disable(pluginId: number) {
			return apiRequest<SingleResponse<Plugin>>(baseUrl, token, {
				method: 'POST',
				url: `/api/application/plugins/${pluginId}/disable`
			}).then(unwrap)
		},

		/** Import a plugin from a URL. */
		importFromUrl(url: string): Promise<void> {
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: '/api/application/plugins/import/url',
				data: { url }
			})
		},

		/** Import a plugin from a file (Buffer or Blob). */
		importFromFile(file: Buffer | Blob, filename = 'plugin.zip'): Promise<void> {
			const formData = new FormData()
			const blob = file instanceof Blob ? file : new Blob([file])
			formData.append('file', blob, filename)
			return apiRequest<void>(baseUrl, token, {
				method: 'POST',
				url: '/api/application/plugins/import/file',
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' }
			})
		}
	}
}
