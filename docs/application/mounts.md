# Mounts

[← Docs](../README.md) · [← Database Hosts](./database-hosts.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.mounts`.

Mounts are filesystem bind mounts that make host paths available inside server containers. They can be scoped to
specific eggs, nodes, or servers.

---

## Methods

| Method                                             | Description                                 |
|----------------------------------------------------|---------------------------------------------|
| [`list(params?)`](#listparams)                     | Paginated list of mounts                    |
| [`get(mountId, include?)`](#getmountid-include)    | Get a mount by ID                           |
| [`create(params)`](#createparams)                  | Create a mount                              |
| [`update(mountId, params)`](#updatemountid-params) | Update a mount                              |
| [`delete(mountId)`](#deletemountid)                | Delete a mount                              |
| [Egg relationships](#egg-relationships)            | `listEggs`, `addEggs`, `removeEgg`          |
| [Node relationships](#node-relationships)          | `listNodes`, `addNodes`, `removeNode`       |
| [Server relationships](#server-relationships)      | `listServers`, `addServers`, `removeServer` |

---

### `list(params?)`

```typescript
pelican.application.mounts.list(params?: {
  page?: number
  per_page?: number
  'filter[uuid]'?: string
  'filter[name]'?: string
}): Promise<{ data: Mount[]; meta: { pagination: Pagination } }>
```

---

### `get(mountId, include?)`

```typescript
pelican.application.mounts.get(mountId: number, include?: string): Promise<Mount>
```

---

### `create(params)`

```typescript
pelican.application.mounts.create(params: {
  name: string
  source: string             // absolute path on the host
  target: string             // absolute path inside the container
  description?: string | null
  read_only?: boolean        // default: false
  user_mountable?: boolean   // whether users can attach it themselves
}): Promise<Mount>
```

```typescript
const mount = await pelican.application.mounts.create({
  name: 'Shared Configs',
  source: '/mnt/shared/configs',
  target: '/mnt/configs',
  read_only: true,
})
```

---

### `update(mountId, params)`

```typescript
pelican.application.mounts.update(mountId: number, params: {
  name?: string
  source?: string
  target?: string
  description?: string | null
  read_only?: boolean
  user_mountable?: boolean
}): Promise<Mount>
```

---

### `delete(mountId)`

```typescript
pelican.application.mounts.delete(mountId: number): Promise<void>
```

> Fails if the mount still has servers attached. Remove all servers first.

---

### Egg relationships

Control which eggs can use a mount.

```typescript
pelican.application.mounts.listEggs(mountId: number, include?: string): Promise<Egg[]>
pelican.application.mounts.addEggs(mountId: number, eggs: number[]): Promise<Mount>
pelican.application.mounts.removeEgg(mountId: number, eggId: number): Promise<void>
```

```typescript
// Allow this mount on Minecraft eggs
await pelican.application.mounts.addEggs(1, [3, 4])
// Revoke access for one egg
await pelican.application.mounts.removeEgg(1, 4)
```

---

### Node relationships

Control which nodes a mount is available on.

```typescript
pelican.application.mounts.listNodes(mountId: number, include?: string): Promise<Node[]>
pelican.application.mounts.addNodes(mountId: number, nodes: number[]): Promise<Mount>
pelican.application.mounts.removeNode(mountId: number, nodeId: number): Promise<void>
```

---

### Server relationships

Attach a mount directly to specific servers.

```typescript
pelican.application.mounts.listServers(mountId: number, include?: string): Promise<ApplicationServer[]>
pelican.application.mounts.addServers(mountId: number, servers: number[]): Promise<Mount>
pelican.application.mounts.removeServer(mountId: number, serverId: number): Promise<void>
```

---

## `Mount` type

| Field            | Type             | Description          |
|------------------|------------------|----------------------|
| `id`             | `number`         |                      |
| `uuid`           | `string`         |                      |
| `name`           | `string`         |                      |
| `description`    | `string \| null` |                      |
| `source`         | `string`         | Host filesystem path |
| `target`         | `string`         | Container path       |
| `read_only`      | `boolean`        |                      |
| `user_mountable` | `boolean`        |                      |
| `created_at`     | `string`         | ISO 8601             |
| `updated_at`     | `string`         | ISO 8601             |

---

[← Database Hosts](./database-hosts.md) · [Roles →](./roles.md)
