import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'

const dbName = 'elementIdToBlPartId'

const srcFile = '../xml/bl/codes.xml'

const jsHeader = `export const ${dbName} = `

readFile(srcFile, function(err, data) {
    parseString(data, function (err, result) {
        const destObj = {}
        const srcArray = result.CODES.ITEM
        srcArray.forEach((item) => {
            destObj[item.CODENAME] = item.ITEMID[0]
        })
        writeFileSync(`../db/${dbName}.js`, jsHeader + (JSON.stringify(destObj, null, 2)))
    });
});