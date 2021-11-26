const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

const userController = require('../controller/user.controller')
const clientController = require('../controller/client.controller')
const productController = require('../controller/product.controller')

router.post('/registration', userController.registrationUser)
router.post('/login', userController.loginUser)
router.get('/auth', authMiddleware, userController.authUser)
router.get('/product', productController.getAllProducts)
router.post('/product', clientController.addToCart)

module.exports = router