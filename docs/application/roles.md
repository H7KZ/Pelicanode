# Roles

[← Docs](../README.md) · [← Mounts](./mounts.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.roles`.

Administrative roles can be assigned to users to grant them elevated panel permissions. Roles are assigned via [
`users.assignRoles`](./users.md#assignrolesuserid-params).

---

## Methods

| Method                                           | Description             |
|--------------------------------------------------|-------------------------|
| [`list(params?)`](#listparams)                   | Paginated list of roles |
| [`get(roleId)`](#getroleid)                      | Get a role by ID        |
| [`create(params)`](#createparams)                | Create a role           |
| [`update(roleId, params)`](#updateroleid-params) | Update a role           |
| [`delete(roleId)`](#deleteroleid)                | Delete a role           |

---

### `list(params?)`

```typescript
pelican.application.roles.list(params?: {
  page?: number
  per_page?: number
}): Promise<{ data: Role[]; meta: { pagination: Pagination } }>
```

---

### `get(roleId)`

```typescript
pelican.application.roles.get(roleId: number): Promise<Role>
```

---

### `create(params)`

```typescript
pelican.application.roles.create(params: {
  name: string
  description?: string | null
}): Promise<Role>
```

---

### `update(roleId, params)`

```typescript
pelican.application.roles.update(roleId: number, params: {
  name?: string
  description?: string | null
}): Promise<Role>
```

---

### `delete(roleId)`

```typescript
pelican.application.roles.delete(roleId: number): Promise<void>
```

---

## `Role` type

| Field         | Type             | Description |
|---------------|------------------|-------------|
| `id`          | `number`         |             |
| `name`        | `string`         |             |
| `description` | `string \| null` |             |
| `created_at`  | `string`         | ISO 8601    |
| `updated_at`  | `string`         | ISO 8601    |

---

[← Mounts](./mounts.md) · [Plugins →](./plugins.md)
