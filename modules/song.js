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

	async uploadSong(path, type, filename ) {
		try {
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
