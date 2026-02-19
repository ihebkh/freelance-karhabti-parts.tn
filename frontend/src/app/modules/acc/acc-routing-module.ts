import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { CategorieaccList } from './categorieacc-list/categorieacc-list';

const routes: Routes = [

  { path: 'accessoires', component: CategorieaccList },
  /*  
  
    { path: 'brands/:brandId/models', component: ModelList },
  
    { path: 'models/:modelId/generations', component: GenerationList },
  
    { path: 'generations/:generationId/parts', component: CarPartAdmin },
  
    { path: 'subcategories/:subcategoryId/parts', component: CarPartAdmin },
  
  
    { path: 'parts', component: CarPartAdmin },
    { path: 'sales', component: PartsOnSale },
  
    {
      path: 'orders', component: Orders,
      canActivate: [AuthGuard]
    },
    {
      path: 'categories',
      component: CategoryList
    },
    {
      path: 'categories/:categoryId/subcategories',
      component: SubcategoryList
    }*/

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccRoutingModule { }
