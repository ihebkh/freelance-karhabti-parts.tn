export interface AccessoryPart {
    id: number;
    name: string;
    price: number;
    costPrice: number;
    inStock: boolean;
    image: string;
    reference: string;
    description: string;
    categoryAccId: number;
    categoryAccName?: string;
    designationId?: number;
    designationName?: string;
    onSale: boolean;
    salePercentage: number;
    priceAfterSale: number;
}