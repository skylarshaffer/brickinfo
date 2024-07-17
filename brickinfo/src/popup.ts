'use strict';

//  Imports
////  CSS
import './popup.css';

////  Operations
import { getStorageItemValue } from './operations/getStorageItemValue';
import { setStorageItemValue } from './operations/setStorageItemValue';
import { getCookieValue } from './operations/getCookieValue';


//  Native
////  DOM
const $form = document.querySelector("form") as HTMLFormElement
const $blAffiliateApiKey = document.querySelector('input[name="bl-affiliate-api-key"]') as HTMLInputElement
const $updateBlDbButton = document.querySelector('#update-bl-db') as HTMLButtonElement
const $updateLogDiv = document.querySelector('#update-log') as HTMLDivElement
const $dbUpdatedP = document.querySelector('#bl-updated') as HTMLParagraphElement

////  Operations
//-On each popup load, fetch flAffiliateApiKey and overwrite $blAffiliateKey.
getStorageItemValue({ key: 'blAffiliateApiKey' })
.then((result) => {
    $blAffiliateApiKey.value = result
  }
)

//-Fetch latest Bricklink DB update info and overwrite $dbUpdatedP.
function updateDbInfo () {
  getStorageItemValue({ key: 'BricklinkDB-Elements-update' })
  .then((result: number) => {
      $dbUpdatedP.textContent = (new Date(result)).toString()
    }
  )
}

//-On each popup load, run updateDbInfo.
updateDbInfo()

////  Listeners
//-On each $form submission, write current value of $blAffiliateApiKey to chrome storage.
$form.addEventListener('submit',function(event){
  event.preventDefault()
  const newBlAffiliateApiKey = (event.target as HTMLFormElement)['bl-affiliate-api-key'].value
  setStorageItemValue({ key: 'blAffiliateApiKey', value: newBlAffiliateApiKey })
  .then(() => {
    console.log("blAffiliateApiKey is set in storage.");
  })
})

//-On each $updateBlDbButton click.
$updateBlDbButton.addEventListener('click',() => {
  //-Add header to popup.
  const $h2 = document.createElement('h2')
  $h2.textContent = 'Database Update Log'
  $updateLogDiv.append($h2)
  try {
    //-Attempt to grab Bricklink session cookie.
    getCookieValue({url: 'https://bricklink.com', cookieName: 'BLNEWSESSIONID'}).then((blNewSessionId) => {
      //-Notify user of successful cookie grab.
      const $p = document.createElement('p')
      $p.textContent = 'Grabbed Bricklink session. You can now close this popup without consequence.'
      $updateLogDiv.append($p)
      //-Send message to service worker. Popup can be closed at this point.
      chrome.runtime.sendMessage({ blNewSessionId, type: 'updateBlDb' }, (response) => {
        console.log('Service worker response: ', response)
        //-Notify user of successful update if they are still on popup.
        const $p = document.createElement('p')
        $p.textContent = 'Successfully updated Bricklink Database.'
        $updateLogDiv.append($p)
        //-Fetch latest Bricklink DB update info and overwrite $dbUpdatedP.
        updateDbInfo()
      })
      //-Notify user of message sent to service worker. Not necessarily success yet.
      const $p2 = document.createElement('p')
      $p2.textContent = 'Sent Bricklink session and update request to service worker. Continuing work in background process.'
      $updateLogDiv.append($p2)
    })
  } catch (error) {
    console.log(error)
  }
});
