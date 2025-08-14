import { listNodes } from "./api/application/function/node/list-nodes.js"
import type { ListNodesRequest } from "./types/index.js"

export * from "./api/index.js"
export * from "./types/index.js"

/**
 * Pelican API Wrapper
 */
class Pelicanode {
    private url: string
    private token: string

    /**
     * Creates an instance of the Pelicanode API Wrapper
     * @param url - The base URL for the API (e.g. "https://panel.pelicanode.com")
     * @param token - The authentication token (set up your API token inside Pelican admin dashboard, make sure you set the correct scopes!)
     */
    constructor(url: string, token: string) {
        this.url = url
        this.token = token
    }

    /**
     * Application-related API calls
     */
    public application = {
        /**
         * Return all the nodes currently available on the Panel
         * @param params ListNodesRequest - The request parameters
         * @returns Promise<Node[]> - A promise that resolves to an array of nodes
         */
        listNodes: (params: ListNodesRequest) => listNodes(this.url, this.token, params)
    }
}

export { Pelicanode }
