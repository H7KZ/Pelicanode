# Files

[← Docs](../README.md) · [← Server](./server.md) · Client API

> Access via `pelican.client.server(uuid).files`.

Full filesystem access to a server — read, write, archive, and manage files.

---

## Methods

| Method                                        | Permission     | Description              |
|-----------------------------------------------|----------------|--------------------------|
| [`list(directory?)`](#listdirectory)          | `file.read`    | List directory contents  |
| [`getContents(file)`](#getcontentsfile)       | `file.read`    | Read a file as text      |
| [`getDownloadUrl(file)`](#getdownloadurlfile) | `file.read`    | Signed download URL      |
| [`getUploadUrl()`](#getuploadurl)             | `file.create`  | Signed upload URL        |
| [`write(file, content)`](#writefile-content)  | `file.create`  | Write a file             |
| [`createFolder(params)`](#createfolderparams) | `file.create`  | Create a directory       |
| [`rename(params)`](#renameparams)             | `file.update`  | Rename files             |
| [`copy(params)`](#copyparams)                 | `file.create`  | Copy a file              |
| [`delete(params)`](#deleteparams)             | `file.delete`  | Delete files             |
| [`compress(params)`](#compressparams)         | `file.archive` | Compress into an archive |
| [`decompress(params)`](#decompressparams)     | `file.create`  | Extract an archive       |
| [`chmod(params)`](#chmodparams)               | `file.update`  | Change file permissions  |
| [`pull(params)`](#pullparams)                 | `file.create`  | Download file from URL   |

---

### `list(directory?)`

Returns the contents of a directory.

```typescript
srv.files.list(directory?: string): Promise<FileObject[]>
```

```typescript
const root = await srv.files.list('/')
const pluginDir = await srv.files.list('/plugins')
```

---

### `getContents(file)`

Returns the raw text content of a file. Large files may be refused by Wings.

```typescript
srv.files.getContents(file: string): Promise<string>
```

```typescript
const config = await srv.files.getContents('/server.properties')
```

---

### `getDownloadUrl(file)`

Returns a signed URL for downloading a file directly from Wings. Valid for **15 minutes**.

```typescript
srv.files.getDownloadUrl(file: string): Promise<string>
```

```typescript
const url = await srv.files.getDownloadUrl('/world.zip')
// use url with fetch, a browser redirect, etc.
```

---

### `getUploadUrl()`

Returns a signed URL for uploading a file directly to Wings via multipart form. Valid for **15 minutes**.

```typescript
srv.files.getUploadUrl(): Promise<string>
```

```typescript
const uploadUrl = await srv.files.getUploadUrl()
// POST your file to uploadUrl with multipart/form-data
```

---

### `write(file, content)`

Writes a string to a file path. Creates the file if it doesn't exist, overwrites if it does.

```typescript
srv.files.write(file: string, content: string): Promise<void>
```

```typescript
await srv.files.write('/config.json', JSON.stringify({ port: 25565 }, null, 2))
await srv.files.write('/server.properties', 'online-mode=false\nmotd=My Server')
```

---

### `createFolder(params)`

```typescript
srv.files.createFolder(params: {
  root?: string | null   // parent directory; defaults to '/'
  name: string           // new folder name
}): Promise<void>
```

```typescript
await srv.files.createFolder({ root: '/', name: 'backups' })
```

---

### `rename(params)`

Renames one or more files in a single request.

```typescript
srv.files.rename(params: {
  root: string
  files: { from: string; to: string }[]
}): Promise<void>
```

```typescript
await srv.files.rename({
  root: '/plugins',
  files: [
    { from: 'old-plugin.jar', to: 'new-plugin.jar' },
    { from: 'config-v1', to: 'config-v2' },
  ],
})
```

---

### `copy(params)`

Creates a copy of a file at the same location with a suffix.

```typescript
srv.files.copy(params: {
  location: string   // full path to the file
}): Promise<void>
```

---

### `delete(params)`

Deletes one or more files or directories.

```typescript
srv.files.delete(params: {
  root: string
  files: string[]   // names relative to root
}): Promise<void>
```

```typescript
await srv.files.delete({
  root: '/logs',
  files: ['debug.log', 'latest.log', 'old-logs'],
})
```

---

### `compress(params)`

Compresses files into an archive.

```typescript
srv.files.compress(params: {
  files: string[]
  root?: string | null
  name?: string | null        // archive filename without extension; auto-generated if omitted
  extension?: 'zip' | 'tgz' | 'tar.gz' | 'txz' | 'tar.xz' | 'tbz2' | 'tar.bz2' | null
  // defaults to tar.gz
}): Promise<FileObject>   // returns the created archive's FileObject
```

```typescript
const archive = await srv.files.compress({
  root: '/plugins',
  files: ['plugin-a.jar', 'plugin-b.jar'],
  name: 'plugins-backup',
  extension: 'zip',
})
console.log(archive.name)  // 'plugins-backup.zip'
```

---

### `decompress(params)`

Extracts an archive. May take up to 5 minutes for large files.

```typescript
srv.files.decompress(params: {
  file: string              // archive filename
  root?: string | null      // extraction destination; defaults to '/'
}): Promise<void>
```

```typescript
await srv.files.decompress({ file: 'plugins-backup.zip', root: '/plugins' })
```

---

### `chmod(params)`

Changes UNIX permissions on one or more files.

```typescript
srv.files.chmod(params: {
  root: string
  files: {
    file: string
    mode: number   // octal mode as decimal — e.g. 755, 644, 777
  }[]
}): Promise<void>
```

```typescript
await srv.files.chmod({ root: '/', files: [{ file: 'start.sh', mode: 755 }] })
```

---

### `pull(params)`

Instructs Wings to download a file from a remote URL into the server's filesystem.

```typescript
srv.files.pull(params: {
  url: string               // remote URL to fetch
  directory?: string | null // destination directory; defaults to '/'
  filename?: string | null  // override filename; defaults to URL filename
  use_header?: boolean      // use Content-Disposition header for filename
  foreground?: boolean      // wait for download to finish before responding
}): Promise<void>
```

```typescript
await srv.files.pull({
  url: 'https://papermc.io/api/v2/projects/paper/versions/1.21/builds/latest/downloads/paper-1.21-latest.jar',
  directory: '/',
  filename: 'server.jar',
})
```

---

## `FileObject` type

| Field         | Type      | Description                                  |
|---------------|-----------|----------------------------------------------|
| `name`        | `string`  |                                              |
| `mode`        | `string`  | UNIX permissions string, e.g. `'-rw-r--r--'` |
| `mode_bits`   | `string`  | Octal mode, e.g. `'0644'`                    |
| `size`        | `number`  | Bytes                                        |
| `is_file`     | `boolean` | `false` for directories                      |
| `is_symlink`  | `boolean` |                                              |
| `mimetype`    | `string`  | e.g. `'text/plain'`                          |
| `created_at`  | `string`  | ISO 8601                                     |
| `modified_at` | `string`  | ISO 8601                                     |

---

[← Server](./server.md) · [Databases →](./databases.md)
