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

test('check if all has id attributes and not _id', async () => {
    const blogs = await api.get('/api/blogs/')

    blogs.body.forEach(blog => {
        console.log(blog)
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test('adding new blog data', async () => {
    const newBlog = {
        title: "I love hallways",
        author: "sisigbuyas",
        url: "http://facebook.com/silaganrj",
        likes: 2
    }

    await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const savedBlogs = await helper.blogsInDb()

    assert.strictEqual(savedBlogs.length, helper.blogs.length + 1)

    const contents = savedBlogs.map(blog => {
        return {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes
        }
    })

    console.log(contents)

    assert.deepStrictEqual(contents[contents.length - 1], newBlog)
})

test('verifies that if the likes property is missing from the request', async () => {
    const newBlog = {
        title: "I love hallways",
        author: "sisigbuyas",
        url: "http://facebook.com/silaganrj",
    }

    await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const savedBlogs = await helper.blogsInDb()

    console.log(savedBlogs[savedBlogs.length - 1])

    assert.strictEqual(savedBlogs[savedBlogs.length - 1].likes, 0)
})

test.only('400 post request for missing title/url', async () => {
    const newBlog = {
        title: "I love hallways",
        author: "sisigbuyas"
    }

    await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
    mongoose.connection.close()
})