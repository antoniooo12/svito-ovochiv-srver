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

const Product = sequelize.define('product',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true},
    units:{type: DataTypes.STRING},
    // actual:{type: DataTypes.BOOLEAN,defaultValue: false},
    price:{type: DataTypes.DECIMAL(10, 2)},
    // photo: {type: DataTypes.STRING, require},
},{  createdAt: false, updatedAt:false})


module.exports = {
    User: User,
    Product,
}
