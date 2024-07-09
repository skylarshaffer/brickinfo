import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'
import { blColorNameToBlColorId } from '../db/blColorNametoBlColorId.js'

const dbName = 'elementIdToBlColorId'

const srcFile = '../xml/bl/codes.xml'

const jsHeader = `export const ${dbName} = `

readFile(srcFile, function(err, data) {
    parseString(data, function (err, result) {
        const destObj = {}
        const srcArray = result.CODES.ITEM
        srcArray.forEach((item) => {
            destObj[item.CODENAME] = blColorNameToBlColorId[item.COLOR[0]]
        })
        writeFileSync(`../db/${dbName}.js`, jsHeader + (JSON.stringify(destObj, null, 2)))
    });
});