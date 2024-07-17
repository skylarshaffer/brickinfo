//  Exports
////  Operations
export function addBricklinkPrice(div: HTMLDivElement, priceType: string, price: string) {
    let priceLabel = ''
    switch (priceType) {
        case 'inventory_new':
            priceLabel = 'CN'
            break;
        case 'inventory_used':
            priceLabel = 'CU'
            break;
        case 'ordered_new':
            priceLabel = '6N'
            break;
        case 'ordered_used':
            priceLabel = '6U'
            break;
        default: 
            throw new Error(`Exception. priceType: ${priceType} unrecognized.`)
    }
    const $priceDiv = div.querySelector('div:has(span[data-test="pab-item-price"])') as HTMLDivElement;
    if (!$priceDiv) throw new Error("Unexpected failure to fetch pab-item-price span parent div.")
    //-Create a new div element
    const $bricklinkPriceDiv = $priceDiv.cloneNode(true) as HTMLDivElement
    $bricklinkPriceDiv.className='ElementLeaf_bricklinkPrice'
    const $bricklinkPriceSpan = $bricklinkPriceDiv.querySelector('span[data-test="pab-item-price"]') as HTMLSpanElement
    if (!$bricklinkPriceSpan) throw new Error("Unexpected failure to fetch pab-item-price span.")
    $bricklinkPriceSpan.dataset.test = 'pab-item-bricklink-price'
    $bricklinkPriceSpan.textContent = `${priceLabel}: $${price}`
    div.insertBefore($bricklinkPriceDiv,$priceDiv.nextSibling);
}