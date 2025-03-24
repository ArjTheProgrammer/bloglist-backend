const blogRouter = require('express').Router()
const Blog = require('../models/blog.model')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')


blogRouter.get('/', async (request, response) => {
    response.send(await Blog.find({}).populate('user', {username: 1, name: 1}))
})

blogRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id){
        response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({ 
        title: body.title, 
        author: body.author, 
        url: body.url, 
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id){
        response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if (user.id.toString() != blog.user.toString()){
        response.status(403).json({error: "Invalid permission"}).end()
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const updateData = {}

    if (request.body.title !== undefined) {
        updateData.title = request.body.title
    }
    if (request.body.author !== undefined) {
        updateData.author = request.body.author
    }
    if (request.body.url !== undefined) {
        updateData.url = request.body.url
    }
    if (request.body.likes !== undefined) {
        updateData.likes = request.body.likes
    }
    if (request.body.userid !== undefined) {
        updateData.user = request.body.userid
    }

    const updateBlog = await Blog.findByIdAndUpdate(request.params.id, updateData, { new: true })

    if (updateBlog) {
        console.log(updateBlog)
        response.send(updateBlog)
    } else {
        response.status(404).send({ error: "Blog not found" })
    }
});

module.exports = blogRouter