const userRouter = require('express').Router()
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body
    const passwordHash = await bcrypt.hash(password, 10)

    if (password.length < 3){
        response.status(404).json({error: "password must be at least 3 characters long"})
    }

    const newUser = new User({username, name, passwordHash})

    const savedUser = await newUser.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    response.send(await User.find({}))
})

module.exports = userRouter