# Database Hosts

[← Docs](../README.md) · [← Eggs](./eggs.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.databaseHosts`.

Database hosts are MySQL/MariaDB server connections that the panel uses to provision server databases.

---

## Methods

| Method                                           | Description                      |
|--------------------------------------------------|----------------------------------|
| [`list(params?)`](#listparams)                   | Paginated list of database hosts |
| [`get(hostId, include?)`](#gethostid-include)    | Get a database host by ID        |
| [`create(params)`](#createparams)                | Add a new database host          |
| [`update(hostId, params)`](#updatehostid-params) | Update a database host           |
| [`delete(hostId)`](#deletehostid)                | Remove a database host           |

---

### `list(params?)`

```typescript
pelican.application.databaseHosts.list(params?: {
  page?: number
  per_page?: number
  include?: string
}): Promise<{ data: DatabaseHost[]; meta: { pagination: Pagination } }>
```

---

### `get(hostId, include?)`

```typescript
pelican.application.databaseHosts.get(hostId: number, include?: string): Promise<DatabaseHost>
```

---

### `create(params)`

```typescript
pelican.application.databaseHosts.create(params: {
  name: string
  host: string           // IP address or hostname
  port: number           // typically 3306
  username: string       // must have CREATE/DROP privileges
  password: string
  max_databases?: number | null  // null = unlimited
}): Promise<DatabaseHost>
```

```typescript
const host = await pelican.application.databaseHosts.create({
  name: 'Primary MySQL',
  host: '127.0.0.1',
  port: 3306,
  username: 'pelican',
  password: 'supersecret',
})
```

---

### `update(hostId, params)`

All fields are optional.

```typescript
pelican.application.databaseHosts.update(hostId: number, params: {
  name?: string
  host?: string
  port?: number
  username?: string
  password?: string
  max_databases?: number | null
}): Promise<DatabaseHost>
```

---

### `delete(hostId)`

```typescript
pelican.application.databaseHosts.delete(hostId: number): Promise<void>
```

---

## `DatabaseHost` type

| Field           | Type             | Description |
|-----------------|------------------|-------------|
| `id`            | `number`         |             |
| `name`          | `string`         |             |
| `host`          | `string`         |             |
| `port`          | `number`         |             |
| `username`      | `string`         |             |
| `max_databases` | `number \| null` |             |
| `created_at`    | `string`         | ISO 8601    |
| `updated_at`    | `string`         | ISO 8601    |

> The password is never returned in responses.

---

[← Eggs](./eggs.md) · [Mounts →](./mounts.md)
