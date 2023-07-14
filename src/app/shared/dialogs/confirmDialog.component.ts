import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Input, Inject } from '@angular/core';

/**
 * 確認視窗
 * 需要傳入 msg
 */
@Component({
  moduleId: module.id,
  selector: 'my-confirm',
  styles: [`
    .wrapper {
      background: rgb(255, 255, 190); 
      margin: -24px;
      padding: 5px 5px 10px 5px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .my-icon {
      width: 60px;
      height: 60px;
      font-size: 60px;
      color: brown;
    }

    .my-h {
      margin: 0;
      padding: 0;
    }

    .msg {
      color: darkmagenta;
      font-weight: bold;
    }

    .title {
      margin: 0; 
      margin-top: 5px;
      padding: 0; 
      border-bottom:1px solid black;
    }
    
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
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
      <div mat-dialog-title class="title">確認視窗</div>
    </header>

    <div mat-dialog-content class="content mat-typography">
      <span><mat-icon class="my-icon">help</mat-icon></span>
      <h2 class="msg my-h" >{{msg}}</h2>
    </div>

    <div mat-dialog-actions class="actions">
        <button mat-raised-button color="primary"  (click)="dialogRef.close('Y')"><mat-icon>done</mat-icon>確定</button>
        <button mat-raised-button color="accent" (click)="dialogRef.close('N')"><mat-icon>cancel</mat-icon>取消</button>
    </div>
  </div>

  `
})
export class ConfirmDialog {
  msg: string = "NA";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmDialog>) {

    this.msg = data;

  }

}
