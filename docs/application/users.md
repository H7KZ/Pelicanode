# Users

[← Docs](../README.md) · Application API

> Requires an **admin** API key. Access via `pelican.application.users`.

Manage panel users — create accounts, update credentials, and assign roles.

---

## Methods

| Method                                                        | Description                 |
|---------------------------------------------------------------|-----------------------------|
| [`list(params?)`](#listparams)                                | Paginated list of all users |
| [`get(userId, include?)`](#getuserid-include)                 | Get a user by ID            |
| [`getByExternalId(id, include?)`](#getbyexternalidid-include) | Get a user by external ID   |
| [`create(params)`](#createparams)                             | Create a new user           |
| [`update(userId, params)`](#updateuserid-params)              | Update a user               |
| [`delete(userId)`](#deleteuserid)                             | Delete a user               |
| [`assignRoles(userId, params)`](#assignrolesuserid-params)    | Assign roles to a user      |
| [`removeRoles(userId, params)`](#removerolesuserid-params)    | Remove roles from a user    |

---

### `list(params?)`

Returns a paginated list of all users.

```typescript
pelican.application.users.list(params?: {
  page?: number
  per_page?: number          // max 100, default 50
  sort?: string              // 'id' | 'uuid' | '-id' | '-uuid'
  include?: string           // e.g. 'servers,roles'
  'filter[email]'?: string
  'filter[uuid]'?: string
  'filter[username]'?: string
  'filter[external_id]'?: string
}): Promise<{ data: ApplicationUser[]; meta: { pagination: Pagination } }>
```

```typescript
const { data: users, meta } = await pelican.application.users.list({
  'filter[email]': '@example.com',
  sort: '-id',
  per_page: 25,
})
console.log(`Page 1 of ${meta.pagination.total_pages}`)
```

---

### `get(userId, include?)`

```typescript
pelican.application.users.get(userId: number, include?: string): Promise<ApplicationUser>
```

```typescript
const user = await pelican.application.users.get(1)
const userWithRelations = await pelican.application.users.get(1, 'servers,roles')
```

---

### `getByExternalId(id, include?)`

Look up a user using a third-party system's identifier (set via `external_id`).

```typescript
pelican.application.users.getByExternalId(externalId: string, include?: string): Promise<ApplicationUser>
```

```typescript
const user = await pelican.application.users.getByExternalId('discord-123456789')
```

---

### `create(params)`

```typescript
pelican.application.users.create(params: {
  email: string          // required
  username: string       // required
  password?: string      // required for standard accounts
  name_first?: string
  name_last?: string
  language?: string      // default: 'en'
  external_id?: string | null
  root_admin?: boolean   // default: false
}): Promise<ApplicationUser>
```

```typescript
const user = await pelican.application.users.create({
  email: 'alice@example.com',
  username: 'alice',
  password: 'SecurePass123!',
  name_first: 'Alice',
})
```

---

### `update(userId, params)`

All fields are optional — only the fields you provide are changed.

```typescript
pelican.application.users.update(userId: number, params: {
  email?: string
  username?: string
  password?: string
  name_first?: string
  name_last?: string
  language?: string
  external_id?: string | null
  root_admin?: boolean
}): Promise<ApplicationUser>
```

---

### `delete(userId)`

```typescript
pelican.application.users.delete(userId: number): Promise<void>
```

> Root admin accounts cannot be deleted.

---

### `assignRoles(userId, params)`

```typescript
pelican.application.users.assignRoles(userId: number, params: {
  roles: number[]   // role IDs — see Roles
}): Promise<ApplicationUser>
```

> Cannot assign roles to root admin accounts.

---

### `removeRoles(userId, params)`

```typescript
pelican.application.users.removeRoles(userId: number, params: {
  roles: number[]
}): Promise<ApplicationUser>
```

---

## `ApplicationUser` type

| Field         | Type             | Description            |
|---------------|------------------|------------------------|
| `id`          | `number`         |                        |
| `external_id` | `string \| null` | Third-party identifier |
| `uuid`        | `string`         |                        |
| `username`    | `string`         |                        |
| `email`       | `string`         |                        |
| `language`    | `string`         | e.g. `'en'`            |
| `root_admin`  | `boolean`        |                        |
| `2fa`         | `boolean`        | Whether 2FA is enabled |
| `created_at`  | `string`         | ISO 8601               |
| `updated_at`  | `string`         | ISO 8601               |

---

[← Docs](../README.md) · [Nodes →](./nodes.md)
