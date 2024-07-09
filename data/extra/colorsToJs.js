import { parseString } from 'xml2js'
import { readFile, writeFileSync } from 'fs'



const colorsJsHeader = 'export const colors = '


readFile('xml/colors.xml', function(err, data) {
    parseString(data, function (err, result) {
        const colorsObj = {};
        const colorsArray = result.CATALOG.ITEM
        colorsArray.forEach((color) => {
            colorsObj[color.COLORNAME] = color.COLOR[0]
        })
        writeFileSync('js/colors.js', colorsJsHeader + (JSON.stringify(colorsObj, null, 2)))
    });
});