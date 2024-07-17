export type BlRequestItem = {
    item: {
        no: string;
        type: 'PART'
    };
    color_id: number;
}
  
export type BlResponsePriceObj = {
    unit_quantity: number;
    total_quantity: number;
    min_price: string;
    max_price: string;
    total_price: string;
    total_qty_price: string;
}
  
export interface BlResponseItem extends BlRequestItem {
    inventory_new: BlResponsePriceObj;
    inventory_used: BlResponsePriceObj;
    ordered_new: BlResponsePriceObj;
    ordered_used: BlResponsePriceObj;
}

export type BlResponse = {
    meta: {
        description: string;
        message: string;
        code: number;
    };
    data: BlResponseItem[];
}