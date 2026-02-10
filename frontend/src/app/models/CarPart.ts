import { CarGeneration } from './CarGeneration';

export interface CarPart {
  id?: number;
  name: string;
  price: number;
  costPrice: number;
  inStock: boolean;
  image?: string;
  compatibility: CarGeneration[];
  generationIds?: number[];
  subCategoryId?: number | null;
  subCategoryName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;



  reference: string;
  description: string;
  designationId: number;
  designationName: string;




  onSale: boolean;
  salePercentage: number;
  priceAfterSale: number;


}
