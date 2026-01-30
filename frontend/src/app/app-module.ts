import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Layout } from './wrapper/layout/layout';
import {Topbar} from './wrapper/topbar/topbar';
import { Sidebar } from './wrapper/sidebar/sidebar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Welcomebar } from './wrapper/welcomebar/welcomebar';
import { Footer } from './wrapper/footer/footer';
import {MobileSidebar} from './wrapper/mobile-sidebar/mobile-sidebar';
@NgModule({
  declarations: [
    App,
    Layout,
    Topbar,
    Sidebar,
    Welcomebar,
    Footer,
    MobileSidebar,],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService,


    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
