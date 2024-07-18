//  This file is a MESS and makes me miss React. Will revisit. VERY inefficient.

//  Exports
////  Operations

import { BlElementsPricesList } from "../types/BlElementsIndexTypes";

//  Native

////  Types
type Props = {
    div: HTMLDivElement;
    prices: BlElementsPricesList;
}

////  Operations
export function addBricklinkPrices({div, prices}: Props) {
    console.log('1')
    const $oldDiv = div.querySelector('div.bricklink-price-table')
    if ($oldDiv) {
        $oldDiv.remove()
    }
/*     const ulClass = (document.querySelector('ul[data-test="pab-search-results-list"]') as HTMLUListElement).className.trim() */
    const subtextClass = (div.querySelector('span[data-test="element-item-id"]') as HTMLDivElement).className
    const $priceDiv = div.querySelector('div:has(span[data-test="pab-item-price"])') as HTMLDivElement;
    if (!$priceDiv) throw new Error("Unexpected failure to fetch pab-item-price span parent div.")
    //-Create a new div element
    const $bricklinkPriceDiv = $priceDiv.cloneNode(true) as HTMLDivElement
    $bricklinkPriceDiv.classList.add('bricklink-price-table')
    $bricklinkPriceDiv.style.setProperty('text-align', 'center', 'important')
    $bricklinkPriceDiv.style.setProperty('display', 'flex', 'important')
    const $bricklinkOrderedPriceDiv = $bricklinkPriceDiv.cloneNode(true) as HTMLDivElement
    $bricklinkOrderedPriceDiv.style.setProperty('flex-direction', 'row', 'important')
    $bricklinkOrderedPriceDiv.className = ''
    const $bricklinkInventoryPriceDiv = $bricklinkPriceDiv.cloneNode(true) as HTMLDivElement
    $bricklinkInventoryPriceDiv.className = ''
    $bricklinkInventoryPriceDiv.style.setProperty('flex-direction', 'row', 'important')
    $bricklinkPriceDiv.style.setProperty('justify-content', 'space-around', 'important')
/*     $bricklinkPriceDiv.classList.add('lxyIRW_original')  */ 
   div.insertBefore($bricklinkPriceDiv,$priceDiv.nextSibling);
    const $headerSpanTemplate = document.createElement('span')
    $headerSpanTemplate.className = subtextClass

    const $headerSpanON = $headerSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $headerSpanOU = $headerSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $headerSpanIN = $headerSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $headerSpanIU = $headerSpanTemplate.cloneNode(true) as HTMLSpanElement
    $headerSpanON.textContent = 'New'
    $headerSpanOU.textContent = 'Used'
    $headerSpanIN.textContent = 'New'
    $headerSpanIU.textContent = 'Used'
    const $bricklinkPriceSpanTemplate = ($priceDiv.querySelector('span[data-test="pab-item-price"]') as HTMLSpanElement).cloneNode(true) as HTMLSpanElement
    if (!$bricklinkPriceSpanTemplate) throw new Error("Unexpected failure to fetch pab-item-price span.")
    $bricklinkPriceSpanTemplate.dataset.test = 'pab-item-bricklink-price'
/*     $bricklinkPriceSpanTemplate.classList.add(ulClass); */
    $bricklinkPriceSpanTemplate.style.setProperty('flex-grow', '1', 'important')
    $bricklinkPriceSpanTemplate.style.setProperty('display', 'flex', 'important')
    $bricklinkPriceSpanTemplate.style.setProperty('flex-direction', 'column', 'important')
    const $priceSpanOrdered = $bricklinkPriceSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $priceSpanInventory = $bricklinkPriceSpanTemplate.cloneNode(true) as HTMLSpanElement
    $priceSpanOrdered.className = subtextClass
    $priceSpanInventory.className = subtextClass
    $priceSpanOrdered.textContent = '6 Months'
    $priceSpanInventory.textContent = 'Current'
    const $priceSpanON = $bricklinkPriceSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $priceSpanOU = $bricklinkPriceSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $priceSpanIN = $bricklinkPriceSpanTemplate.cloneNode(true) as HTMLSpanElement
    const $priceSpanIU = $bricklinkPriceSpanTemplate.cloneNode(true) as HTMLSpanElement
    //-Kill all children
    $bricklinkPriceDiv.innerHTML = ""
    $bricklinkOrderedPriceDiv.innerHTML = ""
    $bricklinkInventoryPriceDiv.innerHTML = ""
    $priceSpanON.classList.add('ordered_new')
    $priceSpanOU.classList.add('ordered_used')
    $priceSpanIN.classList.add('inventory_new')
    $priceSpanIU.classList.add('inventory_used')
    $priceSpanON.firstChild!.textContent = '         ' + (prices.ordered_new || '\u2003\u2003') + '         '
    $priceSpanOU.firstChild!.textContent = '         ' + (prices.ordered_used || '\u2003\u2003') + '         '
    $priceSpanIN.firstChild!.textContent = '         ' + (prices.inventory_new || '\u2003\u2003') + '         '
    $priceSpanIU.firstChild!.textContent = '         ' + (prices.inventory_used || '\u2003\u2003') + '         '
    $bricklinkOrderedPriceDiv.append($priceSpanON,$priceSpanOU)
    $bricklinkInventoryPriceDiv.append($priceSpanIN,$priceSpanIU)
    $priceSpanOrdered.append($bricklinkOrderedPriceDiv)
    $priceSpanInventory.append($bricklinkInventoryPriceDiv)
    $priceSpanON.insertBefore($headerSpanON,$priceSpanON.firstChild);
    $priceSpanOU.insertBefore($headerSpanOU,$priceSpanOU.firstChild);
    $priceSpanIN.insertBefore($headerSpanIN,$priceSpanIN.firstChild);
    $priceSpanIU.insertBefore($headerSpanIU,$priceSpanIU.firstChild);
    $bricklinkPriceDiv.append($priceSpanOrdered,$priceSpanInventory);
    console.log('3')
}