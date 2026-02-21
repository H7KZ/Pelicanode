# Error Handling

[← Docs](../README.md) · [Getting Started](./getting-started.md)

---

All non-2xx responses throw a `PelicanError`. Import it alongside `Pelicanode` to type-check errors:

```typescript
import { Pelicanode, PelicanError } from 'pelicanode'
```

---

## `PelicanError`

| Property  | Type                | Description                                               |
|-----------|---------------------|-----------------------------------------------------------|
| `status`  | `number`            | HTTP status code (e.g. `404`, `422`)                      |
| `errors`  | `PelicanApiError[]` | Structured error objects from the API                     |
| `message` | `string`            | First error's `detail`, or `"HTTP {status}"` if no errors |

### `PelicanApiError`

| Property        | Type     | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `code`          | `string` | Machine-readable error code, e.g. `"NotFound"`   |
| `status`        | `string` | HTTP status as a string, e.g. `"404"`            |
| `detail`        | `string` | Human-readable description                       |
| `source?.field` | `string` | The request field that caused a validation error |
| `meta`          | `object` | Additional error metadata (varies)               |

---

## Basic usage

```typescript
try {
  const server = await pelican.application.servers.get(99999)
} catch (err) {
  if (err instanceof PelicanError) {
    console.error(`HTTP ${err.status}`)           // HTTP 404
    console.error(err.message)                    // "No query results for model"

    for (const e of err.errors) {
      console.error(`[${e.code}] ${e.detail}`)
    }
  } else {
    throw err  // re-throw non-API errors (network failures, etc.)
  }
}
```

---

## Validation errors (422)

When a request body fails validation, the API returns HTTP 422 with one error object per invalid field. Each error's
`source.field` names the offending field:

```typescript
try {
  await pelican.application.users.create({ email: 'not-an-email', username: '' })
} catch (err) {
  if (err instanceof PelicanError && err.status === 422) {
    for (const e of err.errors) {
      console.error(`${e.source?.field}: ${e.detail}`)
      // email: The email must be a valid email address.
      // username: The username field is required.
    }
  }
}
```

---

## Common status codes

| Status | Meaning                                                                    |
|--------|----------------------------------------------------------------------------|
| `401`  | Missing or invalid API key                                                 |
| `403`  | Valid key but insufficient permissions (e.g. subuser missing a permission) |
| `404`  | Resource not found                                                         |
| `409`  | Conflict — e.g. deleting a node that still has servers                     |
| `422`  | Validation failed — check `err.errors` for field details                   |
| `502`  | Server is offline (e.g. `sendCommand` on a stopped server)                 |

---

## Network errors

Non-API errors (DNS failure, connection refused, timeout) are thrown as plain `Error` objects — not `PelicanError`.
Always check `instanceof PelicanError` before assuming you have a structured error.

```typescript
try {
  await pelican.application.nodes.list()
} catch (err) {
  if (err instanceof PelicanError) {
    // API responded with an error
  } else {
    // Network or unexpected error
    console.error('Network error:', err)
  }
}
```

---

[← Getting Started](./getting-started.md) · [Application API →](../application/users.md)
