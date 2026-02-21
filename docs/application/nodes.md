# Nodes

[← Docs](../README.md) · [← Users](./users.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.nodes`.

Manage Wings daemon nodes — the servers that actually run game servers.

---

## Methods

| Method                                                | Description                                |
|-------------------------------------------------------|--------------------------------------------|
| [`list(params?)`](#listparams)                        | Paginated list of all nodes                |
| [`get(nodeId, include?)`](#getnodeid-include)         | Get a node by ID                           |
| [`getDeployable(params)`](#getdeployableparams)       | Find nodes that meet resource requirements |
| [`getConfiguration(nodeId)`](#getconfigurationnodeid) | Get the Wings daemon config                |
| [`create(params)`](#createparams)                     | Create a node                              |
| [`update(nodeId, params)`](#updatenodeid-params)      | Update a node                              |
| [`delete(nodeId)`](#deletenodeid)                     | Delete a node                              |

---

### `list(params?)`

```typescript
pelican.application.nodes.list(params?: {
  page?: number
  per_page?: number
  sort?: string              // 'id' | 'uuid' | 'memory' | 'disk' | 'cpu' (prefix with - for desc)
  include?: string
  'filter[uuid]'?: string
  'filter[name]'?: string
  'filter[fqdn]'?: string
  'filter[daemon_token_id]'?: string
}): Promise<{ data: Node[]; meta: { pagination: Pagination } }>
```

---

### `get(nodeId, include?)`

```typescript
pelican.application.nodes.get(nodeId: number, include?: string): Promise<Node>
```

---

### `getDeployable(params)`

Returns nodes that satisfy the specified resource requirements. Useful for auto-placement logic.

```typescript
pelican.application.nodes.getDeployable(params: {
  memory: number     // required — MB needed
  disk: number       // required — MB needed
  cpu?: number       // CPU % needed
  tags?: string[]    // node must have all specified tags
  include?: string
}): Promise<{ data: Node[]; meta: { pagination: Pagination } }>
```

```typescript
const { data: nodes } = await pelican.application.nodes.getDeployable({
  memory: 2048,
  disk: 20480,
  tags: ['us-east'],
})
```

---

### `getConfiguration(nodeId)`

Returns the Wings daemon bootstrap configuration for a node.

```typescript
pelican.application.nodes.getConfiguration(nodeId: number): Promise<NodeConfiguration>
```

> **Sensitive data.** This response contains the daemon authentication token. Treat it like a secret.

---

### `create(params)`

```typescript
pelican.application.nodes.create(params: {
  name: string
  fqdn: string
  scheme: 'https' | 'http'
  memory: number              // MB total
  memory_overallocate: number // overallocation %, 0 to disable
  disk: number                // MB total
  disk_overallocate: number
  cpu: number                 // CPU % total
  cpu_overallocate: number
  daemon_sftp: number         // SFTP port (default 2022)
  daemon_listen: number       // Wings internal listen port
  daemon_connect: number      // Wings public-facing port (used by panel)
  maintenance_mode?: boolean
  tags?: string[]
  upload_size?: number        // max file upload MB
}): Promise<Node>
```

```typescript
const node = await pelican.application.nodes.create({
  name: 'US-East-01',
  fqdn: 'node01.example.com',
  scheme: 'https',
  memory: 32768,
  memory_overallocate: 0,
  disk: 512000,
  disk_overallocate: 0,
  cpu: 800,
  cpu_overallocate: 0,
  daemon_sftp: 2022,
  daemon_listen: 8080,
  daemon_connect: 443,
})
```

---

### `update(nodeId, params)`

All fields are optional.

```typescript
pelican.application.nodes.update(nodeId: number, params: Partial<CreateNodeParams>): Promise<Node>
```

```typescript
await pelican.application.nodes.update(1, { maintenance_mode: true })
```

---

### `delete(nodeId)`

```typescript
pelican.application.nodes.delete(nodeId: number): Promise<void>
```

> The node must have **no servers assigned** before it can be deleted. Returns `409 Conflict` otherwise.

---

## `Node` type

| Field                 | Type                | Description                 |
|-----------------------|---------------------|-----------------------------|
| `id`                  | `number`            |                             |
| `uuid`                | `string`            |                             |
| `name`                | `string`            |                             |
| `fqdn`                | `string`            | Fully-qualified domain name |
| `scheme`              | `'https' \| 'http'` |                             |
| `memory`              | `number`            | Total memory in MB          |
| `memory_overallocate` | `number`            |                             |
| `disk`                | `number`            | Total disk in MB            |
| `disk_overallocate`   | `number`            |                             |
| `cpu`                 | `number`            | Total CPU %                 |
| `cpu_overallocate`    | `number`            |                             |
| `daemon_listen`       | `number`            |                             |
| `daemon_sftp`         | `number`            |                             |
| `daemon_connect`      | `number`            |                             |
| `maintenance_mode`    | `boolean`           |                             |
| `tags`                | `string[]`          |                             |
| `upload_size`         | `number`            |                             |
| `created_at`          | `string`            | ISO 8601                    |
| `updated_at`          | `string`            | ISO 8601                    |

---

[← Users](./users.md) · [Allocations →](./allocations.md)
