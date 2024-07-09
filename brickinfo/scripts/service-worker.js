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

importScripts('../data/colors.js')
importScripts('../data/elementToPart.js')
importScripts('../data/api.js')

let fullPartsObj = {}
let apiLoading = true
console.log(fullPartsObj)

chrome.webRequest.onBeforeRequest.addListener(
  function(details)
  {
    if (details.frameId === 0) {
      const decoder = new TextDecoder();
      console.log(decoder.decode(details.requestBody.raw[0].bytes))
      const body = decoder.decode(details.requestBody.raw[0].bytes)
      const reqUrl = 'https://www.lego.com/api/graphql/PickABrickQuery'
      console.log(details)
      fetch(reqUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }).then((res) => {
        if (res.status !== 200) {
          console.log({word: 'Error', desc: 'There was a problem fetching element data'});
          return
        }
        res.json().then((data) => {
          console.log(data)
          fullPartsObj = {}
          const rbPartsArray = []
          const blPartsArray = []
          const elementsArray = data.data.elements.results
          console.log(data.data.elements.results)
          elementsArray.forEach((element) => {
            if (element.__typename === 'SingleVariantElement') {
              fullPartsObj[`${element.variant.id}`] = {lego_id: element.variant.attributes.designNumber, lego_color_id: element.variant.attributes.colourId, element_id: element.variant.id}
              rbPartsArray.push(element.variant.attributes.designNumber)
            }
            else {
              rbPartsArray.push('xxxx')
              console.log('MultiVariantElement')
            }
          })
          for (const part in fullPartsObj) {
            if (colors[fullPartsObj[part].lego_color_id] !== undefined) {
              fullPartsObj[part].bricklink_color_id = colors[fullPartsObj[part].lego_color_id]
            } else {
              fullPartsObj[part].bricklink_color_id = 0
            }
            console.log('HERE: ', fullPartsObj[part].lego_id, elements[fullPartsObj[part].element_id])
            if (elements[fullPartsObj[part].element_id] !== undefined) {
              fullPartsObj[part].bricklink_id = elements[fullPartsObj[part].element_id]
            } else {
              fullPartsObj[part].bricklink_id = fullPartsObj[part].lego_id
            }
            blPartsArray.push(
              {
                "item":{
                  "no":fullPartsObj[part].bricklink_id,
                  "type":"PART"
                },
                "color_id":fullPartsObj[part].bricklink_color_id
              }
            )
            if (fullPartsObj[part].bricklink_id === '3168pb06') {
              console.log('THIS ONE NOW: ',{
                "item":{
                  "no":fullPartsObj[part].bricklink_id,
                  "type":"PART"
                },
                "color_id":fullPartsObj[part].bricklink_color_id
              })
            }
          }
          console.log(fullPartsObj)
          const apiKey = blAffiliateApiKey
          const baseUrl = 'https://api.bricklink.com/api/affiliate/v1'
          const reqUrl = `${baseUrl}/price_guide_batch?api_key=${apiKey}`
          console.log('blPartsArray: ',blPartsArray)
          fetch(reqUrl, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(blPartsArray)
          }).then((res) => {
            if (res.status !== 200) {
              console.log({word: 'Error', desc: 'There was a problem fetching element data'});
              return
            }
            if (res.status === 500) {
              console.log({word: 'Error', desc: 'Affiliate API is down at the moment. Please wait.'});
              return
            }
            res.json().then((data) => {
              const blResultsArray = data.data
              const blPriceObj = {}
              console.log('blResultsArray: ',blResultsArray)
              blResultsArray.forEach((element) => {
                blPriceObj[`${element.item.no}-${element.color_id}`] = (Number(element.inventory_used.total_price)/element.inventory_used.total_quantity).toFixed(2)
                console.log(`
                  ${element.item.no}
                  ${element.color_id}
                  ${Number(element.inventory_used.total_price)}
                  ${element.inventory_used.total_quantity}
                  `
                )
              })
              console.log(blPriceObj)
              for (const part in fullPartsObj) {
                if (blPriceObj[`${fullPartsObj[part].bricklink_id}-${fullPartsObj[part].bricklink_color_id}`] !== undefined) {
                  console.log(blPriceObj[`${fullPartsObj[part].bricklink_id}-${fullPartsObj[part].bricklink_color_id}`])
                  if (fullPartsObj[part].bricklink_id === '3168pb06') {
                    console.log('THIS ONE NOW: ',fullPartsObj[part].bricklink_id,fullPartsObj[part].bricklink_color_id)
                  }
                  fullPartsObj[part].bricklink_price = blPriceObj[`${fullPartsObj[part].bricklink_id}-${fullPartsObj[part].bricklink_color_id}`]
                } else {
                  fullPartsObj[part].bricklink_price = null
                }
              }
              console.log(fullPartsObj)
              console.log('setting apiLoading false')
              apiLoading = false
            })
          }).catch((err) => {
            console.log({word: 'Error', desc: 'There was a problem fetching element data'})
          })
        })
      }).catch((err) => {
        console.log({word: 'Error', desc: 'There was a problem fetching element data'})
      })
    }
  },
  {urls: ["https://www.lego.com/api/graphql/PickABrickQuery"]},
  ['requestBody']
);

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.name === "getBlDetails") {
    function returnElement() {
      if (apiLoading === false) {
        const elementId = message.elementId
        if (fullPartsObj[elementId] !== undefined) {
          response(fullPartsObj[elementId])
        } else {
          console.log('test:',{word: 'Error', desc: 'Element property does not exist in fullPartsObj'})
          response({word: 'Error', desc: 'Element property does not exist in fullPartsObj'});
        }
        if (typeof interval !== 'undefined') {
          clearInterval(interval);
        }
      }
    }
    if (apiLoading === false) {
      returnElement()
    } else {
      const interval = setInterval(returnElement, 100);
    }
  }
  if (message.name === "pricesDone") {
    apiLoading = true
    console.log('setting apiLoading true')
  }
  return true
})
