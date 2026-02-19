import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { Layout } from './wrapper/layout/layout';
import { RootRedirectGuard } from './guards/route-redirect.guard';

const routes: Routes = [

  {
    path: '',
    canActivate: [RootRedirectGuard],

    component: class DummyComponent { }
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule),
  },


  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('./modules/user/user-module').then(m => m.UserModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cars',
        loadChildren: () =>
          import('./modules/cars/cars-module').then(m => m.CarsModule)
      },
      {
        path: 'admin/cars',
        loadChildren: () =>
          import('./modules/cars/cars-module').then(m => m.CarsModule),
        canActivate: [AuthGuard, AdminGuard]
      },

      {
        path: 'acc',
        loadChildren: () =>
          import('./modules/acc/acc-module').then(m => m.AccModule)
      },
      {
        path: 'admin/acc',
        loadChildren: () =>
          import('./modules/acc/acc-module').then(m => m.AccModule),
        canActivate: [AuthGuard, AdminGuard]
      },

      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home-module').then(m => m.HomeModule)
      }
    ]
  },

  { path: '', redirectTo: 'auth/signin', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
