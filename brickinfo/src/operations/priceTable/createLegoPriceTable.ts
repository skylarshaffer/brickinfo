import { LegoPriceTable } from "../../types/LegoPriceTableTypes"

export async function createLegoPriceTable (): Promise<LegoPriceTable> {
    const $ulPabSearchResultsList: HTMLSpanElement | null = 
            document.querySelector('ul[data-test*="pab-search-results-list"]')
        ??  document.querySelector('ul[data-test="pab-search"]')
        ??  null
    if ($ulPabSearchResultsList === null) throw new Error('Could not find the target ul element.')
    const $liFirstLeaf: HTMLLIElement | null = 
            $ulPabSearchResultsList.querySelector('li[class*="ElementsList_leaf"]')
        ??  $ulPabSearchResultsList.querySelector('li') 
        ??  document.querySelector('li[class*="ElementsList_leaf"]') 
        ??  null
    if ($liFirstLeaf === null) throw new Error('Could not find the target li element.')
    const $divPabItemPriceContainer: HTMLDivElement | null =
            $liFirstLeaf.querySelector('div[class*="ElementLeaf_price"]:has(span[data-test="pab-item-price"]')
        ??  $liFirstLeaf.querySelector('div[class*="ElementLeaf_price"]')
        ??  $liFirstLeaf.querySelector('div:has(span[data-test="pab-item-price"]')
        ??  document.querySelector('div[class*="ElementLeaf_price"]')
        ??  null
    if ($divPabItemPriceContainer === null) throw new Error('Could not find the target div element.')
    const $spanPabBestsellerBadge = $liFirstLeaf.querySelector('span[class*="ElementLeaf_badgeContainer"]') as HTMLSpanElement || $liFirstLeaf.querySelector('span:has(span[data-test="pab-item-label"])') as HTMLSpanElement
    const spanPabElementItemIdClass = ($liFirstLeaf.querySelector('span[data-test="element-item-id"]') as HTMLSpanElement).className
    const spanPabItemPriceClass = ($liFirstLeaf.querySelector('span[data-test="pab-item-price"]') as HTMLDivElement).className
    if ($spanPabBestsellerBadge === null || spanPabElementItemIdClass === null || spanPabItemPriceClass === null) console.log('An important element or class could not be found in the DOM. Moving on without it.')
    const $legoPriceTable = $divPabItemPriceContainer.cloneNode(true) as HTMLDivElement
    $legoPriceTable.classList.add('lego-price-table')

    $legoPriceTable.innerHTML = `
    <div class="row">
        <div class="column grow">
            <span class="ds-body-sm-regular">6 Months</span>
            <div class="row _38">
                <div class="column grow">
                    <span class='${spanPabElementItemIdClass}'>New</span>
                    <span class='ordered-new ${spanPabItemPriceClass}'></span>
                </div>
                <div class="column grow">
                    <span class='${spanPabElementItemIdClass}'>Used</span>
                    <span class='ordered-used ${spanPabItemPriceClass}'></span>
                </div>
            </div>
        </div>
        <div class="column grow">
            <span class="ds-body-sm-regular">Current</span>
            <div class="row _38">
                <div class="column grow">
                    <span class='${spanPabElementItemIdClass}'>New</span>
                    <span class='inventory-new ${spanPabItemPriceClass}'></span>
                </div>
                <div class="column grow">
                    <span class='${spanPabElementItemIdClass}'>Used</span>
                    <span class='inventory-used ${spanPabItemPriceClass}'></span>
                </div>
            </div>
        </div>
    </div>
    `
    const $legoPriceTableBadge = $spanPabBestsellerBadge.cloneNode(true) as HTMLSpanElement
    if ($legoPriceTableBadge.firstChild) {
        const legoPriceTableBadgeFirstChildClass = ($legoPriceTableBadge.firstChild as HTMLSpanElement).className
        const $bricklinkPartLabelButton = document.createElement('a');
        $bricklinkPartLabelButton.className = legoPriceTableBadgeFirstChildClass
        //-Kill children
        $legoPriceTableBadge.innerHTML= ''
        $legoPriceTableBadge.style.setProperty('position', 'relative', 'important');
        $bricklinkPartLabelButton.classList.add('bricklink-part-label')
        $bricklinkPartLabelButton.textContent = 'BRICKLINK'
        $legoPriceTableBadge.append($bricklinkPartLabelButton)
        $legoPriceTable.prepend($legoPriceTableBadge)
    }
    return $legoPriceTable
}