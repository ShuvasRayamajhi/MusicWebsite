
'use strict'
const mock = require('mock-fs')
const Songs = require('../modules/song.js')
//const File = require('../modules/song.js')
const fs = require('fs')
// const song = await new Songs()
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
	test('file name can\'t be empty', async done => {
		expect.assertions(1)
		try {
			const song = await new Songs()
			await song.uploadSong('asd', 'asd', '')
			done.fail('test failed')
		}catch(err) {
			expect(err.message).toBe('file name can not be empty')
		} finally {
			done()
		}
	})
	test('path can\'t be empty', async done => {
		expect.assertions(1)
		try {
			const song = await new Songs()
			await song.uploadSong('', 'asd', 'asd')
			done.fail('test failed')
		}catch(err) {
			expect(err.message).toBe('path can not be empty')
		} finally {
			done()
		}
	})
	test('file type can\'t be empty', async done => {
		expect.assertions(1)
		try {
			const song = await new Songs()
			await song.uploadSong('asd', '', 'asd')
			done.fail('test failed')
		}catch(err) {
			expect(err.message).toBe('file type can not be empty')
		} finally {
			done()
		}
	})
})

describe('playSong()', () => {
	test('blank id', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.playSong('') )
			.rejects.toEqual( Error('missing id') )
		done()
	})
})

describe('displaySong()', () => {
	test('blank data', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.getData() )
			.rejects.toEqual( Error('missing data') )
		done()
	})

})
