const $form = document.querySelector("form")
const $blAffiliateApiKey = document.querySelector('input[name="bl-affiliate-api-key"]')
const $updateBlDbButton = document.querySelector('#update-bl-db')
const $createDbButton = document.querySelector('#create-db')
const $writeDbButton = document.querySelector('#write-db')


async function getBlAffiliateApiKey () {
    const blAffiliateApiKeyObj = await chrome.storage.sync.get("blAffiliateApiKey")
    const blAffiliateApiKey = blAffiliateApiKeyObj.blAffiliateApiKey
    $blAffiliateApiKey.value = blAffiliateApiKey
}

getBlAffiliateApiKey()

$form.addEventListener('submit',function(event){
    event.preventDefault()
    console.log(event.target)
    const newBlAffiliateApiKey = event.target['bl-affiliate-api-key'].value
    console.log("added to the form")
    console.log(newBlAffiliateApiKey)
    chrome.storage.sync.set({ blAffiliateApiKey: newBlAffiliateApiKey }).then(() => {
        console.log("Value is set");
    });
})

function tsvToObj({data,downloadType}) {
    const newObj = {}
    console.log('downloadType: ',downloadType)
    const lines = data.split('\r\n')
    console.log(downloadType, 'lines: ', lines)
    lines.forEach((line, index) => {
        if (index !== 0 && line !== '') {
            const splitLine = line.split("\t")
            switch (downloadType) {
                case 'itemtypes':
                    newObj[splitLine[0]] = splitLine[1]
                    break;
                case 'categories':
                    newObj[splitLine[0]] = splitLine[1]
                    break;
                case 'colors':
                    newObj[splitLine[1]] = splitLine[0]
                    break;
                case 'codes':
                    newObj[splitLine[2]] = {itemId: splitLine[0], colorName: splitLine[1]}
                    break;
                default:
                    console.log({word: 'Error', data: 'Unexpected tsv, not sure what to do.'})
            }
        }
    })
    return newObj
}

function tsvToArr({data,downloadType}) {
    const newArr = []
    console.log('downloadType: ',downloadType)
    const lines = data.split('\r\n')
    console.log(downloadType, 'lines: ', lines)
    lines.forEach((line, index) => {
        if (index !== 0 && line !== '') {
            const splitLine = line.split("\t")
            switch (downloadType) {
                case 'itemtypes':
                    newArr.push({itemTypeId: splitLine[0], itemTypeName: splitLine[1]})    
                    break;
                case 'categories':
                    newArr.push({categoryId: splitLine[0], categoryName: splitLine[1]})    
                    break;
                case 'colors':
                    newArr.push({colorId: splitLine[0], colorName: splitLine[1],rgb: splitLine[2],type: splitLine[3],parts: splitLine[4],inSets: splitLine[5],wanted: splitLine[6], forSale: splitLine[7],yearFrom: splitLine[8],yearTo: splitLine[9]})
                    break;
                case 'codes':
                    newArr.push({elementId: splitLine[2], partId: splitLine[0], colorName: splitLine[1]})
                    break;
                default:
                    console.log({word: 'Error', data: 'Unexpected tsv, not sure what to do.'})
            }
        }
    })
    return newArr
}

function colorsObjAndCodesArrToElements({colorsObj, codesArr}) {
    codesArr.forEach((element) =>{
        element.colorId = colorsObj[element.colorName]
    })
    const codesObj = {}
    codesArr.forEach((element) =>{
        if (typeof codesObj[element.elementId] === 'undefined')  {
            codesObj[element.elementId] = {
                partIdArr: [element.partId],
                colorIdArr: [element.colorId]
            }
        } else {
            codesObj[element.elementId].partIdArr.push(element.partId)
            codesObj[element.elementId].colorIdArr.push(element.colorId)
        }
    })
    console.log('codesArr: ',[codesArr[0],codesArr[1],codesArr[2]])
    console.log('codesObj: ',{ '4516816': codesObj['4516816'], '6174085': codesObj['6174085'], '6454960': codesObj['6454960']})
    console.log('codesObjReal: ',codesObj)
    const newCodesArr = []
    for (const element in codesObj) {
        newCodesArr.push((
            {
                'elementId': element,
                'partIdArr': codesObj[element].partIdArr,
                'colorIdArr': codesObj[element].colorIdArr
            }
        ))
    }
    console.log('newCodesArr: ',[newCodesArr[0],newCodesArr[1],newCodesArr[2]])
    return newCodesArr

}

$updateBlDbButton.addEventListener('click', () => {
    chrome.cookies.get({ url: 'https://bricklink.com', name: 'BLNEWSESSIONID' },(blNewSessionIdCookie) => {
        if (blNewSessionIdCookie) {
            const blNewSessionId = blNewSessionIdCookie.value
            let blColorsResponse = ''
            let blCodesResponse = '' 
            const colorsPromise = new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ name: 'getBlDb', blNewSessionId, downloadType: 'colors'}, (response) => {
                    if (response.word === 'Error') {
                        if (response.desc === 'Not logged in to Bricklink') {
                            console.log('blNewSessionId cookie found but isn\'t validated. Please log in to bricklink.com and try again.')
                        }
                    }
                    else if (response.word === 'Success') {
                        if (response.downloadType === 'colors') {
                            console.log({ blColors: response.data })
                            blColorsResponse = response
                            /* chrome.storage.sync.set({ blColors: response.data }) */
                        }
                    }
                    console.log('response is: ', response)
                    resolve()
                })
            })
            const codesPromise = new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ name: 'getBlDb', blNewSessionId, downloadType: 'codes'}, (response) => {
                    if (response.word === 'Error') {
                        if (response.desc === 'Not logged in to Bricklink') {
                            console.log('blNewSessionId cookie found but isn\'t validated. Please log in to bricklink.com and try again.')
                        }
                    }
                    else if (response.word === 'Success') {
                        if (response.downloadType === 'codes') {
                            console.log({ blCodes: response.data })
                            blCodesResponse = response
                            /* chrome.storage.sync.set({ blCodes: response.data }) */
                        }
                    }
                    console.log('response is: ', response)
                    resolve()
                })
              });
                
            
            Promise.all([colorsPromise,codesPromise]).then(() => {
                console.log('then reached')
                const colorsObj = tsvToObj(blColorsResponse)
                const codesArr = tsvToArr(blCodesResponse)
                console.log('colorsObj: ', colorsObj['Black'])
                console.log('codesArr: ', codesArr[0],codesArr[1],codesArr[2])
                const blElementsArr = colorsObjAndCodesArrToElements({colorsObj,codesArr})
                console.log('blElementsArr: ',[blElementsArr[0],blElementsArr[1],blElementsArr[2]])
                console.log('writing')
                writeArrayToDb({dbName: 'BricklinkDB', objectStoreName: 'Elements', dataArr: blElementsArr})
                console.log('done?')
            })
        } else {
            console.log('blNewSessionId cookie cannot be found. Please log in to bricklink.com and try again.')
        }
    });
});

async function createBlDb(event) {
    const createPromise = new Promise((resolve, reject) => {
        const transaction = event.target.transaction;
        const db = event.target.result;
        console.log('eventTargetResult: ',db)
        const objectStore = db.createObjectStore("Elements", { keyPath: "elementId"});
        objectStore.createIndex("partIdArr", "partIdArr", { unique: false });
        objectStore.createIndex("colorIdArr", "colorIdArr", { unique: false });
        objectStore.transaction.oncompleted = () => {resolve(db)}
    })
    const createResponse = await createPromise
    console.log('createResponse: ',createResponse)
    return createResponse
}

async function openBlDb ({dbName}) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            console.log('db error')
            reject(`Error opening database: ${event.target.errorCode}`);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = async (event) => {
            console.log('onUpgradeNeeded')
            resolve(await createBlDb(event))
        };
    });
};

$createDbButton.addEventListener('click', () => {
    // Open the database
    openBlDb({dbName: 'BricklinkDB'});
})

$writeDbButton.addEventListener('click', () => {
    const testArr = [{elementId: 10458, partId: 'a1', colorName: 'Black', colorId: 21},{elementId: 104542, partId: 'a12', colorName: 'Black', colorId: 211}]
    writeArrayToDb({dbName: 'BricklinkDB',dataArr:testArr});
})

function writeArrayToDb ({dbName,objectStoreName,dataArr}) {
    openBlDb({dbName}).then((db) => {
        const reqArr = []
        const transaction = db.transaction([objectStoreName], "readwrite");
        const objectStore = transaction.objectStore(objectStoreName);
        const smallDataArr = [dataArr[0],dataArr[1],dataArr[2]]
        console.log('dataArr: ', smallDataArr)
        dataArr.forEach((elementData) => {
            reqArr.push(
                new Promise((resolve,reject) => {
                    const req = objectStore.add(elementData)
                    req.onerror = (event) => {
                        event.preventDefault()
                        console.log(event)
                    }
                    req.then(resolve())
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
    });
};

