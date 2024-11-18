const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const SALT_LENGTH = 10

router.post('/signup', async(req, res) => {
    
    try {
        const userInDatabase = await User.findOne({ username: req.body.username})
        if(userInDatabase){
            return res.status(400).json({mesage: "Username already exits"})
        }
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        const token = jwt.sign(
            {username: user.username, _id: user._id},
            process.env.JWT_SECRET)
        res.json({user, token})
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/signin', async(req, res) => {
    
    try {
        
        const user = await User.findOne({username: req.body.username})
        console.log(user)
         if(user && bcrypt.compareSync(req.body.password, user.hashedPassword)){
            const token = jwt.sign(
                {username: user.username, _id: user._id},
                process.env.JWT_SECRET)
            res.json({user, token})
         }else {
            res.status(400).json({ error: "invalid username or password" })
         }
    } catch (error) {
        console.log(error)
    } 

})

module.exports = router