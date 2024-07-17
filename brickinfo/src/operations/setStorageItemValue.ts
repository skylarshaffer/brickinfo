//  Native
////  Types
type Props = {
    key: string;
    value: any;
}


//  Exports
////  Operations
export async function setStorageItemValue ({key, value}: Props): Promise<void> {
    try {
        console.log('Attempting to write: ',key,value)
        await chrome.storage.sync.set({[key]: value}).catch((error) => {throw new Error(error)})
    }
    catch (error) {
        throw new Error(`Exception: ${key} could not be set to ${value} in Chrome synced storage.`)
    }
    finally {
        return
    }
}