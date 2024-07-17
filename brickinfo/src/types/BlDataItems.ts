export type BlCodesItem = {
    elementId: number;
    partId: string;
    colorName: string;
};

export type BlColorsItem = {
    colorId: number;
    colorName: string;
    rgb: string | null;
    type: string;
    parts: number | null;
    inSets: number | null;
    wanted: number | null;
    forSale: number | null;
    yearFrom: number | null;
    yearTo: number | null;
};

export type BlCategoriesItem = {
    categoryId: number;
    categoryName: string;
};

export type BlItemTypesItem = {
    itemTypeId: string;
    itemTypeName: string;
};

export type BlDataItem = BlCodesItem | BlColorsItem | BlCategoriesItem | BlItemTypesItem;

export type BlElementsItem = {
    elementId: number;
    partIds: string[]
    colorId: number;
};