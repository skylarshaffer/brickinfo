//  Native
////  Types
type Props = {
    downloadType: string;
    blNewSessionId: string;
}


//  Exports
////  Operations
export async function getBlTxt ({ downloadType, blNewSessionId }: Props): Promise<string> {
    let viewType
    switch (downloadType) {
        case 'codes':
            viewType = '5'
            break;
        case 'colors':
            viewType = '3'
            break;
        case 'categories':
            viewType = '2'
            break;
        case 'itemtypes':
            viewType = '1'
            break;
        default:
            throw new Error("Unrecognized download type.")
    }
    try {
        const response = await fetch('https://www.bricklink.com/catalogDownload.asp?a=a',{
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `BLNEWSESSIONID=${blNewSessionId}`
            },
            body: new URLSearchParams({ viewType: viewType })
        })
        const tsv = response.text()
        return tsv
    }
    catch (error) {
        throw new Error(`${downloadType} could not download from https://www.bricklink.com/catalogDownload.asp?a=a. Please make sure you are signed into Bricklink and that it is not down right now. Error: ${error}`)
    }
}