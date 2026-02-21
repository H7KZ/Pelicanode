import type { ListParams } from './common.js'

// ============================================================
// APPLICATION API — Allocation
// ============================================================

export interface Allocation {
	id: number
	ip: string
	alias: string | null
	port: number
	notes: string | null
	assigned: boolean
}

export interface ListAllocationsParams extends ListParams {
	'filter[ip]'?: string
	'filter[port]'?: number
	'filter[ip_alias]'?: string
	'filter[server_id]'?: number
}

export interface CreateAllocationsParams {
	ip: string
	alias?: string | null
	ports: string[]
}

// ============================================================
// CLIENT API — Allocation (per server)
// ============================================================

export interface ClientAllocation {
	id: number
	ip: string
	ip_alias: string | null
	port: number
	notes: string | null
	is_default: boolean
}
