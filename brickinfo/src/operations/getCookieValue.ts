//  Native
////  Types
type Props = {
    url: string;
    cookieName: string;
}


//  Exports
////  Operations
export async function getCookieValue ({url, cookieName}: Props): Promise<any> {
    const item = await chrome.cookies.get({ url, name: cookieName })
    if (!item) {
        throw new Error(`${cookieName} cookie not be found for ${url}.`)
    }
    const value = item.value
    return value
}