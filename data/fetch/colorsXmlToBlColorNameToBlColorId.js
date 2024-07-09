import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'

const dbName = 'blColorNameToBlColorId'

const srcFile = '../xml/bl/colors.xml'

const jsHeader = `export const ${dbName} = `

readFile(srcFile, function(err, data) {
    parseString(data, function (err, result) {
        const destObj = {};
        const srcArray = result.CATALOG.ITEM
        srcArray.forEach((item) => {
            destObj[item.COLORNAME] = item.COLOR[0]
        })
        writeFileSync(`../db/${dbName}.js`, jsHeader + (JSON.stringify(destObj, null, 2)))
    });
});