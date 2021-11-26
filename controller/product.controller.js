const uuid = require('uuid')
const config = require('config')
const path = require('path')

const {Product} = require('../db/model/models')

class ProductController {
    async addImage(req, res) {
        try {
            const {id} = req.body
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            image.mv(path.resolve(__dirname, '..', 'files', 'static', fileName))
            const produt = await Product.update({image: fileName}, {where: {id}})
            return res.json(produt)
        } catch (e) {
            console.log(e)
        }
    }

    async addType(req, res) {
        try {
            const {id, typeId} = req.body
            const product = await Product.update({typeId}, {where: {id}})
            return res.json(product)
        } catch (e) {
            console.log(e)
        }
    }

    async getAllProducts(req, res) {
        try {
            const {typeId} = req.body
            let products;
            if (!typeId) {
                products = await Product.findAll({where: {actual: true}})
            }
            if (typeId) {
                products = await Product.findAll({where: {typeId, actual: true}})
            }
            return res.json(products)

        } catch (e) {
            return res.status(404).json({message: `We cann't get products`})
        }
    }
}


module.exports = new ProductController()
