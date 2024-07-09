
const $ul = document.querySelector('#pab-results-wrapper ul');

// `document.querySelector` may return null if the selector doesn't match anything.

function addBricklinkPrice(div, price) {
  // create a new div element
  const $priceDiv = div.querySelector('div:has(span[data-test="pab-item-price"])');
  const $bricklinkPriceDiv = $priceDiv.cloneNode(true)
  $bricklinkPriceDiv.className='ElementLeaf_bricklinkPrice'
  $bricklinkPriceSpan = $bricklinkPriceDiv.querySelector('span[data-test="pab-item-price"]')
  $bricklinkPriceSpan.dataset.test = 'pab-item-bricklink-price'
  $bricklinkPriceSpan.textContent = `BL: $${price}`
  div.insertBefore($bricklinkPriceDiv,$priceDiv.nextSibling);
}

const observer = new MutationObserver((mutationList) => {
  mutationList.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-test') {
      if ($ul.dataset.test !== 'pab-search-results-list-loading') {
        const $divs = document.querySelectorAll('div[data-test="pab-item"]');
        $divs.forEach((div) => {
          const element = {}
          element.bricklink = {}
          const $itemIdSpan = div.querySelector('span[data-test="element-item-id"]')
          const $priceSpan = div.querySelector('span[data-test="pab-item-price"]')
          if ($itemIdSpan) {
            element.id = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)[0]
            chrome.runtime.sendMessage({ name: 'getBlDetails', elementId: element.id }, (response) => {
              element.bricklink = {
                colorId: response.bricklink_color_id,
                price: response.bricklink_price
              }
              console.log('id: ',element.id, 'blColorId: ',element.bricklink.colorId,'blPrice: ',element.bricklink.price)
              if (typeof element.bricklink.price !== 'undefined' && !isNaN(element.bricklink.price) && element.bricklink.price !== null) {
                addBricklinkPrice(div,element.bricklink.price)
              }
              if($divs[$divs.length-1] === div){
                console.log("Last Element")
                chrome.runtime.sendMessage({ name: 'pricesDone'})
              }
            })
          }
        })
      }
    }
  })
})


const target = $ul
const config = { attributes: true };
observer.observe(target, config);

//     const blPrice = await fetch(`https://api.bricklink.com/api/store/v1/items/part/${designId}/price?guide_type=stock&region=north_america&color_id=5`).json
//    const rbFetch = fetch(`https://rebrickable.com/api/v3/lego/elements/${elementId}/`)
//    console.log('id: ',element.id, 'blPartId: ',element.bricklink.partId, 'blColorId: ',element.bricklink.colorId)
