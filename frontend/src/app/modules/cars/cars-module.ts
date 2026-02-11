import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarsRoutingModule } from './cars-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandList } from './brand-list/brand-list';
import { ModelList } from './model-list/model-list';
import { GenerationList } from './generation-list/generation-list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarPartAdmin } from './car-part-admin/car-part-admin';
import { Orders } from './orders/orders';
import { SubcategoryList } from './subcategory-list/subcategory-list';
import { CategoryList } from './category-list/category-list';
import { PartsOnSale } from './parts-on-sale/parts-on-sale';
import { CarHeader } from './car-header/car-header';


@NgModule({
  declarations: [
    BrandList,
    ModelList,
    GenerationList,
    CarPartAdmin,
    Orders,
    SubcategoryList,
    CategoryList,
    PartsOnSale,
    CarHeader,
  ],
  imports: [
    NgbModule,
    CommonModule,
    CarsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CarsModule { }
