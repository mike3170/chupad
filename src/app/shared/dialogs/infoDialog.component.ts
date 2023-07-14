import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'info-dialog',
  styles: [`
    .wrapper {
      background: rgb(191, 255, 191); 
      margin: -24px;
      padding: 5px 5px 10px 5px;
      overflow: hidden;
      box-sizing: border-box;
    }

    .my-icon {
      width: 60px;
      height: 60px;
      font-size: 60px;
      color: green;
    }

    .my-h {
      margin: 0;
      padding: 0;
    }

    .msg {
      color: darkred;
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
        <h2 mat-dialog-title class="title">提示視窗</h2>
      </header>

      <mat-dialog-content class="content mat-typography">
        <span><mat-icon class="my-icon">info</mat-icon></span>
        <h2 class="msg my-h" >{{msg}}</h2>
      </mat-dialog-content>

      <mat-dialog-actions class="actions">
        <button mat-raised-button color="primary" mat-dialog-close><mat-icon>close</mat-icon>關閉</button>
      </mat-dialog-actions>
   </div>
  
  `
})

export class InfoDialog implements OnInit {
  msg: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.msg = data;
  }

  ngOnInit() { }
}