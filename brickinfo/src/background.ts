'use strict';

import { BlCodesItem, BlColorsItem } from "./types/BlDataItems";
import { blColorsAndCodesToElements } from "./operations/blColorsAndCodesToElements";
import { getBlTxt } from "./operations/getBlTxt";
import { tsvToArr } from "./operations/tsvToArr";
import { writeArrayToDb } from "./operations/writeArrayToDb";

type BackgroundMessage = {
  type: string
}

interface UpdateBlDbMessage extends BackgroundMessage {
  type: 'updateBlDb'
  blNewSessionId: string
}

type IncomingBackgroundMessage = UpdateBlDbMessage

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((message: IncomingBackgroundMessage, sender, response) => {
  console.log("Message received")
  if (message.type === 'updateBlDb' && message.blNewSessionId) {
    const blCodesTsvPromise = getBlTxt({downloadType: 'codes',blNewSessionId: message.blNewSessionId})
    const blColorsTsvPromise = getBlTxt({downloadType: 'colors',blNewSessionId: message.blNewSessionId})
    Promise.all([blCodesTsvPromise,blColorsTsvPromise]).then(([blCodesTsv,blColorsTsv]) => {
      const blCodesArrPromise = tsvToArr({tsv: blCodesTsv}) as Promise<BlCodesItem[]>
      const blColorsArrPromise = tsvToArr({tsv: blColorsTsv}) as Promise<BlColorsItem[]>
      Promise.all([blCodesArrPromise,blColorsArrPromise]).then(([blCodesArr,blColorsArr]) => {
        const blElementsArr = blColorsAndCodesToElements({blCodesArr, blColorsArr})
        writeArrayToDb({ dbName: 'BricklinkDB', objectStoreName: 'Elements', dataArr: blElementsArr}).then(() => {
          console.log("Successfully wrote data to 'BricklinkDB'.")
          response("Successfully wrote data to 'BricklinkDB'.")
        })
      })
    })
  }
  return true
});
