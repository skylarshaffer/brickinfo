//  Imports
////  Dependencies
import Dexie,{ Table, type EntityTable } from "dexie";

////  Operations
import { setStorageItemValue } from "./setStorageItemValue";
import { openOrCreateDb } from "./openOrCreateDb";

////  Types
import { BlElementsItem } from "../types/IndexedDBTypes";


// Native
////  Types
type Props = {
    dbName: string;
    objectStoreName: string;
    dataArr: BlElementsItem[]
}


//  Exports
////  Operations
export async function writeArrayToDbTable ({ dbName, objectStoreName, dataArr }: Props): Promise<void> {
    //-In case dataArr is sparse
    const compactArr = Object.values(dataArr)
    const db = await openOrCreateDb({dbName, tables: [{name: 'Elements', columns: ['elementId', '*partIds*', 'colorId']}]})
    try {
        console.log(`Clearing ${objectStoreName} table of ${dbName} db.`)
        await (db[objectStoreName as keyof Dexie] as unknown as Table).clear()
        console.log(`Writing data to ${objectStoreName} table of ${dbName} db.`)
        await (db[objectStoreName as keyof Dexie] as unknown as Table).bulkAdd(compactArr)
        .catch((error) => {throw new Error(error)})
        setStorageItemValue({key: `${dbName}-${objectStoreName}-update`, value: Date.now()})
    }
    catch (error) {
        throw new Error(`Failed to write data to ${objectStoreName} table of ${dbName} db.`)
    }
    finally {
        console.log(`Successfully wrote data to ${objectStoreName} table of ${dbName} db.`)
        return
    }
}