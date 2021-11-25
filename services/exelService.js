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
                    block.units = param;
                    tempString += `'${block.units}', `
                } else if (nav[j][0] === 'D') {
                    block.price = param;
                    tempString += `${block.price}),`

                    this.toDb.push(block)
                    block = {}
                }
            }

            if (param === 'Склад') {
                writeBool = true
            }
        }
        // console.log('======')
        this.toDbString = tempString.slice(0, -1);
        console.log(this.toDbString)
        // console.log('======')
    }

    async uploadToDb() {

        try {
            // const res = await Product.bulkCreate(this.toDb, {
            //     updateOnDuplicate: ['id', 'name']
            // }).then(() => {
            //     return Product.findAll();
            // }).then(product => {
            //     // console.log() // ... in order to get the array of user objects
            // })
            const st = `('test3', 'tt', 40)`
            // console.log(this.toDbString)
            await db.query(`INSERT INTO products (title, units, price)
            VALUES
            ${this.toDbString}
                            ON CONFLICT (title)
            DO UPDATE SET (title, price) = (EXCLUDED.title, EXCLUDED.price);                               `)


        } catch (e) {
            console.log('!!!!!!!!!===!!!!!!!!!!!')
            console.log(e)
        }

    }
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function checkToqoute(word) {
    let arr = word.split("'")
    word = arr.join("''")
    console.log(word)
    return word
}

module.exports = ExelService