//  Exports
////  Types
export type BlElementsItem = {
    elementId: number;
    partIds: string[]
    colorId: number;
    prices?: {
        inventory_new: string;
        inventory_used: string;
        ordered_new: string;
        ordered_used: string;
    };
}