import { DirectivesModule } from './../shared/directives/directives.module';
import { DialogModule } from './../shared/dialogs/dialog.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { MobRoutingModule, routedComponents } from './spc-routing.module';
import { CommonModule } from '@angular/common';
import { MyMaterialModule } from '../myMaterial.module';

import { Spc0202mQueryComponent } from './spc0202m/spc0202m-query.component';

import { Spc0202mTableDialogComponent } from './spc0202m/spc0202m-table-dialog.component';

import { UnsavedGuard } from '../core/unsaved.guard';
import { HeaderComponent } from '../shared/header/header.component';
import { BarcodeTestComponent } from './barcode-test/barcode-test.component';
import { Spc0232mQueryComponent } from './spc0232m/spc0232m-query.component';
import { Spc0232mTableDialogComponent } from './spc0232m/spc0232m-table-dialog.component';
import { ZxingTestComponent } from './zxing-test/zxing-test.component';
import { OperationMenuComponent } from './operation-menu/operation-menu.component';
import { ProgressThreadComponent } from './ui/progress-thread/progress-thread.component';

const myDeclarations = routedComponents;

const myExports = myDeclarations;

const myEntryComponents = [
  Spc0202mQueryComponent,
  Spc0202mTableDialogComponent,

  Spc0232mQueryComponent,
  Spc0232mTableDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyMaterialModule,
    MobRoutingModule,
    DialogModule,

    DirectivesModule
  ],

  exports: [routedComponents],
  declarations: [
    routedComponents, 
    Spc0202mTableDialogComponent, 
    Spc0232mTableDialogComponent, 
    BarcodeTestComponent, 
    ZxingTestComponent, 
    OperationMenuComponent, 
    ProgressThreadComponent, 
  ],
  entryComponents: [ ...myEntryComponents],
  providers: [ UnsavedGuard ],
})
export class SpcModule { }
