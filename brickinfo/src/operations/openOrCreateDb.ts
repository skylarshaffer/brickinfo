//  Imports
////  Dependencies
import Dexie from "dexie";


// Native
////  Types
type Props = {
    dbName: string;
    tables?: [
        {
            name: string;
            columns: string[]
        }
    ] | null
}


//  Exports
////  Operations
export async function openOrCreateDb ({dbName, tables = null}: Props) {
    const db = new Dexie(dbName);
    console.log('db: ',db)
    const stores = {} as Record<string,string>
    if (tables) {
        tables.forEach((table) => {
            stores[table.name] = table.columns.join(', ')
        })
        db.version(1).stores(stores);
    } 
    await db.open().catch((error) => console.log('dexie error: ',error))
    console.log('openDb: ',db)
    return db
}