//  Imports
////  Operations
import { LegoPriceTable } from "../../types/LegoPriceTableTypes";
import { createLegoPriceTable } from "./createLegoPriceTable";
import { removeOldPriceTables } from "./removeOldPriceTables";


//  Exports
////  Operations
export async function insertBricklinkPriceTables (): Promise<Record<number,LegoPriceTable>> {
    function getLegoPabSearchResults (): NodeListOf<HTMLDivElement> {
        const $divsPabSearchResults: NodeListOf<HTMLDivElement> | null =
            document.querySelectorAll('div[data-test="pab-item"]')
        ??  document.querySelectorAll('div[data-test*="pab-item"]')
        ??  document.querySelectorAll('ul[data-test="pab-search-results-list"] > li > div')
        ??  document.querySelectorAll('ul[data-test*="pab-search"] div')
        ??  document.querySelectorAll('li[class*="ElementsList_leaf"] > div')
        ??  null
        if ($divsPabSearchResults === null || $divsPabSearchResults.length === 0) throw new Error('No results when looking for divs.')
        return $divsPabSearchResults
    }
    const insertPromisesArr = [] as Promise<void>[]
    const legoPriceTableObj = {} as Record<number,LegoPriceTable>
    await Promise.all([createLegoPriceTable(),getLegoPabSearchResults(),removeOldPriceTables()]).then(([$legoPriceTable,$divsPabSearchResults]) => {
        $divsPabSearchResults.forEach(($divsPabSearchResult) => {
            insertPromisesArr.push(
                new Promise((resolve, reject) => {
                    const $divPabItemPriceContainer: HTMLDivElement | null =
                            $divsPabSearchResult.querySelector('div[data-test="pab-item-price"]')
                        ??  $divsPabSearchResult.querySelector('div[class*="ElementLeaf_price"]')
                        ??  $divsPabSearchResult.querySelector('div[class*="ElementLeaf_price"]')
                        ??  null
                    if ($divPabItemPriceContainer === null) throw new Error('Could not find the target div element.')
                    const $itemIdSpan = $divsPabSearchResult.querySelector('p[data-test="pab-item-elementId"]') as HTMLParagraphElement
                    const matchesArr = $itemIdSpan.textContent?.match(/(?<=ID: )[^/]+/)
                    if (!matchesArr) {
                      throw new Error("Exception. MatchesArr should resolve for every span.")
                    }
                    const elementId = Number(matchesArr[0]);
                    const $cloneLegoPriceTable = $legoPriceTable.cloneNode(true) as HTMLDivElement
                    $cloneLegoPriceTable.classList.add(elementId.toString())
                    legoPriceTableObj[elementId] = $cloneLegoPriceTable
                    $divsPabSearchResult.insertBefore($cloneLegoPriceTable,$divPabItemPriceContainer.nextSibling);
                    resolve()
                })
            )
        })
    })
    await Promise.all([insertPromisesArr])
    return legoPriceTableObj
}
