import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMaterialModule } from "../../myMaterial.module";

import { LoaderComponent } from './loader.component';
import { LoaderService } from './loader.service';
import { LoaderInterceptor } from './loader.interceptor';

@NgModule({
  imports: [ CommonModule, MyMaterialModule ],
  declarations: [ LoaderComponent ],
  exports: [ LoaderComponent ],
  providers: [
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
})
export class LoaderModule { }
