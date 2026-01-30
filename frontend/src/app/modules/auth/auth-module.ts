import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Signup } from './signup/signup';
import { Signin } from './signin/signin';
import { Verify } from './verify/verify';
import {FormsModule} from '@angular/forms';
import { ForgotPassword } from './forgot-password/forgot-password';


@NgModule({
  declarations: [
    Signup,
    Signin,
    Verify,
    ForgotPassword
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
