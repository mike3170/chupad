import { MatDialogRef } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'spc0232m-table-dialog',
  styles: [`
    .title {
      margin: 0; 
      padding:0; 
      border-bottom:1px solid lightblue;
    }

    .hightlight {
      font-weight: bold;
      color: blue;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 16px;
      font-family: system-ui, arial;
    }

    table td, table th {
      border: 1px solid lightgray;
      padding: 10px 3px;
    }

    table tbody tr:nth-child(odd) {
      background: #efefef;
    }

    table tbody tr:hover {
      cursor: pointer;
      border: 2px solid orange;
    }

    .my-flex {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .my-align-right {
      margin-left: auto;
    }

    .actions {
      display:flex; 
      align-items: center;
      border-top:1px solid lightgray;
    }


  `],
  template: `
  <section class="my-flex mat-typography">
      <h2 mat-dialog-title class="title">表格視窗</h2>
      <span class="my-align-right" >
        <strong class="hightlight">點選</strong>-選取資料,&nbsp;&nbsp;
        <strong class="hightlight">點選其他區域</strong>-離開
      </span>
  </section>

  <section mat-dialog-content>
    <table style="overflow: auto;">
      <thead style="background: black; color: white">
        <tr>
          <th>項次</th>
          <th>批號</th>
          <th>製程</th>
          <th>爐序</th>
          <th>桶號</th>
          <th>毛重</th>
          <th>產品規格</th>
          <th>爐號</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let whp of wrkHeadPadList; let i = index" (click)="dialogRef.close(whp)">
          <th>{{i + 1}}</th>
          <td><b>{{whp.jobNo}}</b></td>
          <td>{{whp.procNo}}</td>
          <td>{{whp.luoCode}}</td>
          <td>{{whp.ctnNo}}</td>
          <td>{{whp.makeWt}}</td>
          <td style="font-weight: bold;">{{whp.pdcSize}}</td>
          <td>{{whp.luoName}}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!--
  <section mat-dialog-actions class="actions  mat-typography">
    <div>
      筆數: {{wrkHeadPadList.length}}
    </div>
    <button mat-raised-button class="my-align-right" (click)="dialogRef.close('No')">離開</button>
  </section>
  -->

  `
})
export class Spc0232mTableDialogComponent {
  public wrkHeadPadList: any[] = [];

  constructor( public dialogRef: MatDialogRef<Spc0232mTableDialogComponent>) {

  }

} // end class
