import { Subscription } from 'rxjs';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { interval, of, Subject, Observable } from 'rxjs';
import { take, map, takeUntil, switchMap } from 'rxjs/operators';

import { Single } from './../../spc0202m/model';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent implements OnInit {
  @Input()
  donutSingle: Single;

  value: number;
  radius = 45;
  circumference = 2 * Math.PI * this.radius;   // 圓周長
  dashoffset: number;


  donutInterval$: Observable<number>;

  count = 0;

  constructor() {
    this.progress(0);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    this.donutSingle = changes.donutSingle.currentValue;
    if (! this.donutSingle) {
      return;
    }

    this.value = this.donutSingle.value;

    this.emulateProgress(this.value);
  }

  private emulateProgress(progress: number) {
    const end = this.donutSingle.value;
    let beg = 0;

      interval(25)
        .pipe(
          take(progress),
          map(i => {
            beg++;
            if (beg >= end) {
              beg = end;
            }
            return beg;
          })
        )
        .subscribe(beg => {
          // console.log(beg);
          this.progress(beg);
        });
  }

  private progress(value: number) {
    const progress = value / 100;
    this.dashoffset = this.circumference * (1 - progress);
    this.value = value;
  }

} // end class