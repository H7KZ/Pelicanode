import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { PelicanError } from '../src/errors.js'
import { apiRequest } from '../src/http.js'

const mock = new MockAdapter(axios)
beforeEach(() => mock.reset())
afterAll(() => mock.restore())

const BASE = 'https://panel.example.com'
const TOKEN = 'test-token'

describe('apiRequest', () => {
	it('returns response data on 200', async () => {
		mock.onGet(`${BASE}/api/test`).reply(200, { id: 1, name: 'test' })
		const result = await apiRequest<{ id: number; name: string }>(BASE, TOKEN, {
			method: 'GET',
			url: '/api/test',
		})
		expect(result).toEqual({ id: 1, name: 'test' })
	})

	it('sets Authorization Bearer header', async () => {
		let authHeader = ''
		mock.onGet(`${BASE}/api/test`).reply(config => {
			authHeader = (config.headers?.Authorization as string | undefined) ?? ''
			return [200, {}]
		})
		await apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/test' })
		expect(authHeader).toBe('Bearer test-token')
	})

	it('sets Accept and Content-Type headers', async () => {
		let accept = ''
		let contentType = ''
		mock.onGet(`${BASE}/api/test`).reply(config => {
			accept = (config.headers?.Accept as string | undefined) ?? ''
			contentType = (config.headers?.['Content-Type'] as string | undefined) ?? ''
			return [200, {}]
		})
		await apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/test' })
		expect(accept).toBe('application/json')
		expect(contentType).toBe('application/json')
	})

	it('allows caller to override headers', async () => {
		let accept = ''
		mock.onGet(`${BASE}/api/test`).reply(config => {
			accept = (config.headers?.Accept as string | undefined) ?? ''
			return [200, '']
		})
		await apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/test', headers: { Accept: 'text/plain' } })
		expect(accept).toBe('text/plain')
	})

	it('throws PelicanError on 4xx', async () => {
		mock.onGet(`${BASE}/api/missing`).reply(404, {
			errors: [{ code: 'NotFound', status: '404', detail: 'Not found' }],
		})
		await expect(apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/missing' })).rejects.toBeInstanceOf(
			PelicanError,
		)
	})

	it('PelicanError carries status and errors on 4xx', async () => {
		mock.onGet(`${BASE}/api/forbidden`).reply(403, {
			errors: [{ code: 'Forbidden', status: '403', detail: 'Access denied' }],
		})
		try {
			await apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/forbidden' })
			expect.fail('should have thrown')
		} catch (err) {
			expect(err).toBeInstanceOf(PelicanError)
			const pelErr = err as PelicanError
			expect(pelErr.status).toBe(403)
			expect(pelErr.errors[0]?.detail).toBe('Access denied')
		}
	})

	it('throws PelicanError on 5xx', async () => {
		mock.onGet(`${BASE}/api/error`).reply(500, { errors: [] })
		await expect(apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/error' })).rejects.toBeInstanceOf(
			PelicanError,
		)
	})

	it('re-throws non-HTTP network errors as-is', async () => {
		mock.onGet(`${BASE}/api/network`).networkError()
		await expect(apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/network' })).rejects.not.toBeInstanceOf(
			PelicanError,
		)
	})

	it('constructs full URL by concatenating base and path', async () => {
		let capturedUrl = ''
		mock.onGet(/.*/).reply(config => {
			capturedUrl = config.url ?? ''
			return [200, {}]
		})
		await apiRequest(BASE, TOKEN, { method: 'GET', url: '/api/path' })
		expect(capturedUrl).toBe(`${BASE}/api/path`)
	})
})
