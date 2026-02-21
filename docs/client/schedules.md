# Schedules

[← Docs](../README.md) · [← Databases](./databases.md) · Client API

> Access via `pelican.client.server(uuid).schedules`.

Cron-based schedules that run tasks automatically. Each schedule holds an ordered list of tasks executed in sequence.

---

## Methods

| Method                                                                          | Permission        | Description                   |
|---------------------------------------------------------------------------------|-------------------|-------------------------------|
| [`list()`](#list)                                                               | `schedule.read`   | List all schedules with tasks |
| [`get(scheduleId)`](#getscheduleid)                                             | `schedule.read`   | Get a specific schedule       |
| [`create(params)`](#createparams)                                               | `schedule.create` | Create a schedule             |
| [`update(scheduleId, params)`](#updatescheduleid-params)                        | `schedule.update` | Update a schedule             |
| [`execute(scheduleId)`](#executescheduleid)                                     | `schedule.update` | Run a schedule immediately    |
| [`delete(scheduleId)`](#deletescheduleid)                                       | `schedule.delete` | Delete a schedule             |
| [`createTask(scheduleId, params)`](#createtaskscheduleid-params)                | `schedule.update` | Add a task                    |
| [`updateTask(scheduleId, taskId, params)`](#updatetaskscheduleid-taskid-params) | `schedule.update` | Update a task                 |
| [`deleteTask(scheduleId, taskId)`](#deletetaskscheduleid-taskid)                | `schedule.delete` | Delete a task                 |

---

### `list()`

Returns all schedules, each including its full `tasks` array.

```typescript
srv.schedules.list(): Promise<Schedule[]>
```

---

### `get(scheduleId)`

```typescript
srv.schedules.get(scheduleId: number): Promise<Schedule>
```

---

### `create(params)`

```typescript
srv.schedules.create(params: {
  name: string
  minute: string        // cron minute field, e.g. '0', '*/15', '*'
  hour: string          // cron hour field, e.g. '*/6', '0', '*'
  day_of_month: string  // e.g. '*', '1', '15'
  month: string         // e.g. '*', '1-6'
  day_of_week: string   // e.g. '*', '1-5' (Mon–Fri)
  is_active?: boolean          // default: true
  only_when_online?: boolean   // skip if server is offline
}): Promise<Schedule>
```

```typescript
// Run every 6 hours
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
```

---

### `update(scheduleId, params)`

All fields are optional.

```typescript
srv.schedules.update(scheduleId: number, params: {
  name?: string
  minute?: string
  hour?: string
  day_of_month?: string
  month?: string
  day_of_week?: string
  is_active?: boolean
  only_when_online?: boolean
}): Promise<Schedule>
```

---

### `execute(scheduleId)`

Triggers the schedule to run immediately, regardless of its cron expression or active state.

```typescript
srv.schedules.execute(scheduleId: number): Promise<void>
```

---

### `delete(scheduleId)`

Deletes the schedule and **all its associated tasks**.

```typescript
srv.schedules.delete(scheduleId: number): Promise<void>
```

---

### `createTask(scheduleId, params)`

Adds a task to a schedule. Tasks run in sequence by their `sequence_id`. Maximum **10 tasks** per schedule.

```typescript
srv.schedules.createTask(scheduleId: number, params: {
  action: 'command' | 'power' | 'backup'
  payload: string              // command string, power signal ('start'/'stop'/...), or backup name
  time_offset: number          // seconds to wait after the previous task
  continue_on_failure?: boolean
}): Promise<ScheduleTask>
```

```typescript
// Create a backup task then a restart task
await srv.schedules.createTask(schedule.id, {
  action: 'backup',
  payload: 'Auto Backup',
  time_offset: 0,
})
await srv.schedules.createTask(schedule.id, {
  action: 'power',
  payload: 'restart',
  time_offset: 60,  // 60 seconds after the backup
})
```

---

### `updateTask(scheduleId, taskId, params)`

```typescript
srv.schedules.updateTask(
  scheduleId: number,
  taskId: number,
  params: {
    action?: 'command' | 'power' | 'backup'
    payload?: string
    time_offset?: number
    continue_on_failure?: boolean
  }
): Promise<ScheduleTask>
```

---

### `deleteTask(scheduleId, taskId)`

Deletes a task. Subsequent tasks have their sequence IDs adjusted automatically.

```typescript
srv.schedules.deleteTask(scheduleId: number, taskId: number): Promise<void>
```

---

## Types

### `Schedule`

| Field              | Type                                                 | Description       |
|--------------------|------------------------------------------------------|-------------------|
| `id`               | `number`                                             |                   |
| `name`             | `string`                                             |                   |
| `cron`             | `{ minute, hour, day_of_month, month, day_of_week }` | Cron fields       |
| `is_active`        | `boolean`                                            |                   |
| `is_processing`    | `boolean`                                            | Currently running |
| `only_when_online` | `boolean`                                            |                   |
| `last_run_at`      | `string \| null`                                     | ISO 8601          |
| `next_run_at`      | `string \| null`                                     | ISO 8601          |
| `tasks`            | `ScheduleTask[]`                                     |                   |
| `created_at`       | `string`                                             | ISO 8601          |
| `updated_at`       | `string`                                             | ISO 8601          |

### `ScheduleTask`

| Field                 | Type                               | Description                 |
|-----------------------|------------------------------------|-----------------------------|
| `id`                  | `number`                           |                             |
| `sequence_id`         | `number`                           | Execution order             |
| `action`              | `'command' \| 'power' \| 'backup'` |                             |
| `payload`             | `string`                           |                             |
| `time_offset`         | `number`                           | Seconds after previous task |
| `is_queued`           | `boolean`                          |                             |
| `continue_on_failure` | `boolean`                          |                             |
| `created_at`          | `string`                           | ISO 8601                    |
| `updated_at`          | `string`                           | ISO 8601                    |

---

[← Databases](./databases.md) · [Network →](./network.md)
