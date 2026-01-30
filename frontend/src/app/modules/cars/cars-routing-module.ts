import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BrandList} from './brand-list/brand-list';
import {ModelList} from './model-list/model-list';
import {GenerationList} from './generation-list/generation-list';
import {CarPartAdmin} from './car-part-admin/car-part-admin';
import {Orders} from './orders/orders';
import {CategoryList} from './category-list/category-list';
import {SubcategoryList} from './subcategory-list/subcategory-list';
import {PartsOnSale} from './parts-on-sale/parts-on-sale';
import {AuthGuard} from '../../guards/auth.guard';

const routes: Routes = [
  { path: 'brands', component: BrandList },

  { path: 'brands/:brandId/models', component: ModelList },

  { path: 'models/:modelId/generations', component: GenerationList },

  { path: 'generations/:generationId/parts', component: CarPartAdmin },

  { path: 'subcategories/:subcategoryId/parts', component: CarPartAdmin },


  { path: 'parts', component: CarPartAdmin },
  { path: 'sales', component: PartsOnSale },

  {path: 'orders',component: Orders,
  canActivate:[AuthGuard]},
  {
    path: 'categories',
    component: CategoryList
  },
  {
    path: 'categories/:categoryId/subcategories',
    component: SubcategoryList
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule { }
