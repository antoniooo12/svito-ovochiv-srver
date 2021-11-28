const db = require('../db/db')
const {Sequelize} = require("sequelize");
const {Product} = require("../db/model/models");
const {OrderProduct} = require("../db/model/models");
const {OrderProductList} = require("../db/model/models");
const {Order} = require("../db/model/models");
const {Basket} = require("../db/model/models");
const {User} = require("../db/model/models");


class ClientController {


    async addToCart(req, res) {
        try {

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: `We cann't add products`})

        }
    }

    async createOrder(req, res) {
        try {
            const client = req.body.client
            let cart = req.body.cart
            const user = await User.upsert({
                firstName: client.name,
                number: client.number,
            })
            console.log(user[0].dataValues.id)
            let basket = await Basket.findOrCreate({
                where: {userId: user[0].dataValues.id}
            })
            console.log(basket[0].dataValues.id)
            let order = await Order.create({
                status: 'виконуеться',
                customerNumber: user[0].dataValues.number,
                basketId: basket[0].dataValues.id,
            })

            let orderProductList = await OrderProductList.create({orderId: order.id})

            let toFindProduct = cart.map(el => el.id)
            const foundProducts = await Product.findAll({
                where: {
                    id: {[Sequelize.Op.in]: toFindProduct}
                }
            })
            cart = cart.map(el => {
                const pFromDb = foundProducts.filter(pDb => pDb.id === el.id)[0]

                const totalPrice = Math.round(((el.weight * pFromDb.price) + Number.EPSILON) * 100) / 100
                const p = {
                    weight: el.weight,
                    price: pFromDb.price,
                    totalPrice: totalPrice,
                    orderProductListId: orderProductList.id,
                    productId: pFromDb.id,
                }
                console.log(p)
                return p
            })

            const orderProduct = await OrderProduct.bulkCreate(cart)

            console.log('=========')
            console.log(cart)


            // console.log('========')
            // console.log(basket)
            // const order = await Order.create({
            //     basketId: basket.id,
            //     status: 'виконується',
            // })
            // let toFindProduct = cart.map(el => el.id)
            // const foundProducts = await Product.findAll({
            //     where: {
            //         id: {[Sequelize.Op.in]: toFindProduct}
            //     }
            // })
            // foundProducts.map(el => {
            //     const p = el.dataValues;
            //     return {id: p.id, price: p.price}
            // })
            // const orderProductList = await OrderProductList.create({orderId: order.id})
            //
            // cart.map(el => {
            //     const pFromDb = foundProducts.filter(pDb => pDb.id === el.id)[0]
            //     const totalPrice = el.weight * pFromDb.price
            //     const p = {
            //         weight: el.weight,
            //         price: pFromDb.price,
            //         totalPrice: totalPrice,
            //         orderProductListId: orderProductList.id,
            //         productId: pFromDb.id,
            //     }
            //     console.log(p)
            //     return p
            // })
            // const orderProduct = await OrderProduct.bulkCreate(cart)
            //
            // // console.log(foundProducts)
            // console.log('========')
            // console.log(foundProducts)
            return res.json({})
        } catch (e) {
            console.log(e)
        }
    }
}


module.exports = new ClientController()