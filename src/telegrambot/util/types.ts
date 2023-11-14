export interface FeedbackI {
  id: string;
  text: string;
  productValuation: number;
  createdDate: string;
  answer: null | string;
  state: string;
  productDetails: {
    imtId: number;
    nmId: number;
    productName: string;
    supplierArticle: string;
    supplierName: string;
    brandName: string;
    size: string;
  };
  video: null | string;
  wasViewed: boolean;
  photoLinks: null | string[];
  userName: string;
  matchingSize: string;
  isAbleSupplierFeedbackValuation: boolean;
  supplierFeedbackValuation: number;
  isAbleSupplierProductValuation: boolean;
  supplierProductValuation: number;
  isAbleReturnProductOrders: boolean;
  returnProductOrdersDate: null | string;
}

export interface OpenChatInterface {
  getStream(text: string, chat_id: string): Promise<string | null>;
}
