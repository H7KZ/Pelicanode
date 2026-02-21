# Server Databases

[← Docs](../README.md) · [← Servers](./servers.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.serverDatabases`.

Manage databases attached to application servers from an admin perspective. For user-facing database management see
the [Client Databases](../client/databases.md) docs.

---

## Methods

| Method                                                                     | Description                 |
|----------------------------------------------------------------------------|-----------------------------|
| [`list(serverId, include?)`](#listserverid-include)                        | List databases for a server |
| [`get(serverId, databaseId, include?)`](#getserverid-databaseid-include)   | Get a specific database     |
| [`create(serverId, params)`](#createserverid-params)                       | Create a database           |
| [`resetPassword(serverId, databaseId)`](#resetpasswordserverid-databaseid) | Reset the database password |
| [`delete(serverId, databaseId)`](#deleteserverid-databaseid)               | Delete a database           |

---

### `list(serverId, include?)`

```typescript
pelican.application.serverDatabases.list(serverId: number, include?: string): Promise<ServerDatabase[]>
```

Pass `include: 'password'` to include the current password in the response.

---

### `get(serverId, databaseId, include?)`

```typescript
pelican.application.serverDatabases.get(
  serverId: number,
  databaseId: number,
  include?: string
): Promise<ServerDatabase>
```

---

### `create(serverId, params)`

```typescript
pelican.application.serverDatabases.create(serverId: number, params: {
  database: string   // name suffix — panel prepends the server ID
  remote: string     // allowed connection host; '%' for any host
  host?: number      // database host ID; omit to use the default host
}): Promise<ServerDatabase>
```

```typescript
const db = await pelican.application.serverDatabases.create(42, {
  database: 'gamedb',
  remote: '%',
})
```

---

### `resetPassword(serverId, databaseId)`

Generates and sets a new random password.

```typescript
pelican.application.serverDatabases.resetPassword(
  serverId: number,
  databaseId: number
): Promise<void>
```

---

### `delete(serverId, databaseId)`

```typescript
pelican.application.serverDatabases.delete(serverId: number, databaseId: number): Promise<void>
```

Permanently drops the database from both the panel and the database host.

---

## `ServerDatabase` type

| Field             | Type             | Description                             |
|-------------------|------------------|-----------------------------------------|
| `id`              | `number`         |                                         |
| `server`          | `number`         | Server ID                               |
| `host`            | `number`         | Database host ID                        |
| `database`        | `string`         | Full database name (with server prefix) |
| `username`        | `string`         |                                         |
| `remote`          | `string`         | Allowed connection host                 |
| `max_connections` | `number \| null` |                                         |
| `created_at`      | `string`         | ISO 8601                                |
| `updated_at`      | `string`         | ISO 8601                                |

---

[← Servers](./servers.md) · [Eggs →](./eggs.md)
