async function createDb(event) {
    const createPromise = new Promise((resolve, reject) => {
        const transaction = event.target.transaction;
        const db = event.target.result;
        console.log('eventTargetResult: ',db)
        const objectStore = db.createObjectStore("Elements", { keyPath: "elementId"});
        objectStore.createIndex("partIdArr", "partIdArr", { unique: false });
        objectStore.createIndex("colorIdArr", "colorIdArr", { unique: false });
        console.log('objectStore.transaction: ',objectStore.transaction)
        objectStore.transaction.oncomplete = () => {resolve(db)}
    })
    const createResponse = await createPromise
    console.log('createResponse: ',createResponse)
    return createResponse
}

async function openDb ({dbName}) {
    const openPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            console.log('db error')
            reject(`Error opening database: ${event.target.errorCode}`);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log('db: ',db)
            resolve(db);
        };

        request.onupgradeneeded = async (event) => {
            console.log('onUpgradeNeeded')
            const db = await createDb(event)
            resolve(db)
        };
    });
    const openResponse = await openPromise
    console.log('openResponse: ',openResponse)
    return openResponse
};

