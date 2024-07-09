import { writeFileSync } from 'fs'
import { colors } from '../js/colors.js'
import { codes } from './js/codes.js'



const elementsJsHeader = 'export const elements = '

const elementsObj = {};
const elementPartsObj = {}
codes.forEach((code) => {
    elementsObj[code.element_id] = {'part_id': code.part_id, 'color_id': colors[code.color_name]}
})
writeFileSync('js/elements.js', elementsJsHeader + (JSON.stringify(elementsObj, null, 2)))