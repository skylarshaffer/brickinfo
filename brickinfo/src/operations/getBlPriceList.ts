import { BlResponse, BlResponseItem } from "../types/BlHttpTypes";
import { BlElementsItem } from "../types/IndexedDBTypes";
import { getBlReqArr } from "./getBlReqArr";

type Props = {
    blElementsItemArr: BlElementsItem[];
    blAffiliateApiKey: string;
}

export async function getBlPriceList ({blElementsItemArr, blAffiliateApiKey}: Props): Promise<BlResponseItem[]> {
    const baseUrl = 'https://api.bricklink.com/api/affiliate/v1'
    const reqUrl = `${baseUrl}/price_guide_batch?api_key=${blAffiliateApiKey}`
    console.log('reqUrl: ',reqUrl)
    const blReqArr = await getBlReqArr({blElementsItemArr})
    async function fetchBl () {
        const req = fetch(reqUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blReqArr)
        })
        return (await req).json()
    };
    const data: BlResponse = await fetchBl()
    console.log('resJson reached, data: ',data)
    const blResArr = data.data
    return blResArr
}