import { FooComponent } from './foo/foo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: "spc", pathMatch: "full"  },
  { path: 'spc', loadChildren: () => import('./spc/spc.module').then(m => m.SpcModule) },
  { path: 'foo', component: FooComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }

export const routedComponents = [
  AppComponent
];