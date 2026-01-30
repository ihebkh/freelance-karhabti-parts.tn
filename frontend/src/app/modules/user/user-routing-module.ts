import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Profile} from './profile/profile';
import {UsersList} from './users-list/users-list';
import {AuthGuard} from '../../guards/auth.guard';
import {AdminGuard} from '../../guards/admin.guard';

const routes: Routes = [
  { path: 'profile', component: Profile },
  { path: 'users', component: UsersList, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
