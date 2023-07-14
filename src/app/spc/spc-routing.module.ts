import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Spc0202mComponent } from './spc0202m/spc0202m.component';
import { Spc0202mQueryComponent } from './spc0202m/spc0202m-query.component';
import { Spc0232mComponent } from './spc0232m/spc0232m.component';
import { UnsavedGuard } from '../core/unsaved.guard';
import { Spc0232mQueryComponent } from './spc0232m/spc0232m-query.component';

import { DonutComponent } from './ui/donut/donut.component';
import { ProgressComponent } from './ui/progress/progress.component';

import { BarcodeTestComponent } from './barcode-test/barcode-test.component';
import { ZxingTestComponent } from './zxing-test/zxing-test.component';
import { OperationMenuComponent } from './operation-menu/operation-menu.component';

const routes: Routes = [
  { path: '', redirectTo: "operationMenu", pathMatch: "exact" },
  { path: 'operationMenu', component: OperationMenuComponent},
  { path: 'spc0202m', component: Spc0202mComponent },
  { path: 'spc0232m', component: Spc0232mComponent },

  { path: 'barcodeTest', component: BarcodeTestComponent },
  { path: 'zxingtest', component: ZxingTestComponent },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class MobRoutingModule { }

export const routedComponents = [
  Spc0202mComponent,
  Spc0202mQueryComponent,

  Spc0232mComponent,
  Spc0232mQueryComponent,

  BarcodeTestComponent,
  ZxingTestComponent,

  DonutComponent,
  ProgressComponent,

];