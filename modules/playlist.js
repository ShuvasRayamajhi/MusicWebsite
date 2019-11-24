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
}
