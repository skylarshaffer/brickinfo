// Import
////  Operations
import { addBricklinkPrice } from "./operations/addBricklinkPrice"
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
    const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')! as HTMLSpanElement
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
    $divs.forEach((div) => {
      const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')! as HTMLSpanElement
      if ($itemIdSpan) {
        const matchesArr = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)
        if (!matchesArr) {
          throw new Error("Exception. MatchesArr should resolve for every span.")
        }
        const  elementId = Number(matchesArr[0]);
        console.log('elementId: ',elementId)
        if (blElementsIndex[elementId] !== undefined) {
          console.log('1');
          (blElementsIndex[elementId] as [BlElementsIndexItem]).forEach((blElementsIndexItem) => {
            console.log('2')
            console.log('blElementsIndexItem: ', blElementsIndexItem)
            if (blElementsIndexItem.prices !== undefined) {
              console.log('3')
              addBricklinkPrices({div, prices: blElementsIndexItem.prices})
            }
          })
        }
      }
    })
  })
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-test') {
        if ($ul.dataset.test !== 'pab-search-results-list-loading') {
          const $divs = document.querySelectorAll('div[data-test="pab-item"]') as NodeListOf<HTMLDivElement>;
          const elementsArr = [] as number[]
          $divs.forEach((div) => {
            const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')! as HTMLSpanElement
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
            $divs.forEach((div) => {
              const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')! as HTMLSpanElement
              if ($itemIdSpan) {
                const matchesArr = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)
                if (!matchesArr) {
                  throw new Error("Exception. MatchesArr should resolve for every span.")
                }
                const  elementId = Number(matchesArr[0]);
                console.log('elementId: ',elementId)
                if (blElementsIndex[elementId] !== undefined) {
                  console.log('1');
                  (blElementsIndex[elementId] as [BlElementsIndexItem]).forEach((blElementsIndexItem) => {
                    console.log('2')
                    console.log('blElementsIndexItem: ', blElementsIndexItem)
                    if (blElementsIndexItem.prices !== undefined) {
                      console.log('3')
                      addBricklinkPrices({div, prices: blElementsIndexItem.prices})
                    }
                  })
                }
              }
            })
          })
        }
      }
    })
  })
  const target = $ul
  const config = { attributes: true };
  observer.observe(target, config);
})