import { apiRequest } from '../../../http.js'
import type { ClientEggVariable, EggVariableCollectionMeta } from '../../../types/index.js'

export function createStartupApi(baseUrl: string, token: string, serverUuid: string) {
	return {
		/** List all startup variables. Requires `startup.read` permission. */
		list(): Promise<{
			variables: ClientEggVariable[]
			startup_command: string
			raw_startup_command: string
			docker_images: Record<string, string>
		}> {
			return apiRequest<{
				object: 'list'
				data: { object: string; attributes: ClientEggVariable }[]
				meta: EggVariableCollectionMeta
			}>(baseUrl, token, {
				method: 'GET',
				url: `/api/client/servers/${serverUuid}/startup`
			}).then(res => ({
				variables: res.data.map(item => item.attributes),
				startup_command: res.meta.startup_command,
				raw_startup_command: res.meta.raw_startup_command,
				docker_images: res.meta.docker_images
			}))
		},

		/** Update a startup variable. Requires `startup.update` permission. */
		updateVariable(
			key: string,
			value: string
		): Promise<{
			variable: ClientEggVariable
			startup_command: string
		}> {
			return apiRequest<{
				object: string
				attributes: ClientEggVariable
				meta: { startup_command: string }
			}>(baseUrl, token, {
				method: 'PUT',
				url: `/api/client/servers/${serverUuid}/startup/variable`,
				data: { key, value }
			}).then(res => ({
				variable: res.attributes,
				startup_command: (res.meta as { startup_command: string }).startup_command
			}))
		}
	}
}
