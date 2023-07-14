import { Subscription } from 'rxjs';
import { Component, OnInit, ElementRef, Input, SimpleChanges } from '@angular/core';
import { ProgressData } from './../../spc0202m/model';

import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input()
  data: ProgressData;

  qtySpan: number;
  headQty: number;  // for animation (累積數量)

  ticks: object[] = [];

  padding = 20;

  constructor(private elRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.data) {
      return;
    }

    this.qtySpan = (this.data.upperBoundQty - 0);
    this.headQty = this.data.headQty;;

    this.ticks = [
      { qty: this.data.lowerBoundQty, label: "L" },
      { qty: this.data.reqQty, label: "R" },
      { qty: this.data.upperBoundQty, label: "U" },
    ];

    this.animate();

  }

  totalWidth() {
    return this.elRef.nativeElement.clientWidth - this.padding * 1;
  }

  /**
   * 1. transform the timestamp into a position.
   * 2. convert our position value, which is of unit pixels, 
   *    into a percentage.
   */
  projectQty(qty: number): string {
    const position = qty / this.qtySpan * this.totalWidth();

    return (position / this.elRef.nativeElement.clientWidth * 100) + "%";
  }

  // interporate accQty from 0 -> headQty
  // side effect
  animate() {
    let progress = 0;
    const progressTarget = this.data.headQty;

    const step = 30;
    const duration = 600;

    const count = Math.ceil(duration / step);
    const increment = Math.ceil(progressTarget / count) + 1;

    interval(step)
      .pipe(
        take(count),
        map(i => {
          progress = progress + increment;
          if (progress >= progressTarget) {
            progress = progressTarget;
          }
          return progress;
        })
      )
      .subscribe(progress => {
        this.headQty = progress;
      });

  }

} // end class
