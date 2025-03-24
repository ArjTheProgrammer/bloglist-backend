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

test('400 post request for missing title/url', async () => {
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

test('get a single blog using id', async () => {
    const blogs = await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogById = await api
    .get(`/api/blogs/${blogs.body[0].id}/`)

    assert.deepStrictEqual(blogs.body[0], blogById.body)
})

test('delete a single blog using id', async () => {
    const blogs = await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const contents = blogs.body

    console.log(contents)

    await api
    .delete(`/api/blogs/${contents[0].id}/`)
    .expect(204)

    await api
    .get(`/api/blogs/${blogs.body[0].id}/`)
    .expect(404)
})

test.only('update a single blog using id', async () => {
    const blogs = await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const contents = blogs.body

    const prevBlog = contents[0]

    console.log(prevBlog)

    const update = await api
    .put(`/api/blogs/${contents[0].id}/`)
    .send({likes: 10})
    .expect(200)

    const blog = await api.get(`/api/blogs/${contents[0].id}/`)

    console.log(update.body)
    console.log(blog.body)

    assert.strictEqual(update.body.likes, blog.body.likes)
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No Token Blog',
      author: 'No Token Author',
      url: 'http://notoken.com',
      likes: 0,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401) // Expect unauthorized
      .expect('Content-Type', /application\/json/);
  
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length); // No new blogs should be added
  });

after(async () => {
    mongoose.connection.close()
})