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

  `],
  template: `
  <header>
    <div mat-dialog-title style="margin: 0; padding:0; border-bottom:1px solid lightblue;">未存檔訊息</div>
  </header>

  <div mat-dialog-content>
      <h2 style="font-family: system-ui">資料有異動, 是否要放棄異動?</h2>
  </div>

  <div mat-dialog-actions style="flex; align-items: center; justify-content: center">
      <button mat-raised-button color="warn"  (click)="dialogRef.close('Y')"><mat-icon>done</mat-icon>放棄異動</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close('N')"><mat-icon>cancel</mat-icon>繼續輸入</button>
  </div>

  `
})
export class UnSaveDialog {
  msg: string = "NA";


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UnSaveDialog>) {

    this.msg = data;

  }

}
