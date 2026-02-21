# Settings

[← Docs](../README.md) · [← Startup](./startup.md) · Client API

> Access via `pelican.client.server(uuid).settings`.

Server configuration settings — rename, update description, change Docker image, and reinstall.

---

## Methods

| Method                                                            | Permission             | Description         |
|-------------------------------------------------------------------|------------------------|---------------------|
| [`rename(name)`](#renamename)                                     | `settings.rename`      | Rename the server   |
| [`updateDescription(description)`](#updatedescriptiondescription) | `settings.description` | Update description  |
| [`setDockerImage(dockerImage)`](#setdockerimagedockerimage)       | `startup.docker-image` | Change Docker image |
| [`reinstall()`](#reinstall)                                       | `settings.reinstall`   | Reinstall server    |

---

### `rename(name)`

```typescript
srv.settings.rename(name: string): Promise<void>
```

```typescript
await srv.settings.rename('Survival SMP — Season 2')
```

---

### `updateDescription(description)`

```typescript
srv.settings.updateDescription(description: string | null): Promise<void>
```

Pass `null` to clear the description.

```typescript
await srv.settings.updateDescription('Public survival server — everyone welcome!')
await srv.settings.updateDescription(null)  // clear
```

---

### `setDockerImage(dockerImage)`

Changes the Docker image used by the server. The image must be present in the egg's `docker_images` list (unless the
panel allows custom images).

```typescript
srv.settings.setDockerImage(dockerImage: string): Promise<void>
```

```typescript
// Switch to a different Java version
await srv.settings.setDockerImage('ghcr.io/pterodactyl/yolks:java_21')
```

To see available images for the server's egg, call [`srv.startup.list()`](./startup.md#list) and check `docker_images`.

---

### `reinstall()`

Re-runs the egg's install script. Use with caution — **server data may be overwritten** depending on the install script.

```typescript
srv.settings.reinstall(): Promise<void>
```

> Best practice: create a [backup](./backups.md) before reinstalling.

---

[← Startup](./startup.md) · [← Docs](../README.md)
