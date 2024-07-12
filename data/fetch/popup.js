async function getColorsXml () {
    fetch('https://www.bricklink.com/catalogDownload.asp?downloadType=X&viewType=3',{
        headers: {
          'Cookie': 'BLNEWSESSIONID=',
          'Host': 'www.bricklink.com',
          'User-Agent': 'PostmanRuntime/7.40.0'
        },
        redirect: 'follow'
    }).then((res) => {
        res.text().then((data)=>{console.log(data)})
        /* if (res.status !== 200) {
            console.log({word: 'Error', desc: 'There was a problem downloading codes.xml.'});
            return
        } else {
            console.log({word: 'Success', desc: 'Res status 200, assuming success.'})
            console.log({word: 'codes.xml', res: res})
            return
        } */
    }).catch((err) => {
        console.log({word: 'Error', err})
    })
}

getColorsXml()
