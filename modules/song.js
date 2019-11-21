'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const fs = require('fs-extra')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class Song {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS songs (song_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT);'
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

	async uploadSong(path, mimeType, title,) {
		try {
			if(title.length === 0) throw new Error('missing title')
			//if (extension !== 'mp3') throw new Error('Only mp3 files allowed')
			console.log(`song title: ${title}`)
			await fs.copy(path, `public/songs/${title}.mp3`)
			const location = `public/songs/${title}.mp3`
			const sql = `INSERT INTO songs(title, location) VALUES("${title}", "${location}")`
			console.log(location)
			await this.db.run(sql)
			await this.db.close()
			return true
		}catch(err) {
			throw err
		}
	}
}