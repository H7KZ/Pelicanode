# Subusers

[← Docs](../README.md) · [← Network](./network.md) · Client API

> Access via `pelican.client.server(uuid).subusers`.

Grant other panel users access to a server with a specific set of permissions.

---

## Methods

| Method                                               | Permission    | Description            |
|------------------------------------------------------|---------------|------------------------|
| [`list()`](#list)                                    | `user.read`   | List all subusers      |
| [`get(userUuid)`](#getuser-uuid)                     | `user.read`   | Get a specific subuser |
| [`create(params)`](#createparams)                    | `user.create` | Add a subuser          |
| [`update(userUuid, params)`](#updateuseruuid-params) | `user.update` | Update permissions     |
| [`delete(userUuid)`](#deleteuseruuid)                | `user.delete` | Remove a subuser       |

---

### `list()`

```typescript
srv.subusers.list(): Promise<Subuser[]>
```

---

### `get(userUuid)`

```typescript
srv.subusers.get(userUuid: string): Promise<Subuser>
```

---

### `create(params)`

Grants a panel user access to the server. The user must already have a panel account.

```typescript
srv.subusers.create(params: {
  email: string            // email of the user to add
  permissions: string[]    // see Permissions reference
}): Promise<Subuser>
```

```typescript
const subuser = await srv.subusers.create({
  email: 'friend@example.com',
  permissions: [
    'control.start',
    'control.stop',
    'control.restart',
    'control.console',
    'file.read',
    'file.create',
    'file.update',
  ],
})
```

For all available permission keys see the [Permissions reference](../README.md#subuser-permissions) or call
`pelican.client.listPermissions()`.

---

### `update(userUuid, params)`

Replaces the subuser's permissions entirely.

```typescript
srv.subusers.update(userUuid: string, params: {
  permissions: string[]
}): Promise<Subuser>
```

---

### `delete(userUuid)`

Removes the user's access to the server.

```typescript
srv.subusers.delete(userUuid: string): Promise<void>
```

---

## `Subuser` type

| Field         | Type       | Description             |
|---------------|------------|-------------------------|
| `uuid`        | `string`   |                         |
| `username`    | `string`   |                         |
| `email`       | `string`   |                         |
| `image`       | `string`   | Avatar URL              |
| `2fa_enabled` | `boolean`  |                         |
| `permissions` | `string[]` | Current permission keys |
| `created_at`  | `string`   | ISO 8601                |

---

[← Network](./network.md) · [Backups →](./backups.md)
