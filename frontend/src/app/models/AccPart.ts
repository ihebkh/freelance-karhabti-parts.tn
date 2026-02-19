export interface AccPart {
  id?: number;
  name: string;
  price: number;
  costPrice: number;
  inStock: boolean;
  image?: string;

  categoryAccId?: number;
  categoryAccName?: string;

  reference: string;
  description: string;
  designationId: number;
  designationName: string;

  onSale: boolean;
  salePercentage: number;
  priceAfterSale: number;
}

