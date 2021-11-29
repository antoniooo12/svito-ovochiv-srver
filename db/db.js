const mysql = require('mysql2')
const config = require('config')
const dbParams = config.get('db')

const pool  = mysql.createConnection({
    host: dbParams.host,
    user: dbParams.user,
    password:dbParams.password,
    database: dbParams.database,
    port: dbParams.port,
})


// const pool = mysql.createCone({
//     user: "postgres",
//     password:"root",
//     host:"localhost",
//     port:5555,
//     database:"svitovochiv"
// })
//






module.exports = pool