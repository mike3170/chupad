import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderSvc: LoaderService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log(req.urlWithParams);
    // console.log("api: " + req.urlWithParams);

    this.loaderSvc.startLoading();

    return next
      .handle(req)
      .pipe(
        tap((evt: HttpEvent<any>) => {
          // if (evt instanceof HttpResponse) {
          // this.loaderSvc.endLoading();
          // console.log("end loadng --------------------");
          // }

          // console.log("mia---" + evt.type);
          // console.log("end loadng --------------------");
          this.loaderSvc.endLoading();
        })
      );

  }
} // end class