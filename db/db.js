const mysql = require('mysql2/promise')
const config = require('config')
const dbParams = config.get('db')

const configDb = {
    host: dbParams.host,
    user: dbParams.user,
    password: dbParams.password,
    database: dbParams.database,
    connectionLimit: 10,
    queueLimit: 0
}
// const pool = mysql.createPool(configDb);


const pool = mysql.createPool({
    host: dbParams.host,
    user: dbParams.user,
    password: dbParams.password,
    database: dbParams.database,
    port: dbParams.port,
})
console.log('++++++--')
console.log(pool)
module.exports = pool








