# Plugins

[← Docs](../README.md) · [← Roles](./roles.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.plugins`.

Manage panel plugins — list available plugins, install, enable/disable, and import from URL or file.

---

## Methods

| Method                                                                | Description                           |
|-----------------------------------------------------------------------|---------------------------------------|
| [`list(params?)`](#listparams)                                        | Paginated list of plugins             |
| [`get(pluginId)`](#getpluginid)                                       | Get a plugin by ID                    |
| [`install(pluginId)`](#installpluginid)                               | Install a plugin                      |
| [`update(pluginId)`](#updatepluginid)                                 | Update a plugin to its latest version |
| [`uninstall(pluginId, deleteFiles?)`](#uninstallpluginid-deletefiles) | Uninstall a plugin                    |
| [`enable(pluginId)`](#enablepluginid)                                 | Enable a plugin                       |
| [`disable(pluginId)`](#disablepluginid)                               | Disable a plugin                      |
| [`importFromUrl(url)`](#importfromurlurl)                             | Import a plugin from a URL            |
| [`importFromFile(file, filename?)`](#importfromfilefile-filename)     | Import a plugin from a file           |

---

### `list(params?)`

```typescript
pelican.application.plugins.list(params?: {
  page?: number
  per_page?: number
  'filter[name]'?: string
  'filter[author]'?: string
}): Promise<{ data: Plugin[]; meta: { pagination: Pagination } }>
```

---

### `get(pluginId)`

```typescript
pelican.application.plugins.get(pluginId: number): Promise<Plugin>
```

---

### `install(pluginId)`

Installs a plugin. The plugin must be in the `NotInstalled` state.

```typescript
pelican.application.plugins.install(pluginId: number): Promise<Plugin>
```

---

### `update(pluginId)`

Downloads and installs the latest version of an installed plugin.

```typescript
pelican.application.plugins.update(pluginId: number): Promise<Plugin>
```

---

### `uninstall(pluginId, deleteFiles?)`

```typescript
pelican.application.plugins.uninstall(
  pluginId: number,
  deleteFiles?: boolean   // default: false — set true to also remove plugin files from disk
): Promise<Plugin>
```

---

### `enable(pluginId)` / `disable(pluginId)`

```typescript
pelican.application.plugins.enable(pluginId: number): Promise<Plugin>
pelican.application.plugins.disable(pluginId: number): Promise<Plugin>
```

---

### `importFromUrl(url)`

Downloads and registers a plugin from a remote `.zip` URL.

```typescript
pelican.application.plugins.importFromUrl(url: string): Promise<void>
```

---

### `importFromFile(file, filename?)`

Uploads a plugin archive from a local `Buffer` or `Blob`.

```typescript
pelican.application.plugins.importFromFile(
  file: Buffer | Blob,
  filename?: string   // default: 'plugin.zip'
): Promise<void>
```

```typescript
import { readFileSync } from 'fs'

const file = readFileSync('./my-plugin.zip')
await pelican.application.plugins.importFromFile(file, 'my-plugin.zip')
```

---

## `Plugin` type

| Field         | Type             | Description |
|---------------|------------------|-------------|
| `id`          | `number`         |             |
| `name`        | `string`         |             |
| `description` | `string \| null` |             |
| `author`      | `string`         |             |
| `version`     | `string`         |             |
| `enabled`     | `boolean`        |             |
| `installed`   | `boolean`        |             |
| `created_at`  | `string`         | ISO 8601    |
| `updated_at`  | `string`         | ISO 8601    |

---

[← Roles](./roles.md) · [Client API →](../client/account.md)
