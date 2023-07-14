import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { UnSaveDialog } from '../dialogs/UnSaveDialog.component';
import { AppSvc } from './../svc/app.service';
import { PadUser } from './../svc/PadUser';

import { Observable, of, interval } from 'rxjs';

@Component({
  selector: 'pad-header',
  styleUrls: ["header.component.scss"],
  templateUrl: 'header.component.html',
})

export class HeaderComponent implements OnInit  {
  padUser: PadUser = null;
  today$: Observable<Date>;

  appName: string = "";
  spc0202m = "每桶成型完工輸入";
  spc0232m = "每桶輾牙完工輸入";
  zxingtest = "Zxing test";

  constructor(
    private appSvc: AppSvc,
    private dialog: MatDialog ) { 
  }

  ngOnInit() { 
    this.appSvc.getPadUser()
      .subscribe(rs => {
        this.padUser = rs.data;
      });

      interval(3600)
      .subscribe(i => {
        this.today$ = of(new Date());
      });

    
    this.appSvc.currentAppname
      .subscribe(code => {
        switch (code) {
          case "spc0202m" :
            this.appName = this.spc0202m;
            break;
          case "spc0232m" :
            this.appName = this.spc0232m;
            break;
          default:
            this.appName = "無作業";
        }

      });

     
  }

  doLogout() {
    let logoutUrl = environment.logoutUrl;

    window.location.href = logoutUrl;

    //let canDeactive = this.appSvc.isCanDeactive();

    //if (canDeactive) {
    //  window.location.href = logoutUrl;
    //} else {
    //  let config: MatDialogConfig = new MatDialogConfig();
    //  config.position = {top: "70px"};

    //  let dialogRef = this.dialog.open(UnSaveDialog, config);
    //  dialogRef.afterClosed()
    //    .subscribe(yn => {
    //      if (yn == "Y") {
    //        window.location.href = logoutUrl;
    //      }
    //    });
    //}
  }

  select(appName) {
    this.appName = appName;
    console.log(this.appName);
    
  }

} // end class  