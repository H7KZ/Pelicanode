import { apiRequest } from "../../http.js"
import type {
    Egg,
    ListEggsParams,
    GetEggParams,
    ListResponse,
    SingleResponse,
} from "../../types/index.js"

function unwrap<T>(res: SingleResponse<T>): T {
    return res.attributes
}

function unwrapList<T>(res: ListResponse<T>): T[] {
    return res.data.map(item => item.attributes)
}

export function createEggsApi(baseUrl: string, token: string) {
    return {
        /** List all eggs. */
        list(params?: ListEggsParams) {
            return apiRequest<ListResponse<Egg>>(baseUrl, token, {
                method: 'GET',
                url: '/api/application/eggs',
                params,
            }).then(unwrapList)
        },

        /** Get a single egg by ID. */
        get(eggId: number, params?: GetEggParams) {
            return apiRequest<SingleResponse<Egg>>(baseUrl, token, {
                method: 'GET',
                url: `/api/application/eggs/${eggId}`,
                params,
            }).then(unwrap)
        },

        /** Delete an egg by ID. */
        delete(eggId: number): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'DELETE',
                url: `/api/application/eggs/${eggId}`,
            })
        },

        /** Delete an egg by UUID. */
        deleteByUuid(uuid: string): Promise<void> {
            return apiRequest<void>(baseUrl, token, {
                method: 'DELETE',
                url: `/api/application/eggs/uuid/${uuid}`,
            })
        },

        /** Export an egg as YAML or JSON. Returns raw string content. */
        export(eggId: number, format: 'yaml' | 'json' = 'yaml') {
            return apiRequest<string>(baseUrl, token, {
                method: 'GET',
                url: `/api/application/eggs/${eggId}/export`,
                params: { format },
                headers: { Accept: format === 'json' ? 'application/json' : 'application/x-yaml' },
            })
        },

        /** Import an egg from a JSON string. */
        import(fileContent: string) {
            const formData = new FormData()
            const blob = new Blob([fileContent], { type: 'application/json' })
            formData.append('import_file', blob, 'egg.json')
            return apiRequest<SingleResponse<Egg>>(baseUrl, token, {
                method: 'POST',
                url: '/api/application/eggs/import',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then(unwrap)
        },
    }
}
