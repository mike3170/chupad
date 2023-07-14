import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Input, Inject } from '@angular/core';

/**
 * 確認視窗
 * 需要傳入 msg
 */
@Component({
  moduleId: module.id,
  selector: 'abort-dialog',
  styles: [`

  `],
  template: `
  <header>
    <h2 mat-dialog-title style="margin: 0; padding:0; border-bottom:1px solid lightblue;">確認視窗</h2>
  </header>

  <div mat-dialog-content>
      <h3>{{msg}}</h3>
  </div>

  <div mat-dialog-actions style="flex; align-items: center; justify-content: center">
      <button mat-raised-button color="primary"  (click)="dialogRef.close('yes')">是</button>
      <button mat-raised-button color="accent" (click)="dialogRef.close('no')">否</button>
  </div>

  `
})
export class AbortDialog {
  msg: string = "NA";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AbortDialog>) {

    this.msg = data;

  }

}
