# Databases

[← Docs](../README.md) · [← Files](./files.md) · Client API

> Access via `pelican.client.server(uuid).databases`.

Create and manage MySQL/MariaDB databases for a server. For admin-level database management
see [Server Databases](../application/server-databases.md).

---

## Methods

| Method                                                    | Permission        | Description           |
|-----------------------------------------------------------|-------------------|-----------------------|
| [`list(include?)`](#listinclude)                          | `database.read`   | List server databases |
| [`create(params)`](#createparams)                         | `database.create` | Create a database     |
| [`rotatePassword(databaseId)`](#rotatepassworddatabaseid) | `database.update` | Rotate password       |
| [`delete(databaseId)`](#deletedatabaseid)                 | `database.delete` | Delete a database     |

---

### `list(include?)`

```typescript
srv.databases.list(include?: string): Promise<ClientDatabase[]>
```

Pass `include: 'password'` to include the current database password in the response.

```typescript
const dbs = await srv.databases.list()
const dbsWithPasswords = await srv.databases.list('password')
```

---

### `create(params)`

Creates a new database. The password is included in the response and is **only shown once**.

```typescript
srv.databases.create(params: {
  database: string   // name suffix (3–48 chars, letters/numbers/underscore/hyphen)
  remote: string     // allowed connection host; '%' for any host, or specific IP/pattern
}): Promise<ClientDatabase & { password?: string }>
```

```typescript
const db = await srv.databases.create({ database: 'gamedb', remote: '%' })
console.log(db.password)  // save this — only returned on creation
console.log(db.id)        // use this string ID for subsequent operations
```

---

### `rotatePassword(databaseId)`

Generates a new random password for the database. The new password is returned in the response.

```typescript
srv.databases.rotatePassword(databaseId: string): Promise<ClientDatabase & { password?: string }>
```

---

### `delete(databaseId)`

Permanently drops the database from both the panel and the database host.

```typescript
srv.databases.delete(databaseId: string): Promise<void>
```

---

## `ClientDatabase` type

| Field              | Type                                | Description                             |
|--------------------|-------------------------------------|-----------------------------------------|
| `id`               | `string`                            |                                         |
| `host`             | `{ address: string; port: number }` | Database server connection              |
| `name`             | `string`                            | Full database name (with server prefix) |
| `username`         | `string`                            |                                         |
| `connections_from` | `string`                            | Allowed connection host                 |
| `max_connections`  | `number`                            |                                         |

---

[← Files](./files.md) · [Schedules →](./schedules.md)
