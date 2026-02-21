# Network

[← Docs](../README.md) · [← Schedules](./schedules.md) · Client API

> Access via `pelican.client.server(uuid).network`.

Manage network allocations (IP + port combinations) assigned to a server.

---

## Methods

| Method                                                     | Permission          | Description                  |
|------------------------------------------------------------|---------------------|------------------------------|
| [`list()`](#list)                                          | `allocation.read`   | List server's allocations    |
| [`create()`](#create)                                      | `allocation.create` | Auto-assign a new allocation |
| [`update(allocationId, notes)`](#updateallocationid-notes) | `allocation.update` | Update allocation notes      |
| [`setPrimary(allocationId)`](#setprimaryallocationid)      | `allocation.update` | Set as primary allocation    |
| [`delete(allocationId)`](#deleteallocationid)              | `allocation.delete` | Remove an allocation         |

---

### `list()`

```typescript
srv.network.list(): Promise<ClientAllocation[]>
```

```typescript
const allocs = await srv.network.list()
const primary = allocs.find(a => a.is_default)
```

---

### `create()`

Auto-assigns the next available allocation from the server's node. Fails if the server has reached its
`feature_limits.allocations` maximum.

```typescript
srv.network.create(): Promise<ClientAllocation>
```

---

### `update(allocationId, notes)`

Updates the human-readable note for an allocation. Useful for labelling what each port is used for. Pass `null` to clear
the note.

```typescript
srv.network.update(allocationId: number, notes: string | null): Promise<ClientAllocation>
```

```typescript
await srv.network.update(42, 'Minecraft Java Edition - main port')
await srv.network.update(43, null)  // clear note
```

---

### `setPrimary(allocationId)`

Makes an allocation the server's primary allocation.

```typescript
srv.network.setPrimary(allocationId: number): Promise<ClientAllocation>
```

---

### `delete(allocationId)`

Removes an allocation from the server. The allocation is returned to the node's pool.

```typescript
srv.network.delete(allocationId: number): Promise<void>
```

---

## `ClientAllocation` type

| Field        | Type             | Description                            |
|--------------|------------------|----------------------------------------|
| `id`         | `number`         |                                        |
| `ip`         | `string`         |                                        |
| `alias`      | `string \| null` |                                        |
| `port`       | `number`         |                                        |
| `notes`      | `string \| null` |                                        |
| `is_default` | `boolean`        | Whether this is the primary allocation |

---

[← Schedules](./schedules.md) · [Subusers →](./subusers.md)
