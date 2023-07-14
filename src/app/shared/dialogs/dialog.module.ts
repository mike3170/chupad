import { MyDialog } from './myDIalog.component.';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MyMaterialModule } from './../../myMaterial.module';

import { ConfirmDialog } from './confirmDialog.component';
import { WarnDialog } from './warnDialog.component';
import { Warn2Dialog } from './warn2Dialog.component.';
import { ErrorDialog } from './errorDialog.component';
import { ValidMessagesDialog } from './vaildMessageDialog.component';
import { InfoDialog } from './infoDialog.component';
import { AbortDialog } from './abortDialog.component.';
import { UnSaveDialog } from './UnSaveDialog.component';

const myImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MyMaterialModule,
];

const myDeclarations = [
  ConfirmDialog,
  WarnDialog,
  Warn2Dialog,
  ErrorDialog,
  InfoDialog,
  ValidMessagesDialog,
  AbortDialog,
  UnSaveDialog,
  MyDialog
]

const myExports = myDeclarations;
const entryComponents = myDeclarations;

const myProviders = [
];

@NgModule({
  imports: [ ...myImports ],
  exports: [ ...myExports],
  declarations: [...myDeclarations],
  providers: [...myProviders],
  entryComponents: [ ...entryComponents ]
})
export class DialogModule { }
