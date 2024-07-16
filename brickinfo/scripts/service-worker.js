var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { writeArrayToDb } from "./db/writeArrayToDb";
import { getDb } from "./db/getDb";
var blAffiliateApiKey = '';
function getApiKey(callback) {
    return __awaiter(this, void 0, void 0, function () {
        var blAffiliateApiKeyObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (blAffiliateApiKey !== '') {
                        callback(blAffiliateApiKey);
                    }
                    return [4 /*yield*/, chrome.storage.sync.get("blAffiliateApiKey")];
                case 1:
                    blAffiliateApiKeyObj = _a.sent();
                    blAffiliateApiKey = blAffiliateApiKeyObj.blAffiliateApiKey;
                    callback(blAffiliateApiKey);
                    return [2 /*return*/];
            }
        });
    });
}
var elementsObj = {};
console.log(elementsObj);
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.name === "getBlDb") {
        var viewType = void 0;
        var blNewSessionId = message.blNewSessionId;
        var downloadType_1 = message.downloadType;
        switch (downloadType_1) {
            case 'types':
                viewType = 1;
                break;
            case 'categories':
                viewType = 2;
                break;
            case 'colors':
                viewType = 3;
                break;
            case 'codes':
                viewType = 5;
                break;
        }
        fetch('https://www.bricklink.com/catalogDownload.asp?a=a', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "BLNEWSESSIONID=".concat(blNewSessionId)
            },
            body: new URLSearchParams({ viewType: viewType })
        }).then(function (res) {
            console.log(res);
            if (res.status !== 200) {
                console.log({ word: 'Error', desc: 'There was a problem downloading db from Bricklink.' });
                return;
            }
            if (res.url.startsWith('https://www.bricklink.com/v2/login.page?')) {
                response({ word: 'Error', desc: 'Not logged in to Bricklink' });
                return;
            }
            res.text().then(function (data) {
                switch (downloadType_1) {
                    case 'itemtypes':
                        if (data.startsWith('Item Type ID	Item Type Name')) {
                            console.log({ word: 'Success', data: 'Downloaded itemtypes.txt. Responding with data.' });
                            response({ word: 'Success', downloadType: downloadType_1, data: data });
                        }
                        break;
                    case 'categories':
                        if (data.startsWith('Category ID	Category Name')) {
                            console.log({ word: 'Success', data: 'Downloaded categories.txt. Responding with data.' });
                            response({ word: 'Success', downloadType: downloadType_1, data: data });
                        }
                        break;
                    case 'colors':
                        if (data.startsWith('Color ID	Color Name	RGB	Type	Parts	In Sets	Wanted	For Sale	Year From	Year To')) {
                            console.log({ word: 'Success', data: 'Downloaded colors.txt. Responding with data.' });
                            response({ word: 'Success', downloadType: downloadType_1, data: data });
                        }
                        break;
                    case 'codes':
                        if (data.startsWith('Item No	Color	Code')) {
                            console.log({ word: 'Success', data: 'Downloaded codes.txt. Responding with data.' });
                            response({ word: 'Success', downloadType: downloadType_1, data: data });
                        }
                        break;
                    default:
                        console.log({ word: 'Exception', data: 'Response unexpected, proceeding anyway.' });
                        response({ word: 'Exception', downloadType: downloadType_1, data: data });
                }
            });
        }).catch(function (err) {
            console.log({ word: 'Error', desc: 'There was a problem downloading db from Bricklink.' });
        });
    }
    if (message.name === "fetchPrices") {
        var blReqArr_1 = [];
        var elementsArr_1 = message.elementsArr;
        console.log('elementsArr: ', elementsArr_1);
        getApiKey(function (apiKey) {
            var baseUrl = 'https://api.bricklink.com/api/affiliate/v1';
            var reqUrl = "".concat(baseUrl, "/price_guide_batch?api_key=").concat(apiKey);
            console.log('reqUrl: ', reqUrl);
            var elementsArrPromiseArray = [];
            elementsArr_1.forEach(function (element) {
                elementsArrPromiseArray.push(new Promise(function (resolve, reject) {
                    getDb({ dbName: 'BricklinkDB', objectStoreName: 'Elements', elementId: element })
                        .then(function (result) {
                        elementsObj[element] = {
                            bricklink: {
                                partId: result.partIdArr[0],
                                colorId: result.colorIdArr[0]
                            }
                        };
                        console.log('elementsObj: ', elementsObj);
                        blReqArr_1.push({
                            "item": {
                                "no": elementsObj[element].bricklink.partId,
                                "type": "PART"
                            },
                            "color_id": elementsObj[element].bricklink.colorId
                        });
                        resolve();
                    });
                }));
            });
            Promise.all(elementsArrPromiseArray).then(function () {
                console.log('blReqArr: ', blReqArr_1);
                console.log('about to request: ', apiKey);
                fetch(reqUrl, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(blReqArr_1)
                }).then(function (res) {
                    if (res.status !== 200) {
                        if (res.status === 500) {
                            console.log({ word: 'Error', desc: 'Affiliate API is down at the moment. Please wait.' });
                            return;
                        }
                        console.log({ word: 'Error', desc: 'There was a problem with the Affiliate API request.' });
                        return;
                    }
                    res.json().then(function (data) {
                        var blResArr = data.data;
                        var blPriceObj = {};
                        console.log('blResArr: ', blResArr);
                        blResArr.forEach(function (element) {
                            blPriceObj["".concat(element.item.no, "-").concat(element.color_id)] = (Number(element.inventory_used.total_price) / element.inventory_used.total_quantity).toFixed(2);
                        });
                        console.log('blPriceObj: ', blPriceObj);
                        for (var element in elementsObj) {
                            if (typeof blPriceObj["".concat(elementsObj[element].bricklink.partId, "-").concat(elementsObj[element].bricklink.colorId)] !== 'undefined') {
                                console.log('price: ', blPriceObj["".concat(elementsObj[element].bricklink.partId, "-").concat(elementsObj[element].bricklink.colorId)]);
                                elementsObj[element].bricklink.price = blPriceObj["".concat(elementsObj[element].bricklink.partId, "-").concat(elementsObj[element].bricklink.colorId)];
                            }
                            else {
                                console.log('no price found');
                                elementsObj[element].bricklink.price = null;
                            }
                        }
                        console.log(elementsObj);
                        response({ word: 'Success', desc: 'elementsObj done forming.' });
                    });
                }).catch(function (err) {
                    console.log({ word: 'Error', desc: 'There was a problem with the Affiliate API request.' });
                });
            });
        });
    }
    if (message.name === "getBlPrice") {
        var elementId = message.elementId;
        if (typeof elementsObj[elementId] !== 'undefined') {
            console.log('price is: ', elementsObj[elementId].bricklink.price);
            response(elementsObj[elementId].bricklink.price);
        }
        else {
            console.log('test:', { word: 'Error', desc: 'Element property does not exist in elementsObj.' });
            response({ word: 'Error', desc: 'Element property does not exist in elementsObj.' });
        }
    }
    if (message.name === "writeArrayToDb") {
        var dbName = message.dbName;
        var objectStoreName = message.objectStoreName;
        var dataArr = message.dataArr;
        writeArrayToDb({ dbName: dbName, objectStoreName: objectStoreName, dataArr: dataArr });
        response({ word: 'Success', desc: 'Done writing array to indexeddb.' });
    }
    if (message.name === "getDb") {
        var dbName = message.dbName;
        var objectStoreName = message.objectStoreName;
        var elementId = message.elementId;
        getDb({ dbName: dbName, objectStoreName: objectStoreName, elementId: elementId }).then(function (result) {
            console.log('response success: ', result);
            response(result);
        });
    }
    return true;
});
