'use strict'

const fs = require('fs')

module.exports = class File {
    constructor() {}

    async savePicture(filename, imageData) {
        if (filename === undefined || filename === '') throw new Error(`filename can't be empty`)
        if (imageData === undefined || imageData === '') throw new Error(`image Data can't be empty`)
        fs.writeFile(filename, imageData, 'binary', (err) => {
            if (err) throw new Error(err)
            console.log('File saved.')
        })
    }

    readPicture(filename) {
        if (filename === undefined || filename === '') throw new Error(`filename can't be empty`)
        try {
            fs.readFileSync(filename, 'binary')
        } catch(err) {
            throw new Error(`file doesn't exist`)
        }
    }
}