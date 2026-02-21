export interface PaginationLinks {
    previous: string | null
    next: string | null
}

export interface Pagination {
    total: number
    count: number
    per_page: number
    current_page: number
    total_pages: number
    links: PaginationLinks
}

export interface PaginatedResponse<T> {
    object: 'list'
    data: Array<{ object: string; attributes: T }>
    meta: { pagination: Pagination }
}

export interface ListResponse<T> {
    object: 'list'
    data: Array<{ object: string; attributes: T }>
}

export interface SingleResponse<T> {
    object: string
    attributes: T
    meta?: Record<string, unknown>
}

export interface ListParams {
    page?: number
    per_page?: number
    sort?: string
    include?: string
}
