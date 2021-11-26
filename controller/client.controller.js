const db = require('../db/db')


class ClientController {


    async addToCart(req, res) {
        try {

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: `We cann't add products`})

        }
    }
}


module.exports = new ClientController()