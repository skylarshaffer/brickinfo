import { writeFileSync } from 'fs'
import { rbApiKey } from './api.js'



const colorsJsHeader = 'const colors = '

const apiKey = rbApiKey
const authHeader = `key ${apiKey}`
const baseUrl = 'https://rebrickable.com//api/v3'
const reqUrl = `${baseUrl}/lego/colors/?page_size=999`
fetch(reqUrl, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
    }
})
.then((res) => {
    if (res.status !== 200) {
        console.log({word: 'Error', desc: 'There was a problem fetching color list'});
        return
    }
    res.json().then((data) => {
        const colorsResultsArray = data.results
        const colorsObj = {}
        colorsResultsArray.forEach((color) => {
            if (typeof color.external_ids.LEGO !== 'undefined' && typeof color.external_ids.BrickLink !== 'undefined') {
                colorsObj[color.external_ids.LEGO.ext_ids[0]] = color.external_ids.BrickLink.ext_ids[0]
            }
        })
        writeFileSync('js/colors.js', colorsJsHeader + (JSON.stringify(colorsObj, null, 2)))
    })
    }).catch((err) => {
    console.log({word: 'Error', desc: 'There was a problem fetching color list'})
})
/* const colorsObj = {}
colorsArray.forEach((code) => {
    colors[code.CODENAME] = code.ITEMID[0]
})
writeFileSync('js/elementToPart.js', colorsJsHeader + (JSON.stringify(colorsObj, null, 2))) */