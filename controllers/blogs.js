const blogRouter = require('express').Router()
const Blog = require('../models/blog.model')

blogRouter.get('/', async (request, response) => {
    response.send(await Blog.find({}))
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    await blog.save()
    response.status(201).json(blog)
})

module.exports = blogRouter