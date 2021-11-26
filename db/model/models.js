const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require('../dbSequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true},
    unit: {type: DataTypes.STRING},
    actual: {type: DataTypes.BOOLEAN, defaultValue: true},
    price: {type: DataTypes.DECIMAL(10, 2)},
    image: {type: DataTypes.STRING, defaultValue: ''},
}, {createdAt: false, updatedAt: false})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true, allowNull: false}
},{createdAt: false, updatedAt: false})
const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sum: {type: DataTypes.DECIMAL(10, 2)},

})
const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    sum: {type: DataTypes.DECIMAL(10, 2)},
    status: {type: DataTypes.STRING,},
    customerNumber: {type: DataTypes.STRING,},
})

const OrderProduct = sequelize.define('orderProduct', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.DECIMAL(10, 1)},
    totalPrice: {type: DataTypes.DECIMAL(10, 2)},
})

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(Order)
Order.belongsTo(Basket)

Order.hasMany(OrderProduct)
OrderProduct.belongsTo(Order)

Product.hasMany(OrderProduct)
OrderProduct.belongsTo(Product)

Type.hasMany(Product)
Product.belongsTo(Type)


module.exports = {
    User,
    Product,
    Type,
    Basket,
    Order,
    OrderProduct,
}
