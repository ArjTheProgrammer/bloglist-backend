const blogRouter = require('express').Router()
const { request } = require('express')
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

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog){
        response.send(blog)
    }
    else{
        response.status(404).end()
    }
    
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const updateBlog = await Blog.findByIdAndUpdate(request.params.id, {likes: request.body.likes}, {new: true})

    if (updateBlog) {
        console.log(updateBlog)
        response.send(updateBlog)
    }
    else{
        response.status(404).send({error: "Blog not found"})
    }
})

module.exports = blogRouter