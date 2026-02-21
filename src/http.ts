import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { PelicanError } from './errors.js'

export async function apiRequest<T>(baseUrl: string, token: string, config: AxiosRequestConfig): Promise<T> {
	try {
		const res = await axios.request<T>({
			...config,
			url: `${baseUrl}${config.url!}`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
				...config.headers
			}
		})
		return res.data
	} catch (err) {
		const axiosErr = err as AxiosError
		if (axiosErr.response) {
			throw new PelicanError(axiosErr.response.status, axiosErr.response.data)
		}
		throw err
	}
}
