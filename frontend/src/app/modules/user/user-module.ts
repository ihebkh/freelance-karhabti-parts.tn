import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { Profile } from './profile/profile';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UsersList } from './users-list/users-list';


@NgModule({
  declarations: [
    Profile,
    UsersList
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
