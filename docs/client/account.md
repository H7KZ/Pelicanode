# Account

[← Docs](../README.md) · Client API

> Requires an **account** API key. Access via `pelican.client.account`.

Manage the authenticated user's profile, API keys, SSH keys, and activity logs.

---

## Methods

| Method                                                     | Description             |
|------------------------------------------------------------|-------------------------|
| [`get()`](#get)                                            | Get account details     |
| [`updateUsername(params)`](#updateusernameparams)          | Update username         |
| [`updateEmail(params)`](#updateemailparams)                | Update email address    |
| [`updatePassword(params)`](#updatepasswordparams)          | Update password         |
| [`listActivity(params?)`](#listactivityparams)             | Paginated activity logs |
| [`apiKeys.list()`](#apikeyslist)                           | List API keys           |
| [`apiKeys.create(params)`](#apikeysstoreparams)            | Create an API key       |
| [`apiKeys.delete(identifier)`](#apikeysdeleteidentifier)   | Delete an API key       |
| [`sshKeys.list()`](#sshkeyslist)                           | List SSH keys           |
| [`sshKeys.create(params)`](#sshkeyscreateparams)           | Add an SSH key          |
| [`sshKeys.delete(fingerprint)`](#sshkeysdeletefingerprint) | Remove an SSH key       |

---

### `get()`

Returns the authenticated user's account details.

```typescript
pelican.client.account.get(): Promise<ClientUser>
```

```typescript
const me = await pelican.client.account.get()
console.log(me.email, me.username)
```

---

### `updateUsername(params)`

```typescript
pelican.client.account.updateUsername(params: {
  username: string
  password: string    // current password required for confirmation
}): Promise<void>
```

> Not available for externally-managed accounts.

---

### `updateEmail(params)`

```typescript
pelican.client.account.updateEmail(params: {
  email: string
  password: string    // current password required for confirmation
}): Promise<void>
```

> Not available for externally-managed accounts.

---

### `updatePassword(params)`

```typescript
pelican.client.account.updatePassword(params: {
  current_password: string
  password: string
  password_confirmation: string
}): Promise<void>
```

> All other active sessions are invalidated immediately after a successful password change. Not available for
> externally-managed accounts.

---

### `listActivity(params?)`

```typescript
pelican.client.account.listActivity(params?: {
  page?: number
  per_page?: number    // default 25
  'filter[event]'?: string   // partial match on event name
  sort?: 'timestamp' | '-timestamp'
}): Promise<{ data: ActivityLog[]; meta: { pagination: Pagination } }>
```

---

### `apiKeys.list()`

```typescript
pelican.client.account.apiKeys.list(): Promise<ApiKey[]>
```

---

### `apiKeys.create(params)`

```typescript
pelican.client.account.apiKeys.create(params: {
  description: string
  allowed_ips?: string[]   // IP addresses or CIDR ranges; empty = any IP allowed
}): Promise<ApiKeyWithSecret>
```

> **`secret_token` is shown exactly once.** Store it immediately — it cannot be retrieved again.

```typescript
const key = await pelican.client.account.apiKeys.create({
  description: 'Automation bot',
  allowed_ips: ['10.0.0.0/8'],
})

console.log(key.secret_token)  // save this now — only shown on creation
console.log(key.identifier)    // use this to delete the key later
```

---

### `apiKeys.delete(identifier)`

```typescript
pelican.client.account.apiKeys.delete(identifier: string): Promise<void>
```

The `identifier` is the short key prefix returned by `list()` and `create()`, **not** the secret token.

---

### `sshKeys.list()`

```typescript
pelican.client.account.sshKeys.list(): Promise<SshKey[]>
```

---

### `sshKeys.create(params)`

```typescript
pelican.client.account.sshKeys.create(params: {
  name: string        // friendly label
  public_key: string  // OpenSSH or PEM format
}): Promise<SshKey>
```

Supported key types: **RSA** (≥ 2048 bits), **Ed25519**, **ECDSA**. DSA keys are rejected.

```typescript
await pelican.client.account.sshKeys.create({
  name: 'My MacBook',
  public_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... user@host',
})
```

---

### `sshKeys.delete(fingerprint)`

```typescript
pelican.client.account.sshKeys.delete(fingerprint: string): Promise<void>
```

The `fingerprint` is the SHA-256 fingerprint as returned by `list()`.

---

## Types

### `ClientUser`

| Field        | Type      | Description                           |
|--------------|-----------|---------------------------------------|
| `id`         | `number`  |                                       |
| `admin`      | `boolean` | Whether this account has admin access |
| `username`   | `string`  |                                       |
| `email`      | `string`  |                                       |
| `first_name` | `string`  |                                       |
| `last_name`  | `string`  |                                       |
| `language`   | `string`  |                                       |

### `ApiKey`

| Field          | Type             | Description      |
|----------------|------------------|------------------|
| `identifier`   | `string`         | Short key prefix |
| `description`  | `string`         |                  |
| `allowed_ips`  | `string[]`       |                  |
| `last_used_at` | `string \| null` | ISO 8601         |
| `created_at`   | `string`         | ISO 8601         |

### `ApiKeyWithSecret`

Extends `ApiKey` with:

| Field          | Type     | Description                                    |
|----------------|----------|------------------------------------------------|
| `secret_token` | `string` | Full key secret — **only present on creation** |

### `SshKey`

| Field         | Type     | Description         |
|---------------|----------|---------------------|
| `name`        | `string` |                     |
| `fingerprint` | `string` | SHA-256 fingerprint |
| `public_key`  | `string` |                     |
| `created_at`  | `string` | ISO 8601            |

---

[← Docs](../README.md) · [Server →](./server.md)
