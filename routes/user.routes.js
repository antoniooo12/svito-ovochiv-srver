const Router = require('express')
const router =new Router()
const authMiddleware = require('../middleware/authMiddleware')

const userController = require('../controller/user.controller')

router.post('/registration', userController.registrationUser )
router.post('/login', userController.loginUser )
router.get('/auth', authMiddleware, userController.authUser )



module.exports = router