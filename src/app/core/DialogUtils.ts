import { MyDialog } from './../shared/dialogs/myDIalog.component.';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { InfoDialog } from './../shared/dialogs/infoDialog.component';
import { WarnDialog } from '../shared/dialogs/warnDialog.component';
import { ErrorDialog } from '../shared/dialogs/errorDialog.component';
import { ConfirmDialog } from '../shared/dialogs/confirmDialog.component';
import { Injector } from '@angular/core';
import { Warn2Dialog } from '../shared/dialogs/warn2Dialog.component.';
import { UnSaveDialog } from '../shared/dialogs/UnSaveDialog.component';

export class DialogUtil {
  dialogConfig: MatDialogConfig = {
    disableClose: false,
    position: { top: "50px" },
    minWidth: "300px",
    data: ""
  };

  snackBarConfig: MatSnackBarConfig = {
    horizontalPosition: "center",
    verticalPosition: "bottom",
    panelClass: ["snackbar-bg"]
  };


  dialog: MatDialog;
  snackBar: MatSnackBar;

  constructor(private injector: Injector) {
    this.dialog = injector.get(MatDialog);
    this.snackBar = injector.get(MatSnackBar);
  }

  info(msg: string): MatDialogRef<any> {
    this.dialogConfig.data = msg;
    this.dialogConfig.minWidth = "250px";

    return this.dialog.open(InfoDialog, this.dialogConfig);
  }

  warn(msg: string): MatDialogRef<any> {
    this.dialogConfig.data = msg;
    return this.dialog.open(WarnDialog, this.dialogConfig);
  }

  warn2(msgs: string[]): MatDialogRef<any> {
    this.dialogConfig.data = msgs;
    return this.dialog.open(Warn2Dialog, this.dialogConfig);
  }

  error(msg: string): MatDialogRef<any> {
    this.dialogConfig.data = msg;
    return this.dialog.open(ErrorDialog, this.dialogConfig);
  }

  myDialog(msg: string): MatDialogRef<any> {
    let config = {...this.dialogConfig, data:msg, panelClass: "my-dialog"};

    return this.dialog.open(MyDialog, config);
  }

  confirm(msg: string): MatDialogRef<any> {
    this.dialogConfig.data = msg;
    return this.dialog.open(ConfirmDialog, this.dialogConfig);
  }

  unsave(): MatDialogRef<any> {
    this.dialogConfig.data = "";;
    return this.dialog.open(UnSaveDialog, this.dialogConfig);
  }

  showSnackbar(msg: string, action?: string, duration?: number) {
    const _action = action ? action : "";

    if (duration) {
      this.snackBarConfig.duration = duration;

      this.snackBar.open(msg, _action, this.snackBarConfig);
    } else {
      this.snackBar.open(msg, _action, this.snackBarConfig);
    }
  }

} // end class