

importScripts('./db/openDb.js')

async function getDb ({dbName,objectStoreName,elementId}) {
    const getPromise = new Promise((resolve, reject) => {
        openDb({dbName}).then((db) => {
            const transaction = db.transaction([objectStoreName], "readwrite");
            const objectStore = transaction.objectStore(objectStoreName);
            
            const objectStoreRequest = objectStore.get(elementId)

            objectStoreRequest.onerror = (result) => {
                console.log('db error')
                reject(`Error opening database`);
            };

            objectStoreRequest.onsuccess = (result) => {
                console.log('about to resolve')
                resolve(result.srcElement.result);
            };
            console.log('about to fetch')
            objectStoreRequest
        })
    });
    const getResponse = await getPromise
    console.log('getResponse: ',getResponse)
    return getResponse
};



