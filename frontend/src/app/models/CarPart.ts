import {CarGeneration} from './CarGeneration';

export interface CarPart {
  id?: number;
  name: string;
  price: number;
  inStock: boolean;
  image?: string;
  compatibility: CarGeneration[];
  generationIds?: number[];
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
  categoryName: string;



  reference: string;
  description:string;
  designationId:number;
  designationName:string;




  onSale:boolean;
  salePercentage: number;
  priceAfterSale: number;


}
