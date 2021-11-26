const fs = require('fs')
const config = require('config')
const xlsx = require('xlsx')
const {Product} = require("../db/model/models");
const db = require('../db/db')

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
            units: '',
            price: 0,
        }
        const nav = Object.keys(exelJSSheet)
        for (let j = 0; j < nav.length; j++) {
            let param = exelJSSheet[nav[j]].v
            if (writeBool) {
                if (nav[j][0] === 'B') {
                    block.title = param
                    tempString += `('${checkToqoute( block.title)}', `

                } else if (nav[j][0] === 'C') {
                    block.unit = param;
                    tempString += `'${block.unit}', `
                } else if (nav[j][0] === 'D') {
                    block.price = param;
                    tempString += `${block.price}),`
                    this.toDb.push(block)
                    block = {}
                    console.log()
                }
            }

            if (param === 'Склад') {
                writeBool = true
            }
        }
        // console.log('======')
        this.toDbString = tempString.slice(0, -1);
        console.log(this.toDbString)
        // console.log('===========')
    }

    async uploadToDb() {
        console.log(this.toDb)
        try {
            let newTitle = ''
            this.toDb.forEach(product => {
                newTitle += ` '${checkToqoute(product.title)}' ,`
            })
            newTitle = newTitle.slice(0, -1)
            let res = await db.query(`UPDATE products SET actual =false WHERE title NOT IN (${newTitle});`)
        } catch (e) {
            console.log(e)
        }
        try {
            await db.query(`INSERT INTO products (title, unit, price)
            VALUES
            ${this.toDbString}
                            ON CONFLICT (title)
            DO UPDATE SET (title, price) = (EXCLUDED.title, EXCLUDED.price);                               `)
        } catch (e) {
            console.log(e)
        }

    }
}



function checkToqoute(word) {
    let arr = word.split("'")
    word = arr.join("''")
    console.log(word)
    return word
}

module.exports = ExelService