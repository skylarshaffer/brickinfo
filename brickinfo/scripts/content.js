function waitForElm(selector) {
    return new Promise(function (resolve) {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        var observer = new MutationObserver(function (mutations) {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm('#pab-results-wrapper ul').then(function (elm) {
    console.log('Element is ready');
    var $ul = elm;
    console.log($ul);
    function addBricklinkPrice(div, price) {
        // create a new div element
        var $priceDiv = div.querySelector('div:has(span[data-test="pab-item-price"])');
        var $bricklinkPriceDiv = $priceDiv.cloneNode(true);
        $bricklinkPriceDiv.className = 'ElementLeaf_bricklinkPrice';
        var $bricklinkPriceSpan = $bricklinkPriceDiv.querySelector('span[data-test="pab-item-price"]');
        $bricklinkPriceSpan.dataset.test = 'pab-item-bricklink-price';
        $bricklinkPriceSpan.textContent = "BL: $".concat(price);
        div.insertBefore($bricklinkPriceDiv, $priceDiv.nextSibling);
    }
    var observer = new MutationObserver(function (mutationList) {
        mutationList.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-test') {
                if ($ul.dataset.test !== 'pab-search-results-list-loading') {
                    var $divs_1 = document.querySelectorAll('div[data-test="pab-item"]');
                    var elementsArr_1 = [];
                    $divs_1.forEach(function (div) {
                        var _a;
                        var $itemIdSpan = div.querySelector('span[data-test="element-item-id"]');
                        if ($itemIdSpan) {
                            var elementId = (_a = $itemIdSpan.textContent) === null || _a === void 0 ? void 0 : _a.match(/(?<=ID: )[^/]+/)[0];
                            elementsArr_1.push(elementId);
                        }
                    });
                    chrome.runtime.sendMessage({ name: 'fetchPrices', elementsArr: elementsArr_1 }, function () {
                        console.log('got fetchPrices');
                        $divs_1.forEach(function (div) {
                            var _a;
                            var $itemIdSpan = div.querySelector('span[data-test="element-item-id"]');
                            if ($itemIdSpan) {
                                var elementId = (_a = $itemIdSpan.textContent) === null || _a === void 0 ? void 0 : _a.match(/(?<=ID: )[^/]+/)[0];
                                console.log('sending getBlPrice');
                                var element_1 = {};
                                element_1.bricklink = {};
                                chrome.runtime.sendMessage({ name: 'getBlPrice', elementId: elementId }, function (response) {
                                    console.log('got back getBlPrice');
                                    console.log('response is: ', response);
                                    element_1.bricklink.price = response;
                                    console.log('element: ', element_1);
                                    if (typeof element_1.bricklink.price !== 'undefined') {
                                        if (!isNaN(element_1.bricklink.price) && element_1.bricklink.price !== null) {
                                            addBricklinkPrice(div, element_1.bricklink.price);
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });
    var target = $ul;
    var config = { attributes: true };
    observer.observe(target, config);
});
// `document.querySelector` may return null if the selector doesn't match anything.
