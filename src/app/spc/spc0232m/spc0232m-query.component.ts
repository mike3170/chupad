import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Component, OnInit, Injector, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Spc0232mService } from './spc0232m.service';
import { DialogUtil } from '../../core/DialogUtils';

import {MAT_DIALOG_DATA} from '@angular/material';
import { Spc0232mComponent } from './spc0232m.component';
 
@Component({
  selector: 'spc0232m-query',
  templateUrl: "./spc0232m-query.component.html",
  styleUrls: ["./spc0232m-query.component.scss"],
  providers: [ Spc0232mService ]
})
export class Spc0232mQueryComponent extends DialogUtil implements OnInit {
  formQry: FormGroup;

  isLoading = false;

  constructor(
    private spc0232mSvc: Spc0232mService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Spc0232mQueryComponent>,
    injector: Injector) { 
      super(injector);
      //alert(JSON.stringify(this.data));
    }

  ngOnInit() {
    this.formQry = new FormGroup ({
      jobNo: new FormControl(''),
      luoCode: new FormControl(''),
      luoName: new FormControl('')
    }, { updateOn: 'blur' });
  }

  doQuery() {
    if (this.isFormEmpty(this.formQry)) {
      this.warn("查詢條件空白, 請輸入查詢條件");
      return;
    }

   let matrix = this.getMatrixVariables(this.formQry);
   //alert(matrix);
   //console.log(matrix);

   this.isLoading = true;
   this.spc0232mSvc.query(matrix)
    .subscribe(rs => {
      if (rs.data) {
        this.dialogRef.close(rs);
      } else {
        this.dialogRef.close([]);
        let msg = rs.error.desc;
        this.error(msg);
      }
      this.isLoading = false;
    });
  }

  cancel() {
    this.dialogRef.close("mia");
  }

  /**
   * 檢查 form 是否有資料, 使用於 query form
   * @param form 
   */
  isFormEmpty(form: FormGroup): boolean {
    if (form.invalid) {
      return true;
    }

    // has value arr
    let arr = Object.keys(form.value)
      .filter(k => {
        if (form.value[k]) {
          return true;
        } else {
          return false;
        }
      });

    if (arr.length == 0) {
      return true;
    } else {
      return false;
    }
  }

 /**
   * Matric variables for Rest 
   * format        ;k=v;k2=v2...
   * @param fg 
   */
  getMatrixVariables(fg: FormGroup): string {
    let matrixNoDate = this.getMartixNoDate(fg);
    let matrixWithDate = this.getMatrixForDate(fg);

    return matrixNoDate + matrixWithDate;
  }

  /**
   * 非日期欄位
   * @param fg 
   */
  private getMartixNoDate(fg: FormGroup): string {
    let regex = /.+Date[1,2]$/i;

    let res =
      Object.keys(fg.controls)
        .filter(k => fg.controls[k].value)  // ignore empty
        .filter(k => ! regex.test(k))       // ignore xxxDate1, xxxDate2
        .map(k => {
          let uri = ";" + k + "=" + fg.controls[k].value;
          return encodeURI(uri);
        })
        .reduce((acc, e) => {
          return acc + e;
        }, "");

    return res;
  }

  /**
   * 日期欄位, endwith : xxxDate1 or xxxDate2
   */
  private getMatrixForDate(fg: FormGroup): string {
    let regEx = /.+Date[1,2]$/i;

    // collect distinct date properties
    let arr =
      Object.keys(fg.controls)
        .filter(k => fg.controls[k].value)   // not empty
        .filter(k => k.match(regEx))
        .map(k => k.slice(0, -1))
        .reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);


    // convension over configruation 
    // xxxDate1, xxxDate2
    let matrix =
      arr
        .filter(p => {
          let p1 = p + "1";
          let p2 = p + "2";
          let v1 = fg.controls[p1].value;
          let v2 = fg.controls[p2].value;
          return v1 && v2;                  // both not empty
        })
        .map(p => {
          let p1 = p + "1";
          let p2 = p + "2";

          console.log("========================");
          console.log(fg.controls[p1].value);
          console.log(typeof fg.controls[p1].value);
          console.log(fg.controls[p1].value instanceof Date);
          console.log(fg.controls[p1].value.toISOString());

          let v1 = fg.controls[p1].value.toISOString();
          let v2 = fg.controls[p2].value.toISOString();

          let frag = `;${p}=${v1}:${v2}`;
          return frag;
        })
        .reduce((acc, e) => {
          return acc + e;
        }, "");

    return encodeURI(matrix);
  }

 /**
   * 比較運篹子, 使用於 query form
   * a validator for pattern
   * only for numeric field
   * 
   * @param c 
   */
  // >, >= , <, <=,  ;
  comparePatternValidator(c: AbstractControl): { [key: string]: any } {
    if (!c.value) {
      return null;
    }

    let pattNum = /^\s*\d+\s*$/;
    let pattGte = /^\s*>=?\s*\d+$/;
    let pattLte = /^\s*<=?\s*\d+$/;
    let pattRange = /^\s*\d+\s*:\s*\d+$/;

    if (pattNum.test(c.value)
      || pattLte.test(c.value)
      || pattRange.test(c.value)
      || pattGte.test(c.value)) {

      return null;
    } else {
      return { error: true };
    }
  }
} // end class