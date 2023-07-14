//import { Pair } from './../../core/crudCore';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'validMessages-dialog',
  styles: [`

    .title {
      margin: 0;
      padding: 0;
      color: #336699;
    }

    .err {
      color: red;
      font-weight: bold;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
    }

    table td, table th {
      border: 1px solid lightgray;
      padding: 5px;
    }

    table tbody tr:hover {
      background: #eee;
    }

  `],
  template: `
  <h2 mat-dialog-title class="title">欄位驗證視窗</h2>

  <div mat-dialog-content>
    <table>
      <thead>
        <tr>
          <th>項次</th>
          <th>欄位</th>
          <th>訊息</th>
        </tr>
      </thead>
      <tbody>
      <!--
        <tr *ngFor="let m of messageList; let i = index" >
          <td>{{i + 1}}</td>
          <td>{{m.key}}</td>
          <td><span class="err">{{m.value}}</span></td>
        </tr>
        -->
      </tbody>
    </table>
  </div>

  <div mat-dialog-actions style="display:flex; justify-content: flex-end; border-top:1px solid lightgray">
    <button mat-button (click)="dialogRef.close('Yes')">確定</button>
  </div>

  `
})
export class ValidMessagesDialog {
 // public messageList: Pair<string, string>[] = [];

  constructor(
    public dialogRef: MatDialogRef<ValidMessagesDialog>) { 
 }

}
