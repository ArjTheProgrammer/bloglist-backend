const userRouter = require('express').Router()
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body()
    const passwordHash = bcrypt.hash(password, 10)

    const newUser = new User({username, name, passwordHash})

    const savedUser = await newUser.save()

    response.status(201).json(savedUser)
})

module.exports = userRouter