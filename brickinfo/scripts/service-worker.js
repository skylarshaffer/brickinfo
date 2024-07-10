// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Provides credentials when an HTTP Basic Auth request is received.

importScripts('../data/elementIdToBlPartIdColorId.js')
importScripts('../data/api.js')

let elementsObj = {}
console.log(elementsObj)


chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.name === "fetchPrices") {
    const blReqArr = []
    const elementsArr = message.elementsArr
    console.log('elementsArr: ',elementsArr)
    const apiKey = blAffiliateApiKey
    const baseUrl = 'https://api.bricklink.com/api/affiliate/v1'
    const reqUrl = `${baseUrl}/price_guide_batch?api_key=${apiKey}`
    elementsArr.forEach((element) => {
      elementsObj[element] = {
        bricklink: {
          partId: elementIdToBlPartIdColorId[element].partId,
          colorId: elementIdToBlPartIdColorId[element].colorId
        }
      }
      blReqArr.push(
        {
          "item":{
            "no":elementsObj[element].bricklink.partId,
            "type":"PART"
          },
          "color_id":elementsObj[element].bricklink.colorId
        }
      )
    })
    console.log('blReqArr: ',blReqArr)
    fetch(reqUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blReqArr)
    }).then((res) => {
      if (res.status !== 200) {
        if (res.status === 500) {
          console.log({word: 'Error', desc: 'Affiliate API is down at the moment. Please wait.'});
          return
        }
        console.log({word: 'Error', desc: 'There was a problem with the Affiliate API request'});
        return
      }
      res.json().then((data) => {
        const blResArr = data.data
        const blPriceObj = {}
        console.log('blResArr: ',blResArr)
        blResArr.forEach((element) => {
          blPriceObj[`${element.item.no}-${element.color_id}`] = (Number(element.inventory_used.total_price)/element.inventory_used.total_quantity).toFixed(2)
        })
        console.log('blPriceObj: ',blPriceObj)
        for (const element in elementsObj) {
          if (typeof blPriceObj[`${elementsObj[element].bricklink.partId}-${elementsObj[element].bricklink.colorId}`] !== 'undefined') {
            console.log('price: ',blPriceObj[`${elementsObj[element].bricklink.partId}-${elementsObj[element].bricklink.colorId}`])
            elementsObj[element].bricklink.price = blPriceObj[`${elementsObj[element].bricklink.partId}-${elementsObj[element].bricklink.colorId}`]
          } else {
            console.log('no price found')
            elementsObj[element].bricklink.price = null
          }
        }
        console.log(elementsObj)
        console.log({word: 'Success', desc: 'elementsObj done forming.'})
        response({word: 'Success', desc: 'elementsObj done forming.'})
        return
      })
    }).catch((err) => {
      console.log({word: 'Error', desc: 'There was a problem with the Affiliate API request'})
    })
  }
  if (message.name === "getBlPrice") {
    const elementId = message.elementId
    if (typeof elementsObj[elementId] !== 'undefined') {
      response(elementsObj[elementId].bricklink.price)
    } else {
      console.log('test:',{word: 'Error', desc: 'Element property does not exist in elementsObj'})
      response({word: 'Error', desc: 'Element property does not exist in elementsObj'});
    }
  }
  return true
})
