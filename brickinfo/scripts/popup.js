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
var $form = document.querySelector("form");
var $blAffiliateApiKey = document.querySelector('input[name="bl-affiliate-api-key"]');
var $updateBlDbButton = document.querySelector('#update-bl-db');
import { tsvToObj } from "./conversion/tsvToObj";
function getBlAffiliateApiKey() {
    return __awaiter(this, void 0, void 0, function () {
        var blAffiliateApiKeyObj, blAffiliateApiKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, chrome.storage.sync.get("blAffiliateApiKey")];
                case 1:
                    blAffiliateApiKeyObj = _a.sent();
                    blAffiliateApiKey = blAffiliateApiKeyObj.blAffiliateApiKey;
                    $blAffiliateApiKey.value = blAffiliateApiKey;
                    return [2 /*return*/];
            }
        });
    });
}
getBlAffiliateApiKey();
$form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log(event.target);
    var newBlAffiliateApiKey = event.target['bl-affiliate-api-key'].value;
    console.log("added to the form");
    console.log(newBlAffiliateApiKey);
    chrome.storage.sync.set({ blAffiliateApiKey: newBlAffiliateApiKey }).then(function () {
        console.log("Value is set");
    });
});
function tsvToArr(_a) {
    var data = _a.data, downloadType = _a.downloadType;
    var newArr = [];
    console.log('downloadType: ', downloadType);
    var lines = data.split('\r\n');
    console.log(downloadType, 'lines: ', lines);
    lines.forEach(function (line, index) {
        if (index !== 0 && line !== '') {
            var splitLine = line.split("\t");
            switch (downloadType) {
                case 'itemtypes':
                    newArr.push({ itemTypeId: splitLine[0], itemTypeName: splitLine[1] });
                    break;
                case 'categories':
                    newArr.push({ categoryId: splitLine[0], categoryName: splitLine[1] });
                    break;
                case 'colors':
                    newArr.push({ colorId: splitLine[0], colorName: splitLine[1], rgb: splitLine[2], type: splitLine[3], parts: splitLine[4], inSets: splitLine[5], wanted: splitLine[6], forSale: splitLine[7], yearFrom: splitLine[8], yearTo: splitLine[9] });
                    break;
                case 'codes':
                    newArr.push({ elementId: splitLine[2], partId: splitLine[0], colorName: splitLine[1] });
                    break;
                default:
                    console.log({ word: 'Error', data: 'Unexpected tsv, not sure what to do.' });
            }
        }
    });
    return newArr;
}
function colorsObjAndCodesArrToElements(_a) {
    var colorsObj = _a.colorsObj, codesArr = _a.codesArr;
    codesArr.forEach(function (element) {
        element.colorId = colorsObj[element.colorName];
    });
    var codesObj = {};
    codesArr.forEach(function (element) {
        if (typeof codesObj[element.elementId] === 'undefined') {
            codesObj[element.elementId] = {
                partIdArr: [element.partId],
                colorIdArr: [element.colorId]
            };
        }
        else {
            codesObj[element.elementId].partIdArr.push(element.partId);
            codesObj[element.elementId].colorIdArr.push(element.colorId);
        }
    });
    console.log('codesArr: ', [codesArr[0], codesArr[1], codesArr[2]]);
    console.log('codesObj: ', { '4516816': codesObj['4516816'], '6174085': codesObj['6174085'], '6454960': codesObj['6454960'] });
    console.log('codesObjReal: ', codesObj);
    var newCodesArr = [];
    for (var element in codesObj) {
        newCodesArr.push(({
            'elementId': element,
            'partIdArr': codesObj[element].partIdArr,
            'colorIdArr': codesObj[element].colorIdArr
        }));
    }
    console.log('newCodesArr: ', [newCodesArr[0], newCodesArr[1], newCodesArr[2]]);
    return newCodesArr;
}
$updateBlDbButton.addEventListener('click', function () {
    chrome.cookies.get({ url: 'https://bricklink.com', name: 'BLNEWSESSIONID' }, function (blNewSessionIdCookie) {
        if (blNewSessionIdCookie) {
            var blNewSessionId_1 = blNewSessionIdCookie.value;
            var blColorsResponse_1;
            var blCodesResponse_1;
            var colorsPromise = new Promise(function (resolve, reject) {
                chrome.runtime.sendMessage({ name: 'getBlDb', blNewSessionId: blNewSessionId_1, downloadType: 'colors' }, function (response) {
                    if (response.word === 'Error') {
                        if (response.desc === 'Not logged in to Bricklink') {
                            console.log('blNewSessionId cookie found but isn\'t validated. Please log in to bricklink.com and try again.');
                        }
                    }
                    else if (response.word === 'Success') {
                        if (response.downloadType === 'colors') {
                            console.log({ blColors: response.data });
                            blColorsResponse_1 = response;
                            /* chrome.storage.sync.set({ blColors: response.data }) */
                        }
                    }
                    console.log('response is: ', response);
                    resolve();
                });
            });
            var codesPromise = new Promise(function (resolve, reject) {
                chrome.runtime.sendMessage({ name: 'getBlDb', blNewSessionId: blNewSessionId_1, downloadType: 'codes' }, function (response) {
                    if (response.word === 'Error') {
                        if (response.desc === 'Not logged in to Bricklink') {
                            console.log('blNewSessionId cookie found but isn\'t validated. Please log in to bricklink.com and try again.');
                        }
                    }
                    else if (response.word === 'Success') {
                        if (response.downloadType === 'codes') {
                            console.log({ blCodes: response.data });
                            blCodesResponse_1 = response;
                            /* chrome.storage.sync.set({ blCodes: response.data }) */
                        }
                    }
                    console.log('response is: ', response);
                    resolve();
                });
            });
            Promise.all([colorsPromise, codesPromise]).then(function () {
                console.log('then reached');
                var colorsObj = tsvToObj(blColorsResponse_1);
                var codesArr = tsvToArr(blCodesResponse_1);
                console.log('colorsObj: ', colorsObj['Black']);
                console.log('codesArr: ', codesArr[0], codesArr[1], codesArr[2]);
                var blElementsArr = colorsObjAndCodesArrToElements({ colorsObj: colorsObj, codesArr: codesArr });
                console.log('blElementsArr: ', [blElementsArr[0], blElementsArr[1], blElementsArr[2]]);
                console.log('writing');
                chrome.runtime.sendMessage({ name: 'writeArrayToDb', dbName: 'BricklinkDB', objectStoreName: 'Elements', dataArr: blElementsArr }, function (response) {
                    console.log('done?');
                });
            });
        }
        else {
            console.log('blNewSessionId cookie cannot be found. Please log in to bricklink.com and try again.');
        }
    });
});
