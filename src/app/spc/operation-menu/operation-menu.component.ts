import { AppSvc } from './../../shared/svc/app.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-operation-menu',
  templateUrl: './operation-menu.component.html',
  styleUrls: ['./operation-menu.component.scss']
})
export class OperationMenuComponent implements OnInit {
  version = environment.version;

  constructor(
    private appSvc: AppSvc,
    private router: Router) { 

      this.appSvc.setCanDeactive(true);
  }

  ngOnInit() {
  }

  doHead() {
    // this.router.navigate(["/spc/spc0202m"]);
    this.appSvc.changeAppname("spc0202m");
    this.router.navigateByUrl("/spc/spc0202m");
  }

  doThread() {
    // this.router.navigate(["/spc/spc0232m"]);
    this.appSvc.changeAppname("spc0232m");
    this.router.navigateByUrl("/spc/spc0232m");
  }


}
