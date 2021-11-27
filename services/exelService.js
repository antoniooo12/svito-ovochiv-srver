const fs = require('fs')
const config = require('config')
const xlsx = require('xlsx')
const {Product} = require("../db/model/models");
const db = require('../db/db')
const typeController = require('../controller/type.controller')

class ExelService {
    constructor(path) {
        this.path = path
        this.toDb = []
        this.toDbString = ''
    }

    async parse() {
        let tempString = ''
        const exelJS = await xlsx.readFile(`${this.path}`)
        const exelJSSheet = await exelJS.Sheets[exelJS.SheetNames[0]]
        let writeBool = false
        let block = {
            title: '',
            unit: '',
            price: 0,
            typeId: 0,
        }
        const nav = Object.keys(exelJSSheet)
        for (let j = 0; j < nav.length; j++) {

            let param = exelJSSheet[nav[j]].v
            if (writeBool) {

                if (nav[j][0] === 'B') {
                    block.title = checkToqoute(param)
                    tempString += `('${checkToqoute(block.title)}', `

                } else if (nav[j][0] === 'C') {
                    block.unit = param;
                    tempString += `'${block.unit}', `
                } else if (nav[j][0] === 'D') {
                    block.price = param;
                    tempString += `${block.price}),`
                    this.toDb.push(block)
                } else if (nav[j][0] === 'E') {
                    const typeId = await typeController.create(param)
                    block.typeId = typeId;
                    block = {}
                }
            }

            if (param === 'тип') {
                writeBool = true
            }
        }
        // this.toDbString = tempString.slice(0, -1);
        this.parsToString()

    }

    async parsToString() {
        const lengthOfP = Object.keys(this.toDb[0]).length
        let string = ''
        for (let i = 0; i < this.toDb.length; i++) {
            let j = 0
            for (const argEl in this.toDb[i]) {
                if (j === 0) {
                    string += '('
                }
                if (j < lengthOfP - 1) {
                    string += ` '${(this.toDb[i][argEl])}',`
                }
                if (j === lengthOfP - 1) {
                    string += ` ${this.toDb[i][argEl]}`
                    string += '),'
                }
                j++
            }
        }
        // this.toDbString = string
        console.log(string)
        console.log('sssss')
        console.log(this.toDbString)
        console.log('sssss')
    }

    async uploadToDb() {
        console.log(this.toDb)
        try {
            let newTitle = ''
            this.toDb.forEach(product => {
                newTitle += ` '${checkToqoute(product.title)}' ,`
            })
            newTitle = newTitle.slice(0, -1)
            console.log(newTitle)

            await db.query(`UPDATE products
                            SET actual = false
                            WHERE title NOT IN (${newTitle});`)
            await db.query(`UPDATE products
                            SET actual = true
                            WHERE title IN (${newTitle});`)
        } catch (e) {
            console.log(e)
        }
        console.log(this.toDb)
        try {
            const res = await Product.bulkCreate(this.toDb,
                {updateOnDuplicate: ["title", "price"]})
            console.log(res)
            // await db.query(`INSERT INTO products (title, unit, price, "typeId")
            // VALUES
            // ${this.toDbString}
            //                 ON CONFLICT (title)
            // DO UPDATE SET (title, price) = (EXCLUDED.title, EXCLUDED.price);`)
        } catch (e) {
            console.log(e)
        }

    }
}


function checkToqoute(word = '') {
    let arr = word.split("'")
    word = arr.join("''")
    return word
}

module.exports = ExelService