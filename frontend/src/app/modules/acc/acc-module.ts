import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccRoutingModule } from './acc-routing-module';
import { CategorieaccList } from './categorieacc-list/categorieacc-list';
import { AccPartAdmin } from './acc-part-admin/acc-part-admin';



@NgModule({
  declarations: [

    CategorieaccList,
      AccPartAdmin
  ],
  imports: [

    CommonModule,
    AccRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AccModule { }
