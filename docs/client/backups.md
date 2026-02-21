# Backups

[← Docs](../README.md) · [← Subusers](./subusers.md) · Client API

> Access via `pelican.client.server(uuid).backups`.

Create, restore, download, and manage server backups.

---

## Methods

| Method                                                     | Permission        | Description            |
|------------------------------------------------------------|-------------------|------------------------|
| [`list(perPage?)`](#listperpage)                           | `backup.read`     | List backups           |
| [`get(backupUuid)`](#getbackupuuid)                        | `backup.read`     | Get a single backup    |
| [`create(params?)`](#createparams)                         | `backup.create`   | Create a backup        |
| [`getDownloadUrl(backupUuid)`](#getdownloadurlbackupuuid)  | `backup.download` | Signed download URL    |
| [`restore(backupUuid, params)`](#restorebackupuuid-params) | `backup.restore`  | Restore a backup       |
| [`rename(backupUuid, name)`](#renamebackupuuid-name)       | `backup.delete`   | Rename a backup        |
| [`toggleLock(backupUuid)`](#togglelockbackupuuid)          | `backup.delete`   | Lock / unlock a backup |
| [`delete(backupUuid)`](#deletebackupuuid)                  | `backup.delete`   | Delete a backup        |

---

### `list(perPage?)`

```typescript
srv.backups.list(perPage?: number): Promise<{
  data: Backup[]
  meta: { pagination: Pagination }
}>
```

```typescript
const { data: backups } = await srv.backups.list(20)
```

---

### `get(backupUuid)`

```typescript
srv.backups.get(backupUuid: string): Promise<Backup>
```

---

### `create(params?)`

Creates a new backup. All parameters are optional.

```typescript
srv.backups.create(params?: {
  name?: string
  ignored_files?: string[]   // glob patterns to exclude
  is_locked?: boolean
}): Promise<Backup>
```

```typescript
// Quick backup
const backup = await srv.backups.create()

// Named, locked backup with exclusions
const backup = await srv.backups.create({
  name: 'Before major update',
  ignored_files: ['logs/*', 'cache/*'],
  is_locked: true,
})
```

---

### `getDownloadUrl(backupUuid)`

Returns a signed URL for downloading the backup directly from Wings. Valid for **15 minutes**.

```typescript
srv.backups.getDownloadUrl(backupUuid: string): Promise<string>
```

---

### `restore(backupUuid, params)`

Restores a backup to the server.

```typescript
srv.backups.restore(backupUuid: string, params: {
  truncate?: boolean   // delete all server files before restoring; default: false
}): Promise<void>
```

> The server must be offline before restoring. Use `srv.sendPower('stop')` first.

---

### `rename(backupUuid, name)`

```typescript
srv.backups.rename(backupUuid: string, name: string): Promise<Backup>
```

---

### `toggleLock(backupUuid)`

Toggles the lock on a backup. Locked backups cannot be deleted until unlocked.

```typescript
srv.backups.toggleLock(backupUuid: string): Promise<Backup>
```

```typescript
// Lock a backup
let backup = await srv.backups.create({ name: 'Important', is_locked: true })

// Toggle (now unlocked)
backup = await srv.backups.toggleLock(backup.uuid)
```

---

### `delete(backupUuid)`

Permanently deletes a backup. Fails if the backup is locked.

```typescript
srv.backups.delete(backupUuid: string): Promise<void>
```

---

## `Backup` type

| Field           | Type             | Description                               |
|-----------------|------------------|-------------------------------------------|
| `uuid`          | `string`         |                                           |
| `is_successful` | `boolean`        | Whether the backup completed successfully |
| `is_locked`     | `boolean`        |                                           |
| `name`          | `string`         |                                           |
| `ignored_files` | `string[]`       | Excluded glob patterns                    |
| `checksum`      | `string \| null` | SHA-256 of the archive                    |
| `bytes`         | `number`         | Archive size in bytes                     |
| `created_at`    | `string`         | ISO 8601                                  |
| `completed_at`  | `string \| null` | ISO 8601; null while in progress          |

---

[← Subusers](./subusers.md) · [Startup →](./startup.md)
