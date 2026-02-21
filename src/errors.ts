export interface PelicanApiError {
    code: string
    status: string
    detail: string
    source?: { field: string }
    meta?: Record<string, unknown>
}

/**
 * Error thrown when the Pelican API returns a non-2xx response.
 */
export class PelicanError extends Error {
    readonly status: number
    readonly errors: PelicanApiError[]

    constructor(status: number, body: unknown) {
        const errors = ((body as Record<string, unknown>)?.errors ?? []) as PelicanApiError[]
        super(errors[0]?.detail ?? `HTTP ${status}`)
        this.name = 'PelicanError'
        this.status = status
        this.errors = errors
    }
}
