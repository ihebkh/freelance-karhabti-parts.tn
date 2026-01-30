import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Signin} from './signin/signin';
import {Signup} from './signup/signup';
import {Verify} from './verify/verify';
import {ForgotPassword} from './forgot-password/forgot-password';

const routes: Routes = [
  { path: 'signin', component: Signin },
  { path: 'signup', component: Signup },
  { path: 'verify', component: Verify },
  { path: 'forgot-password', component:ForgotPassword}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
