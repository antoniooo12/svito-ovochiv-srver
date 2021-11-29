const {Sequelize} = require('sequelize')
const config = require('config')


const dbParams = config.get('db')
const sequelize = new Sequelize(dbParams.database,
    dbParams.user, dbParams.password, {
        port: dbParams.port,
        host: dbParams.host,
        dialect: dbParams.type
    })

module.exports = sequelize