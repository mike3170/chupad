import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Input, Inject } from '@angular/core';
import { ViewEncapsulation } from '@angular/compiler/src/core';

/**
 * 錯誤訊息 
 * 需要傳入 msg
 */
@Component({
  moduleId: module.id,
  selector: 'my-dialog',
  styles: [`
    //.wrapper {
      //background: rgba(255, 190, 255);
    //}

    .title {
      border-bottom:1px solid black;
    }

    .my-icon {
      width: 60px;
      height: 60px;
      font-size: 60px;
      color: red;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px;

      .msg {
        color: darkmagenta;
        font-weight: bold;
        margin: 0;
      }
    }

    .actions {
      display: flex; 
      align-items: center; 
      justify-content: flex-end;
      margin: 0 ;
      padding: 0 ;
    }

  `],
  template: `
  <div class="wrapper">
    <header>
      <h2 mat-dialog-title class="title">錯誤訊息</h2>
    </header>

    <div mat-dialog-content class="content mat-typography">
      <span><mat-icon class="my-icon">error</mat-icon></span>
      <h2 class="msg">{{msg}}</h2>
    </div>

    <div mat-dialog-actions class="actions">
        <button mat-raised-button color="primary"  (click)="dialogRef.close('ignore')">關閉</button>
    </div>
  </div>

  `
})
export class MyDialog {
  msg: string = "NA";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MyDialog>) {

    this.msg = data;

  }

}
