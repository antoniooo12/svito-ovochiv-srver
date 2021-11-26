const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

const {check, validationResult} = require('express-validator')


const {User} = require('../db/model/models')

class UserController {
    async registrationUser(req, res) {
        try {
            const {firstName, lastName, email,password,  role} = req.body

            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return res.status(400).json({message: `User with ${email} is already exist`})
            }

            const hashPassword = await bcrypt.hash(password, 8)

            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashPassword,
                role: "USER",
            })
            await user.save()
            return res.json(user)
            return res.json({message: "User was created"})
        } catch (e) {
            console.log(e)
        }
    }

    async loginUser(req, res){
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid) {
            return res.status(400).json({message: "password is invalid"})
        }
        const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})

        return res.json({
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        })
    }
    async authUser(req, res){
        try {
            const user = await User.findOne({where:{id: req.user.id}})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        }catch (e) {
            console.log(e)
            res.send({message: "Auth error : " + e.message})
        }
    }
}

module.exports = new UserController()