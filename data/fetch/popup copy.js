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