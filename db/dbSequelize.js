const {Sequelize} = require('sequelize')
const config = require('config')


const dbParams = config.get('db')
const sequelize = new Sequelize(dbParams.database,
    dbParams.user, dbParams.password, {
        port: dbParams.port,
        host: 'localhost',
        dialect: 'postgres'
    })

module.exports = sequelize