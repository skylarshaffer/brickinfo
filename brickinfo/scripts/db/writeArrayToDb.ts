

import { openDb } from "./openDb";

export function writeArrayToDb ({dbName,objectStoreName,dataArr}) {
    openDb({dbName}).then((db) => {
        const reqArr = []
        const transaction = db.transaction([objectStoreName], "readwrite");
        const objectStore = transaction.objectStore(objectStoreName);
        objectStore.clear()
        const smallDataArr = [dataArr[0],dataArr[1],dataArr[2]]
        console.log('dataArr: ', smallDataArr)
        dataArr.forEach((elementData) => {
            reqArr.push(
                new Promise<void>((resolve,reject) => {
                    const req = objectStore.add(elementData)
                    req.onerror = (event) => {
                        event.preventDefault()
                        console.log(event)
                    }
                    (req as any).then(resolve())
                })
            )
        })
        Promise.all(reqArr)
        .then(() => {
            console.log('done writing')
        })
        .catch((error) => {
            console.log(error);
        });
    })
};