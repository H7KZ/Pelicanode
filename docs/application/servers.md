# Servers

[← Docs](../README.md) · [← Allocations](./allocations.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.servers`.

Create and fully manage game servers — from provisioning to transfer to deletion.

---

## Methods

| Method                                                             | Description                              |
|--------------------------------------------------------------------|------------------------------------------|
| [`list(params?)`](#listparams)                                     | Paginated list of all servers            |
| [`get(serverId, include?)`](#getserverid-include)                  | Get a server by ID                       |
| [`getByExternalId(id, include?)`](#getbyexternalidid-include)      | Get a server by external ID              |
| [`create(params)`](#createparams)                                  | Create a new server                      |
| [`updateDetails(serverId, params)`](#updatedetailsserverid-params) | Update name, owner, description          |
| [`updateBuild(serverId, params)`](#updatebuildserverid-params)     | Update resource limits and allocations   |
| [`updateStartup(serverId, params)`](#updatestartupserverid-params) | Update startup config, egg, environment  |
| [`suspend(serverId)`](#suspendserverid)                            | Suspend a server                         |
| [`unsuspend(serverId)`](#unsuspendserverid)                        | Unsuspend a server                       |
| [`reinstall(serverId)`](#reinstallserverid)                        | Queue server for reinstall               |
| [`startTransfer(serverId, params)`](#starttransferserverid-params) | Transfer to a different node             |
| [`cancelTransfer(serverId)`](#canceltransferserverid)              | Cancel an in-progress transfer           |
| [`delete(serverId)`](#deleteserverid)                              | Delete a server                          |
| [`forceDelete(serverId)`](#forcedeleteserverid)                    | Force-delete even if node is unreachable |

---

### `list(params?)`

```typescript
pelican.application.servers.list(params?: {
  page?: number
  per_page?: number
  sort?: string              // 'id' | 'uuid' (prefix with - for desc)
  include?: string
  'filter[uuid]'?: string
  'filter[uuid_short]'?: string
  'filter[name]'?: string
  'filter[description]'?: string
  'filter[image]'?: string
  'filter[external_id]'?: string
}): Promise<{ data: ApplicationServer[]; meta: { pagination: Pagination } }>
```

---

### `get(serverId, include?)`

```typescript
pelican.application.servers.get(serverId: number, include?: string): Promise<ApplicationServer>
```

---

### `getByExternalId(id, include?)`

```typescript
pelican.application.servers.getByExternalId(externalId: string, include?: string): Promise<ApplicationServer>
```

---

### `create(params)`

Use either `allocation` (manual placement) **or** `deploy` (automatic placement) — they are mutually exclusive.

```typescript
pelican.application.servers.create(params: {
  name: string
  user: number                          // user ID of the server owner
  egg: number                           // egg ID
  environment: Record<string, unknown>  // egg startup variables
  external_id?: string | null
  description?: string | null
  docker_image?: string                 // overrides the egg default
  startup?: string                      // overrides the egg startup command
  skip_scripts?: boolean
  oom_killer?: boolean
  start_on_completion?: boolean
  limits?: {
    memory: number    // MB; 0 = unlimited
    swap: number      // MB; -1 = unlimited, 0 = disabled
    disk: number      // MB; 0 = unlimited
    io: number        // 10–1000 (block IO weight)
    cpu: number       // CPU % (100 = 1 core)
    threads?: string | null
  }
  feature_limits?: {
    databases?: number | null
    allocations?: number | null
    backups?: number | null
  }
  // --- Manual placement ---
  allocation?: {
    default: number       // allocation ID
    additional?: number[] // extra allocation IDs
  }
  // --- Automatic placement ---
  deploy?: {
    tags?: string[]
    dedicated_ip?: boolean
    port_range?: string[]
  }
}): Promise<ApplicationServer>
```

```typescript
// Manual placement
const server = await pelican.application.servers.create({
  name: 'Survival SMP',
  user: 1,
  egg: 3,
  environment: {
    SERVER_JARFILE: 'server.jar',
    MC_VERSION: 'latest',
  },
  limits: { memory: 4096, swap: 0, disk: 51200, io: 500, cpu: 200 },
  feature_limits: { databases: 2, backups: 10 },
  allocation: { default: 42 },
})

// Auto placement
const server = await pelican.application.servers.create({
  name: 'Auto-placed Server',
  user: 1,
  egg: 3,
  environment: { SERVER_JARFILE: 'server.jar' },
  deploy: { tags: ['us-east'], port_range: ['25565-25600'] },
})
```

---

### `updateDetails(serverId, params)`

Updates the server's metadata. All fields are optional.

```typescript
pelican.application.servers.updateDetails(serverId: number, params: {
  name?: string
  user?: number               // change owner
  description?: string | null
  external_id?: string | null
}): Promise<ApplicationServer>
```

---

### `updateBuild(serverId, params)`

Updates resource limits and allocation assignments.

```typescript
pelican.application.servers.updateBuild(serverId: number, params: {
  allocation?: number          // change primary allocation
  oom_killer?: boolean
  limits?: {
    memory?: number
    swap?: number
    disk?: number
    io?: number
    cpu?: number
    threads?: string | null
  }
  feature_limits?: {
    databases?: number | null
    allocations?: number | null
    backups?: number | null
  }
  add_allocations?: number[]    // add extra allocation IDs
  remove_allocations?: number[] // remove extra allocation IDs
}): Promise<ApplicationServer>
```

---

### `updateStartup(serverId, params)`

Updates the startup command, environment variables, egg, or Docker image.

```typescript
pelican.application.servers.updateStartup(serverId: number, params: {
  startup?: string
  environment?: Record<string, unknown>
  egg?: number
  image?: string
  skip_scripts?: boolean
}): Promise<ApplicationServer>
```

---

### `suspend(serverId)` / `unsuspend(serverId)`

```typescript
pelican.application.servers.suspend(serverId: number): Promise<void>
pelican.application.servers.unsuspend(serverId: number): Promise<void>
```

Suspended servers are inaccessible to their owners. The server process is stopped if running.

---

### `reinstall(serverId)`

```typescript
pelican.application.servers.reinstall(serverId: number): Promise<void>
```

Marks the server for reinstallation. The egg's install script is re-run on the next Wings sync. **All server data may be
wiped** depending on the egg's install script.

---

### `startTransfer(serverId, params)`

```typescript
pelican.application.servers.startTransfer(serverId: number, params: {
  node_id: number
  allocation_id: number          // allocation on the target node
  additional_allocations?: number[]
}): Promise<void>
```

> Returns `406` if the server is already transferring or the target is not suitable.

---

### `cancelTransfer(serverId)`

```typescript
pelican.application.servers.cancelTransfer(serverId: number): Promise<void>
```

> Returns `406` if there is no active transfer.

---

### `delete(serverId)`

```typescript
pelican.application.servers.delete(serverId: number): Promise<void>
```

Gracefully deletes a server. Fails if the daemon is unreachable — use `forceDelete` in that case.

---

### `forceDelete(serverId)`

```typescript
pelican.application.servers.forceDelete(serverId: number): Promise<void>
```

Deletes the server record immediately, skipping the daemon. Use when a node is permanently offline.

---

## `ApplicationServer` type

| Field            | Type                            | Description           |
|------------------|---------------------------------|-----------------------|
| `id`             | `number`                        |                       |
| `external_id`    | `string \| null`                |                       |
| `uuid`           | `string`                        |                       |
| `identifier`     | `string`                        | Short 8-char ID       |
| `name`           | `string`                        |                       |
| `description`    | `string`                        |                       |
| `status`         | [`ServerStatus`](#serverstatus) |                       |
| `limits`         | `ServerLimits`                  | Resource limits       |
| `feature_limits` | `ServerFeatureLimits`           |                       |
| `user`           | `number`                        | Owner user ID         |
| `node`           | `number`                        | Node ID               |
| `allocation`     | `number`                        | Primary allocation ID |
| `egg`            | `number`                        | Egg ID                |
| `container`      | `ServerContainer`               | Docker startup info   |
| `created_at`     | `string`                        | ISO 8601              |
| `updated_at`     | `string`                        | ISO 8601              |

### `ServerStatus`

```typescript
type ServerStatus =
  | 'installing'
  | 'running'
  | 'suspended'
  | 'stopping'
  | 'stopped'
  | 'install_failed'
  | 'reinstall_failed'
  | 'restoring_backup'
  | 'transferring'
  | null   // fully installed and idle
```

---

[← Allocations](./allocations.md) · [Server Databases →](./server-databases.md)
