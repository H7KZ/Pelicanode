# Startup

[← Docs](../README.md) · [← Backups](./backups.md) · Client API

> Access via `pelican.client.server(uuid).startup`.

Read and update the server's startup variables and Docker image.

---

## Methods

| Method                                                   | Permission       | Description                                |
|----------------------------------------------------------|------------------|--------------------------------------------|
| [`list()`](#list)                                        | `startup.read`   | List variables and current startup command |
| [`updateVariable(key, value)`](#updatevariablekey-value) | `startup.update` | Update a startup variable                  |

---

### `list()`

Returns all startup variables with their current values, the resolved startup command, and available Docker images.

```typescript
srv.startup.list(): Promise<{
  variables: ClientEggVariable[]
  startup_command: string       // resolved command with current variable values substituted
  raw_startup_command: string   // template with {{VARIABLE}} placeholders
  docker_images: Record<string, string>   // label → image map
}>
```

```typescript
const { variables, startup_command, docker_images } = await srv.startup.list()

for (const v of variables) {
  console.log(`${v.env_variable} = ${v.server_value || v.default_value}`)
}
```

---

### `updateVariable(key, value)`

Updates a single startup variable. Returns the updated variable and the new resolved startup command.

```typescript
srv.startup.updateVariable(key: string, value: string): Promise<{
  variable: ClientEggVariable
  startup_command: string
}>
```

```typescript
const { variable, startup_command } = await srv.startup.updateVariable('SERVER_JARFILE', 'paper.jar')
console.log(startup_command)  // new resolved command
```

> Only variables where `is_editable` is `true` can be updated by subusers. Attempting to edit a non-editable variable
> returns a permission error.

---

## `ClientEggVariable` type

| Field           | Type      | Description                                       |
|-----------------|-----------|---------------------------------------------------|
| `name`          | `string`  | Display name                                      |
| `description`   | `string`  |                                                   |
| `env_variable`  | `string`  | Environment variable key, e.g. `'SERVER_JARFILE'` |
| `default_value` | `string`  |                                                   |
| `server_value`  | `string`  | Currently set value                               |
| `is_editable`   | `boolean` | Whether the user can change this                  |
| `rules`         | `string`  | Laravel validation rules string                   |

---

[← Backups](./backups.md) · [Settings →](./settings.md)
