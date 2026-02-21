import {
	createAccountApi,
	createAllocationsApi,
	createClientServersApi,
	createDatabaseHostsApi,
	createEggsApi,
	createMountsApi,
	createNodesApi,
	createPluginsApi,
	createRolesApi,
	createServerApi,
	createServerDatabasesApi,
	createServersApi,
	createUsersApi
} from './api/index.js'

export * from './types/index.js'
export * from './errors.js'

/**
 * Pelicanode — A fully-typed Node.js client for the Pelican Panel API.
 *
 * @example
 * ```ts
 * import { Pelicanode } from 'pelicanode'
 *
 * const pelican = new Pelicanode('https://panel.example.com', 'your-api-key')
 *
 * // Application API (admin)
 * const users = await pelican.application.users.list()
 * const node  = await pelican.application.nodes.get(1)
 *
 * // Client API (user)
 * const servers = await pelican.client.listServers()
 * const account = await pelican.client.account.get()
 *
 * // Per-server operations
 * const srv = pelican.client.server('uuid-here')
 * await srv.sendPower('start')
 * const files = await srv.files.list('/')
 * ```
 */
class Pelicanode {
	private readonly url: string
	private readonly token: string

	/**
	 * Creates a new Pelicanode client.
	 *
	 * @param url   - Base URL of the Pelican Panel (e.g. `https://panel.example.com`)
	 * @param token - API key. For `application.*` use an **admin** key; for `client.*`
	 *                use a regular **account** API key.
	 */
	constructor(url: string, token: string) {
		// Normalise: strip trailing slash
		this.url = url.replace(/\/$/, '')
		this.token = token
	}

	// =========================================================================
	// APPLICATION API (admin)
	// =========================================================================

	/**
	 * Application API — administrative endpoints.
	 * Requires an API key belonging to an **administrator** account.
	 */
	public get application() {
		const { url, token } = this
		return {
			/** Manage panel users */
			users: createUsersApi(url, token),
			/** Manage daemon nodes */
			nodes: createNodesApi(url, token),
			/** Manage node port allocations */
			allocations: createAllocationsApi(url, token),
			/** Manage game servers */
			servers: createServersApi(url, token),
			/** Manage databases attached to servers */
			serverDatabases: createServerDatabasesApi(url, token),
			/** Manage server configuration templates */
			eggs: createEggsApi(url, token),
			/** Manage database host connections */
			databaseHosts: createDatabaseHostsApi(url, token),
			/** Manage filesystem bind mounts */
			mounts: createMountsApi(url, token),
			/** Manage administrative roles */
			roles: createRolesApi(url, token),
			/** Manage panel plugins */
			plugins: createPluginsApi(url, token)
		}
	}

	// =========================================================================
	// CLIENT API (user)
	// =========================================================================

	/**
	 * Client API — user-facing endpoints.
	 * Requires an API key from **Account → API Keys** in the panel.
	 */
	public get client() {
		const { url, token } = this
		const serversApi = createClientServersApi(url, token)

		return {
			/** List servers accessible to the authenticated user. */
			listServers: serversApi.list.bind(serversApi),
			/** Get all available subuser permission keys. */
			listPermissions: serversApi.listPermissions.bind(serversApi),
			/** Account management (profile, API keys, SSH keys, activity). */
			account: createAccountApi(url, token),
			/**
			 * Access per-server endpoints for the given server UUID.
			 *
			 * @param serverUuid - Full server UUID (e.g. `a1b2c3d4-e5f6-...`)
			 *
			 * @example
			 * ```ts
			 * const srv = pelican.client.server('a1b2c3d4-...')
			 * await srv.sendPower('restart')
			 * const backups = await srv.backups.list()
			 * ```
			 */
			server: (serverUuid: string) => createServerApi(url, token, serverUuid)
		}
	}
}

export { Pelicanode }
export default Pelicanode
