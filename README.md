# Pelicanode

[![npm version](https://img.shields.io/npm/v/pelicanode?style=flat&labelColor=rgba(0,70,114,1)&color=white)](https://www.npmjs.com/package/pelicanode)
[![npm downloads](https://img.shields.io/npm/dm/pelicanode?style=flat&labelColor=rgba(0,70,114,1)&color=white)](https://www.npmjs.com/package/pelicanode)
[![License](https://img.shields.io/npm/l/pelicanode?style=flat&labelColor=rgba(0,70,114,1)&color=white)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&labelColor=rgba(0,70,114,1)&color=white)](https://www.typescriptlang.org/)

A fully-typed Node.js client for the [Pelican Panel](https://pelican.dev) API, covering both the **Application API** (admin) and the **Client API** (user).

## Features

- **100% API coverage** — Application API (users, nodes, allocations, servers, eggs, database hosts, mounts, roles, plugins) and Client API (account, files, databases, schedules, network, subusers, backups, startup, settings)
- **Fully typed** — Complete TypeScript types for all requests, responses and models
- **Automatic error handling** — Non-2xx responses throw a `PelicanError` with structured error details
- **ESM** — Pure ES module, works in Node.js 18+
- **Zero config** — Just pass your panel URL and API token

## Installation

```bash
npm install pelicanode
# or
yarn add pelicanode
# or
pnpm add pelicanode
```

## Quick Start

```typescript
import { Pelicanode } from 'pelicanode'

const pelican = new Pelicanode('https://panel.example.com', 'your-api-key')
```

> **Tip:** For `application.*` endpoints you need an **admin** API key. For `client.*` endpoints you need a regular **account** API key (create one in Account → API Keys).

## Usage

### Application API (Admin)

#### Users

```typescript
// List users (paginated)
const { data: users, meta } = await pelican.application.users.list({ page: 1, per_page: 50 })

// Get a single user
const user = await pelican.application.users.get(1)

// Get user by external ID
const user = await pelican.application.users.getByExternalId('ext-123')

// Create a user
const newUser = await pelican.application.users.create({
    email: 'john@example.com',
    username: 'john',
    password: 'SecurePass123!',
    language: 'en',
})

// Update a user
await pelican.application.users.update(1, { email: 'newemail@example.com' })

// Delete a user
await pelican.application.users.delete(1)

// Assign / remove roles
await pelican.application.users.assignRoles(1, { roles: [2, 3] })
await pelican.application.users.removeRoles(1, { roles: [2] })
```

#### Nodes

```typescript
// List nodes
const { data: nodes } = await pelican.application.nodes.list()

// Get a single node
const node = await pelican.application.nodes.get(1)

// Get deployable nodes for a server
const deployable = await pelican.application.nodes.getDeployable({ memory: 1024, disk: 10240 })

// Get Wings daemon configuration (sensitive!)
const config = await pelican.application.nodes.getConfiguration(1)

// Create a node
const node = await pelican.application.nodes.create({
    name: 'US-East-01',
    fqdn: 'node01.example.com',
    scheme: 'https',
    memory: 16384,
    memory_overallocate: 0,
    disk: 204800,
    disk_overallocate: 0,
    cpu: 400,
    cpu_overallocate: 0,
    daemon_sftp: 2022,
    daemon_listen: 8080,
    daemon_connect: 443,
})

// Update / delete
await pelican.application.nodes.update(1, { maintenance_mode: true })
await pelican.application.nodes.delete(1)
```

#### Allocations

```typescript
// List allocations for a node
const { data: allocs } = await pelican.application.allocations.list(1)

// Create allocations
await pelican.application.allocations.create(1, {
    ip: '192.168.1.100',
    ports: ['25565', '25566-25570'],
})

// Delete an allocation
await pelican.application.allocations.delete(1, 42)
```

#### Servers

```typescript
// List servers
const { data: servers } = await pelican.application.servers.list()

// Get / create / update / delete
const server = await pelican.application.servers.get(1)

const newServer = await pelican.application.servers.create({
    name: 'My Minecraft Server',
    user: 1,
    egg: 3,
    environment: { SERVER_JARFILE: 'server.jar', MC_VERSION: 'latest' },
    limits: { memory: 1024, swap: 0, disk: 10240, io: 500, cpu: 100 },
    feature_limits: { databases: 1, backups: 5 },
    allocation: { default: 1 },
})

await pelican.application.servers.updateDetails(1, { name: 'Renamed Server' })
await pelican.application.servers.updateBuild(1, { limits: { memory: 2048 } })
await pelican.application.servers.suspend(1)
await pelican.application.servers.unsuspend(1)
await pelican.application.servers.reinstall(1)
await pelican.application.servers.delete(1)
await pelican.application.servers.forceDelete(1)

// Transfers
await pelican.application.servers.startTransfer(1, { node_id: 2, allocation_id: 10 })
await pelican.application.servers.cancelTransfer(1)
```

#### Eggs

```typescript
const eggs = await pelican.application.eggs.list()
const egg = await pelican.application.eggs.get(1, { include: 'variables' })
await pelican.application.eggs.delete(1)
const yaml = await pelican.application.eggs.export(1)
const imported = await pelican.application.eggs.import(yamlString)
```

#### Database Hosts

```typescript
const { data: hosts } = await pelican.application.databaseHosts.list()
const host = await pelican.application.databaseHosts.create({
    name: 'Primary MySQL',
    host: '127.0.0.1',
    port: 3306,
    username: 'pelican',
    password: 'secret',
})
await pelican.application.databaseHosts.update(1, { password: 'newpassword' })
await pelican.application.databaseHosts.delete(1)
```

#### Mounts

```typescript
const { data: mounts } = await pelican.application.mounts.list()

const mount = await pelican.application.mounts.create({
    name: 'Shared Configs',
    source: '/mnt/shared/configs',
    target: '/mnt/configs',
    read_only: true,
})

// Manage relationships
await pelican.application.mounts.addEggs(1, [1, 2, 3])
await pelican.application.mounts.addNodes(1, [1])
await pelican.application.mounts.removeEgg(1, 3)
```

#### Roles & Plugins

```typescript
// Roles
const { data: roles } = await pelican.application.roles.list()
const role = await pelican.application.roles.create({ name: 'Moderator' })

// Plugins
const { data: plugins } = await pelican.application.plugins.list()
await pelican.application.plugins.install(5)
await pelican.application.plugins.enable(5)
await pelican.application.plugins.importFromUrl('https://example.com/my-plugin.zip')
```

---

### Client API (User)

#### Servers

```typescript
// List servers for the authenticated user
const { data: servers } = await pelican.client.listServers()

// Filter: only owned servers
const { data: owned } = await pelican.client.listServers({ type: 'owner' })

// Get all available permissions
const perms = await pelican.client.listPermissions()
```

#### Account

```typescript
const me = await pelican.client.account.get()
await pelican.client.account.updateEmail({ email: 'new@email.com', password: 'current-pass' })
await pelican.client.account.updatePassword({
    current_password: 'old',
    password: 'new-secure-pass',
    password_confirmation: 'new-secure-pass',
})

// API Keys
const keys = await pelican.client.account.apiKeys.list()
const { secret_token, ...key } = await pelican.client.account.apiKeys.create({
    description: 'My automation key',
    allowed_ips: ['192.168.1.0/24'],
})
await pelican.client.account.apiKeys.delete(key.identifier)

// SSH Keys
const sshKeys = await pelican.client.account.sshKeys.list()
await pelican.client.account.sshKeys.create({ name: 'My Laptop', public_key: 'ssh-ed25519 AAAA...' })
await pelican.client.account.sshKeys.delete('SHA256:abc...')
```

#### Per-Server Operations

Access any server endpoint by calling `pelican.client.server('uuid')`:

```typescript
const srv = pelican.client.server('a1b2c3d4-e5f6-7890-abcd-ef1234567890')

// Server info
const { server, is_server_owner, user_permissions } = await srv.get()
const stats = await srv.getResources()
const ws = await srv.getWebsocketToken()

// Power management
await srv.sendPower('start')
await srv.sendPower('stop')
await srv.sendPower('restart')
await srv.sendPower('kill')
await srv.sendCommand('say Hello World!')
```

#### Files

```typescript
const srv = pelican.client.server('uuid')

const files = await srv.files.list('/')
const content = await srv.files.getContents('/server.properties')

await srv.files.write('/config.json', JSON.stringify({ key: 'value' }, null, 2))
await srv.files.createFolder({ root: '/', name: 'logs' })
await srv.files.rename({ root: '/plugins', files: [{ from: 'old.jar', to: 'new.jar' }] })
await srv.files.copy({ location: '/plugins/my-plugin.jar' })
await srv.files.delete({ root: '/logs', files: ['latest.log'] })

const archive = await srv.files.compress({ root: '/plugins', files: ['a.jar', 'b.jar'] })
await srv.files.decompress({ root: '/plugins', file: 'backup.tar.gz' })

const downloadUrl = await srv.files.getDownloadUrl('/world.zip')
const uploadUrl = await srv.files.getUploadUrl()

await srv.files.pull({ url: 'https://example.com/server.jar', directory: '/' })
```

#### Databases

```typescript
const srv = pelican.client.server('uuid')

const dbs = await srv.databases.list()
const db = await srv.databases.create({ database: 'mydb', remote: '%' })
console.log(db.password) // only available on create / rotate

await srv.databases.rotatePassword(String(db.id))
await srv.databases.delete(String(db.id))
```

#### Schedules

```typescript
const srv = pelican.client.server('uuid')

const schedules = await srv.schedules.list()
const schedule = await srv.schedules.create({
    name: 'Auto Backup',
    minute: '0',
    hour: '*/6',
    day_of_month: '*',
    month: '*',
    day_of_week: '*',
    is_active: true,
    only_when_online: true,
})

const task = await srv.schedules.createTask(schedule.id, {
    action: 'backup',
    payload: '',
    time_offset: 0,
})

await srv.schedules.execute(schedule.id)
await srv.schedules.delete(schedule.id)
```

#### Network (Allocations)

```typescript
const srv = pelican.client.server('uuid')

const allocs = await srv.network.list()
const newAlloc = await srv.network.create()
await srv.network.update(allocs[0]!.id, 'Minecraft Java')
await srv.network.setPrimary(newAlloc.id)
await srv.network.delete(allocs[1]!.id)
```

#### Subusers

```typescript
const srv = pelican.client.server('uuid')

const users = await srv.subusers.list()
const subuser = await srv.subusers.create({
    email: 'friend@example.com',
    permissions: ['control.start', 'control.stop', 'file.read'],
})
await srv.subusers.update(subuser.uuid, { permissions: ['control.start'] })
await srv.subusers.delete(subuser.uuid)
```

#### Backups

```typescript
const srv = pelican.client.server('uuid')

const { data: backups } = await srv.backups.list()
const backup = await srv.backups.create({ name: 'Before update', is_locked: true })

const url = await srv.backups.getDownloadUrl(backup.uuid)
await srv.backups.restore(backup.uuid, { truncate: false })
await srv.backups.rename(backup.uuid, 'Post-update snapshot')
await srv.backups.toggleLock(backup.uuid)
await srv.backups.delete(backup.uuid)
```

#### Startup & Settings

```typescript
const srv = pelican.client.server('uuid')

// Startup variables
const { variables, startup_command, docker_images } = await srv.startup.list()
const { variable, startup_command: newCmd } = await srv.startup.updateVariable('SERVER_JARFILE', 'paper.jar')

// Settings
await srv.settings.rename('New Server Name')
await srv.settings.updateDescription('A fun survival server')
await srv.settings.setDockerImage('ghcr.io/pterodactyl/yolks:java_21')
await srv.settings.reinstall()
```

---

## Error Handling

All API errors throw a `PelicanError`:

```typescript
import { PelicanError } from 'pelicanode'

try {
    await pelican.application.servers.get(99999)
} catch (err) {
    if (err instanceof PelicanError) {
        console.error(`HTTP ${err.status}`)
        for (const e of err.errors) {
            console.error(`  [${e.code}] ${e.detail}`)
        }
    }
}
```

---

## API Reference

| Namespace | Methods |
|---|---|
| `application.users` | `list`, `get`, `getByExternalId`, `create`, `update`, `delete`, `assignRoles`, `removeRoles` |
| `application.nodes` | `list`, `get`, `getDeployable`, `getConfiguration`, `create`, `update`, `delete` |
| `application.allocations` | `list`, `create`, `delete` |
| `application.servers` | `list`, `get`, `getByExternalId`, `create`, `updateDetails`, `updateBuild`, `updateStartup`, `suspend`, `unsuspend`, `reinstall`, `startTransfer`, `cancelTransfer`, `delete`, `forceDelete` |
| `application.serverDatabases` | `list`, `get`, `create`, `resetPassword`, `delete` |
| `application.eggs` | `list`, `get`, `delete`, `deleteByUuid`, `export`, `import` |
| `application.databaseHosts` | `list`, `get`, `create`, `update`, `delete` |
| `application.mounts` | `list`, `get`, `create`, `update`, `delete`, `listEggs`, `addEggs`, `removeEgg`, `listNodes`, `addNodes`, `removeNode`, `listServers`, `addServers`, `removeServer` |
| `application.roles` | `list`, `get`, `create`, `update`, `delete` |
| `application.plugins` | `list`, `get`, `install`, `update`, `uninstall`, `enable`, `disable`, `importFromUrl`, `importFromFile` |
| `client.listServers` | Paginated server list |
| `client.listPermissions` | All subuser permission keys |
| `client.account` | `get`, `updateUsername`, `updateEmail`, `updatePassword`, `listActivity`, `apiKeys.*`, `sshKeys.*` |
| `client.server(uuid).` | `get`, `getWebsocketToken`, `getResources`, `listActivity`, `sendCommand`, `sendPower` |
| `client.server(uuid).files` | `list`, `getContents`, `getDownloadUrl`, `getUploadUrl`, `write`, `createFolder`, `rename`, `copy`, `delete`, `compress`, `decompress`, `chmod`, `pull` |
| `client.server(uuid).databases` | `list`, `create`, `rotatePassword`, `delete` |
| `client.server(uuid).schedules` | `list`, `get`, `create`, `update`, `delete`, `execute`, `createTask`, `updateTask`, `deleteTask` |
| `client.server(uuid).network` | `list`, `create`, `update`, `setPrimary`, `delete` |
| `client.server(uuid).subusers` | `list`, `get`, `create`, `update`, `delete` |
| `client.server(uuid).backups` | `list`, `get`, `create`, `delete`, `getDownloadUrl`, `rename`, `toggleLock`, `restore` |
| `client.server(uuid).startup` | `list`, `updateVariable` |
| `client.server(uuid).settings` | `rename`, `updateDescription`, `reinstall`, `setDockerImage` |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes
4. Open a Pull Request

## License

[ISC](./LICENSE)
