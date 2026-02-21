# Eggs

[← Docs](../README.md) · [← Server Databases](./server-databases.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.eggs`.

Eggs are server configuration templates that define the startup command, environment variables, Docker image, and
install script for a type of game server.

---

## Methods

| Method                                              | Description              |
|-----------------------------------------------------|--------------------------|
| [`list(params?)`](#listparams)                      | Paginated list of eggs   |
| [`get(eggId, params?)`](#geteggid-params)           | Get an egg by numeric ID |
| [`getByUuid(uuid, params?)`](#getbyuuiduuid-params) | Get an egg by UUID       |
| [`delete(eggId)`](#deleteeggid)                     | Delete by numeric ID     |
| [`deleteByUuid(uuid)`](#deletebyuuiduuid)           | Delete by UUID           |
| [`export(eggId)`](#exporteggid)                     | Export egg as YAML       |
| [`import(yaml)`](#importyaml)                       | Import egg from YAML     |

---

### `list(params?)`

```typescript
pelican.application.eggs.list(params?: {
  page?: number
  per_page?: number
  include?: string   // e.g. 'variables' to include startup variable definitions
}): Promise<{ data: Egg[]; meta: { pagination: Pagination } }>
```

---

### `get(eggId, params?)`

```typescript
pelican.application.eggs.get(eggId: number, params?: {
  include?: string
}): Promise<Egg>
```

```typescript
// Include startup variable definitions
const egg = await pelican.application.eggs.get(3, { include: 'variables' })
console.log(egg.startup)         // startup command template
console.log(egg.docker_images)   // available Docker images
```

---

### `getByUuid(uuid, params?)`

```typescript
pelican.application.eggs.getByUuid(uuid: string, params?: { include?: string }): Promise<Egg>
```

---

### `delete(eggId)` / `deleteByUuid(uuid)`

```typescript
pelican.application.eggs.delete(eggId: number): Promise<void>
pelican.application.eggs.deleteByUuid(uuid: string): Promise<void>
```

---

### `export(eggId)`

Returns the egg's full configuration as a YAML string. This can be shared or imported into another panel.

```typescript
pelican.application.eggs.export(eggId: number): Promise<string>
```

```typescript
import { writeFileSync } from 'fs'

const yaml = await pelican.application.eggs.export(3)
writeFileSync('my-egg.yaml', yaml)
```

---

### `import(yaml)`

Imports an egg from a YAML string. Accepts the same format that `export` produces.

```typescript
pelican.application.eggs.import(yaml: string): Promise<Egg>
```

```typescript
import { readFileSync } from 'fs'

const yaml = readFileSync('my-egg.yaml', 'utf-8')
const egg = await pelican.application.eggs.import(yaml)
```

---

## `Egg` type

| Field           | Type                     | Description                        |
|-----------------|--------------------------|------------------------------------|
| `id`            | `number`                 |                                    |
| `uuid`          | `string`                 |                                    |
| `name`          | `string`                 |                                    |
| `author`        | `string`                 | Author email                       |
| `description`   | `string \| null`         |                                    |
| `features`      | `string[] \| null`       |                                    |
| `docker_images` | `Record<string, string>` | Map of label → image               |
| `config`        | `object`                 | Files, startup, stop command, etc. |
| `startup`       | `string`                 | Startup command template           |
| `script`        | `EggScript`              | Install script details             |
| `created_at`    | `string`                 | ISO 8601                           |
| `updated_at`    | `string`                 | ISO 8601                           |

### `EggVariable` (when `include: 'variables'`)

| Field           | Type      | Description              |
|-----------------|-----------|--------------------------|
| `id`            | `number`  |                          |
| `egg_id`        | `number`  |                          |
| `name`          | `string`  | Display name             |
| `description`   | `string`  |                          |
| `env_variable`  | `string`  | Environment variable key |
| `default_value` | `string`  |                          |
| `user_viewable` | `boolean` |                          |
| `user_editable` | `boolean` |                          |
| `rules`         | `string`  | Laravel validation rules |

---

[← Server Databases](./server-databases.md) · [Database Hosts →](./database-hosts.md)
