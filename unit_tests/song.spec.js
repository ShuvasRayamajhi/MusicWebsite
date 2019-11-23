'use strict'

const mock = require('mock-fs')
const Song = require ('../modules/song.js')
const fs = require('fs')
const File = require ('../modules/song.js')

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
			const song = await new Song()
			await song.uploadSong('', 'asd')
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
			const song = await new Song()
			await song.uploadSong()
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
			const song = await new Song()
			await song.uploadSong('foo.mp3')
			done.fail('test failed')
		} catch(err) {
			expect(err.message).toBe(`song can't be empty`)
		} finally {
			done()
		}
	})
})
