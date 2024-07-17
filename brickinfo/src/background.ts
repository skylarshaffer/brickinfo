'use strict';

//  Imports
////  Operations
import { blColorsAndCodesToElements } from "./operations/blColorsAndCodesToElements";
import { writeArrayToDbTable } from "./operations/writeArrayToDbTable";
import { getBlTxt } from "./operations/getBlTxt";
import { tsvToArr } from "./operations/tsvToArr";

////  Types
import { IncomingBackgroundMessage } from "./types/BackgroundMessageTypes";
import { BlCodesItem, BlColorsItem } from "./types/BlDataTypes";
import { getStorageItemValue } from "./operations/getStorageItemValue";
import { openOrCreateDb } from "./operations/openOrCreateDb";
import Dexie, { Table } from "dexie";
import { BlElementsItem } from "./types/IndexedDBTypes";
import { getBlPriceList } from "./operations/getBlPriceList";
import { getBlElementsIndex } from "./operations/getBlElementsIndex";


//  Native
////  Operations
let blAffiliateApiKey = ''
getStorageItemValue({ key: 'blAffiliateApiKey' })
.then((result) => {
    blAffiliateApiKey = result
  }
)

////  Message listener
chrome.runtime.onMessage.addListener((message: IncomingBackgroundMessage, sender, response) => {
  //-If message is updateBlDb and BLNEWSESSIONID cookie is provided (assumed valid at this point).
  if (message.type === 'updateBlDb' && message.blNewSessionId) {
    const blCodesTsvPromise = getBlTxt({downloadType: 'codes',blNewSessionId: message.blNewSessionId})
    const blColorsTsvPromise = getBlTxt({downloadType: 'colors',blNewSessionId: message.blNewSessionId})
    //-Once both txts are in, feed them to tsvToArr. Technically more efficient if separated. Works for now, fix later.
    Promise.all([blCodesTsvPromise,blColorsTsvPromise]).then(([blCodesTsv,blColorsTsv]) => {
      const blCodesArrPromise = tsvToArr({tsv: blCodesTsv}) as Promise<BlCodesItem[]>
      const blColorsArrPromise = tsvToArr({tsv: blColorsTsv}) as Promise<BlColorsItem[]>
      //-Once both arrays are in, feed them to blColorsAndCodesToElements.
      Promise.all([blCodesArrPromise,blColorsArrPromise]).then(([blCodesArr,blColorsArr]) => {
        const blElementsArr = blColorsAndCodesToElements({blCodesArr, blColorsArr})
        //-Once we have a db-ready array, feed it to writeArrayToDbTable for final write.
        writeArrayToDbTable({ dbName: 'BricklinkDB', objectStoreName: 'Elements', dataArr: blElementsArr}).then(() => {
          //-Send response back to popup.js. If the popup is still open, log will notify user. If not, no visual notification to user (that is fine).
          response({word: "Success", data: "Successfully wrote data to 'BricklinkDB'."})
        })
      })
    })
  } 
  else if (message.type === "fetchPrices") {
    const elementsArr = message.elementsArr
    const elementsArrSorted = elementsArr.sort((a,b) => a-b)
    const elementsSmallest = elementsArrSorted[0]
    const elementsLargest = elementsArr[(elementsArr.length - 1)]
    console.log('elementsArr: ', elementsArr,'elementsArrSorted: ',elementsArrSorted,'typeof elementsSmallest: ', typeof elementsSmallest, 'typeof elementsLargest: ', typeof elementsLargest)
    getStorageItemValue({ key: 'blAffiliateApiKey' })
    .then((blAffiliateApiKey) => {
      openOrCreateDb({dbName: 'BricklinkDB'})
      .then((db) => {
        console.log('passed db: ',db.table('Elements'));
        db.table('Elements')
        .where('elementId')
        .between(elementsSmallest, elementsLargest, true, true)
        .filter((blElementsItem: BlElementsItem) => elementsArr.includes(blElementsItem.elementId))

        .toArray().then((blElementsItemArr: BlElementsItem[]) => {
          console.log('Crucial point here, verify count. blElementsItemArr: ',blElementsItemArr)
          Promise.all(
            [getBlPriceList({blElementsItemArr, blAffiliateApiKey}),getBlElementsIndex({blElementsItemArr})]
          ).then(([blResponseItemArr,blElementsIndex]) => {
            console.log('blResponseItemArr: ', blResponseItemArr)
            blResponseItemArr?.forEach((blResponseItem) => {
              blElementsIndex[blResponseItem.item.no][ blResponseItem.color_id].prices = {
                inventory_new: (Number(blResponseItem.inventory_new.total_price)/blResponseItem.inventory_new.total_quantity).toFixed(2),
                inventory_used: (Number(blResponseItem.inventory_used.total_price)/blResponseItem.inventory_used.total_quantity).toFixed(2),
                ordered_new: (Number(blResponseItem.ordered_new.total_price)/blResponseItem.ordered_new.total_quantity).toFixed(2),
                ordered_used: (Number(blResponseItem.ordered_used.total_price)/blResponseItem.ordered_used.total_quantity).toFixed(2)
              };
            })
            console.log('response blElementsIndex): ', blElementsIndex)
            response(blElementsIndex)
          })
        })
      })
    })
  }
  //-End of expected messages list. All other messages should be assumed faulty and should error before returning.
  else {
    throw new Error("Unexpected message to service worker. Please check your message type and other properties.")
  }
  //-Return true is how service worker communicates it is processing an asynchronous response. All requests should run quick and spit out return true before their eventual response.
  return true
});
