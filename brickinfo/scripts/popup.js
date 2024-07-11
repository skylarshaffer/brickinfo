const $form = document.querySelector("form")
const $apiKey = document.querySelector('input[name="apiKey"]')

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
