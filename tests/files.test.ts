import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import type { FileObject, ListResponse, SingleResponse } from '../src/types/index.js'
import { createFilesApi } from '../src/api/client/server/files.js'

const mock = new MockAdapter(axios)
beforeEach(() => mock.reset())
afterAll(() => mock.restore())

const BASE = 'https://panel.example.com'
const TOKEN = 'test-token'
const UUID = 'server-uuid-123'
const FILES_URL = `${BASE}/api/client/servers/${UUID}/files`

const mockFile: FileObject = {
	name: 'test.txt',
	mode: '644',
	mode_bits: 420,
	size: 1024,
	is_file: true,
	is_symlink: false,
	mimetype: 'text/plain',
	created_at: '2024-01-01T00:00:00.000Z',
	modified_at: '2024-01-01T00:00:00.000Z',
}

describe('createFilesApi', () => {
	const api = createFilesApi(BASE, TOKEN, UUID)

	describe('list()', () => {
		it('returns array of FileObjects', async () => {
			const response: ListResponse<FileObject> = {
				object: 'list',
				data: [{ object: 'file_object', attributes: mockFile }],
			}
			mock.onGet(`${FILES_URL}/list`).reply(200, response)
			const result = await api.list()
			expect(result).toHaveLength(1)
			expect(result[0]).toEqual(mockFile)
		})

		it('passes directory as query param', async () => {
			const response: ListResponse<FileObject> = { object: 'list', data: [] }
			mock.onGet(`${FILES_URL}/list`).reply(200, response)
			await api.list('/home')
			const req = mock.history.get[mock.history.get.length - 1]
			expect(req?.params).toEqual({ directory: '/home' })
		})

		it('omits directory param when not provided', async () => {
			const response: ListResponse<FileObject> = { object: 'list', data: [] }
			mock.onGet(`${FILES_URL}/list`).reply(200, response)
			await api.list()
			const req = mock.history.get[mock.history.get.length - 1]
			expect(req?.params).toBeUndefined()
		})
	})

	describe('getContents()', () => {
		it('returns file content as string', async () => {
			mock.onGet(`${FILES_URL}/contents`).reply(200, 'hello world')
			const result = await api.getContents('test.txt')
			expect(result).toBe('hello world')
		})
	})

	describe('getDownloadUrl()', () => {
		it('returns the signed URL', async () => {
			const response: SingleResponse<{ url: string }> = {
				object: 'signed_url',
				attributes: { url: 'https://cdn.example.com/file.txt?token=abc' },
			}
			mock.onGet(`${FILES_URL}/download`).reply(200, response)
			const url = await api.getDownloadUrl('test.txt')
			expect(url).toBe('https://cdn.example.com/file.txt?token=abc')
		})
	})

	describe('write()', () => {
		it('resolves to void on success', async () => {
			mock.onPost(`${FILES_URL}/write`).reply(204)
			await expect(api.write('test.txt', 'hello world')).resolves.toBeUndefined()
		})
	})

	describe('rename()', () => {
		it('resolves to void on success', async () => {
			mock.onPut(`${FILES_URL}/rename`).reply(204)
			await expect(
				api.rename({ root: '/', files: [{ from: 'old.txt', to: 'new.txt' }] }),
			).resolves.toBeUndefined()
		})
	})

	describe('delete()', () => {
		it('resolves to void on success', async () => {
			mock.onPost(`${FILES_URL}/delete`).reply(204)
			await expect(api.delete({ root: '/', files: ['test.txt'] })).resolves.toBeUndefined()
		})
	})

	describe('createFolder()', () => {
		it('resolves to void on success', async () => {
			mock.onPost(`${FILES_URL}/create-folder`).reply(204)
			await expect(api.createFolder({ name: 'new-folder' })).resolves.toBeUndefined()
		})
	})
})
