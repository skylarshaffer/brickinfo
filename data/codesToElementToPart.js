import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'


const elementToPartJsHeader = 'const elements = '

readFile('xml/codes.xml', function(err, data) {
    parseString(data, function (err, result) {
        const elementToPartObj = {}
        const codesArray = result.CODES.ITEM
        codesArray.forEach((code) => {
            elementToPartObj[code.CODENAME] = code.ITEMID[0]
        })
        writeFileSync('js/elementToPart.js', elementToPartJsHeader + (JSON.stringify(elementToPartObj, null, 2)))
    });
});