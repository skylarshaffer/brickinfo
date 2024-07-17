'use strict';

import './popup.css';

import { tsvToArr } from './operations/tsvToArr';
import { blColorsAndCodesToElements } from './operations/blColorsAndCodesToElements';
import { getCookieValue } from './operations/getCookieValue';
import { getStorageItemValue } from './operations/getStorageItemValue';
import { setStorageItemValue } from './operations/setStorageItemValue';

const $form = document.querySelector("form") as HTMLFormElement
const $blAffiliateApiKey = document.querySelector('input[name="bl-affiliate-api-key"]') as HTMLInputElement
const $updateBlDbButton = document.querySelector('#update-bl-db') as HTMLButtonElement
const $updateLogDiv = document.querySelector('#update-log') as HTMLDivElement

getStorageItemValue({ key: 'blAffiliateApiKey' })
.then((result) => {
    $blAffiliateApiKey.value = result
  }
)


$form.addEventListener('submit',function(event){
  event.preventDefault()
  const newBlAffiliateApiKey = (event.target as HTMLFormElement)['bl-affiliate-api-key'].value
  setStorageItemValue({ key: 'blAffiliateApiKey', value: newBlAffiliateApiKey })
  .then(() => {
    console.log("blAffiliateApiKey is set in storage.");
  })
})

$updateBlDbButton.addEventListener('click',() => {
  try {
    getCookieValue({url: 'https://bricklink.com', cookieName: 'BLNEWSESSIONID'}).then((blNewSessionId) => {
      console.log('Sending message: ',{ blNewSessionId: blNewSessionId, name: 'updateBlDb' })
      chrome.runtime.sendMessage({ blNewSessionId, name: 'updateBlDb' }, (response) => {
        console.log('Service worker response: ', response)
        const $p = document.createElement('p')
        $p.textContent = 'Successfully updated Bricklink Database.'
        $updateLogDiv.append($p)
      })
      console.log("updateBlDb Message sent to service worker.")
    })
  } catch (error) {
    console.log(error)
  }
});
