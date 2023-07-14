import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Input, Inject } from '@angular/core';

/**
 * 警告視窗
 * 需要傳入 msg
 */
@Component({
  moduleId: module.id,
  selector: 'my-warning',
  styles: [`
    .sysui { 
      font-family: system-ui, arial;
    }

    h3 {
      margin-top: 0;
      margin-bottom: 8px;
    }

  `],
  template: `
  <header>
    <h2 mat-dialog-title style="margin: 0; padding:0; border-bottom:1px solid lightblue;">警告視窗</h2>
  </header>

  <div mat-dialog-content>
      <h3 class="sysui" *ngFor="let msg of msgs">{{msg}}</h3>
  </div>

  <div mat-dialog-actions style="flex; align-items: center; justify-content: center">
      <button mat-raised-button color="primary"  (click)="dialogRef.close('yes')">確定</button>
  </div>

  `
})
export class Warn2Dialog {
  msgs: string[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<Warn2Dialog>) {

    this.msgs = data;

  }

}
