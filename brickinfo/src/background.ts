'use strict';

import { BlCodesItem, BlColorsItem } from "./types/BlDataItems";
import { blColorsAndCodesToElements } from "./operations/blColorsAndCodesToElements";
import { getBlTxt } from "./operations/getBlTxt";
import { tsvToArr } from "./operations/tsvToArr";
import { writeArrayToDbTable } from "./operations/writeArrayToDbTable";

type BackgroundMessage = {
  name: string;
}

interface UpdateBlDbMessage extends BackgroundMessage {
  name: 'updateBlDb';
  blNewSessionId: string;
}

type IncomingBackgroundMessage = UpdateBlDbMessage

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((message: IncomingBackgroundMessage, sender, response) => {
  console.log("Message received. Message: ", message)
  if (message.name === 'updateBlDb' && message.blNewSessionId) {
    const blCodesTsvPromise = getBlTxt({downloadType: 'codes',blNewSessionId: message.blNewSessionId})
    const blColorsTsvPromise = getBlTxt({downloadType: 'colors',blNewSessionId: message.blNewSessionId})
    Promise.all([blCodesTsvPromise,blColorsTsvPromise]).then(([blCodesTsv,blColorsTsv]) => {
      const blCodesArrPromise = tsvToArr({tsv: blCodesTsv}) as Promise<BlCodesItem[]>
      const blColorsArrPromise = tsvToArr({tsv: blColorsTsv}) as Promise<BlColorsItem[]>
      Promise.all([blCodesArrPromise,blColorsArrPromise]).then(([blCodesArr,blColorsArr]) => {
        console.log('Made it all the way to arrays: ',blCodesArr,blColorsArr)
        const blElementsArr = blColorsAndCodesToElements({blCodesArr, blColorsArr})
        writeArrayToDbTable({ dbName: 'BricklinkDB', objectStoreName: 'Elements', dataArr: blElementsArr}).then(() => {
          response({word: "Success", data: "Successfully wrote data to 'BricklinkDB'."})
        })
      })
    })
  }
  return true
});
