import { NgModule, Injectable } from '@angular/core';

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";

import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

// material 2 data adapter, david test
@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
  private dateRegex = /^(19|20)\d\d[\-](0[1-9]|1[012])[\-](0[1-9]|[12][0-9]|3[01])$/;

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`;
    } else {
      //console.log("dataAdapter else");

      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      const ymd = `${year}-${month}-${day}`;

      return ymd;
    }
  }

  // 
  parse(value: any): Date | null {
    //console.log("parse: " + value);
    //console.log(typeof value);

    try {
      if (typeof value === "string" && this.dateRegex.test(value)) {
        let arr = value.split("-");
        let year = Number(arr[0]);
        let month = Number(arr[1]) - 1;
        let date = Number(arr[2]);

        return new Date(year, month, date);
      } else {
        console.log("hello mia");
        return null;
      }
    } catch (err) {
      return null;
    }

  }
};

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

const myImports = [
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatDividerModule,

  MatDatepickerModule,
  MatNativeDateModule,

  MatSnackBarModule,
  MatSelectModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatMenuModule,
  MatListModule,
  MatGridListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatBottomSheetModule
];

@NgModule({
  imports: [...myImports],
  exports: [...myImports],

  declarations: [],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class MyMaterialModule { }
