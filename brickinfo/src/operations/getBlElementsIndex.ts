//  Imports
////  Types
import { BlElementsIndex } from "../types/BlElementsIndexTypes";
import { BlElementsItem } from "../types/IndexedDBTypes";


//  Native
//// Types
type Props = {
    blElementsItemArr: BlElementsItem[]
}


//  Exports
////  Operations
export async function getBlElementsIndex ({blElementsItemArr}: Props): Promise<BlElementsIndex> {
    const blElementsIndex = {} as BlElementsIndex;
    blElementsItemArr.forEach((blElementsItem: BlElementsItem) => {
        blElementsItem.partIds.forEach((partId) => {
            if (blElementsIndex[partId] === undefined) {
                blElementsIndex[partId] = {}
            }
            blElementsIndex[partId][blElementsItem.colorId] = {
                elementId: blElementsItem.elementId,
                partId: partId,
                colorId: blElementsItem.colorId
            };
            if (blElementsIndex[blElementsItem.elementId] === undefined) {
                blElementsIndex[blElementsItem.elementId] = []
            }
            (blElementsIndex[blElementsItem.elementId] as [Record<string, any>]).push(blElementsIndex[partId][blElementsItem.colorId]) 
        })
        
    });
    console.log('Completed blElementsIndex: ',blElementsIndex)
    return blElementsIndex
}