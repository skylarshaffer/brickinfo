async function createDb(event): Promise<IDBDatabase> {
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
    const createResponse = await createPromise as IDBDatabase
    console.log('createResponse: ',createResponse)
    return createResponse
}

export async function openDb ({dbName}): Promise<IDBDatabase> {
    const openPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName as string, 1);

        request.onerror = (event) => {
            console.log('db error')
            reject(event);
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            console.log('db: ',db)
            resolve(db);
        };

        request.onupgradeneeded = async (event) => {
            console.log('onUpgradeNeeded')
            const db = await createDb(event)
            resolve(db)
        };
    });
    const openResponse = await openPromise as IDBDatabase
    console.log('openResponse: ',openResponse)
    return openResponse
};

