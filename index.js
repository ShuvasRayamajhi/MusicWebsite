#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa');
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const fs = require('fs-extra')
const lame = require('node-lame')
const sqlite = require('sqlite-async')
const saltRounds = 10
const bitrate = require('bitrate')
const NodeID3 = require('node-id3')
const mm = require('musicmetadata')

// create a new parser from a node ReadStream

//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Song = require('./modules/song')

const app = new Koa()
/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080

const port = process.env.PORT || defaultPort
const dbName = 'website.db'

app.use(views(`${__dirname}/views`, {extension: 'html'}, {map: {handlebars: 'handlebars' }}))
app.use(bodyParser({
	encoding: 'multipart/form-data'
}))

const router = new Router()
/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */

router.get('/', async ctx => {
	try {
		//console.log('/index')
		const sql = 'SELECT song_id, title, location FROM songs;'
		const db = await sqlite.open(dbName)
		const data = await db.all(sql)
		await db.close()
		console.log(data)
		await ctx.render('index', {title: 'Favourite songs', songs: data})
	} catch(err) {
		ctx.body = err.message
	}
})


// const parser = mm(fs.createReadStream('public/songs/Hood_Politics.mp3'), function (err, metadata) {
//  	if (err) throw err
// 	console.log(metadata)
//    })

router.get('/play/:song_id', async ctx => {
	try {
		const sql = `SELECT location FROM songs WHERE song_id = ${ctx.params.song_id} LIMIT 1;`
		const db = await sqlite.open(dbName)
		const data = await db.get(sql)
		await db.close()
		const newdata = JSON.parse(JSON.stringify(data))
		console.log(newdata)
		ctx.response.type = 'mp3'
		ctx.response.body = fs.createReadStream(newdata.location)
	} catch(err) {
		ctx.body = err.message
	}
})


router.get('/meta', async ctx => {

})


router.get('/play', async ctx => {
	//console.log('/index')
	const location = 'public/songs/xxx.mp3'
	ctx.response.type = 'mp3'
	ctx.response.body = fs.createReadStream(location)
	console.log(location)
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))
router.get('/upload', async ctx => await ctx.render('upload'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 * 
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		//console.log(body)
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/* router.post('/uploadPicture', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		// call the functions in the module
		const song = await new Song(dbName)
		//save image
		const {path, type} = ctx.request.files.pic
		const fileExtension = mime.extension(type)
		await song.uploadPicture(path, type, body.title, fileExtension)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
}) */

router.post('/uploadSong', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		//console.log(body)
		// call the functions in the module
		const song = await new Song(dbName)
		//save song
		const {path, type} = ctx.request.files.song
		await song.uploadSong(path, type, body.title)
		// redirect to the home page
		console.log('uploaded')
		ctx.redirect(`/?msg=new song "${body.title}" uploaded`)
		const title = body.title
		await ctx.render('index', {index: title})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})


router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		return ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

app
	.use(router.routes())
	.use(router.allowedMethods())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
