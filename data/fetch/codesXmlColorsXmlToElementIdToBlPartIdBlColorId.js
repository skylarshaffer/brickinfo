import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'

let srcFile = '../xml/bl/colors.xml'

let blColorNameToBlColorId = {}

readFile(srcFile, function(err, data) {
    parseString(data, function (err, result) {
        const destObj = {};
        const srcArray = result.CATALOG.ITEM
        srcArray.forEach((item) => {
            destObj[item.COLORNAME] = item.COLOR[0]
        })
        blColorNameToBlColorId = destObj
    });
});

const dbName = 'elementIdToBlPartIdColorId'

srcFile = '../xml/bl/codes.xml'

const jsHeader = `export const ${dbName} = `

readFile(srcFile, function(err, data) {
    parseString(data, function (err, result) {
        const destObj = {}
        const srcArray = result.CODES.ITEM
        srcArray.forEach((item) => {
            destObj[item.CODENAME] = { partId: item.ITEMID[0], colorId: blColorNameToBlColorId[item.COLOR[0]] }
        })
        writeFileSync(`../db/${dbName}.js`, jsHeader + (JSON.stringify(destObj, null, 2)))
    });
});