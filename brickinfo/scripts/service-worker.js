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

importScripts('./db/writeArrayToDb.js')
importScripts('./db/getAllDb.js')
importScripts('./db/getDb.js')


let blAffiliateApiKey = ''
async function getApiKey(callback) {
  if (blAffiliateApiKey !== '') {
    callback(blAffiliateApiKey)
  }
  const blAffiliateApiKeyObj = await chrome.storage.sync.get("blAffiliateApiKey")
  blAffiliateApiKey = blAffiliateApiKeyObj.blAffiliateApiKey
  callback(blAffiliateApiKey) 
}

let elementsObj = {}
console.log(elementsObj)

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.name === "getBlDb") {
    let viewType
    const blNewSessionId = message.blNewSessionId
    const downloadType = message.downloadType
    switch (downloadType) {
      case 'types':
        viewType = 1
        break;
      case 'categories':
        viewType = 2
        break;
      case 'colors':
        viewType = 3
        break;
      case 'codes':
        viewType = 5
        break;
    }
    fetch('https://www.bricklink.com/catalogDownload.asp?a=a',{
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `BLNEWSESSIONID=${blNewSessionId}`
        },
        body: new URLSearchParams({ viewType: viewType })
    }).then((res) => {
        console.log(res)
        if (res.status !== 200) {
          console.log({word: 'Error', desc: 'There was a problem downloading db from Bricklink.'});
          return
        }
        if (res.url.startsWith('https://www.bricklink.com/v2/login.page?')) {
          response({word: 'Error', desc: 'Not logged in to Bricklink'});
          return
        } 
        res.text().then((data) => {
          switch (downloadType) {
            case 'itemtypes':
              if (data.startsWith('Item Type ID	Item Type Name')) {
                console.log({word: 'Success', data: 'Downloaded itemtypes.txt. Responding with data.'})
                response({word: 'Success',downloadType, data})
              }
              break;
            case 'categories':
              if (data.startsWith('Category ID	Category Name')) {
                console.log({word: 'Success', data: 'Downloaded categories.txt. Responding with data.'})
                response({word: 'Success',downloadType, data})
              }
              break;
            case 'colors':
              if (data.startsWith('Color ID	Color Name	RGB	Type	Parts	In Sets	Wanted	For Sale	Year From	Year To')) {
                console.log({word: 'Success', data: 'Downloaded colors.txt. Responding with data.'})
                response({word: 'Success',downloadType, data})
              }
              break;
            case 'codes':
              if (data.startsWith('Item No	Color	Code')) {
                console.log({word: 'Success', data: 'Downloaded codes.txt. Responding with data.'})
                response({word: 'Success',downloadType, data})
              }
              break;
            default:
              console.log({word: 'Exception', data: 'Response unexpected, proceeding anyway.'})
              response({word: 'Exception',downloadType, data})
          }
        })   
    }).catch((err) => {
      console.log({word: 'Error', desc: 'There was a problem downloading db from Bricklink.'})
    })
  }
  if (message.name === "fetchPrices") {
    const blReqArr = []
    const elementsArr = message.elementsArr
    console.log('elementsArr: ',elementsArr)
    getApiKey((apiKey) => {
      const baseUrl = 'https://api.bricklink.com/api/affiliate/v1'
      const reqUrl = `${baseUrl}/price_guide_batch?api_key=${apiKey}`
      console.log('reqUrl: ',reqUrl)
      const elementsArrPromiseArray = []
      elementsArr.forEach((element) => {
        elementsArrPromiseArray.push(new Promise((resolve, reject) => {
          getDb({dbName: 'BricklinkDB',objectStoreName: 'Elements',elementId: element})
          .then((result) => {
            elementsObj[element] = {
              bricklink: {
                partId: result.partIdArr[0],
                colorId: result.colorIdArr[0]
              }
            }
            console.log('elementsObj: ',elementsObj)
            blReqArr.push(
              {
                "item":{
                  "no":elementsObj[element].bricklink.partId,
                  "type":"PART"
                },
                "color_id":elementsObj[element].bricklink.colorId
              }
            )
            resolve()
          })
        }))
      });
      Promise.all(elementsArrPromiseArray).then(() => {
        console.log('blReqArr: ',blReqArr)
        console.log('about to request: ', apiKey)
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
            console.log({word: 'Error', desc: 'There was a problem with the Affiliate API request.'});
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
            response({word: 'Success', desc: 'elementsObj done forming.'})
          })
        }).catch((err) => {
          console.log({word: 'Error', desc: 'There was a problem with the Affiliate API request.'})
        })
      })
    }) 
  }
  if (message.name === "getBlPrice") {
    const elementId = message.elementId
    if (typeof elementsObj[elementId] !== 'undefined') {
      console.log('price is: ', elementsObj[elementId].bricklink.price)
      response(elementsObj[elementId].bricklink.price)
    } else {
      console.log('test:',{word: 'Error', desc: 'Element property does not exist in elementsObj.'})
      response({word: 'Error', desc: 'Element property does not exist in elementsObj.'});
    }
  }
  if (message.name === "writeArrayToDb") {
    
    
      const dbName = message.dbName
      const objectStoreName = message.objectStoreName
      const dataArr = message.dataArr
      writeArrayToDb({dbName,objectStoreName,dataArr})
      response({word: 'Success', desc: 'Done writing array to indexeddb.'})
  }
  if (message.name === "getAllDb") {
    const dbName = message.dbName
    const objectStoreName = message.objectStoreName
    getAllDb({dbName,objectStoreName}).then((response) => {
      console.log('response success: ',response)
      response(response)
    })
  }
  if (message.name === "getDb") {
    const dbName = message.dbName
    const objectStoreName = message.objectStoreName
    const elementId = message.elementId
    getDb({dbName,objectStoreName,elementId}).then((result) => {
      console.log('response success: ',result)
      response(result)
    })
  }
  return true
})