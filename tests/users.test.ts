import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { PelicanError } from '../src/errors.js'
import type { ApplicationUser, PaginatedResponse, SingleResponse } from '../src/types/index.js'
import { createUsersApi } from '../src/api/application/users.js'

const mock = new MockAdapter(axios)
beforeEach(() => mock.reset())
afterAll(() => mock.restore())

const BASE = 'https://panel.example.com'
const TOKEN = 'test-token'
const USERS_URL = `${BASE}/api/application/users`

const mockUser: ApplicationUser = {
	id: 1,
	external_id: null,
	is_managed_externally: false,
	uuid: 'abc-123',
	username: 'testuser',
	email: 'test@example.com',
	language: 'en',
	root_admin: false,
	'2fa_enabled': false,
	'2fa': false,
	created_at: '2024-01-01T00:00:00.000Z',
	updated_at: '2024-01-01T00:00:00.000Z',
}

const mockSingle: SingleResponse<ApplicationUser> = {
	object: 'user',
	attributes: mockUser,
}

const mockPaginated: PaginatedResponse<ApplicationUser> = {
	object: 'list',
	data: [{ object: 'user', attributes: mockUser }],
	meta: {
		pagination: {
			total: 1,
			count: 1,
			per_page: 50,
			current_page: 1,
			total_pages: 1,
			links: { previous: null, next: null },
		},
	},
}

describe('createUsersApi', () => {
	const api = createUsersApi(BASE, TOKEN)

	describe('list()', () => {
		it('returns unwrapped data and meta', async () => {
			mock.onGet(USERS_URL).reply(200, mockPaginated)
			const result = await api.list()
			expect(result.data).toHaveLength(1)
			expect(result.data[0]).toEqual(mockUser)
			expect(result.meta.pagination.total).toBe(1)
		})

		it('passes query params', async () => {
			mock.onGet(USERS_URL).reply(200, mockPaginated)
			await api.list({ page: 2, per_page: 10 })
			const req = mock.history.get[mock.history.get.length - 1]
			expect(req?.params).toMatchObject({ page: 2, per_page: 10 })
		})
	})

	describe('get()', () => {
		it('returns unwrapped user by ID', async () => {
			mock.onGet(`${USERS_URL}/1`).reply(200, mockSingle)
			const result = await api.get(1)
			expect(result).toEqual(mockUser)
		})

		it('throws PelicanError on 404', async () => {
			mock.onGet(`${USERS_URL}/999`).reply(404, {
				errors: [{ code: 'NotFound', status: '404', detail: 'User not found' }],
			})
			await expect(api.get(999)).rejects.toBeInstanceOf(PelicanError)
		})
	})

	describe('create()', () => {
		it('sends POST and returns unwrapped user', async () => {
			mock.onPost(USERS_URL).reply(201, mockSingle)
			const result = await api.create({ email: 'new@example.com', username: 'newuser', password: 'secret' })
			expect(result).toEqual(mockUser)
		})
	})

	describe('update()', () => {
		it('sends PATCH and returns unwrapped user', async () => {
			mock.onPatch(`${USERS_URL}/1`).reply(200, mockSingle)
			const result = await api.update(1, { email: 'updated@example.com' })
			expect(result).toEqual(mockUser)
		})
	})

	describe('delete()', () => {
		it('resolves to void on 204', async () => {
			mock.onDelete(`${USERS_URL}/1`).reply(204)
			await expect(api.delete(1)).resolves.toBeUndefined()
		})
	})

	describe('getByExternalId()', () => {
		it('fetches by external ID', async () => {
			mock.onGet(`${USERS_URL}/external/ext-abc`).reply(200, mockSingle)
			const result = await api.getByExternalId('ext-abc')
			expect(result).toEqual(mockUser)
		})
	})
})
