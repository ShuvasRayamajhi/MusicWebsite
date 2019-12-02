
'use strict'
const mock = require('mock-fs')
const Songs = require('../modules/song.js')
//const File = require('../modules/song.js')
const fs = require('fs')

describe('uploadSong()', () => {
	test('error if blank path', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.uploadSong('', 'asd', 'asd')).rejects.toEqual( Error('path can not be empty') )
		done()
	})

	test('error if blank file type', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.uploadSong('asd', '', 'asd'))
			.rejects.toEqual( Error('file type can not be empty') )
		done()
	})
	test('error if blank filename', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.uploadSong('asd', 'asd', ''))
			.rejects.toEqual( Error('file name can not be empty') )
		done()
	})
	//need mockfs
	// test('uploaded song', async done => {
	// 	expect.assertions(1)
	// 	const song = await new Songs()
	// 	const result = await song.uploadSong('path', 'abc', 'abc')
	// 	expect(result).toEqual(true)
	// 	done()
	// })
})

describe('playSong()', () => {
	test('blank id', async done => {
		expect.assertions(1)
		const song = await new Songs()
		await expect( song.playSong('') ).rejects.toEqual( Error('missing id') )
		done()
	})
	// test('non integer id', async done => {
	// 	expect.assertions(1)
	// 	const song = await new Songs()
	// 	await expect( song.playSong('a') ).rejects.toEqual( Error('non integer id') )
	// 	done()
	// })

	//need mockfs, also need to call upload song function
	test('no play song data', async done => {
		expect.assertions(1)
		const song = await new Songs()
		const result = await song.playSong(1)
		expect(result).toEqual(undefined)
		done()
	})
})

describe('displaySong()', () => {
	//need mockfs
	test('no display song data', async done => {
		expect.assertions(1)
		const song = await new Songs()
		const result = await song.getData()
		expect(result).toEqual([])
		done()
	})
	// test('blank data', async done => {
	// 	expect.assertions(1)
	// 	const song = await new Songs()
	// 	await expect( song.getData() )
	// 		.rejects.toEqual( Error('missing data') )
	// 	done()
	// })
})
