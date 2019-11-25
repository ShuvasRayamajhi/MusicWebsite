'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const fs = require('fs-extra')
const sqlite = require('sqlite-async')
const nodeID3 = require('node-id3')
const saltRounds = 10

module.exports = class Playlist {

    constructor(dbName = ':memory:' ) {
        return (async() => {
            this.db = await sqlite.open(dbName)
            return this
        })()
    }
        async createTable(plname) {
            const sql = `CREATE TABLE IF NOT EXISTS ${plname} (pl_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pic TEXT, song TEXT);`
            console.log(plname)
            await this.db.run(sql)
            return this
		}
		async uploadPicture(path, type, plname, fileExtension) {
            const extension = mime.extension(type)
            console.log(`song title: ${plname}`)
            console.log(`extension: ${extension}`)
            await fs.copy(path, `public/covers/${plname}.${fileExtension}`)
            const location = `covers/${plname}.${fileExtension}`
            const sql = `INSERT INTO ${plname} (name, pic) VALUES("${plname}", "${location}")`
            console.log(location)
            await this.db.run(sql)
            return true
    }
        async plData() {
        try {
            const sql = 'SELECT * FROM playlist1;'
            const data = await this.db.all(sql)
            await this.db.run(sql)
            await this.db.close()
            return data
        } catch(err) {
            throw err
        }
    }
}
