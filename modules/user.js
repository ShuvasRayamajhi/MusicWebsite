
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const fs = require('fs-extra')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(user, pass) {
		try {
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, pass) VALUES("${user}", "${pass}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
	async uploadPicture(path, mimeType, username, fileExtension) {
		const extension = mime.extension(mimeType)
		console.log(`user: ${username}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
		const location = `public/avatars/${username}.${fileExtension}`
		const sql = `UPDATE users SET image=(" ${location} ") WHERE user= ("${username}")`
		console.log(location)
		await this.db.run(sql)
		return true
	}

	async uploadSong(path, mimeType, title, fileExtension, username) {
		const extension = mime.extension(mimeType)
		console.log(`user: ${username}`)
		console.log(`song title: ${title}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/songs/${title}.${fileExtension}`)
		//const location2 = `public/songs/${title}`
		//const sql = `INSERT INTO users (song) VALUES("${location2}") WHERE user= ("${username}")`
		//console.log(location2)
		//await this.db.run(sql)
    	//return true
	}
	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)
			return true
		} catch(err) {
			throw err
		}
	}

}
