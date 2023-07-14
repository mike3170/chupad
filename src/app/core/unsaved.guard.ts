import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { map, first } from 'rxjs/operators';

import { ICanComponentDeactivate } from './ICanComponentDeactivate';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UnSaveDialog } from '../shared/dialogs/UnSaveDialog.component';

// Consider using this interface for all CanDeactivate guards,
// and have your components implement this interface, too.
//
//   e.g. export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
//
// export interface CanComponentDeactivate {
// canDeactivate: () => any;
// }

@Injectable()
export class UnsavedGuard implements CanDeactivate<ICanComponentDeactivate> {
  dialogConfig: MatDialogConfig = {
    disableClose: true,
    position: { top: "70px" },
    data: ""
  };

  constructor(private dialog: MatDialog) {
  }

  canDeactivate(
    component: ICanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let bln = component.canDeactivate();
    if (bln) return true;

    let dialogRef = this.dialog.open(UnSaveDialog, this.dialogConfig);

    return dialogRef.afterClosed().pipe(
      map(yn => yn == "yes" ? true : false)
    );

  }

} // end of class