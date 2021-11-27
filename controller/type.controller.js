const {Type} = require('../db/model/models')

class TypeController {
    async create(req, res) {
        const {title} = req.body
        const type = await Type.create({title})
        return res.json(type)
    }

    async create(typeName) {
        const type = await Type.upsert({title: typeName},{
            returning: true,
            plain: true
        })
        console.log('+++++++')
        console.log(type[0].dataValues.id)
        return type[0].dataValues.id
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
}

module.exports = new TypeController()