const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const typeController = require('../controller/type.controller')
const productController = require('../controller/product.controller')

router.post('/type', authMiddleware, typeController.create)
router.get('/type', typeController.getAll)
router.post('/addProductPhoto', authMiddleware, productController.addImage)
router.post('/addType', authMiddleware, productController.addType)
router.get('/type', authMiddleware, productController.addImage)


module.exports = router
