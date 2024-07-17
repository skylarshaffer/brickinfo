import { BlDataItem, BlCodesItem, BlColorsItem, BlCategoriesItem, BlItemTypesItem } from "../types/BlDataItems";


type Props = {
    tsv: string;
}

export async function tsvToArr({tsv}: Props) {
    const blDataItemArr = [] as BlDataItem[]
    const lines = tsv.split('\r\n')
    let downloadType: string
    if (lines[0].startsWith('Item No')) {
        downloadType = 'codes'
    }
    else if (lines[0].startsWith('Color ID')) {
        downloadType = 'colors'
    }
    else if (lines[0].startsWith('Category ID')) {
        downloadType = 'categories'
    }
    else if (lines[0].startsWith('Item Type ID')) {
        downloadType = 'itemtypes'
    }
    else throw new Error("Unrecognized download type.")
    lines.forEach((line, index) => {
        if (index !== 0 && line !== '') {
            const splitLine = line.split("\t")
            switch (downloadType) {
                case 'codes':
                    const blCodesItem: BlCodesItem =
                    {
                        elementId: Number(splitLine[2]),
                        partId: splitLine[0],
                        colorName: splitLine[1]
                    }
                    blDataItemArr.push(blCodesItem)
                    break;
                case 'colors':
                    const blColorsItem: BlColorsItem =
                    {
                        colorId: Number(splitLine[0]),
                        colorName: splitLine[1],
                        rgb: splitLine[2],
                        type: splitLine[3],
                        parts: Number(splitLine[4]),
                        inSets: Number(splitLine[5]),
                        wanted: Number(splitLine[6]),
                        forSale: Number(splitLine[7]),
                        yearFrom: Number(splitLine[8]),
                        yearTo: Number(splitLine[9])
                    }
                    blDataItemArr.push(blColorsItem)
                    break;
                case 'categories':
                    const blCategoriesItem: BlCategoriesItem =
                    {
                        categoryId: Number(splitLine[0]),
                        categoryName: splitLine[1]
                    }
                    blDataItemArr.push(blCategoriesItem)    
                    break;
                case 'itemtypes':
                    const blItemTypesItem: BlItemTypesItem =
                    {
                        itemTypeId: splitLine[0],
                        itemTypeName: splitLine[1]
                    }
                    blDataItemArr.push(blItemTypesItem)
                    break;
                default:
                    throw new Error("Unexpected error.")
            }
        }
    })
    console.log('downloadType: ',downloadType,'blDataItemArr: ', blDataItemArr)
    return blDataItemArr
}