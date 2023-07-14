import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Input, Inject } from '@angular/core';
import { ViewEncapsulation } from '@angular/compiler/src/core';

/**
 * 錯誤訊息 
 * 需要傳入 msg
 */
@Component({
  moduleId: module.id,
  selector: 'my-error',
  //encapsulation: ViewEncapsulation.None,
  styles: [`
    .wrapper {
      background: rgba(255, 190, 255);
      margin: -24px;
      padding: 5px 5px 10px 5px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .my-icon {
      width: 60px;
      height: 60px;
      font-size: 60px;
      color: red;
    }

    .my-h {
      margin: 0;
      padding: 0;
    }

    .msg {
      color: darkmagenta;
      font-weight: bold;
    }

    .msg2 {
      color: black;
      font-weight: bold;
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
      <h2 mat-dialog-title class="title">錯誤視窗</h2>
    </header>

    <div mat-dialog-content class="content mat-typography">
      <span style="align-self: flex-start;"><mat-icon class="my-icon">error</mat-icon></span>
      <div>
        <ng-container *ngFor="let line of msgArr; let i = index">
           <h2 *ngIf="i == 0" class="msg my-h">{{line}}</h2>
           <h2 *ngIf="i !== 0" class="msg2 my-h">{{line}}</h2>
        </ng-container>
      </div>
    </div>

    <div mat-dialog-actions class="actions">
        <button mat-raised-button color="primary"  (click)="dialogRef.close('ignore')">關閉</button>
    </div>
  </div>

  `
})
export class ErrorDialog {
  msg: string = "NA";
  msgArr: String[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<ErrorDialog>) {

      if (data.includes("\n")) {
        this.msgArr = data.split("\n");
      } else {
        this.msgArr = [data];
      }

      // this.msg = data;

  }

}
