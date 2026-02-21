import type { ListParams } from './common.js'

export type PluginState = 'NotInstalled' | 'Installing' | 'Installed' | 'Enabled' | 'Disabled' | 'UpdateAvailable'

export interface Plugin {
	id: number
	name: string
	author: string
	category: string
	version: string
	description: string | null
	state: PluginState
	created_at: string
	updated_at: string
}

export interface ListPluginsParams extends ListParams {
	'filter[id]'?: number
	'filter[name]'?: string
	'filter[author]'?: string
	'filter[category]'?: string
}
