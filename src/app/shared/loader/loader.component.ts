import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { LoaderService } from './loader.service';

@Component({
  selector: 'angular-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.scss']
})
export class LoaderComponent implements OnInit {
  show = false;

  private delay = 400;

  private subscription: Subscription;

  constructor(private loaderSvc: LoaderService) { 
  }

  ngOnInit() {
    this.subscription = this.loaderSvc.loading$
      .subscribe(state => {
        if (state) {
          this.show = true;
        } else {
          setTimeout(()=> this.show = false, this.delay);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}