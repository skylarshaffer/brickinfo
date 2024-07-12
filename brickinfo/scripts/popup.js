const $blAffiliateApiKeyForm = document.querySelector("#bl-affiliate-api-key-form")
const $blCredentialsForm = document.querySelector("#bl-credentials-form")
const $blAffiliateApiKey = document.querySelector('input[name="bl-affiliate-api-key"]')
const $blUsername = document.querySelector('input[name="bl-username"]')

async function getBlAffiliateApiKey () {
    $blAffiliateApiKey.value = (await chrome.storage.sync.get("blAffiliateApiKey")).blAffiliateApiKey
}

async function getblUsername () {
    $blUsername.value = (await chrome.storage.sync.get("blUsername")).blUsername
}

async function getBlNewSessionId () {
    fetch('https://bricklink.com').then((res) => {
        if (res.status !== 200) {
            console.log({word: 'Error', desc: 'There was a problem obtaining the BLNEWSESSIONID cookie.'});
            return
        }
        res.json().then((data) => {
            const blNewSessionId = data.blNewSessionId
            return blNewSessionId
        })
    }).catch((err) => {
        console.log({word: 'Error', desc: 'There was a problem obtaining the BLNEWSESSIONID cookie.'})
        return
    })
}

async function validateBlNewSessionId (blNewSessionId, blUsername, blPassword) {
    fetch('https://www.bricklink.com/ajax/renovate/loginandout.ajax',{
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'BLNEWSESSIONID='
        },
        body: {userid: blUsername ,password: blPassword}
    }).then((res) => {
        if (res.status !== 200) {
            console.log({word: 'Error', desc: 'There was a problem validating the BLNEWSESSIONID cookie.'});
            return
        } else {
            console.log({word: 'Success', desc: 'Res status 200, assuming success.'})
            return
        }
    })
}

async function getColorsXml (blNewSessionId) {
    fetch('https://www.bricklink.com/catalogDownload.asp?downloadType=X&viewType=3',{
        headers: {
          'Cookie': blNewSessionId
        }
    }).then((res) => {
        if (res.status !== 200) {
            console.log({word: 'Error', desc: 'There was a problem downloading colors.xml.'});
            return
        } else {
            console.log({word: 'Success', desc: 'Res status 200, assuming success.'})
            console.log({word: 'colors.xml', res: res})
            return
        }
    })
}

async function getCodesXml (blNewSessionId) {
    fetch('https://www.bricklink.com/catalogDownload.asp?downloadType=X&viewType=5',{
        headers: {
          'Cookie': blNewSessionId
        }
    }).then((res) => {
        if (res.status !== 200) {
            console.log({word: 'Error', desc: 'There was a problem downloading codes.xml.'});
            return
        } else {
            console.log({word: 'Success', desc: 'Res status 200, assuming success.'})
            console.log({word: 'codes.xml', res: res})
            return
        }
    })
}

getBlAffiliateApiKey();
getBlUsername();

$blAffiliateApiKeyForm.addEventListener('submit',function(event){
    event.preventDefault()
    const newBlAffiliateApiKey = event.target.blAffiliateApiKey.value
    console.log("added to the form")
    console.log(newBlAffiliateApiKey)
    chrome.storage.sync.set({ blAffiliateApiKey: newBlAffiliateApiKey }).then(() => {
        console.log("Value is set");
    });
})

$blCredentialsForm.addEventListener('submit',function(event){
    event.preventDefault()
    const newBlUsername = event.target.blUsername.value
    chrome.storage.sync.set({ blUsername: newBlUsername }).then(() => {
        console.log("Bl credentials set");
    });
})

$blCredentialsForm.addEventListener('submit',function(event){
    event.preventDefault()
    const providedBlUsername = event.target.blUsername.value
    const providedBlPassword = event.target.blPassword.value
    getBlNewSessionId((blNewSessionId) =>{
        validateBlNewSessionId(blNewSessionId, providedBlUsername,providedBlPassword)
        .then(() => {
            console.log('Assuming all good')
        })
    })
})
