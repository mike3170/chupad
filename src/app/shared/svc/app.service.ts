import { PadUser} from './PadUser';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Api } from '../../core/api.model';


/**
 * 1. canDeactive
 * 2. getPadUser
 */
@Injectable()
export class AppSvc {
  canDeactiveSub: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private appNameSource = new BehaviorSubject(null); 

  currentAppname = this.appNameSource.asObservable();

  constructor(private http: HttpClient) {
  }

  setCanDeactive(bln: boolean) {
    this.canDeactiveSub.next(bln);
  }

  isCanDeactive(): any {
    return this.canDeactiveSub.getValue();
  }

  getPadUser(): Observable<any>{
    let url = "/api/paduser";
    return this.http.get<Api>(url);
  }

  changeAppname(appname: string) {
    this.appNameSource.next(appname);

  }


} // end class