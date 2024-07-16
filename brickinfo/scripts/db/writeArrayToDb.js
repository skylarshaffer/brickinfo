import { openDb } from "./openDb";
export function writeArrayToDb(_a) {
    var dbName = _a.dbName, objectStoreName = _a.objectStoreName, dataArr = _a.dataArr;
    openDb({ dbName: dbName }).then(function (db) {
        var reqArr = [];
        var transaction = db.transaction([objectStoreName], "readwrite");
        var objectStore = transaction.objectStore(objectStoreName);
        objectStore.clear();
        var smallDataArr = [dataArr[0], dataArr[1], dataArr[2]];
        console.log('dataArr: ', smallDataArr);
        dataArr.forEach(function (elementData) {
            reqArr.push(new Promise(function (resolve, reject) {
                var req = objectStore.add(elementData);
                req.onerror = function (event) {
                    event.preventDefault();
                    console.log(event);
                };
                req.then(resolve());
            }));
        });
        Promise.all(reqArr)
            .then(function () {
            console.log('done writing');
        })
            .catch(function (error) {
            console.log(error);
        });
    });
}
;
