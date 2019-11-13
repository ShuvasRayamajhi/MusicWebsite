
'use strict'

const mock = require('mock-fs')

const File = require('../modules/file')
const fs = require('fs')

beforeAll( async() => {
})

afterAll( async() => {
})

describe('savePicture()', () => {
    beforeEach( async() => {
        mock({
            'test': {
                'foo': 'bar'
            }
        });
    })
    afterEach( async() => {
        afterEach(mock.restore);
    })
    test(`filename can't be empty string`, async done => {
        expect.assertions(1)
        try {
            file.savePicture('', 'asd')
            done.fail('test failed')
        } catch(err) {
            expect(err.message).toBe(`filename can't be empty`)
        } finally {
            done()
        }
    })
    test(`filename can't be undefined`, async done => {
        expect.assertions(1)
        try {
            file.savePicture()
            done.fail('test failed')
        } catch(err) {
            expect(err.message).toBe(`filename can't be empty`)
        } finally {
            done()
        }
    })
    test(`imageData can't be empty`, async done => {
        expect.assertions(1)
        try {
            file.savePicture('foo.jpg')
            done.fail('test failed')
        } catch(err) {
            expect(err.message).toBe(`imageData can't be empty`)
        } finally {
            done()
        }
    })
    test(`binary information has to be correctly saved`, async done => {
        expect.assertions(1)
        try {
            const file = new File()
            file.savePicture('test/foobar', 'raboof')
            fs.readFile('test/foobar', 'binary', (err, data) => {
                if (err) throw new Error(err)
                expect(data).toBe('raboof')
            })
        } catch(err) {
            done.fail('test failed')
        } finally {
            done()
        }
    })
})

describe('readPicture()', () => {
    beforeEach( async() => {
        mock({
            '/test': {
                'foo': 'bar'
            }
        });
    })
    afterEach( async() => {
        afterEach(mock.restore);
    })
    test(`filename can't be empty`, async done => {
        expect.assertions(1)
        try {
            file.readPicture('')
            done.fail('test failed')
        } catch(err) {
            expect(err.message).toBe(`filename can't be empty`)
        } finally {
            done()
        }
    })
    test(`filename can't be undefined`, async done => {
        expect.assertions(1)
        try {
            file.readPicture()
            done.fail('test failed')
        } catch(err) {
            expect(err.message).toBe(`filename can't be empty`)
        } finally {
            done()
        }
    })
    test('file has to exist', async done => {
        expect.assertions(1)
        try {
            file.readPicture('nonExistent.txt')
            done.fail('test failed')
        } catch(err) {
            expect(err.message).toBe(`file doesn't exist`)
        } finally {
            done()
        }
    })
    test(`binary information has to be correctly read`, async done => {
        expect.assertions(1)
        try {
            const file = new File()
            expect(file.readPicture('test/foo')).toBe('bar')
        } catch(err) {
            done.fail('test failed')
        } finally {
            done()
        }
    })
})