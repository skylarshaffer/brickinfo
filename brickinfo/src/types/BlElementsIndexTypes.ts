export type BlElementsPricesList = {
    inventory_new: string;
    inventory_used: string;
    ordered_new: string;
    ordered_used: string;
}

export type BlElementsIndexItem = {
    elementId: number;
    partId: string;
    colorId: number;
    prices?: BlElementsPricesList;
}

export type BlElementsIndex = Record<string | number, [BlElementsIndexItem] | Record<number, BlElementsIndexItem>>
