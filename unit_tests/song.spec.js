'use strict'

const mock = require('mock-fs')
const File = require ('../modules/song.js')
const fs = require('fs')
const file = new File()

beforeAll( async() => {
	mock({
		'test': {
			'foobar': 'foobar2\n'
		}
	})
})

afterAll( async() => {
	mock.restore()
})

describe('uploadSong()', () => {
	beforeEach( async() => {})
	afterEach( async() => {})

	test(`filename can't be empty string`, async done => {
		expect.assertions(1)
		try {
			await file.uploadSong('', 'asd')
			done.fail('test failed')
		} catch(err) {
			expect(err.message).toBe(`filename can't be empty`)
		} finally {
			done()
		}
	})
	test(`filename can't be undefined`, async done => {
		expect.assertions(1)
		try {
			await file.uploadSong()
			done.fail('test failed')
		} catch(err) {
			expect(err.message).toBe(`filename can't be empty`)
		} finally {
			done()
		}
	})
	test(`song can't be empty`, async done => {
		expect.assertions(1)
		try {
			await file.uploadSong('foo.mp3')
			done.fail('test failed')
		} catch(err) {
			expect(err.message).toBe(`song can't be empty`)
		} finally {
			done()
		}
	})
})
