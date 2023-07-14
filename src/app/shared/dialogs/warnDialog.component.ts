import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Input, Inject, ViewEncapsulation } from '@angular/core';

/**
 * 警告視窗
 * 需要傳入 msg
 */
@Component({
  moduleId: module.id,
  selector: 'my-warning',
  styles: [`
    .wrapper {
      background: rgb(255, 255, 190); 
      margin: -24px;
      padding: 5px 5px 10px 5px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .my-icon {
      width: 70px;
      height: 70px;
      font-size: 70px;
      color: brown;
    }

    .my-h {
      margin: 0;
      padding: 0;
    }

    .msg {
      color: darkmagenta;
    }

    .title {
      margin: 0; 
      margin-top: 10px;
      padding: 0; 
      border-bottom:1px solid black;
    }
    
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
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
      <h2 mat-dialog-title  class="title">注意視窗</h2>
    </header>

    <div mat-dialog-content class="content mat-typography ">
      <span><mat-icon class="my-icon">warning</mat-icon></span>
      <h2 class="msg my-h">{{msg}}</h2>
    </div>

    <div mat-dialog-actions class="actions" >
        <button mat-raised-button color="primary"  (click)="dialogRef.close('yes')">確定</button>
    </div>
  </div>

  `
})
export class WarnDialog {
  msg: string = "NA";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WarnDialog>) {

    this.msg = data;

  }

}
