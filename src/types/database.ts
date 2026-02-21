// ============================================================
// APPLICATION API — Server Database
// ============================================================

export interface ServerDatabase {
	id: number
	server: number
	host: number
	database: string
	username: string
	remote: string
	max_connections: number | null
	created_at: string
	updated_at: string
}

export interface CreateServerDatabaseParams {
	database: string
	remote: string
	host?: number
}

// ============================================================
// CLIENT API — Server Database
// ============================================================

export interface ClientDatabaseHost {
	address: string
	port: number
}

export interface ClientDatabase {
	id: number
	host: ClientDatabaseHost
	name: string
	username: string
	connections_from: string
	max_connections: number | null
	password?: string
}

export interface CreateClientDatabaseParams {
	database: string
	remote: string
}
