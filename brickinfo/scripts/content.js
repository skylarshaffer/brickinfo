
const $ul = document.querySelector('#pab-results-wrapper ul');

// `document.querySelector` may return null if the selector doesn't match anything.

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
              const element = {}
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