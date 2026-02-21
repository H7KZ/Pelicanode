# Getting Started

[← Docs](../README.md)

---

## Installation

```bash
npm install pelicanode
# or
yarn add pelicanode
# or
pnpm add pelicanode
```

**Requirements:** Node.js 18 or later. The package is pure ESM.

---

## Creating a client

```typescript
import {Pelicanode} from 'pelicanode'

const pelican = new Pelicanode(
    'https://panel.example.com',  // your Pelican Panel URL
    'your-api-key'                // see Authentication below
)
```

The trailing slash is stripped automatically. The client is stateless — you can create one instance and reuse it
throughout your application.

---

## Authentication

Pelican uses two different key types for its two APIs:

| API                     | Key type            | Where to create          |
|-------------------------|---------------------|--------------------------|
| `pelican.application.*` | **Admin API key**   | Panel Admin → API Keys   |
| `pelican.client.*`      | **Account API key** | Panel Account → API Keys |

You can use a single `Pelicanode` instance for both APIs as long as the key belongs to an administrator — admin keys
work for both. If you only need the Client API, a regular account key is sufficient.

```typescript
// Admin key — can use both application.* and client.*
const admin = new Pelicanode('https://panel.example.com', 'ptla_...')

// Account key — client.* only
const user = new Pelicanode('https://panel.example.com', 'ptlc_...')
```

---

## Your first requests

### Application API

```typescript
// List all users
const {data: users, meta} = await pelican.application.users.list()
console.log(`${meta.pagination.total} users total`)

// Get a node by ID
const node = await pelican.application.nodes.get(1)
console.log(node.fqdn)

// Create a server
const server = await pelican.application.servers.create({
    name: 'My Server',
    user: 1,
    egg: 3,
    environment: {SERVER_JARFILE: 'server.jar'},
    limits: {memory: 1024, swap: 0, disk: 10240, io: 500, cpu: 100},
    allocation: {default: 1},
})
```

### Client API

```typescript
// List your servers
const {data: servers} = await pelican.client.listServers()

// Work with a specific server
const srv = pelican.client.server('a1b2c3d4-e5f6-...')

await srv.sendPower('start')
const stats = await srv.getResources()
const files = await srv.files.list('/')
```

> `pelican.client.server(uuid)` creates an API accessor each time it's called — there is no persistent connection.

---

## Pagination

Methods that return collections resolve to:

```typescript
{
    data: T[]
    meta: {
        pagination: {
            total: number
            count: number
            per_page: number
            current_page: number
            total_pages: number
            links: {
                previous: string | null;
                next: string | null
            }
        }
    }
}
```

All paginated methods accept `page` and `per_page`:

```typescript
const page1 = await pelican.application.users.list({page: 1, per_page: 25})
const page2 = await pelican.application.users.list({page: 2, per_page: 25})
```

### Filtering

Pass filter fields as object keys using the `filter[field]` syntax:

```typescript
await pelican.application.users.list({'filter[email]': '@example.com'})
await pelican.application.servers.list({'filter[name]': 'minecraft'})
```

### Sorting

Use the `sort` parameter. Prefix with `-` for descending:

```typescript
await pelican.application.users.list({sort: '-id'})     // newest first
await pelican.application.nodes.list({sort: 'name'})    // alphabetical
```

### Eager-loading relations

Use the `include` parameter to load related resources in a single request:

```typescript
const user = await pelican.application.users.get(1, 'servers,roles')
const egg = await pelican.application.eggs.get(3, 'variables')
```

---

## Next steps

- [Error Handling](./error-handling.md) — handling API errors
- [Application API →](../application/users.md)
- [Client API →](../client/account.md)
