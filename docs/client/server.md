# Server

[← Docs](../README.md) · [← Account](./account.md) · Client API

> Requires an **account** API key. Access per-server operations via `pelican.client.server(uuid)`.

---

## Getting a server accessor

```typescript
const srv = pelican.client.server('a1b2c3d4-e5f6-7890-abcd-ef1234567890')
```

`server(uuid)` returns a new API accessor on each call — there is no persistent connection. You can call it at any time
to get a fully-typed object for that server.

---

## Listing servers

Before accessing a specific server you typically need to find its UUID:

```typescript
const { data: servers } = await pelican.client.listServers()
const srv = pelican.client.server(servers[0]!.uuid)
```

Filter options for `listServers`:

```typescript
pelican.client.listServers(params?: {
  page?: number
  per_page?: number
  type?: 'owner' | 'admin' | 'admin-all'
  'filter[uuid]'?: string
  'filter[name]'?: string
  'filter[*]'?: string    // search across uuid, name, description, external_id
}): Promise<{ data: ClientServer[]; meta: { pagination: Pagination } }>
```

---

## Methods

| Method                                         | Description                            |
|------------------------------------------------|----------------------------------------|
| [`get(include?)`](#getinclude)                 | Server details, permissions, ownership |
| [`getWebsocketToken()`](#getwebsockettoken)    | Short-lived WebSocket token            |
| [`getResources()`](#getresources)              | Live CPU, memory, disk, uptime         |
| [`listActivity(params?)`](#listactivityparams) | Paginated server activity logs         |
| [`sendCommand(command)`](#sendcommandcommand)  | Send a console command                 |
| [`sendPower(signal)`](#sendpowersignal)        | Start, stop, restart, or kill          |

For sub-namespaces see:
[Files](./files.md) · [Databases](./databases.md) · [Schedules](./schedules.md) · [Network](./network.md) · [Subusers](./subusers.md) · [Backups](./backups.md) · [Startup](./startup.md) · [Settings](./settings.md)

---

### `get(include?)`

Returns server details with ownership info and the authenticated user's permissions.

```typescript
srv.get(include?: string): Promise<{
  server: ClientServer
  is_server_owner: boolean
  user_permissions: string[]
}>
```

`user_permissions` lists the permission keys the authenticated user has on this server (
see [Permissions](../README.md#subuser-permissions)).

Always includes the server's allocations and startup variables. Pass `include` to eager-load additional relations.

```typescript
const { server, is_server_owner, user_permissions } = await srv.get()

if (user_permissions.includes('control.start')) {
  await srv.sendPower('start')
}
```

---

### `getWebsocketToken()`

Generates a short-lived signed JWT for connecting to the Wings daemon WebSocket.

```typescript
srv.getWebsocketToken(): Promise<{
  token: string   // JWT, valid for 10 minutes
  socket: string  // wss:// URL
}>
```

Required permission: `websocket.connect`

```typescript
const { token, socket } = await srv.getWebsocketToken()
const ws = new WebSocket(`${socket}?token=${token}`)
```

---

### `getResources()`

Returns the server's current resource utilization from Wings. Results are cached by Wings for ~20 seconds.

```typescript
srv.getResources(): Promise<ServerStats>
```

```typescript
const stats = await srv.getResources()
console.log(stats.current_state)                                   // 'running'
console.log((stats.resources.memory_bytes / 1024 / 1024).toFixed(0) + ' MB used')
```

**`ServerStats` type:**

| Field                        | Type                                                              | Description             |
|------------------------------|-------------------------------------------------------------------|-------------------------|
| `current_state`              | `'running' \| 'stopped' \| 'starting' \| 'stopping' \| 'offline'` |                         |
| `is_suspended`               | `boolean`                                                         |                         |
| `resources.memory_bytes`     | `number`                                                          |                         |
| `resources.cpu_absolute`     | `number`                                                          | CPU usage as absolute % |
| `resources.disk_bytes`       | `number`                                                          |                         |
| `resources.network_rx_bytes` | `number`                                                          |                         |
| `resources.network_tx_bytes` | `number`                                                          |                         |
| `resources.uptime`           | `number`                                                          | Milliseconds            |

---

### `listActivity(params?)`

```typescript
srv.listActivity(params?: {
  page?: number
  per_page?: number   // default 25
  'filter[event]'?: string
  sort?: 'timestamp' | '-timestamp'
}): Promise<{ data: ActivityLog[]; meta: { pagination: Pagination } }>
```

Required permission: `activity.read`

---

### `sendCommand(command)`

Sends a console command to the running server.

```typescript
srv.sendCommand(command: string): Promise<void>
```

Required permission: `control.console`

> Returns `502 Bad Gateway` if the server is offline. Wrap in a try/catch if the server state is uncertain.

```typescript
await srv.sendCommand('say Hello everyone!')
await srv.sendCommand('whitelist add Player123')
```

---

### `sendPower(signal)`

Sends a power signal to the server.

```typescript
srv.sendPower(signal: 'start' | 'stop' | 'restart' | 'kill'): Promise<void>
```

| Signal      | Required permission | Description                       |
|-------------|---------------------|-----------------------------------|
| `'start'`   | `control.start`     | Start the server process          |
| `'stop'`    | `control.stop`      | Send the graceful stop command    |
| `'restart'` | `control.restart`   | Stop then start                   |
| `'kill'`    | `control.stop`      | Immediately terminate the process |

```typescript
await srv.sendPower('restart')
```

---

## `ClientServer` type

| Field                       | Type                                                     | Description                                  |
|-----------------------------|----------------------------------------------------------|----------------------------------------------|
| `server_owner`              | `boolean`                                                | Whether the API key's owner owns this server |
| `identifier`                | `string`                                                 | Short 8-char ID                              |
| `internal_id`               | `number`                                                 |                                              |
| `uuid`                      | `string`                                                 | Full UUID                                    |
| `name`                      | `string`                                                 |                                              |
| `node`                      | `string`                                                 | Node name                                    |
| `is_node_under_maintenance` | `boolean`                                                |                                              |
| `sftp_details`              | `{ ip, alias, port }`                                    |                                              |
| `description`               | `string`                                                 |                                              |
| `limits`                    | `ServerLimits`                                           | Resource limits                              |
| `feature_limits`            | `ServerFeatureLimits`                                    |                                              |
| `status`                    | [`ServerStatus`](../application/servers.md#serverstatus) |                                              |
| `is_transferring`           | `boolean`                                                |                                              |

---

[← Account](./account.md) · [Files →](./files.md)
