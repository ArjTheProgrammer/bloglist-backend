const blogRouter = require('express').Router()
const Blog = require('../models/blog.model')

blogRouter.get('/', (request, response) => {
    Blog
    .find({})
    .then((blogs) => {
        response.send(blogs)
    })
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
    .save()
    .then(savedBlog => {
        response.json(savedBlog)
    })
})

module.exports = blogRouter