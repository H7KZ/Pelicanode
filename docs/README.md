# Pelicanode — Documentation

A fully-typed Node.js client for the [Pelican Panel](https://pelican.dev) API.

---

## Guides

|                                               |                                             |
|-----------------------------------------------|---------------------------------------------|
| [Getting Started](./guide/getting-started.md) | Installation, setup, and your first request |
| [Error Handling](./guide/error-handling.md)   | Working with `PelicanError` and API errors  |

---

## Application API

> Requires an **admin** API key. Access via `pelican.application.*`.

| Namespace                                             | Description                            |
|-------------------------------------------------------|----------------------------------------|
| [Users](./application/users.md)                       | Create, update, and manage panel users |
| [Nodes](./application/nodes.md)                       | Manage Wings daemon nodes              |
| [Allocations](./application/allocations.md)           | Manage port allocations on nodes       |
| [Servers](./application/servers.md)                   | Create and fully manage game servers   |
| [Server Databases](./application/server-databases.md) | Manage databases attached to servers   |
| [Eggs](./application/eggs.md)                         | Manage server configuration templates  |
| [Database Hosts](./application/database-hosts.md)     | Manage database host connections       |
| [Mounts](./application/mounts.md)                     | Manage filesystem bind mounts          |
| [Roles](./application/roles.md)                       | Manage administrative roles            |
| [Plugins](./application/plugins.md)                   | Manage panel plugins                   |

---

## Client API

> Requires a regular **account** API key (Account → API Keys). Access via `pelican.client.*`.

| Namespace                          | Description                                   |
|------------------------------------|-----------------------------------------------|
| [Account](./client/account.md)     | Profile, API keys, SSH keys, activity logs    |
| [Server](./client/server.md)       | Power, console, resources, WebSocket token    |
| [Files](./client/files.md)         | Read, write, archive, and manage server files |
| [Databases](./client/databases.md) | Create and manage server databases            |
| [Schedules](./client/schedules.md) | Cron schedules and tasks                      |
| [Network](./client/network.md)     | Network allocations                           |
| [Subusers](./client/subusers.md)   | Shared server access                          |
| [Backups](./client/backups.md)     | Create, restore, and manage backups           |
| [Startup](./client/startup.md)     | Startup variables and Docker image            |
| [Settings](./client/settings.md)   | Rename, reinstall, and other settings         |

---

## Subuser Permissions

The full list of permission keys assignable to subusers:

| Category        | Keys                                                                                               |
|-----------------|----------------------------------------------------------------------------------------------------|
| Console & power | `control.console`, `control.start`, `control.stop`, `control.restart`                              |
| Files           | `file.create`, `file.read`, `file.update`, `file.delete`, `file.archive`                           |
| Startup         | `startup.read`, `startup.update`, `startup.docker-image`                                           |
| Databases       | `database.create`, `database.read`, `database.update`, `database.delete`, `database.view_password` |
| Schedules       | `schedule.create`, `schedule.read`, `schedule.update`, `schedule.delete`                           |
| Network         | `allocation.read`, `allocation.create`, `allocation.update`, `allocation.delete`                   |
| Backups         | `backup.create`, `backup.read`, `backup.delete`, `backup.download`, `backup.restore`               |
| Subusers        | `user.create`, `user.read`, `user.update`, `user.delete`                                           |
| Settings        | `settings.rename`, `settings.reinstall`, `settings.description`                                    |
| Other           | `websocket.connect`, `activity.read`                                                               |

You can also retrieve this list programmatically:

```typescript
const permissions = await pelican.client.listPermissions()
```

---

[← Back to README](../README.md)
