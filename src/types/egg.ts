import type { ListParams } from './common.js'

export interface EggVariable {
	id: number
	egg_id: number
	name: string
	description: string
	env_variable: string
	default_value: string
	user_viewable: boolean
	user_editable: boolean
	rules: string
	created_at: string
	updated_at: string
}

export interface EggScript {
	privileged: boolean
	install: string
	entry: string
	container: string
	extends: string | null
}

export interface Egg {
	id: number
	uuid: string
	name: string
	author: string
	description: string | null
	features: string[] | null
	docker_images: Record<string, string>
	config: {
		files: Record<string, unknown>
		startup: Record<string, unknown>
		stop: string
		logs: unknown[]
		file_denylist: string[]
		extends: string | null
	}
	startup: string
	script: EggScript
	created_at: string
	updated_at: string
}

export interface ListEggsParams extends ListParams {
	include?: string
}

export interface GetEggParams {
	include?: string
}

// ============================================================
// CLIENT API — EggVariable (startup variables)
// ============================================================

export interface ClientEggVariable {
	name: string
	description: string
	env_variable: string
	default_value: string
	server_value: string
	is_editable: boolean
	rules: string
}

export interface EggVariableCollectionMeta {
	startup_command: string
	raw_startup_command: string
	docker_images: Record<string, string>
}
