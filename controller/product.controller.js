const uuid = require('uuid')
const config = require('config')
const path = require('path')
const {Type} = require("../db/model/models");
const {Product} = require('../db/model/models')
const pool = require('../db/db')
class ProductController {
    async addImage(req, res) {
        try {

            const {id} = req.body
            let image = req.files.file
            console.log(image)
            let fileName = await uuid.v4() + ".jpg"
            let filePath = await path.resolve(__dirname, '..', 'files', 'static', fileName)
            console.log(filePath)
            await image.mv(filePath)
            const produt = await Product.update({image: fileName}, {where: {id}})
            return res.json(filePath)
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
                products = await Product.findAll({
                    where: {actual: true},
                    order: [['typeId', 'ASC'], ['title', 'ASC']],
                })
            }
            if (typeId) {
                products = await Product.findAll({where: {typeId, actual: true}})
            }
            console.log(req)
            return res.json(products)

        } catch (e) {
            return res.status(404).json({message: `Cann't get products`})
        }
    }

    async getAllSections(req, res) {
        let query = `select *
                     from types
                     where Id in (select typeId from products where actual = 1 group by typeId);`
        const [rows] = await pool.execute(query)
        console.log(rows)

        return res.json(rows)
    }
}


module.exports = new ProductController()
