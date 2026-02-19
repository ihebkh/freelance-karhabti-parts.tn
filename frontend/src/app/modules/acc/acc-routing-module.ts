import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { CategorieaccList } from './categorieacc-list/categorieacc-list';
import { AccPartAdmin } from './acc-part-admin/acc-part-admin';

const routes: Routes = [

  { path: 'categoriesacc', component: CategorieaccList },
  { path: 'categoriesacc/:accessoiresId', component: AccPartAdmin },

  /*  
  
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
