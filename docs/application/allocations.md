# Allocations

[← Docs](../README.md) · [← Nodes](./nodes.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.allocations`.

Manage port allocations on nodes. Allocations are IP + port combinations that can be assigned to servers.

---

## Methods

| Method                                                       | Description                    |
|--------------------------------------------------------------|--------------------------------|
| [`list(nodeId, params?)`](#listnodeid-params)                | List allocations for a node    |
| [`create(nodeId, params)`](#createnodeid-params)             | Create one or more allocations |
| [`delete(nodeId, allocationId)`](#deletenodeid-allocationid) | Delete a single allocation     |

---

### `list(nodeId, params?)`

```typescript
pelican.application.allocations.list(nodeId: number, params?: {
  page?: number
  per_page?: number
  include?: string
  'filter[ip]'?: string
  'filter[port]'?: number
  'filter[ip_alias]'?: string
  'filter[server_id]'?: number
}): Promise<{ data: Allocation[]; meta: { pagination: Pagination } }>
```

```typescript
// List all allocations on node 1
const { data: allocs } = await pelican.application.allocations.list(1)

// Find allocations for a specific IP
const { data } = await pelican.application.allocations.list(1, {
  'filter[ip]': '192.168.1.100',
})
```

---

### `create(nodeId, params)`

Creates one or more port allocations on a node in a single request. Both individual ports and ranges are supported.

```typescript
pelican.application.allocations.create(nodeId: number, params: {
  ip: string
  alias?: string | null    // optional human-readable label
  ports: string[]          // individual ('25565') and/or ranges ('25566-25570')
}): Promise<void>
```

```typescript
// Create a single port
await pelican.application.allocations.create(1, {
  ip: '192.168.1.100',
  ports: ['25565'],
})

// Create a range + individual port in one call
await pelican.application.allocations.create(1, {
  ip: '192.168.1.100',
  alias: 'Game Ports',
  ports: ['25565', '25580-25589'],
})
```

---

### `delete(nodeId, allocationId)`

```typescript
pelican.application.allocations.delete(nodeId: number, allocationId: number): Promise<void>
```

> The allocation must **not be assigned** to a server. Unassign it first via [
`servers.updateBuild`](./servers.md#updatebuildserverid-params).

---

## `Allocation` type

| Field      | Type             | Description                                               |
|------------|------------------|-----------------------------------------------------------|
| `id`       | `number`         |                                                           |
| `ip`       | `string`         | IP address                                                |
| `alias`    | `string \| null` | Human-readable label                                      |
| `port`     | `number`         |                                                           |
| `notes`    | `string \| null` |                                                           |
| `assigned` | `boolean`        | Whether this allocation is currently assigned to a server |

---

[← Nodes](./nodes.md) · [Servers →](./servers.md)
