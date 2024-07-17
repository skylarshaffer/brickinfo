//  Exports
////  Types
export type BackgroundMessage = {
  type: string;
}
  
export interface UpdateBlDbMessage extends BackgroundMessage {
  type: 'updateBlDb';
  blNewSessionId: string;
}

export interface FetchPricesMessage extends BackgroundMessage {
  type: 'fetchPrices';
  elementsArr: number[];
}

export interface GetBlPriceMessage extends BackgroundMessage {
  type: 'getBlPrice';
  elementId: number;
}
  
export type IncomingBackgroundMessage = UpdateBlDbMessage | FetchPricesMessage | GetBlPriceMessage