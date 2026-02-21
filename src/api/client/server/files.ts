import { apiRequest } from "../../../http.js"
import type {
    FileObject,
    RenameFilesParams,
    CopyFileParams,
    DeleteFilesParams,
    CreateFolderParams,
    CompressFilesParams,
    DecompressFileParams,
    ChmodFilesParams,
    PullFileParams,
    ListResponse,
    SingleResponse,
} from "../../../types/index.js"

function unwrap<T>(res: SingleResponse<T>): T {
    return res.attributes
}

function unwrapList<T>(res: ListResponse<T>): T[] {
    return res.data.map(item => item.attributes)
}

export function createFilesApi(baseUrl: string, token: string, serverUuid: string) {
    return {
        /** List the contents of a directory. Requires `file.read` permission. */
        list(directory?: string) {
            return apiRequest<ListResponse<FileObject>>(baseUrl, token, {
                method: 'GET',
                url: `/api/client/servers/${serverUuid}/files/list`,
                params: directory ? { directory } : undefined,
            }).then(unwrapList)
        },

        /** Get the contents of a file as a string. Requires `file.read` permission. */
        getContents(file: string) {
            return apiRequest<string>(baseUrl, token, {
                method: 'GET',
                url: `/api/client/servers/${serverUuid}/files/contents`,
                params: { file },
                headers: { Accept: 'text/plain' },
            })
        },

        /** Get a signed download URL for a file. Requires `file.read` permission. */
        getDownloadUrl(file: string) {
            return apiRequest<SingleResponse<{ url: string }>>(baseUrl, token, {
                method: 'GET',
                url: `/api/client/servers/${serverUuid}/files/download`,
                params: { file },
            }).then(res => res.attributes.url)
        },

        /** Get a signed upload URL. Requires `file.create` permission. */
        getUploadUrl() {
            return apiRequest<SingleResponse<{ url: string }>>(baseUrl, token, {
                method: 'GET',
                url: `/api/client/servers/${serverUuid}/files/upload`,
            }).then(res => res.attributes.url)
        },

        /** Write content to a file. Requires `file.create` permission. */
        write(file: string, content: string): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/write`,
                params: { file },
                data: content,
                headers: { 'Content-Type': 'text/plain' },
            })
        },

        /** Create a directory. Requires `file.create` permission. */
        createFolder(params: CreateFolderParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/create-folder`,
                data: params,
            })
        },

        /** Rename one or more files. Requires `file.update` permission. */
        rename(params: RenameFilesParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'PUT',
                url: `/api/client/servers/${serverUuid}/files/rename`,
                data: params,
            })
        },

        /** Copy a file. Requires `file.create` permission. */
        copy(params: CopyFileParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/copy`,
                data: params,
            })
        },

        /** Delete files/directories. Requires `file.delete` permission. */
        delete(params: DeleteFilesParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/delete`,
                data: params,
            })
        },

        /** Compress files into an archive. Requires `file.archive` permission. */
        compress(params: CompressFilesParams) {
            return apiRequest<SingleResponse<FileObject>>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/compress`,
                data: params,
            }).then(unwrap)
        },

        /** Decompress an archive. Requires `file.create` permission. */
        decompress(params: DecompressFileParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/decompress`,
                data: params,
            })
        },

        /** Change file permissions. Requires `file.update` permission. */
        chmod(params: ChmodFilesParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/chmod`,
                data: params,
            })
        },

        /** Pull a file from a remote URL. Requires `file.create` permission. */
        pull(params: PullFileParams): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'POST',
                url: `/api/client/servers/${serverUuid}/files/pull`,
                data: params,
            })
        },
    }
}
