const $form = document.querySelector("form")
const $apiKey = document.querySelector('input[name="api-key"]')
const $updateBlDbButton = document.querySelector('#update-bl-db')

async function getApiKey () {
    $apiKey.value = (await chrome.storage.sync.get("apiKey")).apiKey
}

getApiKey();

$form.addEventListener('submit',function(event){
    event.preventDefault()
    const newApiKey = event.target.apiKey.value
    console.log("added to the form")
    console.log(newApiKey)
    chrome.storage.sync.set({ apiKey: newApiKey }).then(() => {
        console.log("Value is set");
    });
})

chrome.storage.sync.onChanged.addListener((changes, namespace) => {
    for (let [apiKey, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${apiKey}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
        $apiKey.value = newValue
    }
    
});

$updateBlDbButton.addEventListener('click', () => {
    chrome.cookies.get({ url: 'https://bricklink.com', name: 'BLNEWSESSIONID' },(blNewSessionIdCookie) => {
        if (blNewSessionIdCookie) {
            const blNewSessionId = blNewSessionIdCookie.value
            chrome.runtime.sendMessage({ name: 'getBlDb', blNewSessionId, downloadType: 'colors'}, (response) => {
                if (response.word === 'Error') {
                    if (response.desc === 'Not logged in to Bricklink') {
                        console.log('blNewSessionId cookie found but isn\'t validated. Please log in to bricklink.com and try again.')
                    }
                }
                else if (response.word === 'Success') {
                    if (response.downloadType === 'codes') {
                        chrome.storage.sync.set({ blColors: response.data })
                    }
                }
                console.log('response is: ', response)
            })
            chrome.runtime.sendMessage({ name: 'getBlDb', blNewSessionId, downloadType: 'codes'}, (response) => {
                if (response.word === 'Error') {
                    if (response.desc === 'Not logged in to Bricklink') {
                        console.log('blNewSessionId cookie found but isn\'t validated. Please log in to bricklink.com and try again.')
                    }
                }
                else if (response.word === 'Success') {
                    if (response.downloadType === 'codes') {
                        chrome.storage.sync.set({ blCodes: response.data })
                    }
                }
                console.log('response is: ', response)
            })
        } else {
            console.log('blNewSessionId cookie cannot be found. Please log in to bricklink.com and try again.')
        }
    });
});
