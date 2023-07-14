import { NumberOnly2 } from './numberOnly-directive2';
import { NumberOnly } from './numberOnly-directive';
import { NgModule } from '@angular/core';
import { WidthDirective } from './width.directive';

@NgModule({
  declarations: [
    NumberOnly,
    NumberOnly2,
    WidthDirective
  ],

  imports: [
  ],

  exports: [
    NumberOnly,
    NumberOnly2,
    WidthDirective
  ],

  providers: [],
})
export class DirectivesModule { }
