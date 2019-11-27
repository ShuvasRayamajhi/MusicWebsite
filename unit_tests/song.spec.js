
'use strict'
const mock = require('mock-fs')
const Songs = require('../modules/song.js')
//const File = require('../modules/song.js')
const fs = require('fs')
// const song = await new Songs()

describe('uploadSong()', () => {
	test('error if blank username', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.uploadSong('asd', 'asd', ) )
			.rejects.toEqual( Error('file name can not be empty') )
		done()
	})

	test('error if blank path', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.uploadSong('', 'asd', 'asd'))
			.rejects.toEqual( Error('path can not be empty') )
		done()
	})

	test('error if blank file type', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.uploadSong('asd', '', 'asd'))
			.rejects.toEqual( Error('file type can not be empty') )
		done()
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
	test('blank song data', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.playSong('1') )
			.rejects.toEqual( Error('no play song data') )
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
