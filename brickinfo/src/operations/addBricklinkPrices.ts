//  Exports
////  Operations

import { BlElementsIndex, BlElementsPricesList } from "../types/BlElementsIndexTypes";
import { insertBricklinkPriceTables } from "./priceTable/insertBricklinkPriceTables";

//  Native

////  Types
type Props = {
    blElementsIndex: BlElementsIndex
}

////  Operations

export function addBricklinkPrices({blElementsIndex}: Props) {
    insertBricklinkPriceTables().then((legoPriceTableObj) => {
        for (const key in legoPriceTableObj) {
            if (legoPriceTableObj[key as unknown as number]) {
                legoPriceTableObj[key].querySelector('span.ordered-new')!.textContent = blElementsIndex[key as unknown as number][0].prices?.ordered_new || null
                legoPriceTableObj[key].querySelector('span.ordered-used')!.textContent = blElementsIndex[key as unknown as number][0].prices?.ordered_used || null
                legoPriceTableObj[key].querySelector('span.inventory-new')!.textContent = blElementsIndex[key as unknown as number][0].prices?.inventory_new || null
                legoPriceTableObj[key].querySelector('span.inventory-used')!.textContent = blElementsIndex[key as unknown as number][0].prices?.inventory_used || null
            }
        }
    })
}