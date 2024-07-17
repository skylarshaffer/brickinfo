type Props = {
    key: string;
}

export async function getStorageItemValue ({key}: Props): Promise<any> {
    const item = await chrome.storage.sync.get(key)
    if (!item) {
        throw new Error(`Unexpected: ${key} not found in Chrome synced storage.`)
    }
    console.log('key: ',key, 'item: ', item)
    const value = item[key]
    return value
}