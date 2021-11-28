const express = require('express')
const config = require('config')
const {Sequelize} = require('sequelize')
const PORT = config.get('serverPort') || 4200
const fileUpload = require("express-fileupload")
const xlsx = require('xlsx')
const cors = require('cors')
const path = require('path')

const authMiddleware = require('./middleware/authMiddleware')
const sequelize = require('./db/dbSequelize')
const fileRouter = require('./routes/fileRouter.routes')
const userRouter = require('./routes/user.routes')
const adminRouter = require('./routes/admi.routers')
const {OrderProductList} = require("./db/model/models");
const {Order} = require("./db/model/models");
const {Basket} = require("./db/model/models");
const {Type} = require("./db/model/models");
const {OrderProduct} = require("./db/model/models");
const {User} = require("./db/model/models");
const {Product} = require("./db/model/models");
const app = express()


app.use(fileUpload({}))
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4800', 'http://localhost:2999']
}))
app.use(express.json())
app.use(express.static('static'))

let pathStatic = path.join(__dirname,'static')
console.log(pathStatic)

app.get('/api/content', (req,res)=>{
    res.sendFile(pathStatic)
})


app.use('/api/user', userRouter)
app.use('/api/files', fileRouter)
app.use('/api/admin', authMiddleware, adminRouter)




const start = async () => {
    try {
        await sequelize.authenticate()
        // await sequelize.sync()
        // await User.sync({force: true})
        // await Type.sync({force: true})
        // await Basket.sync({force: true})
        // await Order.sync({force: true})
        // await OrderProduct.sync({force: true})
        // await OrderProductList.sync({force: true})
        console.log('Соединение с БД было успешно установлено')
        app.listen(PORT, () =>
            console.log(`server run on  ${PORT}`)
        )
    } catch (e) {
        console.log(e)
        console.log('Невозможно выполнить подключение к БД: ', e)

    }
}

start()