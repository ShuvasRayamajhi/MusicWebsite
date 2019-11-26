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
const fs = require('fs-extra')
const sqlite = require('sqlite-async')


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
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const song = await new Song(dbName)
		const data = await song.getData()
		await ctx.render('index', {title: 'Favourite songs', songs: data})
	} catch(err) {
		await ctx.render('error', { message: err.message })
	}
})
router.get('/play/:song_id', async ctx => {
	try {
		const song = await new Song(dbName)
		const id = ctx.params.song_id
		const data = await song.playSong(id)
		const newdata = JSON.parse(JSON.stringify(data))
		ctx.response.type = 'mp3'
		ctx.response.body = fs.readFileSync(newdata.location)
	} catch(err) {
		fs.createReadStream.close
		ctx.body = err.message
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))
//router.get('/upload', async ctx => await ctx.render('upload'))
router.get('/upload', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		await ctx.render('upload')
	} catch(err) {

		ctx.body = err.message
	}
})
/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 * 
 */
router.post('/register', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
router.post('/uploadSong', koaBody, async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const body = ctx.request.body
		const song = await new Song(dbName)
		const {path, type} = ctx.request.files.song
		console.log(type)
		await song.uploadSong(path, type, body.filename)
		console.log('uploaded')
		ctx.redirect('/?msg=new song uploaded')
		await ctx.render('index')
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
	ctx.render('login')
	ctx.redirect('/?msg=you are now logged out')
})
app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
