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
const  fileRouter = require('./routes/fileRouter.routes')
const userRouter = require('./routes/user.routes')
const adminRouter = require('./routes/admi.routers')
const {Product} = require("./db/model/models");
const app = express()

app.use(cors({
    origin:['http://localhost:3000','http://localhost:3001', 'http://localhost:4800']
}))
app.use(express.static(path.resolve(__dirname, 'files', 'static')))
app.use(fileUpload({}))
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/files', fileRouter)
app.use('/api/admin', authMiddleware, adminRouter)




const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Соединение с БД было успешно установлено')
        app.listen(PORT, () =>
            console.log(`server run on ${PORT}`)
        )
    } catch (e) {
        console.log(e)
        console.log('Невозможно выполнить подключение к БД: ', e)

    }
}

start()