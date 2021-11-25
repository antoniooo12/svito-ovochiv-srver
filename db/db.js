const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password:"root",
    host:"localhost",
    port:5555,
    database:"svitovochiv"
})







module.exports = pool