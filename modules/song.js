/* eslint-disable complexity */
/* eslint-disable max-len */
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const fs = require('fs-extra')
const sqlite = require('sqlite-async')
const nodeID3 = require('node-id3')

module.exports = class Song {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS songs (song_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, album TEXT, genre TEXT, location TEXT, year INTEGER, image TEXT);'
			await this.db.run(sql)
			return this
		})()
	}


	async uploadSong(path, type, filename ) {
		try {
			if (path === '') throw new Error('path can not be empty')
			if (type === '') throw new Error('file type can not be empty')
			if (filename === '') throw new Error('file name can not be empty')
			await fs.copy(path, `public/songs/${filename}.mp3`)
			const location = `public/songs/${filename}.mp3`
			if(location === undefined) throw new Error('location can not be empty')
			const read = nodeID3.read(location)
			const sql = `INSERT INTO songs(title, artist, album, genre, location, year) VALUES("${read.title}", "${read.artist}", "${read.album}", "${read.genre}", "${location}", "${read.year}")`
			await this.db.run(sql)
			await this.db.close()
			return true
		}catch(err) {
			throw err
		}
	}

	async playSong(id) {
		try {
			if(id.length === 0) throw new Error('missing id')
			const sql = `SELECT location FROM songs WHERE song_id = ${id} LIMIT 1;`
			const data = await this.db.get(sql)
			await this.db.run(sql)
			await this.db.close()
			return data
		} catch(err) {
			throw err
		}
	}

	async getData() {
		try {
			const sql = 'SELECT * FROM songs;'
			const data = await this.db.all(sql)
			await this.db.run(sql)
			await this.db.close()
			//if (data.length === 0) throw new Error('missing data')
			return data
		} catch(err) {
			throw err
		}
	}
}
