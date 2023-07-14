import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeTestComponent } from './spc/barcode-test/barcode-test.component';
import { DialogModule } from './shared/dialogs/dialog.module';
import { HeaderComponent } from './shared/header/header.component';
import { AppSvc } from './shared/svc/app.service';

import { DirectivesModule } from './shared/directives/directives.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppComponent } from './app.component';module
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'
import { HttpClient } from 'selenium-webdriver/http';

import { LoaderModule } from './shared/loader/loader.module';
import { MyMaterialModule } from './myMaterial.module';
import { FooComponent } from './foo/foo.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoaderModule,

    DialogModule,

    MyMaterialModule,

    FormsModule,
    ReactiveFormsModule
    
  ],
  bootstrap: [AppComponent],
  //bootstrap: [BarcodeTestComponent],
  providers: [AppSvc]
})
export class AppModule { }
