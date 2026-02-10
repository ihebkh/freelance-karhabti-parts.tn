import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { HomePage } from './home-page/home-page';
import { CarsContainer } from './cars-container/cars-container';
import { HomeManufactures } from './home-manufactures/home-manufactures';
import { AlertHome } from './alert-home/alert-home';
import { BrandListConstante } from './brand-list-constante/brand-list-constante';
import { CategoryList } from './category-list/category-list';
import { PicturesWelcome } from './pictures-welcome/pictures-welcome';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomePage,
    CarsContainer,
    HomeManufactures,
    AlertHome,
    BrandListConstante,
    CategoryList,
    PicturesWelcome,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ]
})
export class HomeModule { }
