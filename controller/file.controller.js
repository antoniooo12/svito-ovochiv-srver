const fs = require('fs')
const xlsx = require('xlsx')
const config = require('config')
const ExelService = require('../services/exelService')
const path = require("path");


class FileController {
    async uploadFile(req, res) {
        try {
            const file = req.files.file
            const type = file.name.split('.').pop()

            if (type !== 'xlsx') {
                return res.status(403).json({message: "файл не формату xlsx"})
            }
            let pathFile = path.resolve(__dirname, '..', 'files', file.name)
            // let    path = `${config.get('filePath')}\\${file.name}`
            // if (fs.existsSync(path)) {
            //     return res.status(400).json({message: "file already exist"})
            // }
            await file.mv(pathFile)
            const newFile = new ExelService(pathFile)
            await newFile.parse()
            await newFile.uploadToDb()
            res.json({message: 'успішно'})
        } catch (e) {

        }

    }
}

module.exports = new FileController()