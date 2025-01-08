const blogRouter = require('express').Router()
const Blog = require('../models/blog.model')

blogRouter.get('/', async (request, response) => {
    response.send(await Blog.find({}))
})

blogRouter.post('/', async (request, response) => {
    const { title, author, url, likes = 0 } = request.body
    const blog = new Blog({ title, author, url, likes })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

module.exports = blogRouter