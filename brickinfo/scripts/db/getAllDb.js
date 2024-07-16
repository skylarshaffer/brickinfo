

importScripts('./db/openDb.js')

async function getAllDb ({dbName,objectStoreName}) {
    const getAllPromise = new Promise((resolve, reject) => {
        openDb({dbName}).then((db) => {
            console.log('dbName: ',dbName,'objectStoreName: ', objectStoreName)
            const transaction = db.transaction([objectStoreName], "readwrite");
            const objectStore = transaction.objectStore(objectStoreName);
            
            const objectStoreRequest = objectStore.getAll()

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
    const getAllResponse = await getAllPromise
    console.log('getAllResponse: ',getAllResponse)
    return getAllResponse
};



