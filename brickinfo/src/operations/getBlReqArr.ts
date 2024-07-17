import { BlRequestItem } from "../types/BlHttpTypes";
import { BlElementsItem } from "../types/IndexedDBTypes";

type Props = {
    blElementsItemArr: BlElementsItem[]
}

export async function getBlReqArr ({ blElementsItemArr }: Props): Promise<BlRequestItem[]> {
    const blReqArr = [] as BlRequestItem[]
    blElementsItemArr.forEach((blElementsItem) => {
        blElementsItem.partIds.forEach((partId) => {
            blReqArr.push(
                {
                    item: {
                        no: partId,
                        type: "PART"
                    },
                    color_id: blElementsItem.colorId
                }
            )
        })
    })
    return blReqArr
}