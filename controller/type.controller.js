const {Type} = require('../db/model/models')

class TypeController {
    async create(req, res) {
        const {title} = req.body
        const type = await Type.create({title})
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
}

module.exports = new TypeController()