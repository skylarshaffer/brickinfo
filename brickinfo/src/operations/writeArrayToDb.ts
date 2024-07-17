import Dexie,{ Table, type EntityTable } from "dexie";
import { BlElementsItem } from "../types/BlDataItems";
import { openOrCreateDb } from "./openOrCreateDb";

type Props = {
    dbName: string;
    objectStoreName: string;
    dataArr: BlElementsItem[]
}

export async function writeArrayToDb ({ dbName, objectStoreName, dataArr }: Props): Promise<void> {
    const db = await openOrCreateDb({dbName})
    try {
        await (db[objectStoreName as keyof Dexie] as unknown as Table).bulkAdd(dataArr)
    }
    catch (error) {
        throw new Error(`Failed to write data to ${objectStoreName} table of ${dbName} db.`)
    }
    finally {
        console.log(`Successfully wrote data to ${objectStoreName} table of ${dbName} db.`)
        return
    }
}