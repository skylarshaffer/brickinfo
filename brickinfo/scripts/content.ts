type BricklinkProperty = {
  elementId?: number,
  partId?: string,
  colorId?: number
  price?: number
}

type BrickElement = {
  bricklink?: BricklinkProperty
}



function waitForElm(selector: string) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}

waitForElm('#pab-results-wrapper ul').then((elm) => {
  console.log('Element is ready');
  const $ul = elm as HTMLUListElement;
  console.log($ul)
  function addBricklinkPrice(div, price) {
    // create a new div element
    const $priceDiv = div.querySelector('div:has(span[data-test="pab-item-price"])');
    const $bricklinkPriceDiv = $priceDiv.cloneNode(true)
    $bricklinkPriceDiv.className='ElementLeaf_bricklinkPrice'
    const $bricklinkPriceSpan = $bricklinkPriceDiv.querySelector('span[data-test="pab-item-price"]')
    $bricklinkPriceSpan.dataset.test = 'pab-item-bricklink-price'
    $bricklinkPriceSpan.textContent = `BL: $${price}`
    div.insertBefore($bricklinkPriceDiv,$priceDiv.nextSibling);
  }
  
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-test') {
        if ($ul.dataset.test !== 'pab-search-results-list-loading') {
          const $divs = document.querySelectorAll('div[data-test="pab-item"]');
          const elementsArr = []
          $divs.forEach((div) => {
            const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')
            if ($itemIdSpan) {
              const elementId = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)[0]
              elementsArr.push(elementId)
            }
          })
          chrome.runtime.sendMessage({ name: 'fetchPrices', elementsArr }, () => {
            console.log('got fetchPrices')
            $divs.forEach((div) => {
              const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')
              if ($itemIdSpan) {
                const elementId = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)[0]
                console.log('sending getBlPrice')
                const element = {} as BrickElement
                element.bricklink = {}
                chrome.runtime.sendMessage({ name: 'getBlPrice', elementId }, (response) => {
                  console.log('got back getBlPrice')
                  console.log('response is: ', response)
                  element.bricklink.price = response
                  
                  console.log('element: ',element)
                  if (typeof element.bricklink.price !== 'undefined') {
                    if (!isNaN(element.bricklink.price) && element.bricklink.price !== null) {
                      addBricklinkPrice(div,element.bricklink.price)
                    }
                  }
                })
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

// `document.querySelector` may return null if the selector doesn't match anything.

