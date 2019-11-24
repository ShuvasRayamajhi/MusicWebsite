'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const fs = require('fs-extra')
const sqlite = require('sqlite-async')
const nodeID3 = require('node-id3')
const saltRounds = 10

module.exports = class Song {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS songs (song_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, album TEXT, genre TEXT, location TEXT);'
			await this.db.run(sql)
			return this
		})()
	}
//picture
/* 	async uploadPicture(path, mimeType, title, fileExtension) {
		const extension = mime.extension(mimeType)
		console.log(`song title: ${title}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/covers/${title}.${fileExtension}`)
		const location = `public/covers/${title}.${fileExtension}`
		const sql = `INSERT INTO songs(cover) VALUES("${location}")`
		console.log(location)
		await this.db.run(sql)
		return true
	} */
//song

	async uploadSong(path, type, filename ) {
		if (filename === undefined || filename === '') throw new error (`filename can't be empty`)
		if (type === undefined || type !== 'mpeg') throw new errot (`file can only be mp3.`)
		try {
			//if (extension !== 'mp3') throw new Error('Only mp3 files allowed')
			await fs.copy(path, `public/songs/${filename}.mp3`)
			const location = `public/songs/${filename}.mp3`
			const read = nodeID3.read(location)
			JSON.parse(JSON.stringify(read))
			const sql = `INSERT INTO songs(title, artist, album, genre, location) VALUES("${read.title}", "${read.artist}", "${read.album}", "${read.genre}", "${location}")`
			console.log(location)
			await this.db.run(sql)
			await this.db.close()
			return true
		}catch(err) {
			throw err
		}
	}
	async playSong(id) {
		try {
			console.log(id)
			const sql = `SELECT location FROM songs WHERE song_id = ${id} LIMIT 1;`
			const data = await this.db.get(sql)
			await this.db.run(sql)
			await this.db.close()
			return data
		} catch(err) {
			throw err
		}
	}
	async metaData(metadata) {
		console.log(metadata)
		return metadata
	}

}
