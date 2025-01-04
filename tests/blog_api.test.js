const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog.model')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
  
    await Blog.insertMany(helper.blogs)
  })

test('blogs returned as json', async () => {
    await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('check if all has id attributes and not _id', async () => {
    const blogs = await api.get('/api/blogs/')

    blogs.body.forEach(blog => {
        console.log(blog)
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

after(async () => {
    mongoose.connection.close()
})