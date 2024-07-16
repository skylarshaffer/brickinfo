

import { openDb } from "./openDb";

export async function getDb ({dbName,objectStoreName,elementId}) {
    const getPromise = new Promise((resolve, reject) => {
        openDb({dbName}).then((db: IDBDatabase) => {
            const transaction = db.transaction([objectStoreName], "readwrite");
            const objectStore = transaction.objectStore(objectStoreName);
            
            const objectStoreRequest = objectStore.get(elementId)

            objectStoreRequest.onerror = (event) => {
                console.log('db error')
                reject(`Error opening database`);
            };

            objectStoreRequest.onsuccess = (event) => {
                console.log('about to resolve')
                resolve((event.target as IDBOpenDBRequest).result);
            };
            console.log('about to fetch')
            objectStoreRequest
        })
    });
    const getResponse = await getPromise
    console.log('getResponse: ',getResponse)
    return getResponse
};



