type Props = {
    key: string;
    value: string;
}

export async function setStorageItemValue ({key, value}: Props): Promise<void> {
    try {
        await chrome.storage.sync.set({[key]: value})
    }
    catch (error) {
        throw new Error(`Exception: ${key} could not be set to ${value} in Chrome synced storage.`)
    }
    finally {
        return
    }
}