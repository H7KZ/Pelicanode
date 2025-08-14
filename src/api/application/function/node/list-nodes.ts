import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"
import { Node } from "../../model/node.js"
import type { ListNodesRequest, ListNodesResponse } from "../../../../types/index.js"

async function listNodes(url: string, token: string, params: ListNodesRequest): Promise<Node[]> {
    const options: AxiosRequestConfig = {
        method: 'GET',
        url: `${url}/api/application/nodes`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        params
    }

    try {
        const res: AxiosResponse<ListNodesResponse> = await axios.request(options)

        const nodes: Node[] = res.data.data.map(n => new Node(n.attributes))

        return nodes
    } catch (error) {
        console.error(error)

        throw error as Error
    }
}

export { listNodes }
