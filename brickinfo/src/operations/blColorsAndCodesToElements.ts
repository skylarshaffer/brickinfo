//  Imports
////  Types
import { BlCodesItem, BlColorsItem } from "../types/BlDataTypes";
import { BlElementsItem } from "../types/IndexedDBTypes";


// Native
////  Types
type Props = {
    blCodesArr: BlCodesItem[];
    blColorsArr: BlColorsItem[];
}


//  Exports
////  Operations
export function blColorsAndCodesToElements ({blCodesArr, blColorsArr}: Props): BlElementsItem[] {
    const blColorIdLookup = {} as Record<string,number>
    blColorsArr.forEach((blColorsItem: BlColorsItem) => {
        blColorIdLookup[blColorsItem.colorName] = blColorsItem.colorId
    })
    const blElementsArr = [] as BlElementsItem[]
    blCodesArr.forEach((blCodesItem: BlCodesItem) =>{
        if (typeof blElementsArr[blCodesItem.elementId] === 'undefined')  {
            blElementsArr[blCodesItem.elementId] = 
            {
                elementId: blCodesItem.elementId,
                partIds: [blCodesItem.partId],
                colorId: blColorIdLookup[blCodesItem.colorName]
            }
            
        } else {
            blElementsArr[blCodesItem.elementId].partIds.push(blCodesItem.partId)
        }
    })
    return blElementsArr
}

    