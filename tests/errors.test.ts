import { describe, expect, it } from 'vitest'
import { PelicanError } from '../src/errors.js'

describe('PelicanError', () => {
	it('creates with HTTP status when body is null', () => {
		const err = new PelicanError(404, null)
		expect(err.status).toBe(404)
		expect(err.message).toBe('HTTP 404')
		expect(err.errors).toEqual([])
		expect(err.name).toBe('PelicanError')
	})

	it('extracts first error detail as message', () => {
		const body = { errors: [{ code: 'NotFound', status: '404', detail: 'Resource not found' }] }
		const err = new PelicanError(404, body)
		expect(err.message).toBe('Resource not found')
		expect(err.errors).toHaveLength(1)
		expect(err.errors[0]?.detail).toBe('Resource not found')
	})

	it('collects all errors from the response body', () => {
		const body = {
			errors: [
				{ code: 'ValidationError', status: '422', detail: 'Email is invalid' },
				{ code: 'ValidationError', status: '422', detail: 'Username is taken' },
			],
		}
		const err = new PelicanError(422, body)
		expect(err.errors).toHaveLength(2)
		expect(err.message).toBe('Email is invalid')
	})

	it('falls back to HTTP status message when errors array is missing', () => {
		const err = new PelicanError(500, { message: 'Internal Server Error' })
		expect(err.errors).toEqual([])
		expect(err.message).toBe('HTTP 500')
	})

	it('is instanceof both Error and PelicanError', () => {
		const err = new PelicanError(500, null)
		expect(err).toBeInstanceOf(Error)
		expect(err).toBeInstanceOf(PelicanError)
	})

	it('includes optional source field in errors', () => {
		const body = {
			errors: [{ code: 'ValidationError', status: '422', detail: 'Required', source: { field: 'email' } }],
		}
		const err = new PelicanError(422, body)
		expect(err.errors[0]?.source?.field).toBe('email')
	})
})
