// Import
////  CSS
import './brickinfo.css';

////  Operations
import { addBricklinkPrices } from "./operations/addBricklinkPrices"
import { waitForElm } from "./operations/waitForElement"
import { BlElementsIndex, BlElementsIndexItem, BlElementsPricesList } from "./types/BlElementsIndexTypes"


// Native
////  Types
type BricklinkProperty = {
  elementId?: number,
  partId?: string,
  colorId?: number
  price?: number
}

type BrickElement = {
  bricklink: BricklinkProperty
}


////  Operations
waitForElm('#pab-results-wrapper ul').then((element) => {
  console.log('Element is ready');
  const $ul = element as HTMLUListElement;
  console.log($ul)
  const $divs = document.querySelectorAll('div[data-test="pab-item"]') as NodeListOf<HTMLDivElement>;
  const elementsArr = [] as number[]
  $divs.forEach((div) => {
    const $itemIdSpan = div.querySelector('p[data-test="pab-item-elementId"]')! as HTMLSpanElement
    if ($itemIdSpan) {
      const matchesArr = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)
      if (matchesArr) {
        const elementId = Number(matchesArr[0])
        elementsArr.push(elementId)
      }
    }
  })
  chrome.runtime.sendMessage({ type: 'fetchPrices', elementsArr }, (blElementsIndex: BlElementsIndex) => {
    addBricklinkPrices({blElementsIndex})
  })
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-test') {
        if ($ul.dataset.test !== 'pab-search-results-list-loading') {
          const $divs = document.querySelectorAll('div[data-test="pab-item"]') as NodeListOf<HTMLDivElement>;
          const elementsArr = [] as number[]
          $divs.forEach((div) => {
            const $itemIdSpan = div.querySelector('p[data-test="pab-item-elementId"]')! as HTMLSpanElement
            if ($itemIdSpan) {
              const matchesArr = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)
              if (matchesArr) {
                const elementId = Number(matchesArr[0])
                elementsArr.push(elementId)
              }
            }
          })
          chrome.runtime.sendMessage({ type: 'fetchPrices', elementsArr }, (blElementsIndex: BlElementsIndex) => {
            console.log('got fetchPrices')
            addBricklinkPrices({blElementsIndex})
          })
        }
      }
    })
  })
  const target = $ul
  const config = { attributes: true };
  observer.observe(target, config);
})
