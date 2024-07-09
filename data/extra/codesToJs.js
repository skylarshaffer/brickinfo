import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'


const codesJsHeader = 'export const codes = '

readFile('../xml/codes.xml', function(err, data) {
    parseString(data, function (err, result) {
        const newCodesArray = [];
        const codesArray = result.CODES.ITEM
        codesArray.forEach((code) => {
            newCodesArray.push({'element_id': code.CODENAME[0], 'part_id': code.ITEMID[0], 'color_name': code.COLOR[0]})
        })
        writeFileSync('js/codes.js', codesJsHeader + (JSON.stringify(newCodesArray, null, 2)))
    });
});