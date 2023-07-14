import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

export interface LoaderState {
  show: boolean;
}

@Injectable()
export class LoaderService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // subscribe by outside
  loading$: Observable<any> = this.loadingSubject.asObservable();
  

  private callStack: number[] = [];
  private timeout: any;

  private loading: boolean = false;

  constructor() { 
  }

  startLoading(): void {
    this.callStack.push(1);
    this.loadingSubject.next(true);
  }

  endLoading(): void {
    this.callStack.pop();
    if (this.callStack.length == 0) {
      this.loadingSubject.next(false);
    }

  }

}  // end class