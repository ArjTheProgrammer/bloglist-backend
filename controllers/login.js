const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user.model')

loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body

    const user = await User.findOne({username})

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(username && passwordCorrect)){
        response.status(401).json(
            {
                error: "invalid username or password"
            }
        )
    }

    const userToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userToken, process.env.SECRET, {expiresIn: 60*60})

    response.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRouter