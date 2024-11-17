const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

const SALT_LENGTH = 10

router.post('/signup', async(req, res) => {
    
    try {
        const userInDatabase = await User.findOne({ username: req.body.username})
        if(userInDatabase){
            return res.json(400),json({mesage: "Username already exits"})
        }
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        res.json(user)
        
    } catch (error) {
        console.log(error)
    }
})


module.exports = router